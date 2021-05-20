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

  initialValues = this.fetchInitialValues();

  validationSchema = Yup.object({
    partyName: Yup.string().required("*Required"),
    type: Yup.string().required("*Required"),
  });

  onSubmit = async (values, onSubmitProps) => {
    const { rerenderCandidates, close } = this.props;
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
    if (response.status === 200) {
      this.setState({ isSubmitSuccess: true });
      setTimeout(() => {
        close();
        rerenderCandidates();
      }, 1000);
    } else {
      const data = await response.json();
      const { message } = data;
      this.setState({
        errorMessage: message,
        isSubmitting: false,
      });
    }
  };

  renderButton = () => {
    const { isSubmitting } = this.state;
    return isSubmitting ? (
      <button className="voter-view-nomination-button">
        <Loader type="TailSpin" width={35} height={30} color="blue" />
      </button>
    ) : (
      <button
        className="voter-view-nomination-button update-button"
        type="submit"
      >
        Update Form
      </button>
    );
  };

  renderForm = () => {
    const { isSubmitting, errorMessage, isEditable } = this.state;
    const bgClass = isSubmitting ? "loading-bg" : "";
    const editFormClass = isEditable ? "" : "edit-form";
    const { details } = this.props;
    const { candidateId } = details;
    const { close } = this.props;
    return (
      <div
        className={`voter-nomination-bg ${bgClass}`}
        id="voter-view-nomination"
      >
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            return (
              <div className="voter-nomination-content">
                <div className="voter-view-nomination-header">
                  <h1 className="voter-nomination-main-heading">
                    {`${candidateId}'s Details`}
                  </h1>
                  <i className="fas fa-times" onClick={close}></i>
                </div>
                <span className="voter-nomination-line"></span>
                <Form className="voter-nomination-form">
                  <div
                    className={`voter-view-nomination-input-container ${editFormClass}`}
                  >
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
                  <div className="voter-view-nomination-buttons-container">
                    <button
                      className="voter-view-nomination-button edit-button"
                      type="button"
                      onClick={() => {
                        this.setState({ isEditable: true });
                      }}
                    >
                      Edit
                    </button>
                    {this.renderButton()}
                    <button
                      className="voter-view-nomination-button reset-button"
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                      }}
                    >
                      Reset
                    </button>
                  </div>
                  <p className="nomination-error-message">{errorMessage}</p>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    );
  };

  renderSubmitSuccess = () => {
    return (
      <div className="nomination-image-container">
        <img
          src="confirmed.gif"
          alt="nomination-success"
          className="nomination-success"
        ></img>
        <p>Details are updated</p>
      </div>
    );
  };

  render() {
    const { isSubmitSuccess } = this.state;
    return isSubmitSuccess ? this.renderSubmitSuccess() : this.renderForm();
  }
}

export default ViewCandidateProfile;
