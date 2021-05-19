import React from "react";
import DownloadSection from "./../components/DownloadSection";
import UpdatesSection from "./../components/UpdatesSection";
import { requireAuth } from "./../util/auth.js";

function DownloadPage(props) {
    return (
        <>
            <DownloadSection
                bg="white"
                textColor="dark"
                size="md"
                bgImage=""
                bgImageOpacity={1}
                title="Download the app"
                subtitle="To receive notifications straight to your phone, download the app"
            />
            <UpdatesSection
                bg="white"
                textColor="dark"
                size="md"
                bgImage=""
                bgImageOpacity={1}
                title="New Updates"
                subtitle="We've moved away from SMS notifications, in favour of app/browser notifications. The reality is, sending text messages can get expensive very quickly, and we're a non-profit organization. We wanted to make this app accessible for all, so notifications are available via our Android app and on the browser, and are coming soon to iOS!"
            />
        </>
    );
}

export default requireAuth(DownloadPage);
