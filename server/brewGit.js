/*

This is a github gist/gitlab snippets work-alike for a local

*/
import config  from './config.js';
import { commit as gitCommit, status as gitStatus } from 'isomorphic-git';
import fs from 'fs';

const gistsActive = config.get('enable_gists') && config.get('gists_path').length > 0 && fs.existsSync(config.get('gists_path')) ? true : false;
const gistsCountLimit = config.get('gists_limit') || 1024;

const brewGists = {
	active          : ()=>{ return gistsActive; },
	walkBrewGitPath : (brewId)=>{
		// Walk the BrewId based path.
		// <gists_path>/brewId[0]/brewId[1]/brewId
		// if path gets full, add another subdirectory based on next position until found.
		// Return full path.

		let branchPath = `/${brewId[0]}/${brewId[1]}`;
		let depth = 2;
		while (!fs.existsSync(`${config.get('gists_path')}/${branchPath}/${brewId}`)) {
			depth++;
			if(depth < brewId.length) branchPath = `${branchPath}/${brewId[depth]}`;
			else break;
		}
		return `${config.get('gists_path')}/${branchPath}/${brewId}`;
	},
	createBrewGit : async (brewId)=>{
		if(gistsActive) {
			await git.init({ fs, dir: this.walkBrewGitPath(brewId) });
		}
	},
	getBrewGitText : async (brew)=>{
		// Make certain we are on head by first ensuring the file is committed then
		// checkout main.

		const gitBrewPath = this.walkBrewGitPath(brew.editId);
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
		if(fs.readdirSync(this.walkBrewGitPath(brew.editId)).length > gistsCountLimit) {
			this.moveBrewGit(brew.editId);
		}
		const gitBrewPath = this.walkBrewGitPath(brew.editId);
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
};

module.exports = brewGists;