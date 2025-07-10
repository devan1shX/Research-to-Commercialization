import React, { createContext, useState, useContext, useCallback } from 'react';
import { Alert, Snackbar } from '@mui/material';

const NotificationContext = createContext();

export const useNotification = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notification, setNotification] = useState(null);

    const addNotification = useCallback((message, severity = 'info', link) => {
        setNotification({ message, severity, link, key: new Date().getTime() });
    }, []);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setNotification(null);
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            {notification && (
                <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
                        {notification.link ? (
                            <a href={notification.link} style={{ color: 'inherit', textDecoration: 'underline' }}>
                                {notification.message}
                            </a>
                        ) : (
                            notification.message
                        )}
                    </Alert>
                </Snackbar>
            )}
        </NotificationContext.Provider>
    );
};