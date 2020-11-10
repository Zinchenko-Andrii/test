const core = require('@actions/core');
const github = require('@actions/github');
const _http = require('@actions/http-client');


const checkIsOutDated = (dates) => {
    // const threeMouthBefore = new Date().setMonth( new Date().getMonth() - 3 );
    const threeMouthBefore = new Date().setDate( new Date().getDay() - 1 );

    return dates.reduce((isOutDated, date) => (
        isOutDated || Number(new Date(date)) < threeMouthBefore
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

        api.getBranches().then(async (branches) => {
                console.log(JSON.stringify(branches, null, 2));

                const body = {
                    "text": "Hello, world."
                };

                const http = new _http.HttpClient();
                await http.post(process.env.SLACK_HOOK_URL, JSON.stringify(body));
            })

    } catch (error) {
        core.setFailed(error.message);
    }
})()