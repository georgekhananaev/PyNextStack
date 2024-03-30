// ChatComponent.js
import React, {useEffect, useRef, useState} from 'react';
import {
    AppBar,
    Box,
    Button,
    Card,
    CircularProgress,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    Select,
    Tab,
    Tabs,
    TextField,
    Toolbar,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {useAuth} from '@/api/auth/auth-context';
import {fetchChatResponse} from "@/api/endpoints";

const saveChatsToCache = (chats) => {
    localStorage.setItem('chatConversations', JSON.stringify(chats));
};

const loadChatsFromCache = () => {
    const cachedChats = JSON.parse(localStorage.getItem('chatConversations'));
    return cachedChats || [];
};

const ChatComponent = () => {
    const {accessToken} = useAuth();
    const [message, setMessage] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [chats, setChats] = useState(loadChatsFromCache());
    const [model, setModel] = useState('gpt-3.5-turbo');
    const [isTyping, setIsTyping] = useState(false);
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: "smooth"});
    }, [chats[activeTab]?.history]);

    useEffect(() => {
        saveChatsToCache(chats);
    }, [chats]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        // Check if there are no open tabs/conversations and open a new one if needed
        if (chats.length === 0) {
            handleNewConversation(); // This creates a new conversation
            await new Promise(resolve => setTimeout(resolve, 0)); // Allow state to update
        }

        const response = await fetchChatResponse(message, accessToken, model);

        // Initialize with empty answer in the appropriate conversation
        // This might not be necessary if you're updating the chat in the interval below
        // But included here to ensure there's an initial state to update
        setChats(currentChats => {
            const updatedChats = [...currentChats];
            if (!updatedChats[activeTab]) { // Ensure there's a tab to update
                updatedChats.push({history: [], model});
            }
            updatedChats[activeTab].history.push({question: message, answer: ""});
            return updatedChats;
        });

        setIsTyping(true); // Begin typing effect

        let typedResponse = "";
        const fullResponse = response.message;
        let index = 0;

        const typingInterval = setInterval(() => {
            if (index < fullResponse.length) {
                typedResponse += fullResponse.charAt(index++);
                // Update the last message's answer in the chat history with typedResponse
                setChats(currentChats => {
                    const updatedChats = [...currentChats];
                    const lastMessageIndex = updatedChats[activeTab].history.length - 1;
                    updatedChats[activeTab].history[lastMessageIndex].answer = typedResponse;
                    return updatedChats;
                });
            } else {
                clearInterval(typingInterval);
                setIsTyping(false); // Stop typing effect after the last character
            }
        }, 10); // Adjust typing speed if necessary

        setMessage('');
    };


    const handleNewConversation = () => {
        const newConversation = {history: [], model};
        setChats(currentChats => currentChats.length >= 20 ? [...currentChats.slice(1), newConversation] : [...currentChats, newConversation]);
        setActiveTab(chats.length >= 20 ? 19 : chats.length);
    };

    const handleChangeModel = (event) => {
        setModel(event.target.value);
    };

    const handleDeleteChat = (index) => {
        setChats(currentChats => currentChats.filter((_, idx) => idx !== index));
        if (index === activeTab || index < activeTab) {
            setActiveTab(prev => prev > 0 ? prev - 1 : 0);
        }
    };

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
                        Chat Interface
                    </Typography>
                    <FormControl variant="standard" sx={{m: 1, minWidth: 120}}>
                        <InputLabel id="model-select-label">Model</InputLabel>
                        <Select
                            labelId="model-select-label"
                            id="model-select"
                            value={model}
                            onChange={handleChangeModel}
                            label="Model"
                        >
                            <MenuItem value="gpt-3.5-turbo">3.5</MenuItem>
                            <MenuItem value="gpt-4">4</MenuItem>
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="inherit" onClick={handleNewConversation} sx={{ml: 3}}>New
                        Conversation</Button>

                </Toolbar>
            </AppBar>
            <Grid container spacing={2}>
                <Grid item xs={3}>
                    <Card sx={{mt: 1, height: '70vh', overflow: 'auto'}}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={activeTab}
                            onChange={(event, newValue) => setActiveTab(newValue)}
                            aria-label="Chat tabs"
                            sx={{borderRight: 1, borderColor: 'divider'}}
                        >
                            {chats.map((chat, index) => (
                                <Tab
                                    label={`Conversation ${index + 1} (model ${chat.model?.replace('gpt-', '') || 'unknown'})`}
                                    key={index}
                                    icon={
                                        <IconButton onClick={() => handleDeleteChat(index)} size="small">
                                            <CloseIcon fontSize="inherit"/>
                                        </IconButton>
                                    }
                                    iconPosition="end"
                                />
                            ))}
                        </Tabs>
                    </Card>
                </Grid>
                <Grid item xs={9}>
                    <Card sx={{mt: 1, height: '70vh', display: 'flex', flexDirection: 'column'}}>
                        <List sx={{overflow: 'auto', flexGrow: 1}}>
                            {chats[activeTab]?.history.map((entry, index) => (
                                <ListItem key={index}>
                                    <ListItemText primary={`You: ${entry.question}`}
                                                  secondary={`ChatGPT: ${entry.answer}`}/>
                                </ListItem>
                            ))}
                            {isTyping && <CircularProgress sx={{alignSelf: 'center', m: 1}}/>}
                            <div ref={bottomRef}/>
                        </List>
                        <Box sx={{display: 'flex', p: 1}}>
                            <TextField
                                fullWidth
                                label="Your question"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                variant="outlined"
                                margin="normal"
                            />
                            <Button onClick={handleSendMessage} variant="contained" color="primary"
                                    sx={{mt: 2, mb: 1, ml: 1}}>
                                Send
                            </Button>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </>
    );
};

export default ChatComponent;
