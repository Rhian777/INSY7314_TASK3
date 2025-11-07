import React, { useEffect, useState } from "react";
import api from "../api";
import { loadToken } from "../auth";

export default function PaymentsList() {
  const [payments, setPayments] = useState([]);
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    const token = loadToken();
    if (!token) {
      setErr("Not logged in");
      return;
    }

    try {
      const res = await api.get("/payment", token); // pass JWT
      setPayments(res || []);
    } catch (e) {
      setErr(e.body?.message || "Failed to load payments");
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="card">
      <h3>Your Payments</h3>
      {err && <div className="error">{err}</div>}
      <div className="payments-list">
        {payments.length === 0 && <div className="small">No payments found.</div>}
        {payments.map(p => (
          <div key={p._id} className="payment-item">
            <div>
              <div><strong>{p.amount} {p.currency}</strong></div>
              <div className="small">{p.provider} • {p.payeeAccount}</div>
            </div>
            <div className="small">{p.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
