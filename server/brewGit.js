/*

This is a github gist/gitlab snippets work-alike for a local

*/
import config  from './config.js';
import { commit as gitCommit, status as gitStatus } from 'isomorphic-git';
import fs from 'fs';

const gistsActive = config.get('enable_gists') && config.get('gists_path').length > 0 && fs.existsSync(config.get('gists_path')) ? true : false;
const gistsCountLimit = config.get('gists_limit') || 1024;

const brewGit = {
	active          : ()=>{ return gistsActive; },
	walkBrewGitPath : (brewId, newBrew=false, move=false)=>{
		// Walk the BrewId based path.
		// <gists_path>/brewId[0]/brewId[1]/brewId
		// if path gets full, add another subdirectory based on next position until found.
		// Return full path.

		let branchPath = `/${brewId[0]}/${brewId[1]}`;
		let depth = 2;
		let brewPath ='';
		let movePath = '';
		while (depth < brewId.length) {
			brewPath = `${config.get('gists_path')}/${branchPath}`;
			if(!newBrew && fs.existsSync(`${brewPath}/${brewId}`))
				break;
			if(newBrew && !fs.existsSync(`${brewPath}`)) {
				fs.mkdirSync(`${brewPath}`);
				break;
			}
			if(newBrew && (!fs.readdirSync(brewPath).length < gistsCountLimit)) break;
			depth++;
			branchPath = `${branchPath}/${brewId[depth]}`;
		}
		// If we're moving, go up a subdir...
		if(move && depth < brewId.length) {
			depth++;
			branchPath = `${branchPath}/${brewId[depth]}`;
			movePath = `${config.get('gists_path')}/${branchPath}`;
			if(!fs.existsSync(`${brewPath}`)) fs.mkdirSync(`${brewPath}`);
		}
		return {
			parent    : brewPath,
			newParent : movePath,
			path      : `${brewPath}/${brewId}`
		};
	},
	createBrewGit : async (brewId)=>{
		if(gistsActive) {
			try {
				await git.init({ fs, dir: this.walkBrewGitPath(brewId).path });
				return true;
			} catch (err) {
				console.log(`brewGit init failed. ${err}`);
				return false;
			}
		}
	},
	getBrewGitText : async (brew)=>{
		// Make certain we are on head by first ensuring the file is committed then
		// checkout main.

		const gitBrewPath = this.walkBrewGitPath(brew.editId).path;
		const status = await gitStatus({
			fs,
			dir      : gitBrewPath,
			filepath : brew.editId,
		});
		if(status != 'unmodified') {
			// This SHOULD NEVER HAPPEN
			if(status in ['absent', '*absent', 'deleted', '*deleted']) {
				console.log('File does not exist in brewGit');
				return false;
			} else if(status in ['*modified', 'modified', '*added', 'added']) {
				await gitAdd({
					fs,
					dir      : gitBrewPath,
					filepath : brew.editId,
				});
				const sha = await gitCommit({
					fs,
					dir    : gitBrewPath,
					author : {
						name : brew.author[0],
					},
					message : `Emergency commit on file load.`
				});
				if(!sha) {
					console.log(`brewGit Unable to emergency save ${brew.editId}`);
					return false;
				}
			} else {
				console.log(`brewGit Unable to get text for brew ${brew.editId} - Status: ${status}`);
			}
		}
		// Make sure we're on main/head
		await gitCheckout({
			fs,
			dir : gitBrewPath,
			ref : 'main',
		});
		const brewText = fs.readFileSync(`${gitBrewPath}/${brew.editId}`, { encoding: 'utf8' });
		return brewText;
	},
	putBrewGitText : async (brew, commitMessage='')=>{
		// Check content count in brew directory
		if(fs.readdirSync(this.walkBrewGitPath(brew.editId).parent).length > gistsCountLimit) {
			this.moveBrewGit(brew.editId);
		}
		const gitBrewPath = this.walkBrewGitPath(brew.editId).path;
		try {
		 	fs.writeFileSync(`${gitBrewPath}/${brew.editId}`);
			 await gitAdd({
				fs,
				dir      : gitBrewPath,
				filepath : brew.editId,
			});
			const message = commitMessage.length > 0 ?
				`${new Date().toISOString()} ${commitMessage}` :
				`${new Date().toISOString()} autosave`;

			const sha = await gitCommit({
				fs,
				dir    : gitBrewPath,
				author : {
					name : brew.author[0],
				},
				message : message
			});
			if(!sha) {
				console.log(`brewGit Unable to save ${brew.editId}`);
				return false;
			}
			return true;
		} catch (err) {
			console.log(`brewGit file write error: ${err}`);
			return false;
		}
	},
	deleteBrew : (brewId)=>{
		const gitBrewPath = this.walkBrewGitPath(brewId).path;
		if(fs.existsSync(gitBrewPath) && gitBrewPath.endsWith(brewId)) {
			// Do we need MORE sanity checking here?
			fs.rmSync(gitBrewPath, { recursive: true });
			return true;
		} else {
			console.log(`brewGit.deleteBrew path not found for brew ${gitBrewPath} - ${brewId}`);
		}
		return false;
	},
	moveBrewGit : async(brewId)=>{
		const gitBrewPath = this.walkBrewGitPath(brewId);
		if(gitBrewPath.parent != gitBrewPath.newParent) {
			fs.renameSync(gitBrewPath.parent, gitBrewPath.newParent);
		} else {
			console.log(`Unable to move path - values match`);
		}

	}
};

module.exports = brewGit;