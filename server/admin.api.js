/*eslint max-lines: ["warn", {"max": 500, "skipBlankLines": true, "skipComments": true}]*/
const HomebrewModel = require('./homebrew.model.js').model;
const router = require('express').Router();
const Moment = require('moment');
//const render = require('vitreum/steps/render');
const templateFn = require('../client/template.js');
const zlib = require('zlib');

process.env.ADMIN_USER = process.env.ADMIN_USER || 'admin';
process.env.ADMIN_PASS = process.env.ADMIN_PASS || 'password3';

const mw = {
	adminOnly : (req, res, next)=>{
		if(!req.get('authorization')){
			return res
				.set('WWW-Authenticate', 'Basic realm="Authorization Required"')
				.status(401)
				.send('Authorization Required');
		}
		const [username, password] = Buffer.from(req.get('authorization').split(' ').pop(), 'base64')
			.toString('ascii')
			.split(':');
		if(process.env.ADMIN_USER === username && process.env.ADMIN_PASS === password){
			return next();
		}
		return res.status(401).send('Access denied');
	}
};

const junkBrewPipeline = [
	{	$match : {
		updatedAt  : { $lt: Moment().subtract(30, 'days').toDate() },
		lastViewed : { $lt: Moment().subtract(30, 'days').toDate() }
	} },
	{ $project: { textBinSize: { $binarySize: '$textBin' } } },
	{ $match: { textBinSize: { $lt: 140 } } },
	{ $limit: 100 }
];

/* Search for brews that aren't compressed (missing the compressed text field) */
const uncompressedBrewQuery = HomebrewModel.find({
	'text' : { '$exists': true }
}).lean().limit(10000).select('_id');

// Search for up to 100 brews that have not been viewed or updated in 30 days and are shorter than 140 bytes
router.get('/admin/cleanup', mw.adminOnly, (req, res)=>{
	HomebrewModel.aggregate(junkBrewPipeline).option({ maxTimeMS: 60000 })
		.then((objs)=>res.json({ count: objs.length }))
		.catch((error)=>{
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

// Delete up to 100 brews that have not been viewed or updated in 30 days and are shorter than 140 bytes
router.post('/admin/cleanup', mw.adminOnly, (req, res)=>{
	HomebrewModel.aggregate(junkBrewPipeline).option({ maxTimeMS: 60000 })
		.then((docs)=>{
			const ids = docs.map((doc)=>doc._id);
			return HomebrewModel.deleteMany({ _id: { $in: ids } });
		}).then((result)=>{
			res.json({ count: result.deletedCount });
		}).catch((error)=>{
			console.error(error);
			res.status(500).json({ error: 'Internal Server Error' });
		});
});

/* Searches for matching edit or share id, also attempts to partial match */
router.get('/admin/lookup/:id', mw.adminOnly, async (req, res, next)=>{
	HomebrewModel.findOne({
		$or : [
			{ editId: { $regex: req.params.id, $options: 'i' } },
			{ shareId: { $regex: req.params.id, $options: 'i' } },
		]
	}).exec()
	.then((brew)=>{
		if(!brew)	// No document found
			return res.status(404).json({ error: 'Document not found' });
		else
			return res.json(brew);
	})
	.catch((err)=>{
		console.error(err);
		return res.status(500).json({ error: 'Internal Server Error' });
	});
});

/* Find 50 brews that aren't compressed yet */
router.get('/admin/finduncompressed', mw.adminOnly, (req, res)=>{
	const query = uncompressedBrewQuery.clone();

	query.exec()
		.then((objs)=>{
			const ids = objs.map((obj)=>obj._id);
			res.json({ count: ids.length, ids });
		})
		.catch((err)=>{
			console.error(err);
			res.status(500).send(err.message || 'Internal Server Error');
		});
});


/* Compresses the "text" field of a brew to binary */
router.put('/admin/compress/:id', (req, res)=>{
	HomebrewModel.findOne({ _id: req.params.id })
		.then((brew)=>{
			if(!brew)
				return res.status(404).send('Brew not found');

			if(brew.text) {
				brew.textBin = brew.textBin || zlib.deflateRawSync(brew.text);	//Don't overwrite textBin if exists
				brew.text = undefined;
			}

			return brew.save();
		})
		.then((obj)=>res.status(200).send(obj))
		.catch((err)=>{
			console.error(err);
			res.status(500).send('Error while saving');
		});
});


router.get('/admin/stats', mw.adminOnly, async (req, res)=>{
	try {
		const totalBrewsCount = await HomebrewModel.countDocuments({});
		const publishedBrewsCount = await HomebrewModel.countDocuments({ published: true });

		return res.json({
			totalBrews          : totalBrewsCount,
			totalPublishedBrews : publishedBrewsCount
		});
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'Internal Server Error' });
	}
});

router.get('/admin/lock', mw.adminOnly, async (req, res)=>{
	try {
		const countLocksQuery = {
			lock : { $exists: true }
		};
		const count = await HomebrewModel.countDocuments(countLocksQuery)
			.then((result)=>{
				return result;
			});
		return res.json({
			count
		});
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', detail: 'Unable to get lock count', error });
	}
});

router.post('/admin/lock/:id', mw.adminOnly, async (req, res)=>{
	try {
		const lock = req.body;
		lock.applied = new Date;

		const filter = {
			shareId : req.params.id
		};

		const brew = await HomebrewModel.findOne(filter);

		if(brew.lock) {
			// console.log('ALREADY LOCKED');
			return res.json({ status: 'ALREADY LOCKED', detail: `Lock already exists on brew ${req.params.id} - ${brew.title}` });
		}

		brew.lock = lock;
		brew.markModified('lock');

		await brew.save();

		// console.log(`Lock applied to brew ID ${brew.shareId} - ${brew.title}`);
		return res.json({ status: 'LOCKED', detail: `Lock applied to brew ID ${brew.shareId} - ${brew.title}`, ...lock });
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', error, message: `Unable to set lock on brew ${req.params.id}` });
	}
});

router.put('/admin/unlock/:id', mw.adminOnly, async (req, res)=>{
	try {
		const filter = {
			shareId : req.params.id
		};

		const brew = await HomebrewModel.findOne(filter);

		if(!brew.lock) return res.json({ status: 'NOT LOCKED', detail: `Brew ID ${req.params.id} is not locked!` });

		brew.lock = undefined;
		brew.markModified('lock');

		await brew.save();

		// console.log(`Lock removed from brew ID ${brew.shareId} - ${brew.title}`);
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', detail: `Unable to clear lock on brew ${req.params.id}`, error });
	}

	return res.json({ status: 'UNLOCKED', detail: `Lock removed from brew ID ${req.params.id}` });
});

router.get('/admin/lock/reviews', mw.adminOnly, async (req, res)=>{
	try {
		const countReviewsPipeline = [
			{
			  $match :
				{
				  'lock.reviewRequested' : { '$exists': 1 }
				},
			}
		];
		const reviewDocuments = await HomebrewModel.aggregate(countReviewsPipeline);
		return res.json({
			reviewDocuments
		});
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', detail: 'Unable to get review collection', error });
	}
});

router.put('/admin/lock/review/request/:id', async (req, res)=>{
	// === This route is NOT Admin only ===
	// Any user can request a review of their document
	try {
		const filter = {
			shareId : req.params.id,
			lock    : { $exists: 1 }
		};

		const brew = await HomebrewModel.findOne(filter);
		if(!brew) { return res.json({ status: 'NOT LOCKED', detail: `Brew ID ${req.params.id} is not locked!` }); };

		if(brew.lock.reviewRequested){
			// console.log(`Review already requested for brew ${brew.shareId} - ${brew.title}`);
			return res.json({ status: 'ALREADY REQUESTED', detail: `Review already requested for brew ${brew.shareId} - ${brew.title}` });
		};

		brew.lock.reviewRequested = new Date();
		brew.markModified('lock');

		await brew.save();

		// console.log(`Review requested on brew ${brew.shareId} - ${brew.title}`);
		return res.json({ status: 'REVIEW REQUESTED', detail: `Review requested on brew ID ${brew.shareId} - ${brew.title}` });
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', detail: `Unable to set request for review on brew ID ${req.params.id}`, error });
	}
});

router.put('/admin/lock/review/remove/:id', mw.adminOnly, async (req, res)=>{
	try {
		const filter = {
			shareId                : req.params.id,
			'lock.reviewRequested' : { $exists: 1 }
		};

		const brew = await HomebrewModel.findOne(filter);
		if(!brew) { return res.json({ status: 'REVIEW REQUEST NOT REMOVED', detail: `Brew ID ${req.params.id} does not have a review pending!` }); };

		brew.lock.reviewRequested = undefined;
		brew.markModified('lock');

		await brew.save();

		// console.log(`Review request removed on brew ID ${brew.shareId} - ${brew.title}`);
		return res.json({ status: 'REVIEW REQUEST REMOVED', detail: `Review request removed for brew ID ${brew.shareId} - ${brew.title}` });
	} catch (error) {
		console.error(error);
		return res.json({ status: 'ERROR', detail: `Unable to remove request for review on brew ID ${req.params.id}`, error });
	}
});

router.get('/admin', mw.adminOnly, (req, res)=>{
	templateFn('admin', {
		url : req.originalUrl
	})
	.then((page)=>res.send(page))
	.catch((err)=>res.sendStatus(500));
});

module.exports = router;
