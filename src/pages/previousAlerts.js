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
    />
  );
}

export default requireAuth(PreviousAlertsPage);