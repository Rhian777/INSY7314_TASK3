import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Register from "./components/Register.jsx";
import Login from "./components/Login.jsx";
import EmployeeLogin from "./components/EmployeeLogin.jsx";
import PaymentForm from "./components/PaymentForm.jsx";
import PaymentsList from "./components/PaymentsList.jsx";
import VerifyTransactions from "./components/VerifyTransactions.jsx";
import { isLoggedIn, clearToken, getUserInfo } from "./auth.js";

function Home() {
  return (
    <div className="card">
      <h3>Welcome</h3>
      <p className="small">
        Use the Register page to create a customer account. Then login and create payments.
      </p>
      <p className="small">
        Employees can log in via the Employee Login page to verify transactions.
      </p>
    </div>
  );
}

export default function App() {
  const navigate = useNavigate();
  const logged = isLoggedIn();
  const userInfo = getUserInfo();
  const role = userInfo?.role || "guest";

  const logout = () => {
    clearToken();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="container">
      <div className="header">
        <h1>INSY7314 — Portal</h1>

        <div className="nav">
          {/* All buttons always visible */}
          <Link to="/"><button>Home</button></Link>
          <Link to="/register"><button>Register</button></Link>
          <Link to="/login"><button>User Login</button></Link>
          <Link to="/employee-login"><button>Employee Login</button></Link>
          <Link to="/payments"><button>Payments</button></Link>
          <Link to="/verify-transactions"><button>Verify Transactions</button></Link>
          {logged && <button onClick={logout}>Logout</button>}
        </div>
      </div>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Customer routes */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/payments"
          element={
            logged && role === "user" ? (
              <div>
                <PaymentForm onCreate={() => {}} />
                <PaymentsList />
              </div>
            ) : (
              <div className="card"><h3>Access Denied</h3></div>
            )
          }
        />

        {/* Employee routes */}
        <Route path="/employee-login" element={<EmployeeLogin />} />
        <Route
          path="/verify-transactions"
          element={
            logged && role === "employee" ? (
              <VerifyTransactions />
            ) : (
              <div className="card"><h3>Access Denied</h3></div>
            )
          }
        />
      </Routes>

      <footer style={{ marginTop: 18, fontSize: 12 }} className="small">
        Running in secure mode — uses HTTPS to communicate with backend. <br />
        If using self-signed certificates, accept the browser warning first.
      </footer>
    </div>
  );
}
