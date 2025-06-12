import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";

// Importe o CSS do Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// Opcional: Importe o JS do Bootstrap se for usar funcionalidades JS (modals, dropdowns) via data-bs-* attributes
import "bootstrap/dist/js/bootstrap.bundle.min.js";

// Sem CSS global personalizado, então este import pode ser removido ou o arquivo limpo
// import './index.css';

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
