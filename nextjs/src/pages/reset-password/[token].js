import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';
import {useMutation} from 'react-query';
import toast, {Toaster} from 'react-hot-toast';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    IconButton,
    InputAdornment,
    TextField,
    Tooltip,
    Typography
} from '@mui/material';
import LockResetIcon from '@mui/icons-material/LockReset';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import {styled} from '@mui/material/styles';
import {postResetPassword} from "@/api/endpoints";

const StyledCard = styled(Card)(({theme}) => ({
    maxWidth: 400,
    margin: 'auto',
    marginTop: theme.spacing(10),
    padding: theme.spacing(2),
}));

export default function ResetPasswordPage() {
    const router = useRouter();
    const {token} = router.query;

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validatePassword = () => {
        if (newPassword.length < 8 || !/\d/.test(newPassword) || !/[a-zA-Z]/.test(newPassword)) {
            setPasswordError('Password must be at least 8 characters long and include letters and numbers.');
            return false;
        } else if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    useEffect(() => {
        const strength = calculatePasswordStrength(newPassword);
        setPasswordStrength(strength);
    }, [newPassword]);

    const calculatePasswordStrength = (password) => {
        return password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    };

    const mutation = useMutation(async (newPassword) => {
        return postResetPassword({token, newPassword});
    }, {
        onSuccess: () => {
            setIsSubmitting(false);
            toast.success('Password reset successfully. You will be redirected to login.');
            setTimeout(() => {
                router.push('/login');
            }, 1000); // Adjust the redirect timing if needed
        },
        onError: (error) => {
            setIsSubmitting(false);
            console.error('Failed to reset password:', error);
            toast.error('Failed to reset the password. Please try again or contact support if the problem persists.');
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validatePassword()) {
            setIsSubmitting(true);
            mutation.mutate(newPassword);
        }
    };

    return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh" flexDirection="column">
            <Toaster position="bottom-right"/>
            <StyledCard>
                <CardContent>
                    <Typography variant="h5" component="h2" gutterBottom>
                        <LockResetIcon/> Reset Your Password
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            margin="normal"
                            id="newPassword"
                            label="New Password"
                            type="password"
                            fullWidth
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            error={!!passwordError}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {newPassword && (
                                            <Tooltip
                                                title={passwordStrength ? "Password strength: Strong" : "Password strength: Weak"}>
                                                <IconButton disabled>
                                                    {passwordStrength ?
                                                        <CheckCircleOutlineIcon style={{color: 'green'}}/> :
                                                        <ErrorOutlineIcon style={{color: 'red'}}/>}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            margin="normal"
                            id="confirmPassword"
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!passwordError}
                            helperText={passwordError}
                            required
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {confirmPassword && (
                                            <Tooltip
                                                title={newPassword === confirmPassword ? "Passwords match" : "Passwords do not match"}>
                                                <IconButton disabled>
                                                    {newPassword === confirmPassword ?
                                                        <CheckCircleOutlineIcon style={{color: 'green'}}/> :
                                                        <ErrorOutlineIcon style={{color: 'red'}}/>}
                                                </IconButton>
                                            </Tooltip>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box textAlign="center" marginTop={2}>
                            <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                {isSubmitting ? <CircularProgress size={24}/> : 'Reset Password'}
                            </Button>
                        </Box>
                    </form>
                </CardContent>
            </StyledCard>
        </Box>
    );
}
