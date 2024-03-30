import React from 'react';
import SettingsIcon from '@mui/icons-material/Settings';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Popover from '@mui/material/Popover';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import {useRouter} from 'next/router';
import {useAuth} from "@/api/auth/auth-context";
import {usePopover} from "@/hooks/use-popover";
import LogoutButton from "@/sections/auth/logout";

const SettingsPopover = ({anchorEl, onClose, open}) => {
    const {userProfile} = useAuth();
    const router = useRouter();

    return (
        <Popover
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            onClose={onClose}
            open={open}
            PaperProps={{sx: {width: 200}}}
        >
            <Box sx={{p: 2}}>
                <Typography variant="body1">{userProfile?.full_name}</Typography>
                <Typography color="text.secondary" variant="body2">
                    {userProfile?.email}
                </Typography>
            </Box>
            <Divider/>
            <Box sx={{p: 1}}>
                <ListItemButton
                    onClick={() => {
                        onClose();
                        router.push('/settings');
                    }}
                    sx={{
                        borderRadius: 1,
                        px: 1,
                        py: 0.5,
                    }}
                >
                    <ListItemIcon>
                        <SettingsIcon fontSize="small"/>
                    </ListItemIcon>
                    <ListItemText primary="Settings"/>
                </ListItemButton>
            </Box>
            <Divider sx={{my: '0 !important'}}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    p: 1,
                }}
            >
                <LogoutButton/>
            </Box>
        </Popover>
    );
};

export const SettingsButton = () => {
    const popover = usePopover();

    return (
        <>
            <Box
                component={ButtonBase}
                onClick={popover.handleOpen}
                ref={popover.anchorRef}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 48,
                    height: 48,
                }}
            >
                <Avatar color="white" sx={{width: 36, height: 36}}>
                    <SettingsIcon sx={{color: 'white'}}/>
                </Avatar>
            </Box>
            <SettingsPopover
                anchorEl={popover.anchorRef.current}
                onClose={popover.handleClose}
                open={popover.open}
            />
        </>
    );
};
