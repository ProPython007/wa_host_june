import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import GlobalVariablesProvider from "./GlobalVariables";
import { Toaster } from "react-hot-toast";

ReactDOM.render(
  <GlobalVariablesProvider>
     <div>
        <Toaster position="top-center"></Toaster>
      </div>
      <App />
  </GlobalVariablesProvider>,
  document.getElementById("root")
);

