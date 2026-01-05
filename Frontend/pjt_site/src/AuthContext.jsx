import React, { createContext, useState, useContext } from 'react';

export const AuthContext = createContext();

// Helper function to decode JWT token
const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
};

export const AuthProvider = ({ children }) => {
    const [token, setTokenState] = useState(() => {
        // Initialize from localStorage
        return localStorage.getItem('access_token') || null;
    });
    const [user, setUser] = useState(() => {
        // Initialize user from token if exists
        const storedToken = localStorage.getItem('access_token');
        if (storedToken) {
            const decoded = decodeToken(storedToken);
            return decoded ? { id: decoded.user_id, username: decoded.username } : null;
        }
        return null;
    });

    const setToken = (newToken) => {
        if (newToken) {
            // Store token in localStorage
            localStorage.setItem('access_token', newToken);
            // Decode and set user info
            const decoded = decodeToken(newToken);
            if (decoded) {
                setUser({ id: decoded.user_id, username: decoded.username });
            }
        } else {
            // Clear token and user
            localStorage.removeItem('access_token');
            setUser(null);
        }
        setTokenState(newToken);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, setToken, user, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};