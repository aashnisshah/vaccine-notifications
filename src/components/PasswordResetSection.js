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
import { useRouter } from "./../util/router.js";

export default function PasswordResetSection(props) {
    const auth = useAuth();
    const router = useRouter();
    const [pending, setPending] = useState(false);
    const { handleSubmit, register, reset } = useForm();
    const [messageStatus, setMessageStatus] = useState(null);

    const onSubmit = ({ email }) => {
        setPending(true);
        return auth.sendPasswordResetEmail(email).then(() => {
            setPending(false);
            reset();
            setMessageStatus({
                status: "success",
                message: "Password Reset Email Sent!",
            });
        });
    };

    return (
        <Section
            bg={props.bg}
            textColor={props.textColor}
            bgImage={props.bgImage}
            size={props.size}
            bgImageOpacity={props.bgImageOpacity}
        >

            
            <Container className="formContainer forwardBackButton mt-4">
            <Button className="p-0" variant="link" onClick={()=> router.push('/auth/signin')}>
                    <p>← Back</p>
                </Button>
                <SectionHeader
                    title={props.title}
                    subtitle={props.subtitle}
                    size={2}
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
                            name="email"
                            type="email"
                            size={"md"}
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
                            size="md"
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
