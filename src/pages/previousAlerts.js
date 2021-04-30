import React from "react";
import PreviousAlertsSection from "./../components/PostsSection";
import { requireAuth } from "./../util/auth.js";

function PreviousAlertsPage(props) {
  return (
    <PreviousAlertsSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      title="Post a Message"
      subtitle=""
    />
  );
}

export default requireAuth(PreviousAlertsPage);