import "./headerCss/uploadprogress.css";

function UploadProgress({ percentage }) {
  var r = document.querySelector(":root");
  r.style.setProperty("--p", percentage);
  
  return (
    <div className="range">
      <div className="range__label">Uploading</div>
    </div>
  );
}

export default UploadProgress
