import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import ErrorMessagePopup from "../ErrorMessagePopup";

class SendOtp extends Component {
  state = {
    isSubmittingForm: false,
    isPopupOpen: false,
    errorMessage: false,
  };

  setClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    voterId: "",
    mobile: "",
  };

  validationSchema = Yup.object({
    voterId: Yup.string()
      .matches(/^V[0-9]{5}$/, "Voter ID should be like V#####")
      .required("*required"),
    mobile: Yup.string()
      .required("*Required")
      .matches(/^(\+\d{2})?(\d){10}$/, "enter valid phone number"),
  });

  onSubmit = async (data, onSubmitProps) => {
    this.setState({ isSubmittingForm: true });
    const url = "https://ovs-backend.herokuapp.com/send-otp";

    const modifiedData = {
      ...data,
      mobile:
        data.mobile.slice(0, 3) === "+91" ? data.mobile : "+91" + data.mobile,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedData),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    if (response.ok === true) {
      this.otpSentSuccess(modifiedData);
    } else {
      this.otpSentFailed(responseData);
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

  otpSentSuccess = (data) => {
    localStorage.setItem("voterDetails", JSON.stringify(data));
    const { changeForm } = this.props;
    changeForm("verifyOtp");
  };

  otpSentFailed = (data) => {
    const { message } = data;
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
          return (
            <Form className={`voter-login-content ${submitBgClass}`}>
              <h1>Enter your Details</h1>
              <FormikControl
                control="input"
                type="text"
                name="voterId"
                placeholder="Voter ID"
                icon="user"
                formik={formik}
              />

              <FormikControl
                control="input"
                type="text"
                name="mobile"
                placeholder="phone number"
                icon="mobile-alt"
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

export default SendOtp;
