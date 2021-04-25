import React from "react";
import LegalSection from "./../components/LegalSection";

function PrivacyPage(props) {
    return (
        <LegalSection
            bg="white"
            textColor="dark"
            size="md"
            bgImageOpacity={1}
            title="Privacy Policy"
            pageType="privacy"
            showNameField={true}
        />
    );
}

export default PrivacyPage;
