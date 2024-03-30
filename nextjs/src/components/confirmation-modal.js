import React, {useState} from 'react';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const keyframes = `
@keyframes gentleZoomIn {
    from { transform: translate(-50%, -50%) scale(0.5); }
    to { transform: translate(-50%, -50%) scale(1); }
}

@keyframes gentleZoomOut {
    from { transform: translate(-50%, -50%) scale(1); }
    to { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
}
`;

const modalStyle = (animation) => ({
    position: 'absolute',
    top: '30%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 340,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    p: 4,
    transformOrigin: 'center',
    animation: animation,
});

const ConfirmModal = ({
                          onConfirm,
                          confirmButtonName,
                          buttonName,
                          buttonSize = 'auto',
                          buttonVariant = 'contained',
                          confirmationText,
                          title,
                          margin,
                          color,
                          disabledButton = false,
                          icon = null, // New prop for the icon
                          iconPosition = 'start' // New prop for the icon position
                      }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [animation, setAnimation] = useState('');

    const handleClose = () => {
        // Start the zoom-out animation
        setAnimation('gentleZoomOut 0.3s ease-out forwards');
        // Close the modal after the animation finishes
        setTimeout(() => {
            setIsOpen(false);
            // Reset animation to none
            setAnimation('');
        }, 500); // Duration of zoom-out animation
    };

    const handleOpen = () => {
        setIsOpen(true);
        // Apply the zoom-in effect when opening
        setAnimation('gentleZoomIn 0.3s ease-out forwards');
    };

    const buttonProps = {
        ...(iconPosition === 'start' && {startIcon: icon}),
        ...(iconPosition === 'end' && {endIcon: icon}),
    };

    return (
        <Box>
            <style>{keyframes}</style>
            <Button disabled={disabledButton}
                    size={buttonSize}
                    variant={buttonVariant}
                    {...buttonProps}
                    color={color}
                    sx={{m: margin}}
                    onClick={handleOpen}>
                {disabledButton ? "In progress..." : buttonName || "Button"}
            </Button>

            <Modal open={isOpen}
                   onClose={handleClose}>
                <Box sx={modalStyle(animation)}>
                    <Typography variant="h6"
                                component="h2"
                                gutterBottom>
                        {title}
                    </Typography>
                    <Typography variant="body2"
                                color="text.secondary"
                                paragraph>
                        {confirmationText}
                    </Typography>
                    <Box mt={2}
                         display="flex"
                         justifyContent="space-between">
                        <Button
                            variant="outlined"
                                color="error"
                                onClick={() => {
                                    handleClose();
                                }}>
                            Cancel
                        </Button>
                        <Button variant="contained"
                                color="primary"
                                onClick={() => {
                                    onConfirm();
                                    handleClose();
                                }}>
                            {confirmButtonName || "Confirm"}
                        </Button>
                    </Box>
                </Box>
            </Modal>
        </Box>
    );
};

export default ConfirmModal;
