const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const myToken = core.getInput('4f42bf708e037ae3c1d6ebf26375dde521c8bcb4');
        const octokit = github.getOctokit(myToken)
        console.log('----->>>',myToken)
        console.log('----->>>',octokit)
    } catch (error) {
        core.setFailed(error.message);
    }
})()