import "./App.css";
import Chat from "./chat/Chat";
import React, { useContext } from "react";
import Sidebar from "./sidebar/Sidebar";
import { GlobalVariablesContext } from "./GlobalVariables";
import Login from "./Login/Login";

function App() {
  const { currentUser, isLoggedIn, setIsLoggedIn } = useContext(
    GlobalVariablesContext
  );
  
  window.history.pushState(null, null, window.location.href);
  window.onpopstate = function () {
    window.history.go(1);
  };
  
  

  return (
    <div className="chat">
      
      <div className="chat__body">
        {isLoggedIn === "true" ? (
          <>
            <Sidebar />
            {currentUser && <Chat />}
          </>
        ) : (
          <Login setIsLoggedIn={setIsLoggedIn} />
        )}
      </div>
    </div>
  );
}

export default App;
