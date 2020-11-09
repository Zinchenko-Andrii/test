const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const {
                context: {
                        payload: { repository },
                },
        } = github;
        console.log('process.env.GITHUB_TOKEN', process.env.GITHUB_TOKEN);
        const responce = await github.getOctokit(process.env.GITHUB_TOKEN).request(`${repository.url}/branches`);
        console.log('----->>>', responce)

    } catch (error) {
        console.log('error ->>>', error)
    }
})()