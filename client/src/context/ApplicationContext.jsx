import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../api/api';
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
      const { data } = await api.get('/api/applications');
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
      const { data } = await api.post('/api/applications', appData);
      setApplications(prev => [...prev, data]);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to add application' };
    }
  };

  const updateApplication = async (id, appData) => {
    try {
      const { data } = await api.put(`/api/applications/${id}`, appData);
      setApplications(prev => prev.map(app => app._id === id ? data : app));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to update application' };
    }
  };

  const deleteApplication = async (id) => {
    try {
      await api.delete(`/api/applications/${id}`);
      setApplications(prev => prev.filter(app => app._id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.message || 'Failed to delete application' };
    }
  };

  const updateApplicationStatus = async (id, status, order) => {
    try {
      await api.put(`/api/applications/${id}/status`, { status, order });
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
