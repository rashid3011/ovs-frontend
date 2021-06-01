import { Component, React } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import AuthencticateEc from "../AuthenticateEc";
import ErrorMessagePopup from "../ErrorMessagePopup";
import "./index.css";

class ECLoginPage extends Component {
  state = {
    isSubmittingForm: false,
    isPopupOpen: false,
    errorMessage: "",
  };

  setPopup = () => {
    this.setState({ isPopupOpen: false });
  };

  initialValues = {
    ecId: "",
    ecPassword: "",
  };

  validationSchema = Yup.object({
    ecId: Yup.string()
      .matches(/^EC[0-9]{5}$/, "EC ID should be like EC#####")
      .required("*required"),
    ecPassword: Yup.string().required("*required"),
  });

  loginSuccess = (data) => {
    const { history } = this.props;
    AuthencticateEc.login(data, history);
  };

  loginFailed = (data) => {
    const { message } = data;
    this.setState({
      isSubmittingForm: false,
      isPopupOpen: true,
      errorMessage: message,
    });
  };

  onSubmit = async (values, onSubmitProps) => {
    this.setState({ isSubmittingForm: true });

    const { ecId, ecPassword } = values;
    const modifiedData = {
      ecId: ecId,
      password: ecPassword,
    };

    const url = "https://ovs-backend.herokuapp.com/EC/login";
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(modifiedData),
    };

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok === true) {
      this.loginSuccess(data);
    } else {
      this.loginFailed(data);
    }
  };

  renderButton = (formik) => {
    const { isSubmittingForm } = this.state;
    return isSubmittingForm ? (
      <button className="ec-login-button-loader">
        <Loader type="TailSpin" height={30} width={30} color="blue" />
      </button>
    ) : (
      <button
        className="ec-login-button"
        type="submit"
        disabled={!formik.isValid || formik.isSubmitting}
      >
        Login
      </button>
    );
  };

  renderBackToHome = () => {
    return (
      <div
        className="back-to-home"
        onClick={() => {
          this.props.history.push("/");
        }}
      >
        <i className="fas fa-long-arrow-alt-left back-arrow"></i>
        <i className="fas fa-home home-icon"></i>
      </div>
    );
  };

  renderForm = () => {
    const loginColor = "#2aeb51";
    const { isPopupOpen, errorMessage } = this.state;
    return (
      <>
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            return (
              <Form className="ec-login-content">
                <h1>EC Login</h1>
                <FormikControl
                  control="input"
                  type="text"
                  name="ecId"
                  placeholder="EC ID"
                  icon="user"
                  formik={formik}
                />

                <FormikControl
                  control="input"
                  type="password"
                  name="ecPassword"
                  placeholder="Password"
                  icon="lock"
                  formik={formik}
                />
                {this.renderButton(formik)}
                <ErrorMessagePopup
                  errorMessage={errorMessage}
                  isPopupOpen={isPopupOpen}
                  setOpen={this.setPopup}
                />
              </Form>
            );
          }}
        </Formik>
        <div className="ec-login-login-image-container">
          <svg
            id="ec-login-image"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            width="765.83927"
            height="536.7767"
            viewBox="0 0 765.83927 536.7767"
          >
            <path
              d="M975.74765,531.16211H445.25318a7.18,7.18,0,0,1-7.172-7.172V195.42H982.91963V523.99013A7.18,7.18,0,0,1,975.74765,531.16211Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#e6e6e6"
            />
            <path
              d="M960.19238,510.62891H460.80859a7.258,7.258,0,0,1-7.25-7.25V232.78955a7.25835,7.25835,0,0,1,7.25-7.25H960.19238a7.258,7.258,0,0,1,7.25,7.25V503.37891A7.25772,7.25772,0,0,1,960.19238,510.62891Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#fff"
            />
            <path
              d="M982.68727,205.56618H437.849V188.78363a7.18,7.18,0,0,1,7.172-7.172H975.51529a7.18,7.18,0,0,1,7.172,7.172Z"
              transform="translate(-217.08037 -181.61165)"
              fill={loginColor}
            />
            <circle cx="238.36468" cy="12.23725" r="4.28342" fill="#fff" />
            <circle cx="254.62349" cy="12.23725" r="4.28342" fill="#fff" />
            <circle cx="270.88229" cy="12.23725" r="4.28342" fill="#fff" />
            <rect
              x="287.80315"
              y="92.44901"
              width="51.46951"
              height="22.78159"
              fill="#e6e6e6"
            />
            <rect
              x="390.74217"
              y="139.69972"
              width="51.46951"
              height="22.78159"
              fill="#e6e6e6"
            />
            <rect
              x="287.80315"
              y="210.57577"
              width="51.46951"
              height="22.7816"
              fill={loginColor}
            />
            <rect
              x="390.74217"
              y="257.82646"
              width="51.46951"
              height="22.78159"
              fill={loginColor}
            />
            <rect
              x="647.24598"
              y="281.45181"
              width="51.46951"
              height="22.78159"
              fill={loginColor}
            />
            <rect
              x="595.77647"
              y="186.95042"
              width="51.46951"
              height="22.78159"
              fill="#e6e6e6"
            />
            <rect
              x="442.21169"
              y="186.95042"
              width="102.93903"
              height="22.78159"
              fill={loginColor}
            />
            <rect
              x="442.21169"
              y="67.9799"
              width="102.93903"
              height="22.78159"
              fill={loginColor}
            />
            <path
              d="M453.414,225.12244V511.15792H968.10918V225.12242Zm513.00764,23.6958H916.80858V226.81h49.61307ZM660.30477,414.6876V392.67974H761.21839V414.6876Zm100.91367,1.68753V438.3834H660.30472V416.37513Zm0-94.78239v22.00787H660.30472V321.59274Zm-100.91367-1.68752V297.89694H761.21839v22.00828Zm0,47.39119V345.28813H761.21839v22.00828Zm100.91367,1.68752v22.00828H660.30472V368.98393ZM658.61725,343.60061H609.00418V321.59274h49.61307Zm0,1.68752v22.00828H609.00418V345.28813Zm0,23.6958v22.00828H609.00418V368.98393Zm0,23.69581V414.6876H609.00418V392.67974Zm104.28872,0H812.519V414.6876H762.906Zm0-1.68753V368.98393H812.519v22.00828Zm0-23.6958V345.28813H812.519v22.00828Zm0-23.6958V321.59274H812.519v22.00787Zm0-23.69539V297.89694H812.519v22.00828Zm0-23.6958V274.20114H812.519v22.00828Zm-1.68753,0H660.30472V274.20114H761.21839Zm-102.60119,0H609.00418V274.20114h49.61307Zm0,1.68752v22.00828H609.00418V297.89694Zm-51.3006,22.00828H557.7027V297.89694h49.6139Zm0,1.68752v22.00787H557.7027V321.59274Zm0,23.69539v22.00828H557.7027V345.28813Zm0,23.6958v22.00828H557.7027V368.98393Zm0,23.69581V414.6876H557.7027V392.67974Zm0,23.69539V438.3834H557.7027V416.37513Zm1.68753,0h49.61307V438.3834H609.00418Zm49.61307,23.6958v22.00786H609.00418V440.07093Zm1.68752,0H761.21839v22.00786H660.30472Zm102.6012,0H812.519v22.00786H762.906Zm0-1.68753V416.37513H812.519V438.3834Zm51.30059-22.00827h49.6139V438.3834h-49.614Zm0-1.68753V392.67974h49.6139V414.6876Zm0-23.69539V368.98393h49.6139v22.00828Zm0-23.6958V345.28813h49.6139v22.00828Zm0-23.6958V321.59274h49.6139v22.00787Zm0-23.69539V297.89694h49.6139v22.00828Zm0-23.6958V274.20114h49.6139v22.00828Zm0-23.6958V250.50575h49.6139v22.00787Zm-1.68752,0H762.906V250.50575H812.519Zm-51.3006,0H660.30472V250.50575H761.21839Zm-102.60119,0H609.00418V250.50575h49.61307Zm-51.3006,0H557.7027V250.50575h49.6139Zm0,1.68752v22.00828H557.7027V274.20114Zm-51.30142,22.00828H506.40216V274.20114h49.61307Zm0,1.68752v22.00828H506.40216V297.89694Zm0,23.6958v22.00787H506.40216V321.59274Zm0,23.69539v22.00828H506.40216V345.28813Zm0,23.6958v22.00828H506.40216V368.98393Zm0,23.69581V414.6876H506.40216V392.67974Zm0,23.69539V438.3834H506.40216V416.37513Zm0,23.6958v22.00786H506.40216V440.07093Zm1.68752,0h49.6139v22.00786H557.7027Zm49.6139,23.69539V485.775H557.7027V463.76632Zm1.68753,0h49.61307V485.775H609.00418Zm51.30059,0H761.21839V485.775H660.30472Zm102.6012,0H812.519V485.775H762.906Zm51.30059,0h49.6139V485.775h-49.614Zm0-1.68753V440.07093h49.6139v22.00786ZM865.508,440.07093h49.61308v22.00786H865.508Zm0-1.68753V416.37513h49.61308V438.3834Zm0-23.6958V392.67974h49.61308V414.6876Zm0-23.69539V368.98393h49.61308v22.00828Zm0-23.6958V345.28813h49.61308v22.00828Zm0-23.6958V321.59274h49.61308v22.00787Zm0-23.69539V297.89694h49.61308v22.00828Zm0-23.6958V274.20114h49.61308v22.00828Zm0-23.6958V250.50575h49.61308v22.00787Zm0-23.69539V226.81h49.61308v22.00828Zm-1.68752,0h-49.614V226.81h49.6139Zm-51.30142,0H762.906V226.81H812.519Zm-51.3006,0H660.30472V226.81H761.21839Zm-102.60119,0H609.00418V226.81h49.61307Zm-51.3006,0H557.7027V226.81h49.6139Zm-51.30142,0H506.40216V226.81h49.61307Zm0,1.68752v22.00787H506.40216V250.50575Zm-51.3006,22.00787H455.10156V250.50575h49.61307Zm0,1.68752v22.00828H455.10156V274.20114Zm0,23.6958v22.00828H455.10156V297.89694Zm0,23.6958v22.00787H455.10156V321.59274Zm0,23.69539v22.00828H455.10156V345.28813Zm0,23.6958v22.00828H455.10156V368.98393Zm0,23.69581V414.6876H455.10156V392.67974Zm0,23.69539V438.3834H455.10156V416.37513Zm0,23.6958v22.00786H455.10156V440.07093Zm0,23.69539V485.775H455.10156V463.76632Zm1.68753,0h49.61307V485.775H506.40216Zm49.61307,23.69621V509.4704H506.40216V487.46253Zm1.68752,0h49.6139V509.4704H557.7027Zm51.30143,0h49.61307V509.4704H609.00418Zm51.30059,0H761.21839V509.4704H660.30472Zm102.6012,0H812.519V509.4704H762.906Zm51.30059,0h49.6139V509.4704h-49.614Zm51.30142,0h49.61308V509.4704H865.508Zm0-1.68752V463.76632h49.61308V485.775Zm51.3006-22.00869h49.61307V485.775H916.80858Zm0-1.68753V440.07093h49.61307v22.00786Zm0-23.69539V416.37513h49.61307V438.3834Zm0-23.6958V392.67974h49.61307V414.6876Zm0-23.69539V368.98393h49.61307v22.00828Zm0-23.6958V345.28813h49.61307v22.00828Zm0-23.6958V321.59274h49.61307v22.00787Zm0-23.69539V297.89694h49.61307v22.00828Zm0-23.6958V274.20114h49.61307v22.00828Zm0-23.6958V250.50575h49.61307v22.00787ZM504.71463,226.81v22.00828H455.10156V226.81ZM455.10156,487.46253h49.61307V509.4704H455.10156Zm461.707,22.00787V487.46253h49.61307V509.4704Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#e6e6e6"
            />
            <path
              d="M313.30622,380.10373s-26.03815-6-40.35914,5,18.22671,36,18.22671,36Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#2f2e41"
            />
            <path
              d="M340.23334,523.58686a10.05578,10.05578,0,0,1,7.53982-13.45016l5.26214-35.34529,13.828,12.3944-7.117,31.66428a10.11028,10.11028,0,0,1-19.51294,4.73677Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#ffb8b8"
            />
            <polygon
              points="68.648 525.464 80.881 524.652 83.571 477.082 65.517 478.28 68.648 525.464"
              fill="#ffb8b8"
            />
            <path
              d="M283.32582,702.4627h38.53072a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H298.21268a14.88686,14.88686,0,0,1-14.88686-14.88686v0A0,0,0,0,1,283.32582,702.4627Z"
              transform="translate(388.102 1238.20061) rotate(180)"
              fill="#2f2e41"
            />
            <polygon
              points="89.789 508.53 101.29 512.775 123.139 470.433 106.164 464.168 89.789 508.53"
              fill="#ffb8b8"
            />
            <path
              d="M301.84846,692.15621h38.53072a0,0,0,0,1,0,0v14.88687a0,0,0,0,1,0,0H316.73532a14.88686,14.88686,0,0,1-14.88686-14.88686v0A0,0,0,0,1,301.84846,692.15621Z"
              transform="translate(163.01524 1285.50014) rotate(-159.73947)"
              fill="#2f2e41"
            />
            <path
              d="M340.3112,507.39106s12.3886,6.67078,8.57672,33.35393L345.076,641.75975l-21.05939,46.04944-18.10642-4.76485,11.5297-37.47271-15.24751-65.75489-2,119.42808L283.039,702.10373,258.35582,503.57918l31.448-14.29454Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#2f2e41"
            />
            <circle cx="78.95026" cy="162.59444" r="24.56103" fill="#ffb8b8" />
            <path
              d="M310.29266,375.40479l-12.3886,20.01236-18.10642-18.10642-33.84971,23.69479a6.40259,6.40259,0,0,0-2.27327,7.64346c5.20684,12.87513,18.54057,50.93294,14.68116,94.9302,0,0,25.73018-6.67079,52.41332.953s33.35393,4.76485,33.35393,4.76485-6.67078-48.60145-2.8589-59.08411c3.1619-8.69524,9.60226-37.71688,11.70665-47.36117a4.34654,4.34654,0,0,0-2.12719-4.72057Z"
              transform="translate(-217.08037 -181.61165)"
              fill={loginColor}
            />
            <path
              d="M349.86194,398.24706l0,0a4.35486,4.35486,0,0,1,4.81278,3.14888l16.13149,58.25259-3.81188,35.25987-18.10642-2.8589,1.90594-24.77721-13.34157-31.448,8.80712-34.34778A4.35486,4.35486,0,0,1,349.86194,398.24706Z"
              transform="translate(-217.08037 -181.61165)"
              fill={loginColor}
            />
            <path
              d="M277.03832,309.7283a17.506,17.506,0,0,1,16.14123-8.58806,34.30591,34.30591,0,0,1,9.7548,2.73058l16.05606,6.26317c4.15471,1.62067,8.705,3.60587,10.50786,7.68482,1.67331,3.78583.42489,8.15807-.83887,12.09956L322.65222,348.654a57.03087,57.03087,0,0,0-3.40415-12.37628c-1.74494-3.9173-4.50473-7.52937-8.3203-9.48677-4.17057-2.13951-9.08622-2.09521-13.76814-1.86989-6.63082.31911-13.8404,1.16273-18.55166,5.83967a19.26957,19.26957,0,0,0-4.88945,9.54931,57.47859,57.47859,0,0,0-1.02534,10.8092,89.61293,89.61293,0,0,1-6.84346-14.67147,36.3,36.3,0,0,1-2.54269-11.876,16.70268,16.70268,0,0,1,3.82833-11.29616c2.71259-3.03167,7.13245-4.66839,11.01942-3.46817"
              transform="translate(-217.08037 -181.61165)"
              fill="#2f2e41"
            />
            <path
              d="M263.3791,537.58686a10.05578,10.05578,0,0,0-7.53982-13.45016l-5.26214-35.34529-13.828,12.3944,7.117,31.66428a10.11028,10.11028,0,0,0,19.51294,4.73677Z"
              transform="translate(-217.08037 -181.61165)"
              fill="#ffb8b8"
            />
            <path
              d="M246.29533,400.66856h0a6.4131,6.4131,0,0,0-5.35079,6.00558l-5.46,109.19958h20.01235l6.67079-58.13113-8.48945-51.78568A6.41309,6.41309,0,0,0,246.29533,400.66856Z"
              transform="translate(-217.08037 -181.61165)"
              fill={loginColor}
            />
            <polygon
              points="171.738 536.777 0 536.777 0 534.671 172.12 534.671 171.738 536.777"
              fill="#ccc"
            />
          </svg>
        </div>
      </>
    );
  };

  render() {
    const { isSubmittingForm } = this.state;
    const bgClass = isSubmittingForm ? "loading-bg" : "";
    return (
      <div className={`ec-login-bg ${bgClass}`}>
        {this.renderBackToHome()}
        {this.renderForm()}
      </div>
    );
  }
}

export default ECLoginPage;
