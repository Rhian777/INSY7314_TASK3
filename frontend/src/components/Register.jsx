import React, { useState } from "react";
import api from "../api";
import { validateRegister } from "../utils/validators";

export default function Register() {
  const [form, setForm] = useState({ fullName: "", idNumber: "", accountNumber: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setError(""); setSuccess("");
    const v = validateRegister(form);
    if (v) { setError(v); return; }
    try {
      const res = await api.post("/user/register", form);
      setSuccess(res.message || "Registered");
      setForm({ fullName: "", idNumber: "", accountNumber: "", password: "" });
    } catch (err) {
      setError(err.body?.message || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h3>Register (Customer)</h3>
      <form onSubmit={submit}>
        <div className="form-row"><label>Full name</label><input name="fullName" value={form.fullName} onChange={onChange} /></div>
        <div className="form-row"><label>ID Number</label><input name="idNumber" value={form.idNumber} onChange={onChange} /></div>
        <div className="form-row"><label>Account Number</label><input name="accountNumber" value={form.accountNumber} onChange={onChange} /></div>
        <div className="form-row"><label>Password</label><input type="password" name="password" value={form.password} onChange={onChange} /></div>
        <button className="primary" type="submit">Register</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
}
