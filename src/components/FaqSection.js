import React, { useState } from "react";
import Section from "./Section";
import Container from "react-bootstrap/Container";
import SectionHeader from "./SectionHeader";
import "./FaqSection.scss";

function FaqSection(props) {
  // Object to store expanded state for all items
  const [expanded, setExpanded] = useState({});
  // Set an item's expanded state
  const setExpandedItem = (index, isExpanded) => {
    setExpanded({
      ...expanded,
      [index]: isExpanded,
    });
  };

  const items = [
    {
      question: "Is this service free?",
      answer:
        "100%.",
    },
    {
      question: "What regions do you provide alerts for?",
      answer:
        "All regions in Canada.",
    },
    {
      question: "Will my information be shared with any third parties?",
      answer:
        "No. We will only use your information for the purpose of sending you alerts, and nothing else.",
    },
    {
      question: "How can I turn off notifications?",
      answer:
        "When you sign in with your phone number, you will see an opt out button on the right side of your dashboard.",
    },
    {
      question: "Can I get alerts for multiple regions and/or age groups?",
      answer:
        "Yes! Simply add all the groups you want notifications for from your dashboard, and you'll receive notifications for all of them.",
    },
  ];

  return (
    <Section
      bg={props.bg}
      textColor={props.textColor}
      size={props.size}
      bgImage={props.bgImage}
      bgImageOpacity={props.bgImageOpacity}
      id="faq"
    >
      <Container>
        <SectionHeader
          title={props.title}
          subtitle={props.subtitle}
          size={2}
          spaced={true}
          className="text-center"
        />

        {items.map((item, index) => (
          <article
            className="FaqSection__faq-item py-4"
            onClick={() => {
              setExpandedItem(index, !expanded[index]);
            }}
            key={index}
          >
            <h4>
              <span className="text-primary mr-3">
                <i
                  className={
                    "fas" +
                    (expanded[index] ? " fa-minus" : "") +
                    (!expanded[index] ? " fa-plus" : "")
                  }
                />
              </span>
              {item.question}
            </h4>

            {expanded[index] && <div className="mt-3">{item.answer}</div>}
          </article>
        ))}
      </Container>
    </Section>
  );
}

export default FaqSection;
