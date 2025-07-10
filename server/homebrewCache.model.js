import mongoose   from 'mongoose';
import { nanoid } from 'nanoid';
import _          from 'lodash';


const HomebrewCacheSchema = mongoose.Schema({
	editId    : { type: String, default: ()=>{return nanoid(12);}, index: { unique: true } },
	googleId  : { type: String },
	text      : { type: String, default: '' },
	updatedAt : { type: Date, default: Date.now },
	syncedAt  : { type: Date, default: Date.now },
}, { versionKey: false });

HomebrewCacheSchema.statics.get = async function(query, fields=null){
	const brew = await Homebrew.findOne(query, fields).orFail()
		.catch((error)=>{throw 'Can not find brew';});
	return brew;
};

const HomebrewCache = mongoose.model('HomebrewCache', HomebrewCacheSchema);

export {
	HomebrewCacheSchema as schema,
	HomebrewCache       as model
};
