import _                                  from 'lodash';
import { model as HomebrewModel }         from './homebrew.model.js';
import { cache as HomebrewModelCache }    from './homebrewCache.model.js';
import GoogleActions                      from './googleActions.js';

export default {

	remoteSafe : (oAuth2Client, googleId, id, accessType)=>{
		// Check and see if the cache was properly pushed to gDrive.
		const status = HomebrewModelCache.get({ editId: id });
		if(!status || (status?.syncedAt >= status?.updatedAt)) {
			// Trust the google drive stored version more.
			const googleBrew = await GoogleActions.getGoogleBrew(oAuth2Client, googleId, id, accessType)
				.catch((googleError)=>{
					const reason = googleError.errors?.[0].reason;
					if(reason == 'notFound')
						throw { ...googleError, HBErrorCode: '02', authors: stub?.authors, account: req.account?.username };
					else
						throw { ...googleError, HBErrorCode: '01' };
				});
			return googleBrew;
		} else {
			// The last cached 
		}
	},

	getBrew : (editId)=>{
		//
	},

	
};

