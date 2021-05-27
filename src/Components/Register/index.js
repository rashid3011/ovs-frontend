import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import { Link } from "react-router-dom";
import "./index.css";
import Loader from "react-loader-spinner";

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
const districts = {
  Telangana: ["Khammam", "Adilabad"],
  "Andhra Pradesh": ["Kurnool", "Nellore"],
  State: [""],
};
const constituency = {
  Khammam: ["Khammam", "Pallair"],
  Adilabad: ["Sirpur", "Asifabad"],
  Kurnool: ["Yemmiganur", "Pattikonda"],
  Nellore: ["Atmakur Division", "Naidupeta Division"],
  District: [],
};

const mandal = {
  Pallair: ["Tirumalayapalem", "Kusumanchi"],
  Khammam: ["Khammam"],
  Sirpur: ["Dahegaon", "Khanapur"],
  Asifabad: ["Kerameri", "Wankdi"],
  Yemmiganur: ["Yemmiganur", "Gonegandla"],
  Pattikonda: ["Veldurthy", "Maddikera"],
  "Atmakur Division": ["Kaluvoya"],
  "Naidupeta Division": ["Pellakur"],
  Constituency: [],
};

const village = {
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
  Mandal: [],
};

class Register extends Component {
  state = {
    activeState: stateOptions,
    activeDistrict: [],
    activeConstituency: [],
    activeMandal: [],
    activeVillage: [],
    isSubmittingForm: false,
    isRegisterFailed: false,
  };

  initialValues = {
    voterId: "",
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    dob: null,
    gender: "M",
    mobile: "",
    state: "",
    district: "",
    constituency: "",
    mandal: "",
    village: "",
  };

  validationSchema = Yup.object({
    voterId: Yup.string()
      .matches(/^V[0-9]{5}$/, "enter valid voter Id")
      .required("*Required"),
    email: Yup.string().email("*Invalid email Id").required("*Required"),
    firstName: Yup.string().required("*Required"),
    lastName: Yup.string().required("*Required"),
    password: Yup.string()
      .required("*Required")
      .min(8, "password is too short")
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
      .matches(/^(\+\d{2})?(\d){10}$/, "enter valid number"),
    state: Yup.string().required("*Required"),
    district: Yup.string().required("*Required"),
    constituency: Yup.string().required("*Required"),
    mandal: Yup.string().required("*Required"),
    village: Yup.string().required("*Required"),
  });

  registerSuccess = () => {
    const { history } = this.props;
    history.replace("/voter-login");
  };

  registerFailed = () => {
    this.setState({ isRegisterFailed: true });
  };

  onSubmit = async (data, onSubmitProps) => {
    this.setState((prevState) => ({
      isSubmittingForm: !prevState.isSubmittingForm,
      isRegisterFailed: false,
    }));
    const modifiedData = {
      ...data,
      mobile:
        data.mobile.slice(0, 3) === "+91" ? data.mobile : "+91" + data.mobile,
    };
    const url = "https://ovs-backend.herokuapp.com/register";
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(modifiedData),
    };
    const response = await fetch(url, options);
    if (response.ok === true) {
      this.registerSuccess();
    } else {
      this.registerFailed();
    }
  };

  setAddress = (event) => {
    const name = event.target.name;
    if (name === "village") {
      return;
    }
    let key;
    let division;
    if (name === "state") {
      key = "activeDistrict";
      division = districts;
    } else if (name === "district") {
      key = "activeConstituency";
      division = constituency;
    } else if (name === "constituency") {
      key = "activeMandal";
      division = mandal;
    } else if (name === "mandal") {
      key = "activeVillage";
      division = village;
    }

    this.setState((prevState) => {
      return {
        ...prevState,
        [key]: division[event.target.value],
      };
    });
  };

  renderButton = (formik) => {
    const { isSubmittingForm } = this.state;
    return isSubmittingForm ? (
      <button className="voter-register-button">
        <Loader type="TailSpin" color="blue" height={30} width={120} />
      </button>
    ) : (
      <button
        type="submit"
        className="voter-register-button"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Register
      </button>
    );
  };

  render() {
    const {
      activeState,
      activeDistrict,
      activeConstituency,
      activeMandal,
      activeVillage,
      isSubmittingForm,
      isRegisterFailed,
    } = this.state;

    const bgClass = isSubmittingForm ? "submit-bg" : "";
    return (
      <div className="voter-register-outer-bg">
        <div className={`voter-register-bg ${bgClass}`}>
          <div className="voter-register-content">
            <h1 className="voter-register-main-heading">Register Here</h1>
            <hr />
            <span className="voter-register-line"></span>
          </div>
          <Formik
            initialValues={this.initialValues}
            validationSchema={this.validationSchema}
            onSubmit={this.onSubmit}
          >
            {(formik) => {
              console.log(formik.values.dob);
              return (
                <Form className="voter-register-form">
                  <FormikControl
                    control="input"
                    type="text"
                    name="voterId"
                    placeholder="VoterID"
                    icon="address-card"
                    formik={formik}
                  />

                  <FormikControl
                    control="input"
                    type="text"
                    name="email"
                    placeholder="Email ID"
                    icon="envelope"
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
                    control="input"
                    type="password"
                    name="password"
                    placeholder="new Password"
                    icon="lock"
                    formik={formik}
                  />

                  <FormikControl
                    control="input"
                    type="password"
                    name="confirmPassword"
                    placeholder="Password again"
                    icon="lock"
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
                    placeholder="Phone Number"
                    icon="mobile-alt"
                    formik={formik}
                  />
                  <div className="address-input-container">
                    <p className="address-input-container-placeholder">
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

                  <div
                    className="voter-register-form-footer"
                    id="voter-register-footer"
                  >
                    {this.renderButton(formik)}
                    {isRegisterFailed && (
                      <p className="register-failed-message">
                        *Enter your details correctly
                      </p>
                    )}
                    <p className="voter-register-already-account">
                      Already have an account?
                    </p>
                    <Link to="/voter-login">
                      <p className="voter-register-nav-link">Login Here</p>
                    </Link>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    );
  }
}

export default Register;
