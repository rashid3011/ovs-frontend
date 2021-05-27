import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Field, ErrorMessage } from "formik";
import "../index.css";

import React from "react";

function DateInput(props) {
  const { name, icon, formik } = props;
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 18);
  const isError = formik.errors[name] && formik.touched[name];
  const errorIcon = isError ? "error-icon" : "";
  const errorBorder = isError ? "error-border" : "";

  return (
    <>
      <div className="input-container" id={name}>
        <Field>
          {({ field, form }) => {
            const { value } = field;
            const selectedValue = value[name];
            const { setFieldValue } = form;
            return (
              <DatePicker
                {...field}
                name={name}
                className="date"
                selected={selectedValue}
                onChange={(val) => setFieldValue(name, val)}
                placeholderText={`Pick your ${name}`}
                maxDate={maxDate}
                showYearDropdown
                showMonthDropdown
                dropdownMode="select"
              />
            );
          }}
        </Field>
        <i className={`fas fa-${icon} icon ${errorIcon}`}></i>
        <span className={`input-border ${errorBorder}`} />
        <ErrorMessage name={name}>
          {(msg) => <p className="error-message">{msg}</p>}
        </ErrorMessage>
      </div>
    </>
  );
}

export default DateInput;
