import React from "react";
import { Field, ErrorMessage } from "formik";
import "../index.css";

function TextField(props) {
  const { type, name, placeholder, icon, formik } = props;
  const isError = formik.errors[name] && formik.touched[name];
  const errorIcon = isError ? "error-icon" : "";
  const errorBorder = isError ? "error-border" : "";
  return (
    <>
      <div className="input-container">
        <Field
          type={type}
          name={name}
          placeholder={`Enter your ${placeholder}`}
        />
        <i className={`fas fa-${icon} icon ${errorIcon}`}></i>
        <span className={`input-border ${errorBorder}`} />
        <ErrorMessage name={name}>
          {(msg) => <p className="error-message">{msg}</p>}
        </ErrorMessage>
      </div>
    </>
  );
}

export default TextField;
