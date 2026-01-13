import React, { useState } from 'react';
import { updateStudyRecord, deleteStudyRecord } from '../services/api';

const StudyRecordItem = ({ record, onRecordUpdated, onRecordDeleted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    syllabusStatus: record.syllabusStatus,
    studyHoursCompleted: record.studyHoursCompleted
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: name === 'studyHoursCompleted' ? parseFloat(value) || 0 : value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await updateStudyRecord(record._id, editData);
      setIsEditing(false);
      if (onRecordUpdated) {
        onRecordUpdated();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this study record?')) {
      try {
        await deleteStudyRecord(record._id);
        if (onRecordDeleted) {
          onRecordDeleted();
        }
      } catch (error) {
        setError(error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Not Started': return '#dc3545';
      case 'In Progress': return '#ffc107';
      case 'Completed': return '#28a745';
      default: return '#6c757d';
    }
  };

  if (isEditing) {
    return (
      <div className="study-record-item editing">
        <form onSubmit={handleUpdate}>
          <div className="edit-form">
            <div className="form-group">
              <label>Syllabus Status:</label>
              <select
                name="syllabusStatus"
                value={editData.syllabusStatus}
                onChange={handleEditChange}
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="form-group">
              <label>Study Hours Completed:</label>
              <input
                type="number"
                name="studyHoursCompleted"
                value={editData.studyHoursCompleted}
                onChange={handleEditChange}
                min="0"
                step="0.5"
              />
            </div>

            {error && <div className="error-message">{error}</div>}

            <div className="edit-actions">
              <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setIsEditing(false);
                  setError('');
                  setEditData({
                    syllabusStatus: record.syllabusStatus,
                    studyHoursCompleted: record.studyHoursCompleted
                  });
                }}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="study-record-item">
      <div className="record-header">
        <h3>{record.subjectName}</h3>
        <div className="record-actions">
          <button 
            onClick={() => setIsEditing(true)}
            className="edit-btn"
          >
            Edit
          </button>
          <button 
            onClick={handleDelete}
            className="delete-btn"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="record-details">
        <div className="detail-row">
          <span className="label">Student ID:</span>
          <span className="value">{record.studentId}</span>
        </div>

        <div className="detail-row">
          <span className="label">Exam Date:</span>
          <span className="value">{formatDate(record.examDate)}</span>
        </div>

        <div className="detail-row">
          <span className="label">Syllabus Status:</span>
          <span 
            className="value status-badge"
            style={{ backgroundColor: getStatusColor(record.syllabusStatus) }}
          >
            {record.syllabusStatus}
          </span>
        </div>

        <div className="detail-row">
          <span className="label">Study Hours:</span>
          <span className="value">
            {record.studyHoursCompleted} / {record.studyHoursPlanned} hours
            ({record.studyHoursPlanned > 0 
              ? Math.round((record.studyHoursCompleted / record.studyHoursPlanned) * 100)
              : 0}%)
          </span>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ 
              width: `${record.studyHoursPlanned > 0 
                ? Math.min((record.studyHoursCompleted / record.studyHoursPlanned) * 100, 100)
                : 0}%` 
            }}
          ></div>
        </div>

        <div className="detail-row">
          <span className="label">Created:</span>
          <span className="value">{formatDate(record.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default StudyRecordItem;