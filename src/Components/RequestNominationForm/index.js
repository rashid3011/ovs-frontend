import { Component } from "react";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import FormikControl from "../FormikControl";
import Loader from "react-loader-spinner";
import AuthencticateVoter from "../AuthencticateVoter";
import ErrorMessagePopup from "../ErrorMessagePopup";
import "./index.css";

class RequestNominationForm extends Component {
  state = {
    errorMessage: "",
    isSubmitting: false,
    isSubmitSuccess: false,
    isPopupOpen: false,
  };

  typeOptions = ["mla", "mp", "sarpanch", "zptc"];
  initialValues = {
    partyName: "",
    type: "mla",
  };

  validationSchema = Yup.object({
    partyName: Yup.string().required("*Required"),
    type: Yup.string().required("*Required"),
  });

  onSubmit = async (values, onSubmitProps) => {
    this.setState({ isSubmitting: true, errorMessage: "" });
    const { history } = this.props;
    const { voterId } = JSON.parse(localStorage.getItem("voterDetails"));
    const { partyName, type } = values;
    const details = {
      voterId,
      partyName,
      type,
    };
    const url = "https://ovs-backend.herokuapp.com/request-nomination";
    const token = AuthencticateVoter.getToken();
    const options = {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`,
      },

      body: JSON.stringify(details),
    };

    const response = await fetch(url, options);
    if (response.ok === true) {
      this.setState({ isSubmitSuccess: true });
      setTimeout(() => {
        history.push("/voter-dashboard");
      }, 3000);
    } else {
      const data = await response.json();
      const { message } = data;
      this.setState({
        errorMessage: message,
        isPopupOpen: true,
        isSubmitting: false,
      });
    }
  };

  renderButton = () => {
    const { isSubmitting } = this.state;
    return isSubmitting ? (
      <button className="voter-nomination-button">
        <Loader type="TailSpin" width={35} height={30} color="blue" />
      </button>
    ) : (
      <button className="voter-nomination-button" type="submit">
        Request Form
      </button>
    );
  };

  setOpen = () => {
    this.setState({ isPopupOpen: false });
  };

  renderForm = () => {
    const { isSubmitting, errorMessage, isPopupOpen } = this.state;
    const bgClass = isSubmitting ? "loading-bg" : "";
    return (
      <div className={`voter-nomination-bg ${bgClass}`}>
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.onSubmit}
        >
          {(formik) => {
            return (
              <div className="voter-nomination-content">
                <h1 className="voter-nomination-main-heading">Request Here</h1>
                <span className="voter-nomination-line"></span>
                <Form className="voter-nomination-form">
                  <FormikControl
                    control="input"
                    type="text"
                    name="partyName"
                    placeholder="Party Name"
                    icon="envelope"
                    formik={formik}
                  />

                  <div className="nomination-address-input-container">
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
                  {this.renderButton()}
                  <ErrorMessagePopup
                    isPopupOpen={isPopupOpen}
                    errorMessage={errorMessage}
                    setOpen={this.setOpen}
                  />
                </Form>
              </div>
            );
          }}
        </Formik>
        <div className="nomination-image-div">
          <svg
            id="nomination-svg"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            width="818.40551"
            height="529.1051"
            viewBox="0 0 818.40551 529.1051"
          >
            <path
              d="M1007.20276,490.067h-519.506V193.71244h519.506Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#fff"
            />
            <path
              d="M1009.20276,492.0672H485.6969v-300.355h523.50586Zm-519.50586-4h515.50586v-292.355H489.6969Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#cacaca"
            />
            <circle cx="564.64129" cy="163.33526" r="55.49268" fill="#6c63ff" />
            <path
              d="M766.07867,352.62667c-4.49676-5.15747-8.74225-13.47775-11.23047-20.18365-2.4859,6.7059-6.73132,15.02618-11.22815,20.18365l10.04743-3.635v22.41425h2.36139V348.99163Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#fff"
            />
            <polygon
              points="577.272 18.891 481.63 18.891 481.63 0 577.272 0 586.712 9.446 577.272 18.891"
              fill="#cacaca"
            />
            <polygon
              points="482.815 18.891 387.175 18.891 387.175 0 482.815 0 492.257 9.446 482.815 18.891"
              fill="#3f3d56"
            />
            <polygon
              points="389.541 18.891 293.899 18.891 293.899 0 389.541 0 398.982 9.446 389.541 18.891"
              fill="#6c63ff"
            />
            <path
              d="M207.56726,712.81812l.29532-1.32065c.06543-.29028,6.75221-29.20569,28.80362-45.3905,22.05243-16.18548,51.64209-13.89505,51.93782-13.87l1.34887.11391-.2954,1.32007c-.06544.29029-6.75235,29.20515-28.80362,45.39052-22.05243,16.18548-51.64208,13.89506-51.93782,13.87Zm30.49624-44.80706c-18.64466,13.6838-25.95315,36.81611-27.54575,42.641,6.036.22308,30.31221.17676,48.93882-13.49461,18.62447-13.66992,25.94779-36.813,27.54575-42.641C280.9628,654.29326,256.689,654.34042,238.0635,668.01106Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#f0f0f0"
            />
            <path
              d="M246.40177,674.7664c-10.67824,25.047-37.05019,37.799-37.05019,37.799s-9.059-27.85723,1.61921-52.90425,37.0502-37.799,37.0502-37.799S257.08007,649.71938,246.40177,674.7664Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#f0f0f0"
            />
            <path
              d="M520.36276,397.11465a11.81118,11.81118,0,0,0-18.032-1.68994l-24.88795-10.44408L467.40719,398.557,502.761,412.81242a11.87517,11.87517,0,0,0,17.60181-15.69777Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#ffb8b8"
            />
            <polygon
              points="281.261 512.726 296.464 512.725 297.94 458.653 281.258 454.085 281.261 512.726"
              fill="#ffb8b8"
            />
            <path
              d="M468.18014,693.2095l29.94079-.00121h.00121a19.08165,19.08165,0,0,1,19.08062,19.08031v.62l-49.02171.00181Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#2f2e41"
            />
            <polygon
              points="167.032 512.726 182.235 512.725 189.468 454.084 167.029 454.085 167.032 512.726"
              fill="#ffb8b8"
            />
            <path
              d="M353.951,693.2095l29.94078-.00121h.00121a19.08165,19.08165,0,0,1,19.08062,19.08031v.62l-49.0217.00181Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#2f2e41"
            />
            <path
              d="M449.20276,360.55255l50.23849,28.46608L490.5513,411.687s-30.95211-14.91618-32.98572-13.86205S449.20276,360.55255,449.20276,360.55255Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#575a89"
            />
            <path
              d="M392.55293,446.18892,381.1,554.99172,346.74124,680.44394l28.63232,4.58116,82.46108-174.69976-14.88884-93.914L417.74935,407.249Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#2f2e41"
            />
            <path
              d="M374.22822,445.04363s28.63562,16.82272,37.97454,49.50892c10,35,28.45244,89.07153,28.45244,89.07153l25.19642,102.54633,30.9229-8.017L460.12515,445.04363l-30.9229-26.34174L389.117,414.12073Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#2f2e41"
            />
            <circle cx="254.00773" cy="54.05886" r="26.34173" fill="#ffb8b8" />
            <path
              d="M447.14922,290.4291s-18.91473-20.80021-33.80359-20.80021c-4.7857,0-38.09568,37.11565-39.14287,63.92366L363.54284,451.91539s103.07636,5.72648,104.22164,1.14529S447.14922,290.4291,447.14922,290.4291Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#575a89"
            />
            <path
              d="M431.68241,251.02117c2.113-.12607,4.17613.588,6.27442.86658a15.88085,15.88085,0,0,0,16.97442-11.84023,9.08444,9.08444,0,0,1,.8682-2.82875c1.15537-1.88637,3.7867-2.246,5.95583-1.81225s4.22529,1.449,6.43433,1.56488a9.85241,9.85241,0,0,0,8.50308-4.81248,16.31941,16.31941,0,0,0,2.087-9.85641l-1.63511,1.71612a8.30517,8.30517,0,0,1-.74037-4.51377,5.23787,5.23787,0,0,0-4.96132,1.26951c-1.44178.15344-.35362-2.67427-1.42478-3.65148a2.478,2.478,0,0,0-1.74331-.32615c-3.06724.02957-5.54847-2.31646-7.96551-4.205a33.84838,33.84838,0,0,0-14.296-6.521,18.808,18.808,0,0,0-10.43115.50562,22.28227,22.28227,0,0,0-7.04432,4.997c-5.14244,4.94481-9.69614,10.75478-11.83549,17.56057a29.56169,29.56169,0,0,0-.1416,17.14172c.862,2.90952,3.46006,12.87382,7.26342,13.10588C428.60322,259.67306,425.7339,251.3761,431.68241,251.02117Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#2f2e41"
            />
            <polygon
              points="234.047 133.571 207.073 173.132 198.447 265.027 234.047 133.571"
              opacity="0.1"
              style={{ isolation: "isolate" }}
            />
            <path
              d="M385.69575,486.16891a11.81115,11.81115,0,0,0-2.34947-17.958l4.667-26.584L372.55,434.85066l-6.06347,37.6343a11.87517,11.87517,0,0,0,19.20919,13.68395Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#ffb8b8"
            />
            <path
              d="M400.39966,281.81334l-27.55335,89.38335s-10.23331,56.95812-5.65215,66.12044-4.41884,27.19645-4.41884,27.19645l26.34174,2.29058,12.80565-93.60747L424.62114,301.882S433.61313,276.08686,400.39966,281.81334Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#575a89"
            />
            <rect
              id="e8310426-6c31-4dda-9e6e-1765924c3d10"
              data-name="Rectangle 25-2"
              x="495.51824"
              y="365.55255"
              width="101.83965"
              height="83.83965"
              transform="translate(-154.75136 673.83032) rotate(-78.2271)"
              fill="#cacaca"
            />
            <rect
              id="bd122e35-a1c1-49ee-8743-926b8ce798e5"
              data-name="Rectangle 25-3"
              x="497.14861"
              y="367.59796"
              width="97.53086"
              height="79.53086"
              transform="translate(-155.06178 673.23058) rotate(-78.2271)"
              fill="#fff"
            />
            <g id="b64708cb-dce5-48be-ac10-94f92b9c889b" data-name="Group 22">
              <rect
                id="e09379fd-2478-48f1-b81f-f54c4e3c9c7a"
                data-name="Rectangle 28"
                x="542.73166"
                y="358.27592"
                width="2.8535"
                height="19.96516"
                transform="translate(-118.17691 640.38567) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="b4bf12c6-107b-4d74-a31b-e84a4ab6c7a8"
                data-name="Rectangle 29"
                x="551.13561"
                y="358.25439"
                width="2.8535"
                height="40.62625"
                transform="translate(-121.5798 656.81847) rotate(-78.2271)"
                fill="#6c63ff"
              />
              <rect
                id="bbdf33c8-f624-40e0-a78f-3d0040dad156"
                data-name="Rectangle 30"
                x="544.79496"
                y="370.50588"
                width="2.8535"
                height="29.77919"
                transform="translate(-133.31107 656.04604) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="b44a9e07-be4b-414d-8ba3-c4e4a982d953"
                data-name="Rectangle 31"
                x="532.67831"
                y="386.86549"
                width="2.8535"
                height="9.89276"
                transform="translate(-149.23695 649.29152) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="f17ee27a-91b7-41cc-9a5a-26a98e12cdc2"
                data-name="Rectangle 32"
                x="537.8866"
                y="389.5829"
                width="2.8535"
                height="24.09729"
                transform="translate(-154.70444 662.20638) rotate(-78.2271)"
                fill="#6c63ff"
              />
              <rect
                id="f9a19cfe-d4ee-44fa-ab4d-3d6547ba1e46"
                data-name="Rectangle 38"
                x="534.10852"
                y="399.65032"
                width="2.8535"
                height="19.96516"
                transform="translate(-165.5447 664.87659) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="b9542e79-7d8c-492f-96e6-2c189a246911"
                data-name="Rectangle 39"
                x="542.51256"
                y="399.62834"
                width="2.8535"
                height="40.62625"
                transform="translate(-168.94707 681.30912) rotate(-78.2271)"
                fill="#6c63ff"
              />
              <rect
                id="f3fa939e-a9e2-4fac-b505-074c9ee61dc4"
                data-name="Rectangle 40"
                x="536.17191"
                y="411.87983"
                width="2.8535"
                height="29.77919"
                transform="translate(-180.67834 680.53669) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="a1de6102-8b84-4497-ba07-467d8fb2348b"
                data-name="Rectangle 41"
                x="524.05517"
                y="428.23988"
                width="2.8535"
                height="9.89276"
                transform="translate(-196.60472 673.78243) rotate(-78.2271)"
                fill="#e6e6e6"
              />
              <rect
                id="be3007b6-c1ef-41ba-b96c-a7356ec98b0f"
                data-name="Rectangle 42"
                x="529.26345"
                y="430.95732"
                width="2.8535"
                height="24.09729"
                transform="translate(-202.07224 686.69731) rotate(-78.2271)"
                fill="#e6e6e6"
              />
            </g>
            <path
              d="M572.79724,714.55255h-381a1,1,0,0,1,0-2h381a1,1,0,0,1,0,2Z"
              transform="translate(-190.79724 -185.44745)"
              fill="#cacaca"
            />
          </svg>
        </div>
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
        <h1>Nomination Request is successfully Submitted</h1>
        <p>Wait for the approval from Election Commionsioner</p>
      </div>
    );
  };

  render() {
    const { isSubmitSuccess } = this.state;
    return isSubmitSuccess ? this.renderSubmitSuccess() : this.renderForm();
  }
}

export default RequestNominationForm;
