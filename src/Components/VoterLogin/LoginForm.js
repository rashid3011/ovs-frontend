import React, { Component } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import AuthenticateVoter from "../AuthenticateVoter";
import Loader from "react-loader-spinner";
import { Link, withRouter } from "react-router-dom";
import ErrorMessagePopup from "../ErrorMessagePopup";

class LoginForm extends Component {
  state = {
    isSubmittingForm: false,
    isPopupOpen: false,
    errorMessage: false,
  };

  setClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    id: "",
    loginPassword: "",
  };

  validationSchema = Yup.object({
    id: Yup.string()
      .matches(/^V[0-9]{5}$/, "Voter ID should be like V#####")
      .required("*required"),
    loginPassword: Yup.string().required("*Required"),
  });

  onSubmit = async (data, onSubmitProps) => {
    this.setState({ isSubmittingForm: true });
    const url = "https://ovs-backend.herokuapp.com/login";
    const { id, loginPassword } = data;
    const userDetails = {
      voterId: id,
      password: loginPassword,
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    if (response.ok === true) {
      this.loginSuccess(responseData);
    } else {
      this.loginFailed(responseData);
    }
    this.setState({ isSubmittingForm: false });
    onSubmitProps.setSubmitting(false);
  };

  renderButton = (formik) => {
    const { isSubmittingForm } = this.state;
    return isSubmittingForm ? (
      <button className="voter-login-button-loader">
        <Loader type="TailSpin" color="#4287f5" height={30} width={25} />
      </button>
    ) : (
      <button
        className="voter-login-button"
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Login
      </button>
    );
  };

  loginSuccess = (data) => {
    AuthenticateVoter.login(data, this.props.history);
  };

  loginFailed = (data) => {
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
              <h1>Online Voting</h1>
              <p className="voter-login-motto">
                Your <span className="voter-login-vote">Vote</span> Counts
              </p>
              <FormikControl
                control="input"
                type="text"
                name="id"
                placeholder="Voter ID"
                icon="user"
                formik={formik}
              />

              <FormikControl
                control="input"
                type="password"
                name="loginPassword"
                placeholder="Password"
                icon="lock"
                formik={formik}
              />
              {this.renderButton(formik)}
              <p
                className="redirect-link"
                onClick={() => {
                  changeForm("sendOtp");
                }}
              >
                Forgot Password?
              </p>
              <ErrorMessagePopup
                errorMessage={errorMessage}
                setOpen={this.setClose}
                isPopupOpen={isPopupOpen}
              />
              <p className="voter-login-no-account">
                Don't you have an account?
              </p>
              <Link to="/voter-register">
                <p className="voter-login-nav-link">Create account</p>
              </Link>
            </Form>
          );
        }}
      </Formik>
    );
  }
}

export default withRouter(LoginForm);
