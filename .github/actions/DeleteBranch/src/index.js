const core = require('@actions/core');
const github = require('@actions/github');

const checkIsOutDated = (dates) => {
    // const threeMouthBefore = new Date().setMonth( new Date().getMonth() - 3 );
    const threeMouthBefore = new Date().setHours( new Date().getHours() - 3 );

    return dates.reduce((isOutDated, date) => (
        isOutDated || Number(new Date(date)) > threeMouthBefore
    ), false);
}

class API {
    constructor() {
        const { name, owner } = github.context.payload.repository;

        this.octokit = github.getOctokit(process.env.GITHUB_TOKEN);
        this.defaultCreds = { owner: owner.name, repo: name };
    }

    deleteBranch(name) {
        return (
            this.octokit.git.deleteRef({
                ...github.context.repo,
                ref: `heads/${name}`
            })
        )
    }

    getBranchList = () => {
        const params = { ...this.defaultCreds, protected: false };
        return this.octokit.repos.listBranches(params).then(({ data }) => data);
    }

    getBranchInfo = (name) => (
        this.octokit.repos.getBranch({
            ...this.defaultCreds,
            branch: name,
        })
    )

    getBranchesInfoList = (list) => (
        Promise.all(
            list.reduce((acc, { name }) => (
                [ ...acc, this.getBranchInfo(name) ]
            ), [])
        )
    )

    parseBranchesList = (list) => (
        list.reduce((acc, { data }) => {
            const { name, commit: { commit: { author, committer}} } = data;

            let isOutDated = checkIsOutDated([author.date,committer.date]);

            return ([ ...acc, { name, author, committer, isOutDated } ])
        }, [])
    )

    getBranches = () => (
        this.getBranchList()
            .then(this.getBranchesInfoList)
            .then(this.parseBranchesList)
    )
}

(async () => {
    try {
        const api = new API();

        api.getBranches().then((branches) => {
                console.log(JSON.stringify(branches, null, 2));
            })

    } catch (error) {
        core.setFailed(error.message);
    }
})()