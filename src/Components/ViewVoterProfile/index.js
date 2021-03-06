import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import ErrorMessagePopup from "../ErrorMessagePopup";
import AuthenticateVoter from "../AuthenticateVoter";
import VoterCommon from "../VoterCommon";
import "./index.css";

const validationSchema = Yup.object({
  voterId: Yup.string().required("*Required"),
  email: Yup.string().email("*Invalid email Id").required("*Required"),
  firstName: Yup.string().required("*Required"),
  lastName: Yup.string().required("*Required"),
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
  Telangana: ["Khammam", "Adilabad", "Suryapet"],
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

class ViewVoterProfile extends Component {
  state = {
    activeState: stateOptions,
    activeDistrict: [],
    activeConstituency: [],
    activeMandal: [],
    activeVillage: [],
    isFormEditable: false,
    errorMessage: "",
    isUpdatingDetails: false,
    isPopupOpen: false,
  };

  capitalize = (z) => {
    return z
      .split(" ")
      .map((item) => item.slice(0, 1).toUpperCase() + item.slice(1))
      .join(" ");
  };

  setOpen = () => {
    this.setState({ isPopupOpen: false });
  };

  returnInitialValues = () => {
    const details = JSON.parse(localStorage.getItem("voterDetails"));
    const modifiedInitialValues = {
      ...details,
      firstName: this.capitalize(details.firstName),
      lastName: this.capitalize(details.lastName),
      confirmPassword: details.password,
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

  updateDetails = async (values) => {
    const { history } = this.props;
    const modifiedValues = {
      ...values,
      mobile:
        values.mobile.slice(0, 3) === "+91"
          ? values.mobile
          : "+91" + values.mobile,
    };
    this.setState({ isUpdatingDetails: true });
    const url = "https://ovs-backend.herokuapp.com/voters";
    const token = AuthenticateVoter.getToken();
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
      const { updatedVoter } = await response.json();
      localStorage.setItem("voterDetails", JSON.stringify(updatedVoter));
      history.push("/voter-dashboard");
    } else {
      const { message } = await response.json();
      this.setState({ errorMessage: message, isPopupOpen: true });
    }
    this.setState({ isUpdatingDetails: false });
  };

  onSubmit = (values) => {
    if (values === this.initialValues) {
      this.setState({
        errorMessage: "Please Make Changes in Details to Update",
        isPopupOpen: true,
      });
      return;
    }
    this.updateDetails(values);
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
      isPopupOpen,
      isUpdatingDetails,
    } = this.state;

    const formEditClass = isFormEditable ? "" : "no-edit-form";

    return (
      <div className="voter-view-bg">
        {isUpdatingDetails ? (
          this.renderLoader()
        ) : (
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
                        formik={formik}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        name="email"
                        icon="envelope"
                        formik={formik}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        name="firstName"
                        icon="user"
                        formik={formik}
                      />

                      <FormikControl
                        control="input"
                        type="text"
                        name="lastName"
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
                        type="text"
                        icon="mobile-alt"
                        formik={formik}
                      />
                      <div className="address-input-container">
                        <p className="address-placeholder">
                          <span>
                            <i className={`fas fa-map-marker-alt icon`}></i>
                          </span>
                          Your Address :
                        </p>
                        <div className="nested-dropdown-container">
                          <FormikControl
                            control="dropdown"
                            name="state"
                            options={activeState}
                            placeholder="State"
                            formik={formik}
                            setaddress={this.setAddress}
                          />
                          <FormikControl
                            control="dropdown"
                            name="district"
                            options={activeDistrict}
                            placeholder="District"
                            formik={formik}
                            setaddress={this.setAddress}
                          />
                          <FormikControl
                            control="dropdown"
                            name="constituency"
                            options={activeConstituency}
                            placeholder="Constituency"
                            formik={formik}
                            setaddress={this.setAddress}
                          />
                          <FormikControl
                            control="dropdown"
                            name="mandal"
                            options={activeMandal}
                            placeholder="Mandal"
                            formik={formik}
                            setaddress={this.setAddress}
                          />
                          <FormikControl
                            control="dropdown"
                            name="village"
                            options={activeVillage}
                            placeholder="Village"
                            formik={formik}
                            setaddress={this.setAddress}
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
                      <button className="voter-save-button" type="submit">
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
                    </div>
                    <ErrorMessagePopup
                      errorMessage={errorMessage}
                      setOpen={this.setOpen}
                      isPopupOpen={isPopupOpen}
                    />
                  </Form>
                </div>
              );
            }}
          </Formik>
        )}
      </div>
    );
  };

  renderLoader = () => {
    return (
      <Loader
        className="voter-update-loader"
        type="TailSpin"
        width={35}
        height={35}
        color="blue"
      />
    );
  };

  render() {
    return (
      <div className="voter-view-outer-bg">
        <VoterCommon />
        {this.renderForm()}
      </div>
    );
  }
}

export default ViewVoterProfile;
