import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter, MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import App from "./App.jsx";
import { store } from "./store/index.js";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { CompareProvider } from "./context/CompareContext.jsx";
import "./index.css";

// GitHub Pages uses HashRouter. The embedded preview build (VITE_PREVIEW) uses MemoryRouter.
const Router = import.meta.env.VITE_PREVIEW ? MemoryRouter : HashRouter;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <CompareProvider>
          <Router>
            <App />
          </Router>
        </CompareProvider>
      </ThemeProvider>
    </Provider>
  </React.StrictMode>
);
