import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

const BulkAnalysisContext = createContext();

const STORAGE_KEY = 'bulkAnalysisJobs';

export const useBulkAnalysis = () => useContext(BulkAnalysisContext);

export const BulkAnalysisProvider = ({ children }) => {
    const { currentUser } = useAuth();
    const { addNotification } = useNotification();

    const [jobs, setJobs] = useState(() => {
        try {
            const storedJobs = sessionStorage.getItem(STORAGE_KEY);
            return storedJobs ? JSON.parse(storedJobs) : [];
        } catch (error) {
            console.error("Failed to parse jobs from sessionStorage", error);
            return [];
        }
    });

    const [isPolling, setIsPolling] = useState(false);
    const pollingIntervalRef = useRef(null);
    const jobsRef = useRef(jobs);
    jobsRef.current = jobs;

    useEffect(() => {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    }, [jobs]);

    useEffect(() => {
        const areJobsPending = jobs.some(job => job.status === 'pending');
        if (areJobsPending && !isPolling) {
            setIsPolling(true);
        }
    }, []); 

    const startBulkAnalysis = useCallback((initialJobs) => {
        const jobsWithStatus = initialJobs.map(job => ({ ...job, status: 'pending', data: null, error: null }));
        setJobs(jobsWithStatus);
        setIsPolling(true);
    }, []);

    const poll = useCallback(async () => {
        if (!currentUser || jobsRef.current.length === 0) {
            setIsPolling(false);
            return;
        }

        const token = await currentUser.getIdToken(true);
        let allDone = true;

        const updatedJobsPromises = jobsRef.current.map(async (job) => {
            if (job.status === 'completed' || job.status === 'failed') {
                return job;
            }

            allDone = false;
            try {
                const response = await fetch(`/api/studies/analysis-status/${job.analysisId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) {
                    return { ...job, status: 'failed', error: 'Failed to get analysis status.' };
                }
                const result = await response.json();
                if (result.status === 'completed' || result.status === 'failed') {
                    return { ...job, status: result.status, data: result.data, error: result.error };
                }
            } catch (error) {
                return { ...job, status: 'failed', error: 'Network error during status check.' };
            }
            return job;
        });

        const updatedJobs = await Promise.all(updatedJobsPromises);
        setJobs(updatedJobs);

        if (allDone) {
            setIsPolling(false);
            const successfulCount = updatedJobs.filter(j => j.status === 'completed').length;
            const failedCount = updatedJobs.length - successfulCount;
            
            addNotification(
                `Bulk analysis complete: ${successfulCount} succeeded, ${failedCount} failed. Click to view results.`,
                failedCount > 0 ? 'warning' : 'success',
                '/bulk-create-study'
            );
        }
    }, [currentUser, addNotification]);

    useEffect(() => {
        if (isPolling) {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
            poll();
            pollingIntervalRef.current = setInterval(poll, 10000);
        } else {
            if (pollingIntervalRef.current) {
                clearInterval(pollingIntervalRef.current);
                pollingIntervalRef.current = null;
            }
        }
        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, [isPolling, poll]);

    const getCompletedJobs = useCallback(() => {
        return jobs.filter(job => job.status === 'completed' || job.status === 'failed');
    }, [jobs]);

    const clearJobs = useCallback(() => {
        setJobs([]);
        sessionStorage.removeItem(STORAGE_KEY);
        setIsPolling(false);
    }, []);

    const value = { startBulkAnalysis, getCompletedJobs, clearJobs, allJobs: jobs };

    return (
        <BulkAnalysisContext.Provider value={value}>
            {children}
        </BulkAnalysisContext.Provider>
    );
};
