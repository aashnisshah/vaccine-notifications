import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import HeroSection from "./../components/HeroSection";
import FeaturesSection from "./../components/FeaturesSection";
import FaqSection from "./../components/FaqSection";
import heroImage from "./../images/email-campaign-cuate.svg";
import HealthCareWorkerSection from "./../components/HealthCareWorkerSection";
import { useAuth } from "./../util/auth.js";

function IndexPage(props) {
  const auth = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      setIsMobile(true);
    }
  }, [])
  
  return (
    <>
      {!isMobile && (
        <>
          <HeroSection
            bg="white"
            textColor="dark"
            size="md"
            bgImage=""
            bgImageOpacity={1}
            title="Receive vaccine notifications relevant to you!"
            subtitle="Receive push notifications through the app or browser whenever vaccines appointments are available in your area."
            image={heroImage}
            imageAlt="image of a person with a loudspeaker in front of a phone"
            buttonText="Get Started"
            buttonColor="primary"
            buttonPath={auth.user ? "/dashboard" : "/auth/signup"}
          />
          <HealthCareWorkerSection/>
        </>
      )}
      <FeaturesSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="How it works"
        subtitle="Sign up to receive notifications when vaccine appointments become available in your area in a few simple steps."
      />
      <FaqSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Frequently Asked Questions"
        subtitle=""
      />
    </>
  );
}

export default IndexPage;
