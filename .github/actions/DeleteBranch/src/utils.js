
const checkIsOutDated = (dates) => {
    // const threeMouthBefore = new Date().setMonth( new Date().getMonth() - 3 );
    const threeMouthBefore = new Date().setHours( new Date().setHours() - 1 );

    return dates.reduce((isOutDated, date) => (
        isOutDated || Number(new Date(date)) < threeMouthBefore
    ), false);
}

const createNotificationBody = (branches, date) => {
    const body = {
        blocks: [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": `:fire: Next branches will be deleted on ${date} at 00:00 :fire:`,
                    "emoji": true
                }
            },
            {
                "type": "divider"
            },
        ],
    };

    branches.forEach((branch) => {
        // if (branch.isOutDated) {
        //
        // }
        body.blocks.push(
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*\`${branch.name}\`*`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Created by \`${branch.author.name}\` (\`${branch.author.email}\`)`
                }
            },
            {
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `Last commited by \`${branch.committer.name}\` (\`${branch.committer.email}\`)`
                }
            },
            {
                "type": "divider"
            }
        )
    })

    return body;

}


module.exports.checkIsOutDated = checkIsOutDated;
module.exports.createNotificationBody = createNotificationBody;