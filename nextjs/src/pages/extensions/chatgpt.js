import ChatComponent from "@/sections/extensions/chat-gpt/chat-component";
import useAuthenticatedRoute from "@/hooks/use-authenticated-route";
import {Typography} from "@mui/material";
import React from "react";

function ChatGpt() {
    return (
        <>
            <Typography component="h1" variant="h4" gutterBottom>
                ChatGPT
            </Typography>
            <ChatComponent/>
        </>
    );
}


export default useAuthenticatedRoute(ChatGpt);