import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh', // This will take the full height of the viewport
            }}
        >
            <CircularProgress/>
        </Box>
    );
};

export default Loading;
