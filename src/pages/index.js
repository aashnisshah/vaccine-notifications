import React from "react";
import HeroSection from "./../components/HeroSection";
import ClientsSection from "./../components/ClientsSection";
import FeaturesSection from "./../components/FeaturesSection";
import FaqSection from "./../components/FaqSection";
import TestimonialsSection from "./../components/TestimonialsSection";
import NewsletterSection from "./../components/NewsletterSection";
import heroImage from "./../images/email-campaign-cuate.svg";

function IndexPage(props) {
  return (
    <>
      <HeroSection
        bg="white"
        textColor="dark"
        size="md"
        bgImage=""
        bgImageOpacity={1}
        title="Receive vaccine notifications relevant to you!"
        subtitle="Receive notifications whenever vaccines appointments are available in your area."
        image={heroImage}
        imageAlt="image of a person with a loudspeaker in front of a phone"
        buttonText="Get Started"
        buttonColor="primary"
        buttonPath="/auth/signup"
      />
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
