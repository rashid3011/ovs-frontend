import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Popup from "reactjs-popup";
import "./index.css";
import Loader from "react-loader-spinner";
import AuthencticateVoter from "../AuthencticateVoter";

const districts = ["District", "Khammam", "Adilabad", "Kurnool", "Nellore"];
const constituency = [
  "Constituency",
  "Khammam",
  "Pallair",
  "Sirpur",
  "Asifabad",
  "Yemmiganur",
  "Pattikonda",
  "Atmakur Division",
  "Naidupeta Division",
];

const mandal = [
  "Mandal",
  "Tirumalayapalem",
  "Kusumanchi",
  "Khammam",
  "Dahegaon",
  "Khanapur",
  "Kerameri",
  "Wankdi",
  "Yemmiganur",
  "Gonegandla",
  "Veldurthy",
  "Maddikera",
  "Kaluvoya",
  "Pellakur",
];

const village = [
  "Village",
  "Kaluvoya",
  "Pellakur",
  "Yemmiganur",
  "Gonegandla",
  "Veldurthy",
  "Maddikera",
  "Ananthapur",
  "Devapur",
  "Goyagaon",
  "Karanjiwada",
  "Kerameri",
  "Wankdi",
  "Advisarangapur",
  "Badankurthy",
  "Bavapur",
  "Beernandi",
  "Gorregutta",
  "Borlakunta",
  "Kothmir",
  "Khammam",
  "Bachodu",
  "Bachodu Thanda",
  "Erragadd",
  "Gol Thanda",
  "Kusumanchi",
];

class VoterViewResults extends Component {
  state = {
    areaOptions: ["Election Type"],
    winner: [],
    isFetching: false,
    isOpen: false,
  };

  options = ["MLA", "MP", "Sarpanch", "ZPTC"];

  initialValues = {
    typeOfElection: "",
    area: "",
  };

  validationSchema = Yup.object({
    typeOfElection: Yup.string().required("*Required"),
    area: Yup.string().required("*Required"),
  });

  toSmallCase = (x) => {
    return x.toLowerCase();
  };

  setOpen = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  getResults = async (values) => {
    this.setState({ isFetching: true, isOpen: true });
    const { area, typeOfElection } = values;
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

  changeArea = (event) => {
    const value = event.target.value;
    switch (value) {
      case "MLA":
        this.setState({ areaOptions: constituency });
        break;
      case "MP":
        this.setState({ areaOptions: districts });
        break;
      case "Sarpanch":
        this.setState({ areaOptions: village });
        break;
      case "ZPTC":
        this.setState({ areaOptions: mandal });
        break;
      default:
        this.setState({ areaOptions: [] });
    }
  };

  renderLoader = () => {
    return <Loader width={35} height={35} color="blue" type="ThreeDots" />;
  };

  renderResults = (formik, close) => {
    const { typeOfElection, area } = formik.values;
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
    const { areaOptions, isOpen } = this.state;
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          return (
            <Form className="voter-view-results-form">
              <h1 className="main-heading">View Results</h1>
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
              <div className="view-results-type-input-container">
                <p>Pick your area</p>
                <FormikControl
                  control="simpleDropdown"
                  name="area"
                  options={areaOptions}
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
        <div className="voter-view-results">{this.renderForm()}</div>
      </div>
    );
  }
}

export default VoterViewResults;
