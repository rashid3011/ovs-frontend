import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import { Link } from "react-router-dom";
import "./index.css";

/*
state
district
constituency
mandal
village
*/

const initialValues = {
  voterId: "",
  email: "",
  firstname: "",
  lastname: "",
  password: "",
  confirmPassword: "",
  DOB: null,
  address: "",
  gender: "male",
  phoneNumber: "",
  state: "",
  district: "",
  constituency: "",
  mandal: "",
  village: "",
};

const validationSchema = Yup.object({
  voterId: Yup.string().required("*Required"),
  email: Yup.string().email("*Invalid email Id").required("*Required"),
  firstname: Yup.string().required("*Required"),
  lastname: Yup.string().required("*Required"),
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
  DOB: Yup.date().required("*Required").nullable(),
  address: Yup.string().required("*Required"),
  phoneNumber: Yup.string()
    .required("*Required")
    .matches(/^(\+\d{2})?(\d{10})/, "enter valid number"),
  state: Yup.string().required("*Required"),
  district: Yup.string().required("*Required"),
  constituency: Yup.string().required("*Required"),
  mandal: Yup.string().required("*Required"),
  village: Yup.string().required("*Required"),
});

const onSubmit = (values, onSubmitProps) => {
  onSubmitProps.setSubmitting(false);
};

const genderOptions = [
  {
    key: "Male",
    value: "male",
  },
  {
    key: "Female",
    value: "female",
  },
  {
    key: "Others",
    value: "others",
  },
];

const stateOptions = ["Telangana", "Andhra Pradesh"];
const districts = {
  Telangana: ["Khammam", "Adilabad"],
  "Andhra Pradesh": ["Kurnool", "Nellore"],
};
const constituency = {
  Khammam: ["Khammam", "Pallair"],
  Adilabad: ["Sirpur", "Asifabad"],
  Kurnool: ["Yemmiganur", "Pattikonda"],
  Nellore: ["Atmakur Division", "Naidupeta Division"],
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
};

class ViewProfile extends Component {
  state = {
    activeState: stateOptions,
    activeDistrict: [],
    activeConstituency: [],
    activeMandal: [],
    activeVillage: [],
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

  render() {
    const {
      activeState,
      activeDistrict,
      activeConstituency,
      activeMandal,
      activeVillage,
    } = this.state;
    return (
      <div className="voter-register-bg">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => {
            return (
              <div className="voter-register-content">
                <h1 className="voter-register-main-heading">Register Here</h1>
                <hr />
                <span className="voter-register-line"></span>
                <Form className="voter-register-form" id="registerForm">
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
                    name="firstname"
                    icon="user"
                    formik={formik}
                  />

                  <FormikControl
                    control="input"
                    type="text"
                    name="lastname"
                    icon="user"
                    formik={formik}
                  />

                  <FormikControl
                    control="input"
                    type="password"
                    name="password"
                    icon="lock"
                    formik={formik}
                  />

                  <FormikControl
                    control="input"
                    type="password"
                    name="confirmPassword"
                    icon="lock"
                    formik={formik}
                  />

                  <FormikControl
                    control="date"
                    name="DOB"
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
                    name="phoneNumber"
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

                  <div
                    className="voter-register-form-footer"
                    id="voter-register-footer"
                  >
                    <button className="voter-register-button">Register</button>
                    <p className="voter-register-already-account">
                      Already have an account?
                    </p>
                    <Link to="/voter-login">
                      <p className="voter-register-nav-link">Login Here</p>
                    </Link>
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default ViewProfile;
