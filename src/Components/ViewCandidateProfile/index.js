import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import AuthenticateEc from "../AuthenticateEc";
import "./index.css";

class ViewCandidateProfile extends Component {
  state = {
    errorMessage: "",
    isSubmitting: false,
    isSubmitSuccess: false,
    isEditable: false,
  };

  typeOptions = ["mla", "mp", "sarpanch", "zptc"];

  fetchInitialValues = () => {
    const { details } = this.props;
    const { partyName, type } = details;
    return { partyName, type };
  };

  deleteCandidate = async () => {
    const { fetchCandidateDetails, close } = this.props;
    this.setState({ isSubmitting: true, errorMessage: "" });
    const { details } = this.props;
    const { candidateId, type, district } = details;
    const bodyDetails = {
      candidateId,
      type,
      district,
    };
    const url = " https://ovs-backend.herokuapp.com/ec/candidates";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "DELETE",

      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(bodyDetails),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSubmitting: false, isSubmitSuccess: true });
      setTimeout(() => {
        this.setState({ isSubmitSuccess: false });
        close();
        fetchCandidateDetails();
      }, 2000);
    } else {
      const data = await response.json();
      const { message } = data;
      this.setState({
        errorMessage: message,
        isSubmitting: false,
      });
    }
  };

  initialValues = this.fetchInitialValues();

  validationSchema = Yup.object({
    partyName: Yup.string().required("*Required"),
    type: Yup.string().required("*Required"),
  });

  onSubmit = async (values, onSubmitProps) => {
    const { fetchCandidateDetails, close } = this.props;
    this.setState({ isSubmitting: true, errorMessage: "" });
    const { details } = this.props;
    const { candidateId } = details;
    const { partyName, type } = values;
    const updatedValues = {
      candidateId,
      partyName,
      type,
    };
    if (this.initialValues === values) {
      this.setState({
        errorMessage: "Please Change Values First",
        isSubmitting: false,
      });
      return;
    }
    const url = "https://ovs-backend.herokuapp.com/EC/candidates";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(updatedValues),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSubmitting: false, isSubmitSuccess: true });
      setTimeout(() => {
        this.setState({ isSubmitSuccess: false });
        close();
        fetchCandidateDetails();
      }, 2000);
    } else if (response.status === 503) {
      console.log("service not available");
      this.setState({
        errorMessage:
          "Candidate Cannot be deleted, because Campaign is running",
        isSubmitting: false,
      });
    } else {
      const data = await response.json();
      const { message } = data;
      this.setState({
        errorMessage: message,
        isSubmitting: false,
      });
    }
  };

  renderLoader = () => {
    return (
      <Loader
        className="loader"
        type="TailSpin"
        height={30}
        width={30}
        color="blue"
      />
    );
  };

  renderForm = () => {
    const { errorMessage, isEditable } = this.state;
    const editFormClass = isEditable ? "editable" : "";
    const { details } = this.props;
    const { candidateId } = details;
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
      >
        {(formik) => {
          return (
            <>
              <Form className="view-candidate">
                <h1>{`${candidateId}'s Details`}</h1>
                <div className={`edit-form ${editFormClass}`}>
                  <FormikControl
                    control="input"
                    type="text"
                    name="partyName"
                    placeholder="Party Name"
                    icon="envelope"
                    formik={formik}
                  />

                  <div className="nomination-address-input-container  ">
                    <p>
                      <span>
                        <i className={`fas fa-map-marker-alt icon`}></i>
                      </span>
                      Pick you Type :
                    </p>

                    <FormikControl
                      control="simpleDropdown"
                      name="type"
                      options={this.typeOptions}
                    />
                  </div>
                </div>
                <div className="candidate-buttons-container">
                  <div className="inner-button-container">
                    <button
                      className="edit-button"
                      type="button"
                      onClick={() => {
                        this.setState((prevState) => ({
                          isEditable: !prevState.isEditable,
                        }));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="voter-view-nomination-button update-button"
                      type="submit"
                    >
                      Update
                    </button>
                  </div>
                  <div className="inner-button-container">
                    <button
                      className="reset-button"
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                      }}
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      className="delete-button"
                      onClick={this.deleteCandidate}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="nomination-error-message">{errorMessage}</p>
              </Form>
            </>
          );
        }}
      </Formik>
    );
  };

  renderSubmitSuccess = () => {
    return (
      <div className="edit-candidate-success-container">
        <img
          src="confirmed.gif"
          alt="nomination-success"
          className="nomination-success"
        ></img>
        <p>Succesfully done!</p>
      </div>
    );
  };

  render() {
    const { isSubmitSuccess, isSubmitting } = this.state;
    return isSubmitting
      ? this.renderLoader()
      : isSubmitSuccess
      ? this.renderSubmitSuccess()
      : this.renderForm();
  }
}

export default ViewCandidateProfile;
