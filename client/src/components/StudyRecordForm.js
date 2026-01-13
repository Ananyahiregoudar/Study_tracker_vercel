import React, { useState } from 'react';
import { addStudyRecord } from '../services/api';

const StudyRecordForm = ({ onRecordAdded }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    subjectName: '',
    examDate: '',
    studyHoursPlanned: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      await addStudyRecord(formData);
      
      // Reset form
      setFormData({
        studentId: '',
        subjectName: '',
        examDate: '',
        studyHoursPlanned: ''
      });
      
      // Notify parent component
      if (onRecordAdded) {
        onRecordAdded();
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="study-record-form">
      <h2>Add New Study Record</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="studentId">Student ID:</label>
          <input
            type="text"
            id="studentId"
            name="studentId"
            value={formData.studentId}
            onChange={handleChange}
            required
            placeholder="Enter student ID"
          />
        </div>

        <div className="form-group">
          <label htmlFor="subjectName">Subject Name:</label>
          <input
            type="text"
            id="subjectName"
            name="subjectName"
            value={formData.subjectName}
            onChange={handleChange}
            required
            placeholder="Enter subject name"
          />
        </div>

        <div className="form-group">
          <label htmlFor="examDate">Exam Date:</label>
          <input
            type="date"
            id="examDate"
            name="examDate"
            value={formData.examDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="studyHoursPlanned">Study Hours Planned:</label>
          <input
            type="number"
            id="studyHoursPlanned"
            name="studyHoursPlanned"
            value={formData.studyHoursPlanned}
            onChange={handleChange}
            required
            min="1"
            placeholder="Enter planned study hours"
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Adding...' : 'Add Study Record'}
        </button>
      </form>
    </div>
  );
};

export default StudyRecordForm;