import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import { AuthProvider } from "./contexts/AuthContext.tsx";
import Modal from "react-modal";

Modal.setAppElement("#root");

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode> // Manter ou remover, dependendo do comportamento
  <Router>
    <AuthProvider>
      <App />
    </AuthProvider>
  </Router>
  // </React.StrictMode>,
);
