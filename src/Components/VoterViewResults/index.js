import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Popup from "reactjs-popup";
import "./index.css";
import Loader from "react-loader-spinner";
import AuthencticateVoter from "../AuthencticateVoter";

class VoterViewResults extends Component {
  state = {
    winner: [],
    isFetching: false,
    isOpen: false,
  };

  options = ["MLA", "MP", "Sarpanch", "ZPTC"];

  initialValues = {
    typeOfElection: "",
  };

  validationSchema = Yup.object({
    typeOfElection: Yup.string().required("*Required"),
  });

  toSmallCase = (x) => {
    return x.toLowerCase();
  };

  setOpen = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  getResults = async (values) => {
    this.setState({ isFetching: true, isOpen: true });
    const { typeOfElection } = values;
    const area = this.getArea(typeOfElection);
    const url = `https://ovs-backend.herokuapp.com/results/${this.toSmallCase(
      typeOfElection
    )}/${this.toSmallCase(area)}`;
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: `bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    const { winner } = data;
    this.setState({
      winner: winner[0],
      isFetching: false,
    });
  };

  onSubmit = (values) => {
    this.getResults(values);
  };

  getArea = (value) => {
    const voterDetails = JSON.parse(localStorage.getItem("voterDetails"));
    const { constituency, district, mandal, village } = voterDetails;
    switch (value) {
      case "MLA":
        return constituency;
      case "MP":
        return district;
      case "Sarpanch":
        return village;
      case "ZPTC":
        return mandal;
      default:
        return "";
    }
  };

  renderLoader = () => {
    return <Loader width={35} height={35} color="blue" type="ThreeDots" />;
  };

  renderResults = (formik, close) => {
    const { typeOfElection } = formik.values;
    const area = this.getArea(typeOfElection);
    const { isFetching, winner } = this.state;
    return isFetching ? (
      this.renderLoader()
    ) : (
      <>
        <h1>Winner</h1>
        {winner === null ? (
          <p>There is no winner yet</p>
        ) : (
          <p>{`The winner of ${area} ${typeOfElection} is ${winner._id} with ${
            winner.count
          } ${winner.count > 1 ? "votes" : "vote"}`}</p>
        )}
        <button onClick={close}>Close</button>
      </>
    );
  };

  renderForm = () => {
    const { isOpen } = this.state;
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          return (
            <Form className="view-results-form">
              <div className="view-results-type-input-container">
                <p>Pick the type of election</p>
                <FormikControl
                  control="dropdown"
                  name="typeOfElection"
                  options={this.options}
                  onChange={this.changeArea}
                  placeholder="Type of Election"
                />
              </div>
              <button
                className="view-results-button"
                type="submit"
                disabled={!formik.dirty || !formik.isValid}
              >
                Get Results
              </button>
              <Popup
                open={isOpen}
                closeOnDocumentClick
                onClose={this.setOpen}
                modal
                className="winner-popup"
              >
                {(close) => {
                  return this.renderResults(formik, close);
                }}
              </Popup>
            </Form>
          );
        }}
      </Formik>
    );
  };

  render() {
    return (
      <div className="voter-view-results-bg">
        <div className="voter-view-results-container">
          <div className="view-results-bg">
            <h1 className="main-heading">View Results</h1>
            {this.renderForm()}
          </div>
          <div className="results-image-container">
            <img src="results.svg" alt="results" className="results-image" />
          </div>
        </div>
      </div>
    );
  }
}

export default VoterViewResults;
