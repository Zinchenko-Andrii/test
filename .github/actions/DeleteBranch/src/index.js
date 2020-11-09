const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        console.log(JSON.stringify(core, null, 2))
        console.log(JSON.stringify(github, null, 2))
    } catch (error) {
        core.setFailed(error.message);
    }
})()