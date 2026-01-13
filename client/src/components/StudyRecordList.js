import React, { useState, useEffect } from 'react';
import { getStudyRecords } from '../services/api';
import StudyRecordItem from './StudyRecordItem';

const StudyRecordList = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchRecords();
  }, [refreshKey]);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getStudyRecords();
      setRecords(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRecordUpdated = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleRecordDeleted = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="study-record-list loading">
        <div className="loading-spinner">Loading study records...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-record-list error">
        <div className="error-message">
          <p>Error loading study records: {error}</p>
          <button onClick={fetchRecords}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="study-record-list">
      <div className="list-header">
        <h2>Study Records</h2>
        <button onClick={fetchRecords} className="refresh-btn">
          Refresh
        </button>
      </div>

      {records.length === 0 ? (
        <div className="no-records">
          <p>No study records found. Add a new study record to get started!</p>
        </div>
      ) : (
        <div className="records-grid">
          {records.map((record) => (
            <StudyRecordItem
              key={record._id}
              record={record}
              onRecordUpdated={handleRecordUpdated}
              onRecordDeleted={handleRecordDeleted}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudyRecordList;