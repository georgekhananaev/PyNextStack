import React, {useEffect} from 'react';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import Zoom from '@mui/material/Zoom';

const ScrollToTop = ({children}) => {
    // Function to check if the page is scrolled down
    // The threshold value has been set to 10 to make the button appear earlier than only at the bottom
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 300, // This value determines when the button becomes visible as you scroll down
    });

    // Function to handle the scroll to top action
    const handleClick = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    // Listen for scroll events to potentially show the button
    useEffect(() => {
        const handleScroll = () => {
            // This logic is handled by `useScrollTrigger`, so no additional logic is added here
            // Keeping this might hint at potential future use or modifications
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {children}
            <Zoom in={trigger}>
                <div onClick={handleClick} role="presentation"
                     style={{position: 'fixed', bottom: 20, right: 20, zIndex: 1000}}>
                    <IconButton size="large" aria-label="scroll back to top" color="primary">
                        <KeyboardArrowUpIcon/>
                    </IconButton>
                </div>
            </Zoom>
        </>
    );
};

export default ScrollToTop;
