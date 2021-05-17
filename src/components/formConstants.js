const ageGroups = [
    "0-12",
    "12-16",
    "16-18",
    "18-23",
    "24-29",
    "30-35",
    "36-40",
    "41-49",
    "50-59",
    "60-79",
    "80+",
];

const eligibilityGroups = [
    "Adult chronic home care recipients",
    "Adults in First Nations, Métis and Inuit populations",
    "Congregate living for seniors",
    "Essential caregivers to a person with a high risk condition",
    "Faith leaders at higher risk of COVID-19 exposure (e.g. end-of-life care, care of deceased, home visits, care in health care and vulnerable settings)",
    "Health-care workers",
    "High Risk",
    "Highest Risk",
    "Pregnant Women",
    "Those who work or live in a high-risk congregate living setting",
];
const provinces = [
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NT",
    "NS",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT",
];
const provincesWAll = [
    "AB",
    "BC",
    "MB",
    "NB",
    "NL",
    "NT",
    "NS",
    "NU",
    "ON",
    "PE",
    "QC",
    "SK",
    "YT",
    "All",
];

const cities = {
    ON: [
        "Brampton",
        "Mississauga",
        "Toronto",
        "Vaughan",
        "Scarborough",
        "Markham",
        "Ottawa",
        "Hamilton",
        "London",
        "Oshawa",
        "Windsor",
        "Niagara",
        "Barrie",
        "Guelph",
    ].sort(),
    AB: ["Calgary"].sort(),
    BC: ["Vancouver", "Surrey"].sort(),
    QC: ["Montreal"].sort(),
};

const messageTypeOptions = [
    "Vaccine Notifications Update",
    "Appointments Available",
    "Standby List",
    "Walk In's Accepted",
    "Waitlist Open",
];

const error = (errorType, field = "") => {
    const error = {
        required: `Please enter a ${field}`,
        invalid: `Please enter a valid ${field}`,
        noGroup: "Please select at least one age group or eligibility group",
        areaError: "You may only select a province OR input a postal code",
        inUse:
            "This email is already in use. Please enter another email address or sign in.",
        passwordLength: "Password must be at least 6 characters long",
    };
    return error[errorType];
};

const selectAll = (className) => {
    document
        .querySelectorAll(`.${className} input[type='checkbox']`)
        .forEach((checkbox) => {
            checkbox.checked = true;
        });
};

export {
    ageGroups,
    eligibilityGroups,
    provinces,
    messageTypeOptions,
    error,
    selectAll,
    provincesWAll,
    cities,
};
