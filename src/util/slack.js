import slack from "slack";

let token = process.env.REACT_APP_SLACK_BOT_TOKEN;
let slackChannel = process.env.REACT_APP_SLACK_CHANNEL;

export const postToSlack = async (data) => {
    let text = `*:tada: ${data.firstName} just applied for an admin role! :tada:*\n\nEmail: ${data.email} from ${data.facility}`;

    slack.chat
        .postMessage({ token, channel: slackChannel, text })
        .then()
        .catch((e) => console.log(`error: ${JSON.stringify(e.message)}`));
};
