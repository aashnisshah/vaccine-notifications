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
    const { handleSubmit, register, errors, reset } = useForm();

    const [locationGroup, setLocationGroup] = useState("");
    const [citiesToDisplay, setCitiesToDisplay] = useState([]);
    const [numCities, setNumCities] = useState(1);
    const [numPostals, setNumPostals] = useState(1);
    const [pending, setPending] = useState(false);
    const [groupError, setGroupError] = useState(false);
    const [messageStatus, setMessageStatus] = useState(null);
    const [showPreviewMessage, setShowPreviewMessage] = useState(false);
    const [rawData, setRawData] = useState();
    const [previewMessage, setPreviewMessage] = useState("");
    const [previewSendTo, setPreviewSendTo] = useState([]);

    useEffect(() => {
        if (!auth.user.admin) {
            history.replace("/dashboard");
        }
    }, [auth]);

    useEffect(() => {
        const allCities = [];
        for (const province of Object.keys(cities)) {
            for (const city of cities[province]) {
                allCities.push(city)
            }
        }
        setCitiesToDisplay(allCities)
    }, [])

    let accountConfigured =
        auth.user.phone && auth.user.province && auth.user.postalcode;

    const onSubmit = async (data) => {
        const allPostalCodes = document.querySelectorAll(".postalCodesInput");
        const province = document.querySelector(".province");
        const allCities = document.querySelectorAll(".city")

        if (document.querySelectorAll('input[type="checkbox"]:checked').length === 0) {
            setGroupError(true);
            const allCheckBoxes = document.querySelectorAll(
                'input[type="checkbox"]'
            );
            for (let i = 0; i < allCheckBoxes.length; i++) {
                allCheckBoxes[i].addEventListener("click", function () {
                    setGroupError(!this.checked);
                });
            }
        } else {
            if (allPostalCodes.length > 0) {
                data.postal = [];
                allPostalCodes.forEach((postal) => {
                    if (!data.postal.includes(postal.value.toUpperCase()) && postal.value != "") {
                        data.postal.push(postal.value.toUpperCase());
                    }
                });
            } else if (allCities.length > 0) {
                data.cities = []
                allCities.forEach((city) => {
                    if (!data.cities.includes(city.value) && city.value != "--") {
                        data.cities.push(city.value)
                    }
                })
            } else if (province && province.value) {
                if (province.value === "All") {
                    data.province = "CA";
                } else {
                    data.province = province.value
                }
            } 
    
            setGroupError(false);
            setPending(true);
    
            const selectedAgeGroups = [];
            const selectedEligibilityGroups = [];
            const allSelectedGroups = document.querySelectorAll('input[type="checkbox"]:checked');
    
            allSelectedGroups.forEach((group) => {
                if (ageGroups.includes(group.id)) {
                    selectedAgeGroups.push(group.id);
                } else if (eligibilityGroups.includes(group.id)) {
                    selectedEligibilityGroups.push(group.id);
                }
            });
    
            data.selectedAgeGroups = selectedAgeGroups;
            data.eligibilityGroups = selectedEligibilityGroups;
            delete data.locationGroup;
    
            if (auth.user.admin) {
                setPending(false);
                setShowPreviewMessage(true);
                setRawData(data);

                const message = await getMessageBody(data);
                const sendTo = await getSendTo(data);

                setPreviewSendTo(sendTo);
                setPreviewMessage(message);
            } else {
                alert("Only admins can post messages");
            }
        }
    };

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container style={{display: showPreviewMessage ? "none": null }}>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center"
                />
                {messageStatus && (
                    <FormAlert type={messageStatus.status} message={messageStatus.message} />
                  )
                }
            </Container>
        </Section>
    );
}

export default PreviousAlertsSection;
