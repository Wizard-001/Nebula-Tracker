import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';

export const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('/api/applications', config);
      setApplications(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const addApplication = async (appData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('/api/applications', appData, config);
      setApplications(prev => [...prev, data]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add application' };
    }
  };

  const updateApplication = async (id, appData) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.put(`/api/applications/${id}`, appData, config);
      setApplications(prev => prev.map(app => app._id === id ? data : app));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update application' };
    }
  };

  const deleteApplication = async (id) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.delete(`/api/applications/${id}`, config);
      setApplications(prev => prev.filter(app => app._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete application' };
    }
  };

  const updateApplicationStatus = async (id, status, order) => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put(`/api/applications/${id}/status`, { status, order }, config);
      // We don't necessarily need to update state here if we optimistically updated the UI
      return { success: true };
    } catch (err) {
      // Re-fetch to ensure sync on error
      fetchApplications();
      return { success: false, message: err.response?.data?.message || 'Failed to update status' };
    }
  };

  return (
    <ApplicationContext.Provider value={{ 
      applications, 
      loading, 
      error, 
      setApplications,
      fetchApplications, 
      addApplication, 
      updateApplication, 
      deleteApplication,
      updateApplicationStatus
    }}>
      {children}
    </ApplicationContext.Provider>
  );
};
