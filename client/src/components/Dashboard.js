import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import './Dashboard.css';

const COLORS = ['#00d2ff', '#3a7bd5', '#10b981', '#f59e0b', '#ef4444'];

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            try {
                const res = await axios.get(`${API_URL}/analytics`);
                setData(res.data.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) return <div className="loading">Loading Analytics...</div>;
    if (!data) return <div className="error">Failed to load data.</div>;

    return (
        <div className="dashboard">
            <h1>Performance Analytics</h1>

            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Records</h3>
                    <p className="stat-value">{data.recordCount}</p>
                </div>
                <div className="stat-card">
                    <h3>Completed Hours</h3>
                    <p className="stat-value">{data.totalHours} hrs</p>
                </div>
                <div className="stat-card">
                    <h3>Planned Hours</h3>
                    <p className="stat-value">{data.plannedHours} hrs</p>
                </div>
                <div className="stat-card">
                    <h3>Efficiency</h3>
                    <p className="stat-value">
                        {data.plannedHours > 0 ? ((data.totalHours / data.plannedHours) * 100).toFixed(1) : 0}%
                    </p>
                </div>
            </div>

            <div className="charts-container">
                <div className="chart-box">
                    <h3>Study Hours per Subject</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.subjectChartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                            <XAxis dataKey="name" stroke="#ccc" />
                            <YAxis stroke="#ccc" />
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                            <Legend />
                            <Bar dataKey="hours" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="chart-box">
                    <h3>Subject Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={data.subjectChartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="hours"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {data.subjectChartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
