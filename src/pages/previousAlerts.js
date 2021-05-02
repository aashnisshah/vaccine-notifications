import React from "react";
import PreviousAlertsSection from "./../components/PreviousAlertsSection";
import { requireAuth } from "./../util/auth.js";

function PreviousAlertsPage(props) {
  return (
    <PreviousAlertsSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      title="Previous Alerts"
      subtitle="All previous updates relevant to the eligibility/age groups and locations you've subscribed to, can be found here."
    />
  );
}

export default requireAuth(PreviousAlertsPage);