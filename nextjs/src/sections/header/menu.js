import React, {useState} from "react";
import {
    AppBar,
    Box,
    Button,
    CssBaseline,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import {useRouter} from "next/router";

import {useAuth} from "@/api/auth/auth-context";
import {menuItems} from "@/sections/header/menu-items";
import {LogoIcon} from "@/theme/menu-icons";
import {SettingsButton} from "@/sections/header/buttons/settings-button";

export default function Menu({title, subtitle}) {
    const {isAuthenticated} = useAuth();
    const router = useRouter();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [dropdownAnchorEl, setDropdownAnchorEl] = useState(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleClick = (path) => {
        router.push(path);
        closeDropdown(); // Ensure dropdown closes on click
    };

    const handleDesktopMenuItemClick = (event, item) => {
        if (item.subItems) {
            setDropdownAnchorEl(dropdownAnchorEl === event.currentTarget ? null : event.currentTarget);
        } else {
            handleClick(item.path);
        }
    };

    const closeDropdown = () => {
        setDropdownAnchorEl(null);
    };

    const filteredNavItems = menuItems.filter(
        (item) => item.authenticated === null || item.authenticated === isAuthenticated
    );

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{pt: 8}}>
            <List>
                {filteredNavItems.map((item, index) => (
                    <React.Fragment key={index}>
                        <ListItem button onClick={() => handleClick(item.path)}>
                            <ListItemText primary={item.label}/>
                        </ListItem>
                        {item.subItems && (
                            item.subItems.map((subItem, subIndex) => (
                                <ListItem button key={`sub-${subIndex}`} onClick={() => handleClick(subItem.path)}
                                          sx={{pl: 4}}>
                                    <ListItemText primary={subItem.label}/>
                                </ListItem>
                            ))
                        )}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );

    return (
        <>
            <CssBaseline/>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <Toolbar>
                    <Box sx={{my: 1, cursor: 'pointer'}} onClick={() => router.push('/')}>
                        <LogoIcon width={isMobile ? 36 : 48} height={isMobile ? 36 : 48} />

                    </Box>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1, ml: 2, cursor: 'pointer'}}
                                onClick={() => router.push('/')}>
                        {title}
                        <Typography variant="caption" display="block" sx={{color: 'inherit'}}>
                            {subtitle}
                        </Typography>
                    </Typography>
                    {isMobile ? (
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{mr: 2, display: {md: 'none'}}}
                        >
                            <MenuIcon/>
                        </IconButton>
                    ) : (
                        filteredNavItems.map((item, index) => (
                            <Button
                                key={index}
                                color="inherit"
                                onClick={(event) => handleDesktopMenuItemClick(event, item)}
                                sx={{color: 'inherit', mr: 2}}
                                startIcon={item.icon}
                            >
                                {item.label}
                                {item.subItems && (dropdownAnchorEl ? <ExpandLessIcon/> : <ExpandMoreIcon/>)}
                                {item.subItems && dropdownAnchorEl && (
                                    <Box
                                        sx={{
                                            position: "absolute",
                                            top: "100%",
                                            left: 0,
                                            zIndex: 1,
                                            backgroundColor: "background.paper",
                                            boxShadow: 3,
                                            marginTop: 0.1,
                                            borderRadius: 1,
                                            minWidth: "100%"
                                        }}
                                        onMouseLeave={closeDropdown} // Close dropdown when mouse leaves
                                    >
                                        {item.subItems.map((subItem, subIndex) => (
                                            <ListItem button onClick={() => handleClick(subItem.path)}>
                                                <ListItemIcon sx={{
                                                    minWidth: 'auto',
                                                    mr: 1
                                                }}> {/* Adjust marginRight to control space */}
                                                    {subItem.icon}
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={subItem.label}
                                                    primaryTypographyProps={{style: {textTransform: 'none'}}}
                                                    sx={{margin: 0}} // Optionally adjust text margin
                                                />
                                            </ListItem>
                                        ))}
                                    </Box>
                                )}
                            </Button>
                        ))
                    )}
                    {isAuthenticated && (
                        <SettingsButton/>
                    )}
                </Toolbar>
            </AppBar>
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{keepMounted: true}}
                sx={{
                    display: {xs: "block", md: "none"},
                    "& .MuiDrawer-paper": {boxSizing: "border-box", width: 240},
                }}
            >
                {drawer}
            </Drawer>
            <Box component="div" sx={{height: 64}}/>
        </>
    );
}
