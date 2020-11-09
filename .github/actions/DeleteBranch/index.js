const core = require('@actions/core');
const github = require('@actions/github');

(async () => {
    try {
        console.log(JSON.stringify(core))
    } catch (error) {
        core.setFailed(error.message);
    }
})()