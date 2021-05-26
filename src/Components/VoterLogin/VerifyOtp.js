import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import ErrorMessagePopup from "../ErrorMessagePopup";

class VerifyOtp extends Component {
  state = {
    isSubmittingForm: false,
    isPopupOpen: false,
    errorMessage: false,
  };

  setClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    code: "",
    secret: true,
    mobile: JSON.parse(localStorage.getItem("voterDetails")).mobile,
  };

  validationSchema = Yup.object({
    otp: Yup.string().required("*Required"),
  });

  onSubmit = async (data, onSubmitProps) => {
    this.setState({ isSubmittingForm: true });
    const url = "https://ovs-backend.herokuapp.com/verify-otp";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    if (response.ok === true) {
      this.otpVerifySuccess();
    } else {
      this.otpVerifyFailed(responseData);
    }
    this.setState({ isSubmittingForm: false });
    onSubmitProps.setSubmitting(false);
  };

  renderButton = (formik) => {
    const { isSubmittingForm } = this.state;
    return isSubmittingForm ? (
      <button className="voter-login-button">
        <Loader
          className="login-loader"
          type="TailSpin"
          color="#4287f5"
          height={30}
          width={120}
        />
      </button>
    ) : (
      <button
        className="voter-login-button"
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Send OTP
      </button>
    );
  };

  otpVerifySuccess = () => {
    const { changeForm } = this.props;
    changeForm("changePassword");
  };

  otpVerifyFailed = (data) => {
    const { message } = data;
    console.log(message);
    this.setState({
      isSubmittingForm: false,
      isPopupOpen: true,
      errorMessage: message,
    });
  };

  render() {
    const { isSubmittingForm, isPopupOpen, errorMessage } = this.state;
    const { changeForm } = this.props;
    const submitBgClass = isSubmittingForm ? "loading-bg" : null;
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          console.log(formik);
          return (
            <Form className={`voter-login-content ${submitBgClass}`}>
              <h1>Enter your OTP</h1>
              <FormikControl
                control="input"
                type="text"
                name="code"
                placeholder="OTP"
                icon="envelope-open-text"
                formik={formik}
              />
              {this.renderButton(formik)}
              <p
                className="redirect-link"
                onClick={() => {
                  changeForm("login");
                }}
              >
                go back to LoginForm?
              </p>
              <ErrorMessagePopup
                errorMessage={errorMessage}
                setOpen={this.setClose}
                isPopupOpen={isPopupOpen}
              />
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default VerifyOtp;
