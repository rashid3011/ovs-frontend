import React from "react";
import { Field, ErrorMessage } from "formik";

function TextArea(props) {
  const { name, id, icon, formik } = props;
  const isError = formik.errors[name] && formik.touched[name];
  const errorIcon = isError ? "error-icon" : "";
  const errorBorder = isError ? "error-border" : "";
  return (
    <div className="input-container">
      <Field name={name}>
        {({ field }) => {
          console.log(field);
          return (
            <textarea
              {...field}
              rows="10"
              placeholder={`Enter your ${name}`}
              id={id}
            ></textarea>
          );
        }}
      </Field>
      <i className={`fas fa-${icon} icon ${errorIcon}`}></i>
      <span className={`input-border ${errorBorder}`} />
      <ErrorMessage name={name}>
        {(msg) => <p className="error-message">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

export default TextArea;
