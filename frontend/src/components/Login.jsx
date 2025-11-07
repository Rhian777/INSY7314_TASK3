import React, { useState } from "react";
import api from "../api";
import { saveToken } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ accountNumber: "", password: "" });
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setErr("");
    try {
      const res = await api.post("/user/login", form);
      if (res.token) {
        saveToken(res.token);
        navigate("/payments");
      } else {
        setErr(res.message || "Login failed");
      }
    } catch (e) {
      setErr(e.body?.message || "Login error");
    }
  };

  return (
    <div className="card">
      <h3>Login</h3>
      <form onSubmit={submit}>
        <div className="form-row"><label>Account Number</label><input name="accountNumber" value={form.accountNumber} onChange={onChange} /></div>
        <div className="form-row"><label>Password</label><input type="password" name="password" value={form.password} onChange={onChange} /></div>
        <button className="primary" type="submit">Login</button>
      </form>
      {err && <div className="error">{err}</div>}
    </div>
  );
}
