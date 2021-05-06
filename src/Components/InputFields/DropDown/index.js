import React from "react";
import { ErrorMessage, Field } from "formik";
import "../index.css";

function Dropdown(props) {
  const { options, name, placeholder, setaddress } = props;

  const changeHandler = (event) => {
    setaddress(event);
  };
  return (
    <div className="dropdown-container" id={name} onChange={changeHandler}>
      <div className="selectdiv">
        <label>
          <Field as="select" name={name}>
            <option>{placeholder}</option>
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

export default Dropdown;
