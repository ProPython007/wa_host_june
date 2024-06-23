import axios from "axios";
function SendTemplateData({
  currentUser,
  input,
  template_name,
  media_type,
  file,
  setIsShowProgress,
  setPercentage,
  setIsShowForm,
  setIsError,
}) {
  const url = process.env.REACT_APP_TEMPLATE_API;
  const formData = new FormData();
  formData.append("profile_name", currentUser.name);
  formData.append("to_number", currentUser.phone);
  formData.append("from_number", currentUser.wb_num);

  formData.append("components", "LEDSHOE");
  formData.append("template_name", template_name);
  formData.append("media_type", media_type);

  if (input) {
    formData.append("components", input);
  }
  if (file !== null) {
    formData.append("media", file.files[0]);
  }
  axios
    .post(url, formData, {
      headers: file !== null ? "multipart/form-data" : "application/json",
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setIsShowProgress(true);
        setPercentage(percentCompleted);
      },
    })
    .then((res) => {
      setIsShowProgress(false);
      setIsShowForm(false);
      return 1;
    })
    .catch((error) => {
      console.error(`Error uploading ${media_type}:: `, error);
      setIsError(true);
      return 0;
    });
  return 0;
}

export default SendTemplateData;
