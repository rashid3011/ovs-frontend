import React from "react";
import { Field } from "formik";

function RadioInput(props) {
  const { name, options, icon } = props;
  return (
    <>
      <div className="radio-container" id={name}>
        <i className={`fas fa-${icon} radio-icon`}></i>
        <p className="radio-placeholder">{`Pick your ${name} : `}</p>
        <div className="radio-buttons-container">
          <Field name={name}>
            {({ field }) => {
              return options.map((option) => {
                return (
                  <React.Fragment key={option.key}>
                    <input
                      type="radio"
                      id={option.value}
                      {...field}
                      value={option.value}
                      checked={option.value === field.value}
                      name={name}
                    />
                    <label htmlFor={option.value}>{option.key}</label>
                  </React.Fragment>
                );
              });
            }}
          </Field>
        </div>
      </div>
    </>
  );
}

export default RadioInput;
