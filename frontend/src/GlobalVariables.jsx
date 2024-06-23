import axios from "axios";
import React, { createContext } from "react";
import { useState, useEffect, useMemo } from "react";

export const GlobalVariablesContext = createContext(null);

function GlobalVariablesProvider(prop) {
  const [currentUser, setCurrentUser] = useState(null);
  // const [userData, setUserData] = useState(null);
  const [userData2, setUserData2] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(async () => {
    // setUserData(null);
    setUserData2(null);
    if (currentUser) {
      const num =
        currentUser.phone.length >= 12
          ? currentUser.phone.slice(2)
          : currentUser.phone;
         
      const amdesi = "https://www.amdesi.com/order_json/" + num + ".json";
      const ledshoe = "https://ledshoes.fun/master/order_json/" + num + ".json";

      // const cross = "https://cors-anywhere.herokuapp.com/";
      // use cross if you get cross error (cross+amdesi/ledshoe)

      // try {
      //   const amdesiRes = await axios.get(amdesi);
      //   if (amdesiRes.status === 200) {
      //     setUserData(amdesiRes.data);
      //   }
      // } catch (error) {
      //   console.log("Erro while fetching AMDESI user data:: ", error);
      // }

      try {
        const ledshoeRes = await axios.get(ledshoe);
        if (ledshoeRes.status === 200) {
          setUserData2(ledshoeRes.data);
         
        }
      } catch (error) {
       
      }
    }
  }, [currentUser]);

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn"));
  }, []);

  useMemo(() => {
    setIsLoggedIn(localStorage.getItem("isLoggedIn"));
  }, [isLoggedIn]);
  
  return (
    <GlobalVariablesContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        userData2,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {prop.children}
    </GlobalVariablesContext.Provider>
  );
}

export default GlobalVariablesProvider;
