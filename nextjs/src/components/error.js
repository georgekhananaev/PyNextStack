// components/ErrorDisplay.js
import React from 'react';
import {Alert, AlertTitle, Box, Container, Typography} from '@mui/material';

const ErrorDisplay = ({message}) => {
    return (
        <Container component="main" maxWidth="xs" sx={{mt: 8}}>
            <Box display="flex" flexDirection="column" alignItems="center">
                {/*<ErrorOutlineIcon sx={{ fontSize: 60, color: 'error.main' }} />*/}
                <Alert severity="error" sx={{mt: 2, mb: 1, width: '100%'}}>
                    <AlertTitle>Error</AlertTitle>
                    <Typography variant="body2">{message}</Typography>
                </Alert>
            </Box>
        </Container>
    );
};

export default ErrorDisplay;
