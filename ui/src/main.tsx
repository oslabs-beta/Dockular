import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { DockerMuiThemeProvider } from "@docker/docker-mui-theme";

// import { App } from './App';
// import { Home } from './Home'

import { CentralizedState } from "./CentralizedState";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter >
    {/*
      If you eject from MUI (which we don't recommend!), you should add
      the `dockerDesktopTheme` class to your root <html> element to get
      some minimal Docker theming.
    */}
    <DockerMuiThemeProvider>
      <CssBaseline />
      <CentralizedState />
    </DockerMuiThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
