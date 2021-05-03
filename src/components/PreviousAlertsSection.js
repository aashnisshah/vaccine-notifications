import React, { useState, useEffect } from "react";
import { Container, Form, Spinner, Table, Button, Row, Col, Card } from "react-bootstrap";
import { useRouter, history } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import FormAlert from "./FormAlert";
import "./previousAlerts.scss";

function PreviousAlertsSection(props) {
    const auth = useAuth();
    const router = useRouter();
    const [previousAlerts, setPreviousAlerts] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isAlertPage, setIsAlertPage] = useState(false);

    useEffect(() => {
        if (!auth.user) {
            history.replace("/auth/signin");
        }
    }, [auth]);

    useEffect(() => {
      const getMessages = async () => {
        let allMessages = [];

        if ("allMessages" in window.localStorage) {
          allMessages = JSON.parse(window.localStorage.getItem("allMessages"));
          // [].sort.call(allMessages, (a, b) => (b.postTime > a.postTime) ? 1 : -1);
        }

        const lastPostTime = allMessages[0] ? allMessages[0].postTime : null;
        const todaysTime = new Date().getTime();
        const twoDaysAgoTime = todaysTime - 172800000; // seconds in 2 days
        let getPostsAfterTime = 0;

        if (lastPostTime && lastPostTime > twoDaysAgoTime) {
          getPostsAfterTime = lastPostTime;
        } else {
          getPostsAfterTime = twoDaysAgoTime;
        }
        
        console.log(getPostsAfterTime)
        const newPosts = await auth.retrievePastAlerts(getPostsAfterTime);
        if (newPosts && newPosts.length > 0) {
          for (const post of newPosts) {
            allMessages.unshift(post);
          }
        }
       
        if (allMessages.length > 0 && allMessages.length > previousAlerts.length) {
          window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
          setPreviousAlerts(allMessages);
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
        }
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
    }, []);

    const formatTime = (time) => {
      const date = new Date(time).toString();
      return date.split(" ").slice(0,3).join(" ");
    }

    const displayAlert = (alert) => {
      setIsAlertPage(true);
    }
    
    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container className="d-flex align-items-center flex-column">
                <SectionHeader
                    title={props.title}
                    // subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />

                {!isAlertPage && (
                  <p>All previous updates relevant to the eligibility/age groups and locations you've subscribed to, can be found here.</p>
                )}

                {previousAlerts && previousAlerts.length > 0 && !isAlertPage ? (
                  <Table hover className="alertsTable">
                    <thead>
                      <th>Date</th>
                      <th>Message Type</th>
                    </thead>
                    <tbody>
                    {
                      previousAlerts.map((alert) => (
                        <tr onClick={() => displayAlert(alert)}>
                          <td>
                            <p>{formatTime(alert.postTime)}</p>
                          </td>
                          <td>
                            <p>{alert.messageType}</p>
                          </td>
                        </tr>
                      ))
                    }
                    </tbody>
                  </Table>
                ) : isEmpty ? (
                  <p className="emptyMessage"> There are no recent alerts for your selected age/elibility groups or regions.</p>
                ) : isAlertPage ? (
                  <>
                    <Button variant="link" onClick={() => setIsAlertPage(false)}>&#8592; &nbsp; Back</Button>
                  </>
                ) : (
                  <Spinner />
                )}
            </Container>
        </Section>
    );
}

export default PreviousAlertsSection;
