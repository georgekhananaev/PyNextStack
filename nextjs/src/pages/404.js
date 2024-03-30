import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from 'next/link';

const Custom404 = () => {
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80vh',
                textAlign: 'center',
            }}
        >
            <Typography variant="h4" component="h1" gutterBottom>
                404 - Page Not Found
            </Typography>
            <Typography variant="subtitle1">
                Oops! The page you are looking for has disappeared.
            </Typography>
            <Box mt={4}>
                <Link href="/" passHref>
                    <Button variant="contained" color="primary">
                        Go back home
                    </Button>
                </Link>
            </Box>
        </Box>
    );
};

export default Custom404;
