import React, { useState } from "react";
import {
    Container,
    Form,
    Spinner,
    Button,
} from "react-bootstrap";
import { useAuth } from "./../util/auth.js";
import { useForm } from "react-hook-form";
import FormField from "./FormField";
import Section from "./Section";
import SectionHeader from "./SectionHeader";
import FormAlert from "./FormAlert";

export default function PasswordResetSection(props) {
    const auth = useAuth();
    const [pending, setPending] = useState(false);
    const { handleSubmit, register } = useForm();
    const [messageStatus, setMessageStatus] = useState(null);

    const onSubmit = ({ email }) => {
        setPending(true);
        return auth.sendPasswordResetEmail(email).then(() => {
            setPending(false);
            setMessageStatus({
                status: "success",
                message: "Reset Password Email Sent!",
            });
        });
    };

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            size={props.size}
            bgImage={props.bgImage}
            bgImageOpacity={props.bgImageOpacity}
        >
            <Container className="formContainer">
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={1}
                    spaced={true}
                    className="text-center justify-center"
                />
                {messageStatus && (
                    <FormAlert
                        type={messageStatus.status}
                        message={messageStatus.message}
                    />
                )}
                <Form  onSubmit={handleSubmit(onSubmit)}>
                    <Form.Group controlId="messageType" className="flex-fill">
                        <FormField
                            size="lg"
                            name="email"
                            type="email"
                            placeholder="Email"
                            inputRef={register({
                                required: "Please enter an email",
                            })}
                        />
                    </Form.Group>
                    <div className="w-100 text-center">
                        <Button
                            variant="primary"
                            type="submit"
                            disabled={pending}
                            size="lg"
                            className="my-2"
                        >
                            {!pending && <span>Send Email</span>}

                            {pending && (
                                <Spinner
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden={true}
                                    className="align-baseline"
                                >
                                    <span className="sr-only">Loading...</span>
                                </Spinner>
                            )}
                        </Button>
                    </div>
                </Form>
            </Container>
        </Section>
    );
}
