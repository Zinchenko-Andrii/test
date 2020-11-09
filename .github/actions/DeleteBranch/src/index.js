const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        // console.log('->>', process.env);
        // const myToken = core.getInput('${{ secrets.GITHUB_TOKEN }}');
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        // console.log('----->>>',myToken)
        console.log('----->>>',octokit)
    } catch (error) {
        core.setFailed(error.message);
    }
})()