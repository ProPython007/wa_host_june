import "./chatCSS/Chat.css";
import "react-perfect-scrollbar/dist/css/styles.css";
import "emoji-mart/css/emoji-mart.css"; // Import emoji-mart CSS
import Body from "./components/Body/Body";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";

function Chat() {
  return (
    <div className="Chat">
      <div className="Chat__header">
        <Header />
      </div>

      <div className="Chat__bodyOfMsg">
        <Body />
      </div>

      <div className="Chat__footer">
        <Footer />
      </div>
    </div>
  );
}

export default Chat;
