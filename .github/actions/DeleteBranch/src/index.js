const core = require('@actions/core');
const _http = require('@actions/http-client');

const api = require('./api');
const { createNotificationBody, DELETE_DAY, NOTIFY_DAY } = require('./utils');

(async () => {
    try {
        const branches = await api.getBranches();

        if (branches.length) {
            const http = new _http.HttpClient();
            console.log(JSON.stringify(branches, null, 2))

            if (
                // new Date().getDay() === NOTIFY_DAY
                new Date().getDay() === 3
            ) {
                console.log('notify')
                await http.post(
                    process.env.SLACK_HOOK_URL,
                    JSON.stringify(
                        createNotificationBody(branches, false)
                    )
                );
            }

            if (new Date().getDay() === DELETE_DAY) {
                console.log('delete')
                await http.post(
                    process.env.SLACK_HOOK_URL,
                    JSON.stringify(
                        createNotificationBody(branches, true)
                    )
                );
            }


        }

    } catch (error) {
        core.setFailed(error.message);
    }
})()