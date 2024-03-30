import {useCallback, useRef, useState} from 'react';

export const usePopover = () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);

    const handleOpen = useCallback((event) => {
        // Set the current button as the anchor element for the popover
        anchorRef.current = event.currentTarget;
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    return {
        open,
        setOpen,
        anchorRef,
        handleOpen,
        handleClose
    };
};
