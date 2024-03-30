import React from "react";
import useAuthenticatedRoute from "@/hooks/use-authenticated-route";
import {Typography} from "@mui/material";
import {MessagesSettings} from "@/sections/settings/messages-settings";

function Settings() {
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>
                Settings
            </Typography>
            <MessagesSettings/>
        </>
    );
}

export default useAuthenticatedRoute(Settings);
