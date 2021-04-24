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

const cities = {
    ON: ["Brampton", "Mississauga", "Toronto", "Vaughan", "Scarborough"],
    AB: ["Calgary"],
    BC: ["Vancouver", "Surrey"],
    QC: ["Montreal"]
}

const cityPostals = {
  Brampton: ["L7A", "L6P", "L6R", "L6S", "L6T", "L6V", "L6W", "L6X", "L6Y", "L6Z"],
  Mississauga: ["L5A", "L5B", "L5C", "L5E", "L5G", "L5H", "L5J", "L5K", "L5L", "L5M", "L5N", "L5P", "L5R", "L5S", "L5T", "L5V", "L5W", "L4T", "L4V", "L4W", "L4X", "L4Y", "L4Z"],
  Toronto: ["M3C", "M4J", "M8V", "M6H", "M4K", "M4Y", "M3H", "M5J", "M4C", "M5G", "M5N", "M4E", "m6K", "M4N", "M5V", "M5H", "M9V", "M6P", "M6B", "M5R", "M4H", "M6G", "M5X", "M5E", "M5T", "M5K", "M5P", "M4L", "M6N", "M1C", "M4T", "M1E", "M6R", "M2J", "M4X", "M3N", "M4G", "M1H", "M1J", "M9W", "M1S", "M3K", "M9N", "M1K", "M5W", "M1V", "M9R", "M9L", "M3A", "M9M", "M3K"],
  Vaughan: ["L0J", "L3T", "L4C"],
  Scarborough: [],
  Calgary: [],
  Vancouver: [],
  Surrey: [],
  Montreal: [],
}

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
    cities
};
