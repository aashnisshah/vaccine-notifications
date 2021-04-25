import React from "react";
import LegalSection from "../components/LegalSection";

function TosPage(props) {
    return (
        <LegalSection
            bg="white"
            textColor="dark"
            size="md"
            bgImageOpacity={1}
            title="Terms of Service"
            pageType="tos"
            showNameField={true}
        />
    );
}

export default TosPage;
