import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Field, ErrorMessage } from "formik";
import "../index.css";

import React from "react";

function DateTimeInput(props) {
  const { name, icon, formik, placeholder } = props;
  const minDate = new Date();
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
                placeholderText={`Pick your ${placeholder}`}
                minDate={minDate}
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
                showTimeSelect
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

export default DateTimeInput;
