import React, {useEffect, useRef, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Switch,
    TextField
} from '@mui/material';
import {initialUser} from "@/sections/users/users-table";

const modalStyle = (animation) => ({
    animation: animation,
    position: 'fixed', // Keeping it as 'fixed' to stay consistent with your needs
    top: '40%',
    left: '50%',
    margin: 0,
    transform: 'translate(-50%, -50%)',
    width: '400px', // Adjusted to 'auto' for better responsiveness. Consider setting a maxWidth if necessary.
    // maxWidth: '100%', // Ensuring the dialog does not exceed the viewport width
    overflow: 'hidden', // Ensuring content does not overflow causing unexpected shifts
});

function UserDialog({open, setOpen, user, onSave}) {
    const [formData, setFormData] = useState({...initialUser, disabled: false});
    const [errors, setErrors] = useState({});
    const [animation, setAnimation] = useState('');

    const usernameInputRef = useRef(null);

    useEffect(() => {
        if (user) setFormData({...user, disabled: user.disabled ?? false});
    }, [user]);

    useEffect(() => {
        if (open) {
            // Apply the zoom-in effect when opening
            setAnimation('gentleZoomIn 0.3s ease-out forwards');
            // This timeout ensures the focus call happens after the dialog is fully open
            setTimeout(() => {
                usernameInputRef.current?.focus();
            }, 100);
        } else {
            // Start the zoom-out animation
            setAnimation('gentleZoomOut 0.3s ease-out forwards');
        }
    }, [open]);

    // Validation function
    const validate = () => {
        let tempErrors = {};
        tempErrors.username = formData.username ? '' : 'Username is required.';
        tempErrors.email = formData.email ? '' : 'Email is required.';
        tempErrors.full_name = formData.full_name ? '' : 'Full name is required.';
        // tempErrors.password = formData.password ? '' : 'Password is required.';
        tempErrors.role = formData.role ? '' : 'Role is required.';
        setErrors(tempErrors);

        return Object.values(tempErrors).every(x => x === "");
    };

    const handleSave = () => {
        if (validate()) {
            onSave(formData);
            setOpen(false);
            setFormData({...initialUser, disabled: false});
            setErrors({});
        }
    };

    const handleChange = e => {
        const {name, value, checked, type} = e.target;
        setFormData({...formData, [name]: type === 'checkbox' ? checked : value});
    };

    return (
        <Dialog
            open={open}
            onClose={() => setOpen(false)}
            PaperProps={{
                style: modalStyle(animation), // Applying the modal style here
            }}
        >
            <DialogTitle>{user.username === "" ? 'Add New User' : 'Edit User'}</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    name="username"
                    label="Username"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.username}
                    onChange={handleChange}
                    error={!!errors.username}
                    helperText={errors.username}
                    inputRef={usernameInputRef}
                />
                <TextField
                    margin="dense"
                    name="email"
                    label="Email"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                />
                <TextField
                    margin="dense"
                    name="full_name"
                    label="Full Name"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.full_name}
                    onChange={handleChange}
                    error={!!errors.full_name}
                    helperText={errors.full_name}
                />
                <TextField
                    margin="dense"
                    name="password"
                    label="Password"
                    type="password"
                    fullWidth
                    variant="outlined"
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Role</InputLabel>
                    <Select
                        disabled={formData.role === "owner"}
                        name="role"
                        value={formData.role}
                        label="Role"
                        onChange={handleChange}
                        error={!!errors.role}
                    >
                        <MenuItem value="user">User</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="owner">Owner</MenuItem>
                    </Select>
                </FormControl>
                <FormControlLabel
                    control={<Switch checked={formData.disabled} onChange={handleChange} name="disabled"/>}
                    label="Disabled"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
            </DialogActions>
        </Dialog>
    );
}

export default UserDialog;
