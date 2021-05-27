import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import AuthenticateEc from "../AuthenticateEc";
import "./index.css";
import EcCommon from "../EcCommon";

const typeOfElections = ["mla", "mp", "sarpanch", "zptc"];
const districts = ["Khammam", "Adilabad", "Kurnool", "Nellore"];

export class EcStartCampaign extends Component {
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
    const { district, type, startDate, endDate } = values;
    const modifiedStartDate = startDate;
    const modifiedEndDate = endDate;
    modifiedStartDate.setHours(modifiedStartDate.getHours() + 5);
    modifiedStartDate.setMinutes(modifiedStartDate.getMinutes() + 30);
    modifiedEndDate.setHours(modifiedEndDate.getHours() + 5);
    modifiedEndDate.setMinutes(modifiedEndDate.getMinutes() + 30);

    const ecDetails = JSON.parse(localStorage.getItem("ecDetails"));
    const { edId } = ecDetails;

    const modifiedValues = {
      type,
      district,
      startDate: modifiedStartDate,
      endDate: modifiedEndDate,
      ecId: edId,
    };
    console.log({ modifiedValues });
    console.log(JSON.stringify(modifiedValues));
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

                <button type="submit" className="start-campaign-button">
                  Submit
                </button>
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
