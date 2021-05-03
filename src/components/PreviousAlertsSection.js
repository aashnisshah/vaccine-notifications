import React, { useState, useEffect } from "react";
import { Container, Form, Spinner, Button, Row, Col, Card } from "react-bootstrap";
import { useRouter, history } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import FormAlert from "./FormAlert";

function PreviousAlertsSection(props) {
    const auth = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!auth.user) {
            history.replace("/auth/signin");
        }
    }, [auth]);

    useEffect(() => {
      const getMessages = async () => {
        let allMessages = [];
        if ("allMessages" in window.localStorage) {
          console.log("not")
          allMessages = window.localStorage.getItem("allMessages");
          allMessages.sort((a, b) => (b.postTime > a.postTime) ? 1 : -1);
        }

        const lastPostTime = allMessages[0] ? allMessages[0].postTime : null;
        const todaysTime = new Date().getTime();
        const twoDaysAgoTime = todaysTime - 172800; // seconds in 2 days
        let getPostsAfterTime = 0;
        
        if (lastPostTime && lastPostTime < twoDaysAgoTime) {
          getPostsAfterTime = lastPostTime;
        } else {
          getPostsAfterTime = twoDaysAgoTime;
        }

        const newPosts = await auth.retrievePastAlerts(getPostsAfterTime);
        console.log(newPosts.length)
        console.log(Array.isArray(newPosts))
        console.log(newPosts)
        for (const post of newPosts) {
          allMessages.unshift(post);
        }
       
        window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
      }
      
      window.addEventListener("storage", async () => {
        if (window.localStorage.getItem("newMessage") && window.localStorage.getItem("newMessage") !== "") {
          const newMessage = JSON.parse(window.localStorage.getItem("newMessage"));
          const allMessages = JSON.parse(window.localStorage.getItem("allMessages"));
  
          allMessages.push(newMessage);
          window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
        }
      })

      getMessages();
    });

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />

                <p>HI</p>
            </Container>
        </Section>
    );
}

export default PreviousAlertsSection;
