import React from "react";
import { ErrorMessage, Field } from "formik";
import "../index.css";

function SimpleDropdown(props) {
  const { options, name } = props;

  return (
    <div id={name}>
      <div className="selectdiv">
        <label>
          <Field as="select" name={name}>
            {options.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Field>
        </label>
      </div>
      <ErrorMessage name={name}>
        {(msg) => <p className="error-message">{msg}</p>}
      </ErrorMessage>
    </div>
  );
}

export default SimpleDropdown;
