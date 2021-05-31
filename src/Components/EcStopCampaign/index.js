import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import AuthenticateEc from "../AuthenticateEc";
import "./index.css";
import EcCommon from "../EcCommon";
import Loader from "react-loader-spinner";
import ErrorMessagePopup from "../ErrorMessagePopup";
import Popup from "reactjs-popup";

const typeOfElections = ["mla", "mp", "sarpanch", "zptc"];
const districts = ["Khammam", "Adilabad", "Kurnool", "Nellore"];

class EcStopCampaign extends Component {
  state = {
    isSubmitting: false,
    isSubmitSuccess: false,
    errorMessage: null,
    isPopupOpen: false,
  };

  setClose = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    district: "Khammam",
    type: "mla",
  };

  validationSchema = Yup.object({
    district: Yup.string().required("*Required"),
    type: Yup.string().required("*Required"),
  });

  onSubmit = async (values) => {
    this.setState({ isSubmitting: true, errorMessage: "" });
    const { district, type } = values;

    const ecDetails = JSON.parse(localStorage.getItem("ecDetails"));
    const { edId } = ecDetails;

    const modifiedValues = {
      type,
      district,
      ecId: edId,
    };

    const url = "https://ovs-backend.herokuapp.com/ec/stop-campaign";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(modifiedValues),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSubmitSuccess: true });
      setTimeout(() => {
        this.setState({ isSubmitSuccess: false });
      }, 2000);
    } else {
      const { message } = await response.json();
      this.setState({ errorMessage: message, isPopupOpen: true });
    }
    this.setState({ isSubmitting: false });
  };

  renderButton = () => {
    const { isSubmitting } = this.state;
    return isSubmitting ? (
      <button type="submit" className="start-campaign-button">
        <Loader type="TailSpin" height={25} width={35} color="white" />
      </button>
    ) : (
      <button type="submit" className="start-campaign-button">
        Submit
      </button>
    );
  };

  renderStartConfirmed = () => {
    return (
      <div className="confirmed-image-container">
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
        <p>Campaign is Successfully Stopped</p>
      </div>
    );
  };

  renderForm = () => {
    const { isPopupOpen, errorMessage, isSubmitSuccess } = this.state;
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          return (
            <Form className="stop-campaign-form">
              <h1>Stop Campaign</h1>
              <div
                className="start-campaign-container"
                id="stopCampaignContainer"
              >
                <div className="select-container">
                  <p>Type of Election : </p>
                  <FormikControl
                    control="simpleDropdown"
                    name="type"
                    options={typeOfElections}
                    placeholder="Type"
                    formik={formik}
                  />
                </div>
                <div className="select-container">
                  <p>District : </p>
                  <FormikControl
                    control="simpleDropdown"
                    name="district"
                    options={districts}
                    placeholder="district"
                    formik={formik}
                  />
                </div>

                {this.renderButton()}
                <ErrorMessagePopup
                  isPopupOpen={isPopupOpen}
                  setOpen={this.setClose}
                  errorMessage={errorMessage}
                />
                <Popup open={isSubmitSuccess} className="start-campaign-popup">
                  {this.renderStartConfirmed()}
                </Popup>
              </div>
            </Form>
          );
        }}
      </Formik>
    );
  };

  render() {
    return (
      <div>
        <EcCommon />
        <div className="start-campaign-bg">{this.renderForm()}</div>
      </div>
    );
  }
}

export default EcStopCampaign;
