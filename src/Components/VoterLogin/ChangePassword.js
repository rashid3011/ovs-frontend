import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import ErrorMessagePopup from "../ErrorMessagePopup";
import Popup from "reactjs-popup";

class ChangePassword extends Component {
  state = {
    isSubmittingForm: false,
    isPopupOpen: false,
    errorMessage: false,
    isChangeConfirmed: false,
  };

  setClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    password: "",
    confirmPassword: "",
    voterId: JSON.parse(localStorage.getItem("voterDetails")).voterId,
    secret: true,
  };

  validationSchema = Yup.object({
    password: Yup.string()
      .required("*Required")
      .min(8, "password is too short")
      .matches(/^(?=.*[a-z])/, "password must contain one lowercase letter")
      .matches(
        /^(?=.*[A-Z])/,
        "password must contain atleast one UpperCase letter"
      )
      .matches(/^(?=.*[0-9])/, "password must contain atleast one digit"),
    confirmPassword: Yup.string()
      .required("*Requried")
      .oneOf([Yup.ref("password"), null], "password must match"),
  });

  onSubmit = async (data, onSubmitProps) => {
    this.setState({ isSubmittingForm: true });
    const url = "https://ovs-backend.herokuapp.com/forgot-password";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.changePasswordSuccess();
    } else {
      const responseData = await response.json();
      this.changePasswordFailed(responseData);
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
        Change
      </button>
    );
  };

  changePasswordSuccess = () => {
    this.setState({ isChangeConfirmed: true });
    setTimeout(() => {
      this.setState({ isChangeConfirmed: false });
      const { changeForm } = this.props;
      changeForm("login");
    }, 2000);
  };

  changePasswordFailed = (data) => {
    const { message } = data;
    this.setState({
      isSubmittingForm: false,
      isPopupOpen: true,
      errorMessage: message,
    });
  };

  renderChangeConfirmed = () => {
    return (
      <div className="confirmed-image-container">
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
        <p>Password is changed successfully!</p>
      </div>
    );
  };

  render() {
    const { isSubmittingForm, isPopupOpen, errorMessage, isChangeConfirmed } =
      this.state;
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
              <h1>Reset Password</h1>
              <FormikControl
                control="input"
                type="password"
                name="password"
                placeholder="New Password"
                icon="user"
                formik={formik}
              />

              <FormikControl
                control="input"
                type="password"
                name="confirmPassword"
                placeholder="Password again"
                icon="lock"
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
              <Popup
                open={isChangeConfirmed}
                className="forgot-password-confirm-popup"
              >
                {this.renderChangeConfirmed()}
              </Popup>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default ChangePassword;
