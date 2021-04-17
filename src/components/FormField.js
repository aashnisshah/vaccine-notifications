import React from "react";
import Form from "react-bootstrap/Form";

function FormField(props) {
  const { error, type, inputRef, options, defaultValue, ...inputProps } = props;

  return (
    <>
      {props.label && <Form.Label>{props.label}</Form.Label>}

      {type === "select" && (
        <>
          <Form.Group controlId="exampleForm.ControlSelect1">
            <Form.Control
              as="select"
              type="select"
              defaultValue={defaultValue} 
              isInvalid={error ? true : undefined}
              ref={inputRef}
              {...inputProps}
            >
              {props.options.map(option => (
                <option value={option} key={option}>{option}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </>
      )}

      {type !== "select" && (
        <Form.Control
          as={type === "textarea" ? "textarea" : "input"}
          type={type === "textarea" ? undefined : type}
          defaultValue={defaultValue}
          isInvalid={error ? true : undefined}
          ref={inputRef}
          {...inputProps}
        />
      )}

      {error && (
        <Form.Control.Feedback type="invalid" className="text-left">
          {error.message}
        </Form.Control.Feedback>
      )}
    </>
  );
}

export default FormField;
