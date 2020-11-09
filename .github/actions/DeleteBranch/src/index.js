const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        const { name, owner } = github.context.payload.repository;
        const defaultCreds = { owner: owner.name, repo: name };
        const octokit = github.getOctokit(process.env.GITHUB_TOKEN)

        // console.log(JSON.stringify(octokit, null, 2))

        const res = await octokit.git.deleteRef({
            ...github.context.repo,
            ref: "heads/12"
        })

        console.log(JSON.stringify(res));
        // const getBranchList = (list) => list.reduce((acc, { name }) => (
        //     [
        //         ...acc,
        //         octokit.repos.getBranch({
        //             ...defaultCreds,
        //             branch: name,
        //         }),
        //     ]
        // ), [])
        //
        // octokit.repos.listBranches({ ...defaultCreds, protected: false,})
        //     .then(({ data }) => {
        //
        //         Promise.all(
        //             getBranchList(data)
        //         ).then((list) => {
        //             const branches = list.reduce((acc, { data }) => {
        //                 const { name, commit: { commit: { author, committer}} } = data;
        //                 return ([ ...acc, { name, author, committer } ])
        //             }, [])
        //
        //             console.log(JSON.stringify(branches, null, 2));
        //         })
        //     })
    } catch (error) {
        core.setFailed(error.message);
    }
})()