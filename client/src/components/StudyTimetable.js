import React, { useState, useEffect } from 'react';
import { getStudyRecords } from '../services/api';

const StudyTimetable = () => {
  const [records, setRecords] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Load study records
  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const data = await getStudyRecords();
      setRecords(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Calculate study schedule for each record
  const getStudySchedule = (record) => {
    const examDate = new Date(record.examDate);
    const now = currentTime;
    const timeUntilExam = examDate.getTime() - now.getTime();
    
    // If exam has passed
    if (timeUntilExam <= 0) {
      return {
        status: 'EXAM_PASSED',
        studyStatus: 'COMPLETED',
        currentStudyHour: record.studyHoursPlanned,
        nextStudyTime: null,
        timeUntilNextStudy: null,
        progress: 100
      };
    }

    // Calculate days until exam
    const daysUntilExam = Math.ceil(timeUntilExam / (1000 * 60 * 60 * 24));
    
    // Calculate total available hours (assume 8 hours study per day)
    const totalAvailableHours = daysUntilExam * 8;
    
    // Calculate how many hours should be completed by now
    const progressPercentage = Math.min(100, ((now.getTime() - new Date(record.createdAt).getTime()) / timeUntilExam) * 100);
    const shouldCompleteHours = (progressPercentage / 100) * record.studyHoursPlanned;
    
    // Calculate current study hour
    const currentStudyHour = Math.min(record.studyHoursPlanned, shouldCompleteHours);
    
    // Calculate next study time (assuming study sessions of 1 hour)
    const hoursCompletedToday = Math.floor(currentStudyHour % 8);
    const nextStudyTime = new Date(now);
    nextStudyTime.setHours(9 + hoursCompletedToday, 0, 0, 0);
    
    // If next study time has passed today, set for tomorrow
    if (nextStudyTime <= now) {
      nextStudyTime.setDate(nextStudyTime.getDate() + 1);
    }
    
    // Calculate time until next study
    const timeUntilNextStudy = nextStudyTime.getTime() - now.getTime();
    
    // Determine study status
    let studyStatus = 'NOT STARTED';
    if (currentStudyHour > 0) {
      studyStatus = currentStudyHour >= record.studyHoursPlanned ? 'COMPLETED' : 'IN PROGRESS';
    }
    
    // Calculate overall progress
    const progress = Math.round((currentStudyHour / record.studyHoursPlanned) * 100);
    
    return {
      status: 'ACTIVE',
      studyStatus,
      currentStudyHour: Math.round(currentStudyHour * 10) / 10,
      nextStudyTime,
      timeUntilNextStudy,
      progress,
      daysUntilExam,
      totalAvailableHours
    };
  };

  const formatTime = (time) => {
    if (!time) return 'N/A';
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatCountdown = (milliseconds) => {
    if (milliseconds <= 0) return '00:00:00';
    
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'NOT STARTED': return '#dc3545';
      case 'IN PROGRESS': return '#ffc107';
      case 'COMPLETED': return '#28a745';
      case 'EXAM_PASSED': return '#6c757d';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className="study-timetable loading">
        <div className="loading-spinner">Loading timetable...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="study-timetable error">
        <div className="error-message">
          <p>Error loading timetable: {error}</p>
          <button onClick={fetchRecords}>Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="study-timetable">
      <div className="timetable-header">
        <h2>📅 Study Timetable</h2>
        <div className="current-time">
          Current Time: {currentTime.toLocaleString()}
        </div>
      </div>

      {records.length === 0 ? (
        <div className="no-records">
          <p>No study records found. Add study records to see your timetable!</p>
        </div>
      ) : (
        <div className="timetable-grid">
          {records.map((record) => {
            const schedule = getStudySchedule(record);
            
            return (
              <div key={record._id} className="timetable-item">
                <div className="record-header">
                  <h3>{record.subjectName}</h3>
                  <div 
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(schedule.studyStatus) }}
                  >
                    {schedule.studyStatus}
                  </div>
                </div>

                <div className="schedule-details">
                  <div className="detail-row">
                    <span className="label">Exam Date:</span>
                    <span className="value">{new Date(record.examDate).toLocaleDateString()}</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Days Until Exam:</span>
                    <span className="value">{schedule.daysUntilExam} days</span>
                  </div>

                  <div className="detail-row">
                    <span className="label">Study Progress:</span>
                    <span className="value">
                      {schedule.currentStudyHour} / {record.studyHoursPlanned} hours ({schedule.progress}%)
                    </span>
                  </div>

                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${schedule.progress}%` }}
                    ></div>
                  </div>

                  {schedule.status === 'ACTIVE' && (
                    <>
                      <div className="detail-row">
                        <span className="label">Next Study Time:</span>
                        <span className="value">{formatTime(schedule.nextStudyTime)}</span>
                      </div>

                      <div className="detail-row">
                        <span className="label">Countdown to Next Study:</span>
                        <span className="value countdown">
                          {formatCountdown(schedule.timeUntilNextStudy)}
                        </span>
                      </div>

                      <div className="detail-row">
                        <span className="label">Available Study Time:</span>
                        <span className="value">{schedule.totalAvailableHours} hours total</span>
                      </div>
                    </>
                  )}

                  {schedule.status === 'EXAM_PASSED' && (
                    <div className="exam-passed">
                      <p>🎉 Exam has passed! Study session completed.</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudyTimetable;