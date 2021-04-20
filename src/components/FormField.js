import React from "react";
import Form from "react-bootstrap/Form";

function FormField(props) {
  const { error, type, inputRef, options, defaultValue, helpText, ...inputProps } = props;

  return (
    <>
      {props.label && <Form.Label className="mb-1">{props.label}</Form.Label>}

      {type === "select" && (
        <>
          <Form.Control
            as="select"
            type="select"
            defaultValue={defaultValue} 
            isInvalid={error ? true : undefined}
            ref={inputRef}
            {...inputProps}
          >
            <option value={defaultValue}>{defaultValue}</option>
            {props && props.options && props.options.map(option => (
              <option value={option} key={option}>{option}</option>
            ))}
          </Form.Control>
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

      {helpText && <Form.Text muted>{helpText}</Form.Text>} 

      {error && (
        <Form.Control.Feedback type="invalid" className="text-left">
          {error.message}
        </Form.Control.Feedback>
      )}
    </>
  );
}

export default FormField;
