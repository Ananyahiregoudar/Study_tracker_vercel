import React from 'react';
import StudyRecordForm from './StudyRecordForm';
import StudyRecordList from './StudyRecordList';

const RecordManagement = ({ onRecordAdded, refreshTrigger }) => {
    return (
        <div className="record-management">
            <div className="container">
                <div className="form-section">
                    <h3>Add New Study Session</h3>
                    <StudyRecordForm onRecordAdded={onRecordAdded} />
                </div>

                <div className="list-section">
                    <h3>Recent Records</h3>
                    <StudyRecordList key={refreshTrigger} />
                </div>
            </div>
        </div>
    );
};

export default RecordManagement;
