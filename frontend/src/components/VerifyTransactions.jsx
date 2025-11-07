import React, { useEffect, useState } from "react";
import api from "../api";
import { loadToken } from "../auth";
import { useNavigate } from "react-router-dom";

export default function VerifyTransactions() {
  const [transactions, setTransactions] = useState([]);
  const navigate = useNavigate();
  const token = loadToken(); // load once

  useEffect(() => {
    if (!token) {
      navigate("/employee-login");
      return;
    }
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await api.get("/employee/transactions", token);
      setTransactions(res);
    } catch (err) {
      console.error(err);
      navigate("/employee-login");
    }
  };

  const verifyTransaction = async (id) => {
    const swiftCode = prompt("Enter SWIFT code to verify:");
    if (!swiftCode) return;

    try {
      await api.put(`/employee/verify/${id}`, { swiftCode }, token);
      alert("Transaction verified!");
      fetchTransactions();
    } catch (err) {
      alert(err.body?.message || "Verification failed");
    }
  };

  const submitToSwift = async () => {
    try {
      const res = await api.post("/employee/submit-to-swift", {}, token);
      alert(res.message || "Transactions submitted to SWIFT!");
      fetchTransactions();
    } catch (err) {
      alert(err.body?.message || "Submit failed");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Pending Transactions</h2>

      {transactions.length === 0 ? (
        <p>No pending transactions to verify.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-orange-100">
              <th className="border p-2">Payee Account</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Currency</th>
              <th className="border p-2">Provider</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx._id} className="text-center">
                <td className="border p-2">{tx.payeeAccount}</td>
                <td className="border p-2">{tx.amount}</td>
                <td className="border p-2">{tx.currency}</td>
                <td className="border p-2">{tx.provider}</td>
                <td className="border p-2">
                  <button
                    onClick={() => verifyTransaction(tx._id)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded"
                  >
                    Verify
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={submitToSwift}
        className="mt-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded"
      >
        Submit Verified to SWIFT
      </button>
    </div>
  );
}

