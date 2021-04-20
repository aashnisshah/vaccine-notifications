
const ageGroups = ["18-49", "50-59", "60-79", "80+"]
const eligibilityGroups = ["Congregate living for seniors", "Health care workers", "Adults in First Nations, Métis and Inuit populations", "Adult chronic home care recipients", "High-risk congregate settings", "Individuals with high-risk chronic conditions and their caregivers"]
const provinces= [ "AB", "BC", "MB", "NB", "NL", "NT", "NS", "NU", "ON", "PE", "QC", "SK", "YT"]

const error = (errorType, field="") => {
  const error = {
    required: `Please enter a ${field}`,
    invalid: `Please enter a valid ${field}`,
    noGroup: "Please select at least one age group or eligibility group",
    areaError: "You may only select a province OR input a postal code"
  }
  return error[errorType];
}

const selectAll = (className) => {
  document.querySelectorAll(`.${className} input[type='checkbox']`).forEach(checkbox => {
    checkbox.checked = true;
  })
}

export { ageGroups, eligibilityGroups, provinces, error, selectAll };