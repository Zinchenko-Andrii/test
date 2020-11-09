const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const {
                context: {
                        payload: { repository },
                },
        } = github;
        // const responce = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);
        // console.log('----->>>', responce)

            const octokit = github.getOctokit(process.env.GITHUB_TOKEN)
        // console.log('----->>>',myToken)
        // console.log('----->>>',JSON.stringify(Object.keys(octokit), null, 2))
        const responce = await octokit.repos.listBranches({
            owner: 'Zinchenko-Andrii',
            repo: 'test',
        });

         console.log('----->>>', responce)
        // const { data } = await github.getOctokit(process.env.GITHUB_TOKEN).request('/Zinchenko-Andrii/test/branches');



    } catch (error) {
        core.setFailed(error.message);
    }
})()