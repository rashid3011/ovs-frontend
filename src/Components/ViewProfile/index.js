import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import AuthenticateEc from "../AuthenticateEc";
import "./index.css";

const validationSchema = Yup.object({
  voterId: Yup.string().required("*Required"),
  email: Yup.string().email("*Invalid email Id").required("*Required"),
  firstName: Yup.string().required("*Required"),
  lastName: Yup.string().required("*Required"),
  password: Yup.string()
    .required("*Required")
    .min(8, "password is too short")
    .matches(
      /^(?=.*[!@#$%^&*])/,
      "password must contain atleast one speacial character"
    )
    .matches(/^(?=.*[a-z])/, "password must contain one lowercase letter")
    .matches(
      /^(?=.*[A-Z])/,
      "password must contain atleast one UpperCase letter"
    )
    .matches(/^(?=.*[0-9])/, "password must contain atleast one digit"),
  confirmPassword: Yup.string()
    .required("*Requried")
    .oneOf([Yup.ref("password"), null], "password must match"),
  dob: Yup.date().required("*Required").nullable(),
  mobile: Yup.string()
    .required("*Required")
    .matches(/^(\+\d{2})?(\d{10})/, "enter valid number"),
  state: Yup.string().required("*Required"),
  district: Yup.string().required("*Required"),
  constituency: Yup.string().required("*Required"),
  mandal: Yup.string().required("*Required"),
  village: Yup.string().required("*Required"),
});

const genderOptions = [
  {
    key: "Male",
    value: "M",
  },
  {
    key: "Female",
    value: "F",
  },
  {
    key: "Others",
    value: "O",
  },
];

const stateOptions = ["Telangana", "Andhra Pradesh"];
const districtOptions = {
  Telangana: ["Khammam", "Adilabad"],
  "Andhra Pradesh": ["Kurnool", "Nellore"],
};
const constituencyOptions = {
  Khammam: ["Khammam", "Pallair"],
  Adilabad: ["Sirpur", "Asifabad"],
  Kurnool: ["Yemmiganur", "Pattikonda"],
  Nellore: ["Atmakur Division", "Naidupeta Division"],
};

const mandalOptions = {
  Pallair: ["Tirumalayapalem", "Kusumanchi"],
  Khammam: ["Khammam"],
  Sirpur: ["Dahegaon", "Khanapur"],
  Asifabad: ["Kerameri", "Wankdi"],
  Yemmiganur: ["Yemmiganur", "Gonegandla"],
  Pattikonda: ["Veldurthy", "Maddikera"],
  "Atmakur Division": ["Kaluvoya"],
  "Naidupeta Division": ["Pellakur"],
};

const villageOptions = {
  Kaluvoya: ["Kaluvoya"],
  Pellakur: ["Pellakur"],
  Yemmiganur: ["Yemmiganur"],
  Gonegandla: ["Gonegandla"],
  Veldurthy: ["Veldurthy"],
  Maddikera: ["Maddikera"],
  Kerameri: ["Ananthapur", "Devapur", "Goyagaon", "Karanjiwada", "Kerameri"],
  Wankdi: ["Wankdi"],
  Khanapur: ["Advisarangapur", "Badankurthy", "Bavapur", "Beernandi"],
  Dahegaon: ["Gorregutta", "Borlakunta", "Kothmir"],
  Khammam: ["Khammam"],
  Tirumalayapalem: ["Bachodu", "Bachodu Thanda", "Erragadd", "Gol Thanda"],
  Kusumanchi: ["Kusumanchi"],
};

class ViewProfile extends Component {
  state = {
    activeState: stateOptions,
    activeDistrict: [],
    activeConstituency: [],
    activeMandal: [],
    activeVillage: [],
    isFormEditable: false,
    errorMessage: "",
    isSubmitting: false,
    isDeleteActive: false,
    isDeleted: false,
  };

  validationSchema = Yup.object({
    voterId: Yup.string()
      .matches(/^V[0-9]{5}$/, "enter valid voter Id")
      .required("*Required"),
    email: Yup.string().email("*Invalid email Id").required("*Required"),
    firstName: Yup.string().required("*Required"),
    lastName: Yup.string().required("*Required"),
    dob: Yup.date().required("*Required").nullable(),
    mobile: Yup.string()
      .required("*Required")
      .matches(/^(\+\d{2})?(\d){10}$/, "enter valid number"),
    state: Yup.string().required("*Required"),
    district: Yup.string().required("*Required"),
    constituency: Yup.string().required("*Required"),
    mandal: Yup.string().required("*Required"),
    village: Yup.string().required("*Required"),
  });

  capitalize = (z) => {
    return z
      .split(" ")
      .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
      .join(" ");
  };

  returnInitialValues = () => {
    const { details } = this.props;
    const modifiedInitialValues = {
      ...details,
      lastName: details.lastName,
      state: this.capitalize(details.state),
      district: this.capitalize(details.district),
      constituency: this.capitalize(details.constituency),
      mandal: this.capitalize(details.mandal),
      village: this.capitalize(details.village),
      dob: new Date(details.dob),
    };
    return modifiedInitialValues;
  };

  intializeAddress = () => {
    const { state, district, constituency, mandal } = this.initialValues;
    this.setState({
      activeDistrict: districtOptions[state],
      activeConstituency: constituencyOptions[district],
      activeMandal: mandalOptions[constituency],
      activeVillage: villageOptions[mandal],
    });
  };

  componentDidMount() {
    this.intializeAddress();
  }

  initialValues = this.returnInitialValues();

  setAddress = (event) => {
    const name = event.target.name;
    if (name === "village") {
      return;
    }
    let key;
    let division;
    if (name === "state") {
      key = "activeDistrict";
      division = districtOptions;
    } else if (name === "district") {
      key = "activeConstituency";
      division = constituencyOptions;
    } else if (name === "constituency") {
      key = "activeMandal";
      division = mandalOptions;
    } else if (name === "mandal") {
      key = "activeVillage";
      division = villageOptions;
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        [key]: division[event.target.value],
      };
    });
  };

  deleteVoter = async (item) => {
    this.setState({ isSubmitting: true });
    const { fetchVoterDetails, details, close } = this.props;
    const { voterId } = details;
    const url = " https://ovs-backend.herokuapp.com/ec/voters";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify({ voterId: voterId }),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isDeleted: true, isSubmitting: false });
      setTimeout(() => {
        this.setState({ isDeleted: false, isDeleteActive: false });
        fetchVoterDetails();
        close();
      }, 2000);
    } else {
      const { message } = await response.json();
      this.setState({
        errorMessage: message,
        isSubmitting: false,
        isDeleteActive: false,
      });
    }
  };

  updateDetails = async (values) => {
    this.setState({ isSubmitting: true });
    const modifiedValues = {
      ...values,
      mobile:
        values.mobile.slice(0, 3) === "+91"
          ? values.mobile
          : "+91" + values.mobile,
    };
    const { close, fetchVoterDetails } = this.props;
    const url = "https://ovs-backend.herokuapp.com/ec/voters";
    const token = AuthenticateEc.getToken();
    const options = {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(modifiedValues),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      close();
      fetchVoterDetails();
    } else {
      const { message } = await response.json();
      this.setState({
        errorMessage: message,
        isSubmitting: false,
      });
    }
  };

  onSubmit = (values) => {
    console.log("submit");
    if (values === this.initialValues) {
      this.setState({
        errorMessage: "*Please Make Changes Details to Update",
      });
      return;
    }
    this.updateDetails(values);
  };

  renderVoterDeleteConfirmation = (item, close) => {
    const { details } = this.props;
    const { voterId, firstName, lastName } = details;
    return (
      <div className="delete-confirmation-container">
        <h1>Voter Details</h1>
        <ul className="popup-details">
          <div className="popup-details-left">
            <p>Voter ID</p>
            <p>First Name</p>
            <p>Last Name</p>
          </div>
          <div className="popup-details-center">
            <p>:</p>
            <p>:</p>
            <p>:</p>
          </div>
          <div className="popup-details-right">
            <p>{this.capitalize(voterId)}</p>
            <p>{this.capitalize(firstName)}</p>
            <p>{this.capitalize(lastName)}</p>
          </div>
        </ul>
        <p className="message">*Are you sure you want to delete voter</p>
        <div className="confirm-buttons-container">
          <button
            className="delete"
            onClick={() => {
              this.deleteVoter(item);
            }}
          >
            Delete
          </button>
          <button
            className="cancel"
            onClick={() => {
              this.setState({ isDeleteActive: false });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  };

  renderDeleteConfirmed = () => {
    return (
      <div className="confirmed-image-container">
        <img
          src="confirmed.gif"
          alt="confirmed"
          className="confirmed-image"
        ></img>
        <p>Voter is Successfully Deleted</p>
      </div>
    );
  };

  renderForm = () => {
    const {
      activeState,
      activeDistrict,
      activeConstituency,
      activeMandal,
      activeVillage,
      isFormEditable,
      errorMessage,
    } = this.state;

    const formEditClass = isFormEditable ? "" : "no-edit-form";
    const { close } = this.props;
    return (
      <div className="voter-view-bg">
        <Formik
          initialValues={this.initialValues}
          validationSchema={validationSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            return (
              <div className="voter-register-content">
                <div className="voter-view-header">
                  <h1 className="voter-register-main-heading">
                    {`${this.initialValues.voterId}'s Details`}
                  </h1>
                  <i
                    className="fas fa-times hide-popup-icon"
                    onClick={close}
                  ></i>
                </div>
                <hr />
                <span className="voter-register-line"></span>
                <Form>
                  <div
                    className={`voter-register-form ${formEditClass}`}
                    id="updateForm"
                  >
                    <input type="radio" className="dummy-input" />
                    <FormikControl
                      control="input"
                      type="text"
                      name="voterId"
                      icon="address-card"
                      placeholder="voterId"
                      formik={formik}
                    />

                    <FormikControl
                      control="input"
                      type="text"
                      name="email"
                      icon="envelope"
                      placeholder="email"
                      formik={formik}
                    />

                    <FormikControl
                      control="input"
                      type="text"
                      name="firstName"
                      placeholder="First Name"
                      icon="user"
                      formik={formik}
                    />

                    <FormikControl
                      control="input"
                      type="text"
                      name="lastName"
                      placeholder="Last Name"
                      icon="user"
                      formik={formik}
                    />

                    <FormikControl
                      control="date"
                      name="dob"
                      icon="calendar-alt"
                      formik={formik}
                    />
                    <FormikControl
                      control="radio"
                      name="gender"
                      options={genderOptions}
                      icon="venus-mars"
                      formik={formik}
                    />
                    <FormikControl
                      control="input"
                      name="mobile"
                      placeholder="Phone Number"
                      type="text"
                      icon="mobile-alt"
                      formik={formik}
                    />
                    <div className="address-input-container">
                      <p>
                        <span>
                          <i className={`fas fa-map-marker-alt icon`}></i>
                        </span>
                        Pick you address :
                      </p>
                      <div className="nested-dropdown-container">
                        <FormikControl
                          control="dropdown"
                          name="state"
                          options={activeState}
                          placeholder="State"
                          formik={formik}
                          onChange={this.setAddress}
                        />
                        <FormikControl
                          control="dropdown"
                          name="district"
                          options={activeDistrict}
                          placeholder="District"
                          formik={formik}
                          onChange={this.setAddress}
                        />
                        <FormikControl
                          control="dropdown"
                          name="constituency"
                          options={activeConstituency}
                          placeholder="Constituency"
                          formik={formik}
                          onChange={this.setAddress}
                        />
                        <FormikControl
                          control="dropdown"
                          name="mandal"
                          options={activeMandal}
                          placeholder="Mandal"
                          formik={formik}
                          onChange={this.setAddress}
                        />
                        <FormikControl
                          control="dropdown"
                          name="village"
                          options={activeVillage}
                          placeholder="Village"
                          formik={formik}
                          onChange={this.setAddress}
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="voter-view-form-footer"
                    id="voter-view-footer"
                  >
                    <button
                      className="voter-edit-button"
                      type="button"
                      onClick={() => {
                        this.setState((prevState) => ({
                          isFormEditable: !prevState.isFormEditable,
                        }));
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="voter-save-button"
                      type="submit"
                      disabled={!isFormEditable}
                    >
                      Update
                    </button>
                    <button
                      className="voter-reset-button"
                      type="button"
                      onClick={() => {
                        formik.resetForm();
                        this.intializeAddress();
                      }}
                    >
                      Reset
                    </button>
                    <button
                      className="voter-delete-button"
                      onClick={() => {
                        this.setState({ isDeleteActive: true });
                      }}
                    >
                      Delete
                    </button>
                  </div>
                  <p className="voter-view-error-message">{errorMessage}</p>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    );
  };

  renderLoader = () => {
    return (
      <div className="view-loader-container">
        <Loader
          className="loader"
          type="TailSpin"
          width={35}
          height={35}
          color="red"
        />
      </div>
    );
  };

  render() {
    const { isSubmitting, isDeleteActive, isDeleted } = this.state;
    return isSubmitting
      ? this.renderLoader()
      : isDeleteActive
      ? isDeleted
        ? this.renderDeleteConfirmed()
        : this.renderVoterDeleteConfirmation()
      : this.renderForm();
  }
}

export default ViewProfile;
