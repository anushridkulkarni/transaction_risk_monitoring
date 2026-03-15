import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/transactions';

function getRiskColor(score) {
  if (score >= 75) return '#ff4444';
  if (score >= 40) return '#ffbb33';
  return '#00C851';
}

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    fromAccount: '', toAccount: '', amount: '',
    transactionType: '', riskScore: '', status: 'PENDING'
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    const res = await axios.get(API_URL);
    setTransactions(res.data);
  };

  const handleSubmit = async () => {
    if (editId) {
      await axios.put(`${API_URL}/${editId}`, form);
      setEditId(null);
    } else {
      await axios.post(API_URL, form);
    }
    setForm({ fromAccount: '', toAccount: '', amount: '',
      transactionType: '', riskScore: '', status: 'PENDING' });
    fetchTransactions();
  };

  const handleEdit = (t) => {
    setForm(t);
    setEditId(t.id);
  };

  return (
    <div style={{ fontFamily: 'Arial', padding: '20px', backgroundColor: '#0f1117', minHeight: '100vh', color: 'white' }}>
      <h1 style={{ color: '#00d4ff', textAlign: 'center' }}>🔍 Transaction Risk Surveillance Dashboard</h1>

      {/* Form */}
      <div style={{ backgroundColor: '#1a1d2e', padding: '20px', borderRadius: '10px', marginBottom: '30px' }}>
        <h2 style={{ color: '#00d4ff' }}>{editId ? '✏️ Update Transaction' : '➕ Add Transaction'}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
          {['fromAccount', 'toAccount', 'amount', 'transactionType', 'riskScore'].map(field => (
            <input key={field} placeholder={field} value={form[field]}
              onChange={e => setForm({ ...form, [field]: e.target.value })}
              style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#0f1117', color: 'white' }}
            />
          ))}
          <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #333', backgroundColor: '#0f1117', color: 'white' }}>
            <option>PENDING</option>
            <option>FLAGGED</option>
            <option>ESCALATED</option>
            <option>CLEARED</option>
          </select>
        </div>
        <button onClick={handleSubmit}
          style={{ marginTop: '15px', padding: '10px 30px', backgroundColor: '#00d4ff', border: 'none', borderRadius: '5px', color: 'black', fontWeight: 'bold', cursor: 'pointer' }}>
          {editId ? 'Update' : 'Submit'}
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#1a1d2e', padding: '20px', borderRadius: '10px' }}>
        <h2 style={{ color: '#00d4ff' }}>📋 Transactions</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#00d4ff', color: 'black' }}>
              {['ID', 'From', 'To', 'Amount', 'Type', 'Risk Score', 'Status', 'Created At', 'Action'].map(h => (
                <th key={h} style={{ padding: '10px', textAlign: 'left' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id} style={{ borderBottom: '1px solid #333' }}>
                <td style={{ padding: '10px' }}>{t.id}</td>
                <td style={{ padding: '10px' }}>{t.fromAccount}</td>
                <td style={{ padding: '10px' }}>{t.toAccount}</td>
                <td style={{ padding: '10px' }}>₹{t.amount?.toLocaleString()}</td>
                <td style={{ padding: '10px' }}>{t.transactionType}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ backgroundColor: getRiskColor(t.riskScore), padding: '4px 10px', borderRadius: '20px', color: 'white', fontWeight: 'bold' }}>
                    {t.riskScore}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>{t.status}</td>
                <td style={{ padding: '10px' }}>{new Date(t.createdAt).toLocaleString()}</td>
                <td style={{ padding: '10px' }}>
                  <button onClick={() => handleEdit(t)}
                    style={{ padding: '5px 15px', backgroundColor: '#ffbb33', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;