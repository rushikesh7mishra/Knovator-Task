import React, { useEffect, useState } from 'react';
import axios from '../services/api';
import ImportHistoryTable from '../components/ImportHistoryTable';
import socket from '../utils/socket';

const Home = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios.get('/jobs/import-logs')
      .then(res => setLogs(res.data))
      .catch(err => console.error("Error fetching logs:", err));
  }, []);

  useEffect(() => {
    socket.on('job-added', () => {
      axios.get('/jobs/import-logs')
        .then(res => setLogs(res.data));
    });

    socket.on('job-updated', () => {
      axios.get('/jobs/import-logs')
        .then(res => setLogs(res.data));
    });

    return () => {
      socket.off('job-added');
      socket.off('job-updated');
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">📥 Import Logs</h1>
      <ImportHistoryTable logs={logs} />
    </div>
  );
};

export default Home;
