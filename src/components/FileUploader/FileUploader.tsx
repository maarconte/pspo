import Button from "../Button/Button";
import { Button_Style } from "../Button/Button.types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { useRef } from "react";

type FileUploaderProps = {
  handleFile: any; // Function to handle the uploaded file
};
const FileUploader = ({ handleFile }: FileUploaderProps) => {
  // Create a reference to the hidden file input element
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!hiddenFileInput.current) {
      return;
    }
    hiddenFileInput.current.click();
  };
  // Call a function (passed as a prop from the parent component)
  // to handle the user-selected file
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    console.log(event.target.files[0]);
    const fileUploaded = event.target.files[0];
    handleFile(fileUploaded);
  };
  return (
    <>
      <Button
        label="Import questions"
        style={Button_Style.OUTLINED}
        icon={<FontAwesomeIcon icon={faUpload} />}
        onClick={handleClick}
      />

      <input
        type="file"
        onChange={handleChange}
        ref={hiddenFileInput}
        style={{ display: "none" }} // Make the file input element invisible
      />
    </>
  );
};

export default FileUploader;
