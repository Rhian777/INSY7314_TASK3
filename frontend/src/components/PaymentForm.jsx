import React, { useState } from "react";
import api from "../api";
import { loadToken } from "../auth";
import { validatePayment } from "../utils/validators";

export default function PaymentForm({ onCreate }) {
  const [form, setForm] = useState({ amount: "", currency: "ZAR", provider: "", payeeAccount: "", swiftCode: "" });
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (ev) => {
    ev.preventDefault();
    setErr(""); setOk("");
    const v = validatePayment(form);
    if (v) { setErr(v); return; }
    try {
      const res = await api.post("/payment/create", form, loadToken());
      setOk("Payment created (Pending).");
      setForm({ amount: "", currency: "ZAR", provider: "", payeeAccount: "", swiftCode: "" });
      onCreate && onCreate();
    } catch (e) {
      setErr(e.body?.message || "Create payment failed");
    }
  };

  return (
    <div className="card">
      <h3>Create Payment</h3>
      <form onSubmit={submit}>
        <div className="form-row"><label>Amount</label><input name="amount" value={form.amount} onChange={onChange} type="number" step="0.01" /></div>
        <div className="form-row"><label>Currency</label>
          <select name="currency" value={form.currency} onChange={onChange}>
            <option value="ZAR">ZAR</option>
            <option value="USD">USD</option>
            <option value="GBP">GBP</option>
            <option value="EUR">EUR</option>
          </select>
        </div>
        <div className="form-row"><label>Provider</label><input name="provider" value={form.provider} onChange={onChange} /></div>
        <div className="form-row"><label>Payee Account</label><input name="payeeAccount" value={form.payeeAccount} onChange={onChange} /></div>
        <div className="form-row"><label>SWIFT Code</label><input name="swiftCode" value={form.swiftCode} onChange={onChange} /></div>
        <button className="primary" type="submit">Create</button>
      </form>
      {err && <div className="error">{err}</div>}
      {ok && <div className="success">{ok}</div>}
    </div>
  );
}
