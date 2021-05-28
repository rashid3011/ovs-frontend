import { Form, Formik } from "formik";
import FormikControl from "../FormikControl";
import * as Yup from "yup";
import React, { Component } from "react";
import AuthencticateVoter from "../AuthencticateVoter";
import ErrorMessagePopup from "../ErrorMessagePopup";
import Loader from "react-loader-spinner";
import VoterCommon from "../VoterCommon";
import "./index.css";

class Donation extends Component {
  state = {
    errMsg: "",
    isPopupOpen: false,
    isSubmitting: false,
    isDonationSucess: false,
  };

  setPopupClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    amount: "",
  };

  validationSchema = Yup.object({
    amount: Yup.number()
      .typeError("*Please enter a number")
      .positive("*Please enter a valid amount")
      .max(10000, "*mount should be less than 10000")
      .required("*required"),
  });

  verifyPayment = async (data) => {
    this.setState({ isSubmitting: true });
    const url = "https://ovs-backend.herokuapp.com/payment-verify";
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSubmitting: false, isDonationSucess: true });
    } else {
      this.setState({
        isSubmitting: true,
        isDonationSucess: false,
        isPopupOpen: true,
        errMsg: "Payment Failed",
      });
    }
  };

  renderRazorpay = async (id) => {
    const verifyPayment = this.verifyPayment;
    const options = {
      key: "rzp_test_ZKY5qZEHlwQ2An",
      currency: "INR",
      name: "Votifie",
      description: "Online Voting System",
      order_id: id,
      handler: function (response) {
        verifyPayment(response);
      },
      theme: {
        color: "#132dbe",
      },
    };
    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  onSubmit = async (values) => {
    this.setState({ isSubmitting: true });
    const { amount } = values;
    const url = "https://ovs-backend.herokuapp.com/payment-order";
    const token = AuthencticateVoter.getToken();
    const data = {
      amount: amount * 100,
      currency: "INR",
      payment_capture: "1",
    };

    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      const { sub } = await response.json();
      const { id } = sub;
      this.renderRazorpay(id);
    } else {
      const data = await response.json();
      const { sub } = data;
      this.setState({ errMsg: sub.error.description, isPopupOpen: true });
    }
    this.setState({ isSubmitting: false });
  };

  renderButton = () => {
    const { isSubmitting } = this.state;
    return isSubmitting ? (
      <button className="submitting-btn create-order-btn">
        <Loader type="TailSpin" height={30} width={35} color="white" />
      </button>
    ) : (
      <button type="submit" className="create-order-btn">
        Donate
      </button>
    );
  };

  renderForm = () => {
    return (
      <div className="donation-content">
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            return (
              <Form className="donation-form">
                <h1>Donation </h1>

                <FormikControl
                  control="input"
                  type="text"
                  name="amount"
                  placeholder="Amount in INR"
                  icon="rupee-sign"
                  formik={formik}
                />
                {this.renderButton()}
              </Form>
            );
          }}
        </Formik>
      </div>
    );
  };

  renderDonationSucess = () => {
    return (
      <div className="donation-success">
        <h1>Donation Successful</h1>
        <p>
          Your donation is successful.
          <br /> Thank you for donation.
          <br /> We will make sure this donation
          <br /> reach the needy.
        </p>
        <button
          onClick={() => {
            this.props.history.go(0);
          }}
        >
          Donate again
        </button>
      </div>
    );
  };

  render() {
    const { errMsg, isPopupOpen, isDonationSucess } = this.state;
    return (
      <div className="donation-outer-bg">
        <VoterCommon />
        <div className="donation-bg">
          {isDonationSucess ? this.renderDonationSucess() : this.renderForm()}
          <ErrorMessagePopup
            errorMessage={errMsg}
            isPopupOpen={isPopupOpen}
            setOpen={this.setPopupClose}
          />{" "}
        </div>
      </div>
    );
  }
}

export default Donation;
