import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import AuthenticateEc from "../AuthenticateEc";
import "./index.css";
import EcCommon from "../EcCommon";
import Loader from "react-loader-spinner";

const typeOfElections = ["mla", "mp", "sarpanch", "zptc"];
const districts = ["Khammam", "Adilabad", "Kurnool", "Nellore"];

class EcStartCampaign extends Component {
  state = {
    isSubmitting: false,
  };

  initialValues = {
    district: "Khammam",
    type: "mla",
    startDate: null,
    endDate: null,
  };

  validationSchema = Yup.object({
    district: Yup.string().required("*Required"),
    type: Yup.string().required("*Required"),
    startDate: Yup.date().nullable().required("*Required"),
    endDate: Yup.date().nullable().required("*Required"),
  });

  onSubmit = async (values) => {
    this.setState({ isSubmitting: true });
    const { district, type, startDate, endDate } = values;
    const modifiedStartDate = startDate;
    const modifiedEndDate = endDate;

    const ecDetails = JSON.parse(localStorage.getItem("ecDetails"));
    const { edId } = ecDetails;

    const modifiedValues = {
      type,
      district,
      startDate: modifiedStartDate,
      endDate: modifiedEndDate,
      ecId: edId,
    };

    const url = "https://ovs-backend.herokuapp.com/ec/start-campaign";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(modifiedValues),
    };

    await fetch(url, options);
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

  renderForm = () => {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          return (
            <Form className="start-campaign-form">
              <h1>Start Campaign</h1>
              <div className="start-campaign-container">
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

                <FormikControl
                  control="dateTime"
                  placeholder="Start Date"
                  name="startDate"
                  formik={formik}
                  icon="calendar-alt"
                />

                <FormikControl
                  control="dateTime"
                  placeholder="End Date"
                  name="endDate"
                  formik={formik}
                  icon="calendar-alt"
                />

                {this.renderButton()}
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

export default EcStartCampaign;
