// API Base URL - Use relative path for production, localhost for development
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api'; // Updated for Vercel deployment

// Add a new study record
export const addStudyRecord = async (recordData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/addStudyRecord`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recordData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to add study record');
    }

    return result;
  } catch (error) {
    console.error('Error adding study record:', error);
    throw error;
  }
};

// Get all study records
export const getStudyRecords = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/studyRecords`);

    if (!response.ok) {
      throw new Error('Failed to fetch study records');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching study records:', error);
    throw error;
  }
};

// Get a specific study record by ID
export const getStudyRecordById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/studyRecord/${id}`);

    if (!response.ok) {
      throw new Error('Failed to fetch study record');
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error('Error fetching study record:', error);
    throw error;
  }
};

// Update a study record
export const updateStudyRecord = async (id, updateData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/studyRecord/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update study record');
    }

    return result;
  } catch (error) {
    console.error('Error updating study record:', error);
    throw error;
  }
};

// Delete a study record
export const deleteStudyRecord = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/studyRecord/${id}`, {
      method: 'DELETE',
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete study record');
    }

    return result;
  } catch (error) {
    console.error('Error deleting study record:', error);
    throw error;
  }
};

// --- AUTH ---
export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

// --- ANALYTICS ---
export const getAnalytics = async () => {
  const response = await fetch(`${API_BASE_URL}/analytics`);
  return response.json();
};