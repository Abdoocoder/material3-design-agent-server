import React from "react";
import ReactDOM from "react-dom/client";
import Material3DesignAgent from "./mcp-app";

const root = ReactDOM.createRoot(
  document.getElementById("app") || document.body
);

root.render(
  <React.StrictMode>
    <Material3DesignAgent />
  </React.StrictMode>
);
