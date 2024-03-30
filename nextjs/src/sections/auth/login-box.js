import React, {useState} from 'react';
import {Box, Button, Container, TextField, Typography} from '@mui/material';
import {useAuth} from "@/api/auth/auth-context";
import toast from "react-hot-toast";
import {useRouter} from "next/router";
import {getToken} from "@/api/endpoints";
import ForgotPasswordModal from "@/sections/auth/forgot-password";
import RegistrationModal from "@/sections/auth/registration";

export default function LoginBox() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const {setAccessToken, setIsAuthenticated} = useAuth();
    const router = useRouter();

    // State for managing modal visibility
    const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
    const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const data = await getToken(username, password);
            if (data.access_token) {
                setAccessToken(data.access_token);
                setIsAuthenticated(true);
                toast.success('Login successful!');
                await router.push('/dashboard');
            } else {
                toast.error('Login succeeded, but no access token was returned.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    // Handle incorrect credentials
                    toast.error(error.response.data.detail || 'Incorrect username or password.');
                } else if (error.response.status === 503) {
                    // Handle server down scenario
                    toast.error('Service temporarily unavailable. Please try again later.');
                } else {
                    // Handle other errors
                    toast.error(`An error occurred: ${error.response.status}`);
                }
            } else if (error.request) {
                // The request was made but no response was received
                toast.error('The server is not responding. Please check your internet connection or try again later.');
            } else {
                // Something happened in setting up the request that triggered an Error
                toast.error('An error occurred during login. Please try again.');
            }
        }
    };

    return (
        <Container component="main" maxWidth="sm">
            <Box
                sx={{
                    marginTop: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    backgroundColor: '#333',
                    padding: '40px',
                    borderRadius: '8px',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                }}
            >
                <Typography component="h1" variant="h5" style={{color: '#fff', marginBottom: '20px'}}>
                    Sign in
                </Typography>
                <Box component="form" noValidate sx={{mt: 3, mb: 2, width: '100%'}} onSubmit={handleLogin}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        variant="outlined"
                        color="primary"
                        onChange={(e) => setUsername(e.target.value)}
                        InputProps={{style: {color: '#fff'}}}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        variant="outlined"
                        color="primary"
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{style: {color: '#fff'}}}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2, backgroundColor: '#1976d2'}}
                    >
                        Sign In
                    </Button>
                    <Button
                        sx={{mt: 1}}
                        color="secondary"
                        fullWidth
                        onClick={() => setIsForgotPasswordOpen(true)}
                    >
                        Forgot Password?
                    </Button>
                    <Button
                        sx={{mt: 1}}
                        color="secondary"
                        fullWidth
                        onClick={() => setIsRegistrationOpen(true)}
                    >
                        Don't have an account? Register
                    </Button>
                </Box>
            </Box>
            <ForgotPasswordModal open={isForgotPasswordOpen} handleClose={() => setIsForgotPasswordOpen(false)}/>
            <RegistrationModal open={isRegistrationOpen} handleClose={() => setIsRegistrationOpen(false)}/>
        </Container>
    );
}
