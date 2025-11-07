import React, { useState } from "react";
import api from "../api";
import { saveToken } from "../auth";
import { useNavigate } from "react-router-dom";

export default function EmployeeLogin() {
  const [form, setForm] = useState({ employeeId: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await api.post("/employee/login", form);
    saveToken(res.token); // <-- use res.token, not res.data.token
    navigate("/verify-transactions");

    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-80">
        <h2 className="text-xl font-semibold text-center mb-4">Employee Login</h2>
        <form onSubmit={submit} className="space-y-4">
          <input
            name="employeeId"
            placeholder="Employee ID"
            value={form.employeeId}
            onChange={onChange}
            className="border border-orange-400 w-full p-2 rounded"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={onChange}
            className="border border-orange-400 w-full p-2 rounded"
          />
          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white w-full p-2 rounded"
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-3 text-center">{error}</p>}
      </div>
    </div>
  );
}
