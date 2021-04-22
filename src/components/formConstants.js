const ageGroups = [
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
    "High Risk",
    "Highest Risk",
    "Faith leaders at higher risk of COVID-19 exposure (e.g. end-of-life care, care of deceased, home visits, care in health care and vulnerable settings)",
    "Health-care workers",
    "Those who work or live in a high-risk congregate living setting",
    "Essential caregivers to a person with a high risk condition",
    "Congregate living for seniors",
    "Adults in First Nations, Métis and Inuit populations",
    "Adult chronic home care recipients",
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
};
