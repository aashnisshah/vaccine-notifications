import React, { useState, useEffect } from "react";
import { Container, Form, Spinner, Table, Button, Row, Col, Card } from "react-bootstrap";
import { useRouter, history } from "./../util/router.js";
import { useAuth } from "./../util/auth.js";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import { getSendTo } from "../helpers/FormatPostMessage";
import FormAlert from "./FormAlert";
import "./previousAlerts.scss";

function PreviousAlertsSection(props) {
    const auth = useAuth();
    const router = useRouter();
    const [previousAlerts, setPreviousAlerts] = useState([]);
    const [isEmpty, setIsEmpty] = useState(true);
    const [isAlertPage, setIsAlertPage] = useState(false);
    const [groups, setGroups] = useState([]);
    const [alertBody, setAlertBody] = useState("");

    useEffect(() => {
        if (!auth.user) {
          history.replace("/auth/signin");
        }
    }, [auth]);

    useEffect(()=> {

    },[])

    useEffect(() => {
      const getMessages = async () => {
        
        let allMessages = [];
        let firstLoad = false;
        if ("allMessages" in window.localStorage) {
          allMessages = await checkNewMessage();
          // allMessages = JSON.parse(window.localStorage.getItem("allMessages"));
          // [].sort.call(allMessages, (a, b) => (b.postTime > a.postTime) ? 1 : -1);
        } else {
          firstLoad = true;
          window.localStorage.setItem("allMessages", JSON.stringify([allMessages]));
        }
        allMessages.sort((a, b) => (b.postTime > a.postTime) ? 1 : -1);
        const lastPostTime = allMessages[0] ? allMessages[0].postTime : null;
        const todaysTime = new Date().getTime();
        const twoDaysAgoTime = todaysTime - 172800000; // seconds in 2 days
        let getPostsAfterTime = 0;

        if (lastPostTime && lastPostTime > twoDaysAgoTime) {
          getPostsAfterTime = lastPostTime;
        } else {
          getPostsAfterTime = twoDaysAgoTime;
        }
        
        const newPosts = await auth.retrievePastAlerts(getPostsAfterTime);
        if (newPosts && newPosts.length > 0) {
          for (const post of newPosts) {
            allMessages.unshift(post);
          }
        }
        window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
        
        if (firstLoad) {
          allMessages = await checkNewMessage();
        }
       
        if (allMessages.length > 0 && allMessages.length > previousAlerts.length) {
          
          setPreviousAlerts(allMessages);
          setIsEmpty(false);
        } else {
          setIsEmpty(true);
        }
      }
      async function checkNewMessage() {
        const newMessageRaw = window.localStorage.getItem("newMessage");
        let allMessages = JSON.parse(window.localStorage.getItem("allMessages"))
        if (newMessageRaw && newMessageRaw !== "") {
          const newMessage = JSON.parse(newMessageRaw);
          
          window.localStorage.removeItem("newMessage");
          allMessages.push(newMessage);
          displayAlert(newMessage);  
          window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
          
        }
        return allMessages;
      }
      
      // window.addEventListener("storage", async (e) => {
      // //   alert(e.key)
      // console.log(e.key)
      //  alert(window.localStorage.getItem("newMessage"))
      //   if (window.localStorage.getItem("newMessage") && window.localStorage.getItem("newMessage") !== "" && window.localStorage.getItem("newMessage") !== undefined) {
          
      //     alert(window.localStorage.getItem("newMessage"))
      //     const newMessage = JSON.parse(window.localStorage.getItem("newMessage"));
      //     const allMessages = JSON.parse(window.localStorage.getItem("allMessages"));
      //     window.localStorage.removeItem("newMessage");
      //     // if (!allMessages.includes(newMessage)) {
      //     allMessages.push(newMessage);
            
      //     window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
      //     // }
      //   }
      // })

      // window.addEventListener("storage", async (e) => {
      //   const newMessageRaw = window.localStorage.getItem("newMessage");
      //   const newMessage = JSON.parse(newMessageRaw);
      //   const allMessages = JSON.parse(window.localStorage.getItem("allMessages"));
      //   window.localStorage.removeItem("newMessage");
      //   // if (!allMessages.includes(newMessage)) {
      //   allMessages.push(newMessage);
          
      //   window.localStorage.setItem("allMessages", JSON.stringify(allMessages));
      // });


      getMessages();
    }, []);

    const formatTime = (time) => {
      const date = new Date(time).toString();
      return date.split(" ").slice(0,3).join(" ");
    }

    const formatPhoneNumber = (number) => {
      let match = number.match(/^(\d{3})(\d{3})(\d{4})$/);

      if (match) {
        return '(' + match[1] + ') ' + match[2] + '-' + match[3]
      };
    }

    const displayAlert = (alert) => {
      const alertGroups = getSendTo(alert);

      setGroups(alertGroups);
      setIsAlertPage(true);
      setAlertBody(alert);
    }
    
    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container className="d-flex align-items-center flex-column position-relative">
                <SectionHeader
                    title={props.title}
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
                  <Container className="position-relative alertPageContainer">
                    <Button variant="link" className="backButton left-0" onClick={() => setIsAlertPage(false)}>&#8592; &nbsp; Back</Button>
                    <Container className="messageContainer">
                      <h5>This message is for: </h5>
                      <ul>
                        {groups.map(group => <li>{group}</li>)}
                      </ul>
                      <Card className="mb-4">
                        <Card.Header as="h5">Alert Preview</Card.Header>
                        <Card.Body>
                          {alertBody.messageType}
                          <br/> 
                          <br/>
                          {alertBody.message}
                          <br/>
                          <br/>
                          { alertBody.linkToBooking && !alertBody.numberToBooking && (
                            <p>To book, visit <a href={alertBody.linkToBooking}>{alertBody.linkToBooking}</a></p>
                          )}

                          { alertBody.numberToBooking && !alertBody.linkToBooking && (
                            <p>Call {formatPhoneNumber(alertBody.numberToBooking)} to book</p>
                          )}

                          { alertBody.numberToBooking && alertBody.linkToBooking && (
                            <p>Call {formatPhoneNumber(alertBody.numberToBooking)} or visit <a href={alertBody.linkToBooking}>{alertBody.linkToBooking}</a> to book</p>
                          )}

                          { alertBody.linkToSrc && (
                            <p>To learn more visit <a href={alertBody.linkToSrc}>{alertBody.linkToSrc}</a></p> 
                          )}
                        </Card.Body>
                      </Card>
                    </Container>
                  </Container>
                ) : (
                  <Spinner />
                )}
            </Container>
        </Section>
    );
}

export default PreviousAlertsSection;
