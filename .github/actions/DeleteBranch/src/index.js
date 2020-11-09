const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        // console.log('->>', process.env);
        // const myToken = core.getInput('${{ secrets.GITHUB_TOKEN }}');
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        // console.log('----->>>',myToken)
        console.log('----->>>',JSON.stringify(Object.keys(octokit), null, 2))
        const data = await octokit.git.getTree()

        console.log('----->>>',JSON.stringify(data, null, 2))

    } catch (error) {
        core.setFailed(error.message);
    }
})()