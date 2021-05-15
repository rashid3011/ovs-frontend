import TextField from "../InputFields/TextField";
import DateInput from "../InputFields/DateInput";
import TextArea from "../InputFields/TextArea";
import RadioInput from "../InputFields/RadioInput";
import Dropdown from "../InputFields/DropDown";
import SimpleDropdown from "../InputFields/SimpleDropdown";

function FromikControl(props) {
  const { control, ...rest } = props;
  switch (control) {
    case "input":
      return <TextField {...rest} />;
    case "date":
      return <DateInput {...rest} />;
    case "textarea":
      return <TextArea {...rest} />;
    case "radio":
      return <RadioInput {...rest} />;
    case "dropdown":
      return <Dropdown {...rest} />;
    case "simpleDropdown":
      return <SimpleDropdown {...rest} />;
    default:
      return null;
  }
}

export default FromikControl;
