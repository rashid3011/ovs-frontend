import { Form, Formik } from "formik";
import React, { Component } from "react";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import AuthenticateEc from "../AuthenticateEc";
import Popup from "reactjs-popup";
import "./index.css";
import Loader from "react-loader-spinner";

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

class EcViewResults extends Component {
  state = {
    areaOptions: ["Area"],
    winner: null,
    isFetching: true,
    isOpen: false,
    errorMessage: null,
  };

  options = ["MLA", "MP", "Sarpanch", "ZPTC"];

  initialValues = {
    typeOfElection: "",
    area: "",
    district: "",
  };

  validationSchema = Yup.object({
    typeOfElection: Yup.string().required("*Required"),
    area: Yup.string().required("*Required"),
    district: Yup.string().required("*Required"),
  });

  toSmallCase = (x) => {
    return x.toLowerCase();
  };

  capitalize = (x) => {
    return x
      .split(" ")
      .map((y) => y.slice(0, 1).toUpperCase() + y.slice(1))
      .join(" ");
  };

  setOpen = () => {
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  getResults = async (values) => {
    this.setState({ isFetching: true, isOpen: true, winner: null });
    const { area, typeOfElection, district } = values;
    const url = `https://ovs-backend.herokuapp.com/ec/results/${this.toSmallCase(
      district
    )}/${this.toSmallCase(typeOfElection)}/${this.toSmallCase(area)}`;
    const token = AuthenticateEc.getToken();
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      const data = await response.json();
      const { winner } = data;
      if (winner[0] !== null) {
        this.getCandidate(winner[0]);
      } else {
        this.setState({ isFetching: false });
      }
    } else {
      const { message } = await response.json();
      this.setState({ errorMessage: message, isFetching: false });
    }
  };

  getCandidate = async (winner) => {
    const candidateId = winner._id;
    const url = `https://ovs-backend.herokuapp.com/ec/candidates/${candidateId}`;
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AuthenticateEc.getToken()}`,
      },
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      const { candidate } = await response.json();
      this.setState({
        winner: candidate,
        isFetching: false,
      });
    } else {
      const { message } = await response.json();
      this.setState({ errorMessage: message, isFetching: false });
    }
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

  renderResultDetails = (formik, close) => {
    const { area } = formik.values;
    const { winner } = this.state;
    const { voterInfo, type, partyName } = winner;
    const { firstName, lastName } = voterInfo;
    return (
      <>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Candidate Name</p>
            <p>Party Name</p>
            <p>Type of Election</p>
            <p>Area</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{`${this.capitalize(firstName)} ${this.capitalize(
              lastName
            )}`}</p>
            <p>{this.capitalize(partyName)}</p>
            <p>{this.capitalize(type)}</p>
            <p>{this.capitalize(area)}</p>
          </div>
        </ul>

        <button onClick={close} className="">
          Close
        </button>
      </>
    );
  };

  renderNoWinner = (close) => {
    const { errorMessage } = this.state;
    return (
      <>
        <p className="no-winner-message">
          {errorMessage !== null ? errorMessage : `There is no winner yet`}
        </p>
        <button onClick={close}>Close</button>
      </>
    );
  };

  renderResults = (formik, close) => {
    const { isFetching, winner } = this.state;
    return isFetching ? (
      this.renderLoader()
    ) : (
      <>
        <h1>Winner</h1>
        {winner === null
          ? this.renderNoWinner(close)
          : this.renderResultDetails(formik, close)}
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
                  placeholder="Election Type"
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
              <div className="view-results-type-input-container">
                <p>Pick your district</p>
                <FormikControl
                  control="simpleDropdown"
                  name="district"
                  options={districts}
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
    return <div className="view-results-bg">{this.renderForm()}</div>;
  }
}

export default EcViewResults;
