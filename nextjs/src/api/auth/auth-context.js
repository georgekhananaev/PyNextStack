import React, {createContext, useContext, useEffect, useState} from 'react';
import Cookies from 'js-cookie';
import {getProfile, logout as apiLogout} from "@/api/endpoints";

// Create a context for auth-related data and operations.
const AuthContext = createContext();

// Custom hook to use the auth context in other components.
export const useAuth = () => useContext(AuthContext);

// AuthProvider component that wraps the application and provides auth state.
export const AuthProvider = ({children}) => {
    // State for the access token.
    const [accessToken, setAccessToken] = useState(null);
    // State for the user profile object.
    const [userProfile, setUserProfile] = useState(null);
    // State to track if the user is authenticated.
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    // State to track if the auth-related data is still loading.
    const [isLoading, setIsLoading] = useState(true);

    // Effect that runs once on component mount.
    useEffect(() => {
        // Function to check for an existing session and set auth state.
        const checkForExistingSession = async () => {
            // Attempt to retrieve the access token from cookies.
            const storedToken = Cookies.get('accessToken');
            if (storedToken) {
                // If a token is found, attempt to fetch the user profile.
                setAccessToken(storedToken);
                try {
                    const profile = await getProfile(storedToken);
                    if (profile) {
                        // If a profile is successfully fetched, update auth state.
                        setUserProfile(profile);
                        setIsAuthenticated(true);
                    } else {
                        // If no profile is returned, consider the user unauthenticated.
                        setIsAuthenticated(false);
                        Cookies.remove('accessToken');
                    }
                } catch (error) {
                    // Handle any errors during profile fetch.
                    console.error("Error fetching user profile:", error);
                    setIsAuthenticated(false);
                    Cookies.remove('accessToken');
                }
            } else {
                // If no token is found, set the user as unauthenticated.
                setIsAuthenticated(false);
            }
            // Indicate that loading of auth data is complete.
            setIsLoading(false);
        };

        // Invoke the session check function.
        checkForExistingSession();
    }, []);

    // Function to handle user logout.
    const logout = async () => {
        if (accessToken) {
            try {
                // Attempt to call the API's logout endpoint.
                await apiLogout(accessToken);
            } catch (error) {
                // Handle any errors during logout.
                console.error('Error during logout:', error);
            }
        }
        // Clear auth state and remove the token cookie.
        setIsAuthenticated(false);
        setAccessToken(null);
        setUserProfile(null);
        Cookies.remove('accessToken');
        setIsLoading(false);
    };

    // Function to handle setting the access token.
    const value = {
        accessToken,
        setAccessToken: (token) => {
            // Store the token in cookies.
            Cookies.set('accessToken', token, {expires: 1, secure: true, sameSite: 'strict'});
            // Update the access token state.
            setAccessToken(token);
            setIsAuthenticated(true); // Assume authentication is successful.
            // Attempt to fetch the user profile with the new token.
            getProfile(token).then(profile => {
                setUserProfile(profile);
                setIsAuthenticated(true); // Confirm authentication.
            }).catch(error => {
                // Handle any errors during profile fetch.
                console.error("Error setting access token and fetching profile:", error);
                setIsAuthenticated(false);
                setUserProfile(null); // Clear user profile on error.
            });
        },
        isAuthenticated,
        setIsAuthenticated,
        userProfile,
        isLoading,
        logout,
    };

    // Provide the auth context to child components.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
