import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    TextField,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import toast from "react-hot-toast";
import {useMutation} from "react-query";
import {postRegister} from "@/api/endpoints";

export default function RegistrationModal({open, handleClose}) {
    const [userData, setUserData] = useState({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [captcha, setCaptcha] = useState('');
    const [userCaptchaInput, setUserCaptchaInput] = useState('');

    useEffect(() => {
        // Function to generate a simple captcha
        const generateCaptcha = () => {
            let result = '';
            let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let charactersLength = characters.length;
            for (let i = 0; i < 5; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        };

        setCaptcha(generateCaptcha());
    }, []);

    const handleChange = (e) => {
        setUserData({...userData, [e.target.name]: e.target.value});
    };

    const registrationMutation = useMutation(postRegister, {
        onSuccess: (data) => {
            toast.success("Successfully registered!");
            handleClose();
        },
        onError: (error) => {
            console.error('There was a problem with the registration:', error);
            toast.error("Registration failed. Please try again.");
        },
    });

    const handleRegister = () => {
        if (userData.password !== userData.confirmPassword) {
            toast.error('Passwords do not match!');
            return;
        }
        if (userCaptchaInput !== captcha) {
            toast.error('Captcha does not match!');
            // Consider regenerating captcha or handling this scenario appropriately
            return;
        }

        registrationMutation.mutate(userData);
    };

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>
                Register
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <TextField
                    autoFocus
                    margin="dense"
                    id="fullName"
                    label="Full Name"
                    type="text"
                    fullWidth
                    name="fullName"
                    variant="outlined"
                    value={userData.fullName}
                    onChange={handleChange}
                    sx={{mb: 2}}
                />
                <TextField
                    margin="dense"
                    id="username"
                    label="Username"
                    type="text"
                    fullWidth
                    name="username"
                    variant="outlined"
                    value={userData.username}
                    onChange={handleChange}
                    sx={{mb: 2}}
                />
                <TextField
                    margin="dense"
                    id="email"
                    label="Email Address"
                    type="email"
                    fullWidth
                    name="email"
                    variant="outlined"
                    value={userData.email}
                    onChange={handleChange}
                    sx={{mb: 2}}
                />
                <TextField
                    margin="dense"
                    id="password"
                    label="Password"
                    type="password"
                    fullWidth
                    name="password"
                    variant="outlined"
                    value={userData.password}
                    onChange={handleChange}
                    sx={{mb: 2}}
                />
                <TextField
                    margin="dense"
                    id="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    name="confirmPassword"
                    variant="outlined"
                    value={userData.confirmPassword}
                    onChange={handleChange}
                    sx={{mb: 2}}
                />
                <Typography variant="caption" display="block" gutterBottom>
                    Captcha: {captcha}
                </Typography>
                <TextField
                    margin="dense"
                    id="userCaptchaInput"
                    label="Enter Captcha"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={userCaptchaInput}
                    onChange={(e) => setUserCaptchaInput(e.target.value)}
                    sx={{mb: 2}}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" color="inherit">Cancel</Button>
                <Button onClick={handleRegister} variant="contained" color="primary">Register</Button>
            </DialogActions>
        </Dialog>
    );
}
