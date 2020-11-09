const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const myToken = core.getInput('myToken');
        const octokit = github.getOctokit(myToken)
        console.log('----->>>',myToken)
        console.log('----->>>',octokit)
    } catch (error) {
        core.setFailed(error.message);
    }
})()