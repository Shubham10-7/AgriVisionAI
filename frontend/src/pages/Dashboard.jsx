// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { LayoutDashboard, Scan, Leaf, TrendingUp } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const COLORS = ["#2D7A3A", "#F9A825", "#0288D1", "#E53935", "#8E24AA"];

export default function Dashboard() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/dashboard/stats`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => setStats(r.data))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <div className="text-center py-16 text-gray-400">Loading dashboard...</div>;
  if (!stats) return null;

  const chartData = stats.top_diseases.map(d => ({ name: d.disease?.split("___")[1]?.replace(/_/g, " ") || d.disease, count: d.count }));

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><h1 className="text-2xl font-display font-bold text-gray-800">📊 My Farm Dashboard</h1><p className="text-gray-500 mt-1">Track your scan history and agricultural analytics</p></div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: "Total Scans", value: stats.total_scans, icon: Scan, color: "text-blue-500 bg-blue-50" },
          { label: "Fertilizer Recs", value: stats.total_fertilizer_recs, icon: Leaf, color: "text-green-500 bg-green-50" },
          { label: "Disease Types", value: stats.top_diseases.length, icon: TrendingUp, color: "text-purple-500 bg-purple-50" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-2xl shadow-card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <p className="text-3xl font-bold text-gray-800">{s.value}</p>
            <p className="text-sm text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>
      {chartData.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h2 className="font-bold text-gray-800 mb-4">Top Diseases Detected</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#2D7A3A" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="bg-white rounded-2xl shadow-card p-6">
        <h2 className="font-bold text-gray-800 mb-4">Recent Scans</h2>
        <div className="space-y-3">
          {stats.recent_scans.map(s => (
            <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0"><Leaf className="w-5 h-5 text-primary" /></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-800 truncate">{s.disease_name?.replace(/___/g, " → ").replace(/_/g, " ") || "Plant identified"}</p>
                <p className="text-xs text-gray-400">{new Date(s.scanned_at).toLocaleString()}</p>
              </div>
              {s.confidence && <span className="text-xs font-bold text-primary">{(s.confidence * 100).toFixed(1)}%</span>}
            </div>
          ))}
          {stats.recent_scans.length === 0 && <p className="text-center py-6 text-gray-400 text-sm">No scans yet. Upload a leaf image to get started!</p>}
        </div>
      </div>
    </div>
  );
}
