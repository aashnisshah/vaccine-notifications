const { getAllUsers, updateUser } = require("./_db.js");

exports.handler = async (event, context, callback) => {
    let users = await getAllUsers();

    let updateCount = 0;

    let newAgeGroups = ["18-23", "24-29", "30-35", "36-40", "41-49"];

    users.map((user) => {
        console.log(`user: ${JSON.stringify(user)}`);
        if (user.ageGroups && user.ageGroups.includes("18-49")) {
            let combinedAgeGroups = user.ageGroups.concat(newAgeGroups);
            updateUser(user.uid, { ageGroups: combinedAgeGroups });
            console.log(`updated ${user.uid}`);
            updateCount++;
        }
    });

    return {
        statusCode: 200,
        body: `Updated ${updateCount} users`,
    };
};
