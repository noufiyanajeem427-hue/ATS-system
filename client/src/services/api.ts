const API_BASE_URL = 'http://localhost:5005/api';

export const getAuthToken = () => localStorage.getItem('token');

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// --- JOBS API ---
export const fetchJobs = async (query = '') => {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs${query ? `?${query}` : ''}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch jobs');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchJobs error, using fallback:', err);
    return null;
  }
};

export const fetchJobById = async (id: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs/${id}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch job details');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchJobById error:', err);
    return null;
  }
};

export const createJobApi = async (jobData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(jobData),
    });
    return await res.json();
  } catch (err) {
    console.error('createJob error:', err);
    throw err;
  }
};

// --- APPLICATIONS API ---
export const fetchApplications = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch applications');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchApplications error:', err);
    return null;
  }
};

export const applyJobApi = async (applicationData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/applications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(applicationData),
    });
    return await res.json();
  } catch (err) {
    console.error('applyJob error:', err);
    throw err;
  }
};

// --- DASHBOARD API ---
export const fetchDashboardStats = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch dashboard stats');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchDashboardStats error:', err);
    return null;
  }
};

// --- USERS & AUTH API ---
export const fetchUserProfile = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch user profile');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchUserProfile error:', err);
    return null;
  }
};

export const fetchAllUsersApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/users`);
    if (!res.ok) throw new Error('Failed to fetch users');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchAllUsers error:', err);
    return null;
  }
};

// --- NOTIFICATIONS API ---
export const fetchNotificationsApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch notifications');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchNotifications error:', err);
    return null;
  }
};

// --- SAVED JOBS API ---
export const fetchSavedJobs = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/saved-jobs`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch saved jobs');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchSavedJobs error:', err);
    return null;
  }
};

export const saveJobApi = async (jobId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/saved-jobs`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ job: jobId }),
    });
    return await res.json();
  } catch (err) {
    console.error('saveJob error:', err);
    return null;
  }
};

export const deleteSavedJobApi = async (jobId: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/saved-jobs/${jobId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error('deleteSavedJob error:', err);
    return null;
  }
};

// --- INTERVIEWS API ---
export const fetchInterviewsApi = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/interviews`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch interviews');
    return await res.json();
  } catch (err) {
    console.warn('Backend fetchInterviews error:', err);
    return null;
  }
};

export const scheduleInterviewApi = async (interviewData: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/interviews`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(interviewData),
    });
    return await res.json();
  } catch (err) {
    console.error('scheduleInterview error:', err);
    throw err;
  }
};

export const deleteInterviewApi = async (id: string | number) => {
  try {
    const res = await fetch(`${API_BASE_URL}/interviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return await res.json();
  } catch (err) {
    console.error('deleteInterview error:', err);
    return null;
  }
};

