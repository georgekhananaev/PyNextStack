import {Box, Card, CardContent, IconButton, List, ListItem, ListItemText, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import WarpEffect from "@/components/warp-effects";
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import Link from "next/link";

const sections = [
    {title: "Overview", id: "overview"},
    {title: "Key Features", id: "key-features"},
    {title: "Technologies Used", id: "technologies-used"},
    {title: "Getting Started", id: "getting-started"},
    {title: "Installation", id: "installation"},
    {title: "Usage", id: "usage"},
    {title: "Security Practices", id: "security-practices"},
    {title: "License", id: "license"},
    {title: "Credits", id: "credits"},
];

const Home = () => {
    const [isClient, setIsClient] = useState(false);
    const [activeSection, setActiveSection] = useState("");

    const handleCopyClick = (text) => {
        navigator.clipboard.writeText(text)
            .then()
            .catch((error) => console.error('Failed to copy text: ', error));
    };

    useEffect(() => {
        setIsClient(true);
    }, []);

    const scrollToSection = (id) => {
        setActiveSection(id); // Set the active section for styling
        const element = document.getElementById(id);
        if (element) {
            const offset = 200; // Height of the floating navigation bar + extra space
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <Box>
            <List component="nav" aria-label="Readme sections" sx={{width: '100%'}}>
                {sections.map((section, index) => (
                    <ListItem
                        key={section.id}
                        button
                        onClick={() => scrollToSection(section.id)}
                        sx={{
                            py: 0.5,
                            px: 2,
                            minHeight: 32,
                            backgroundColor: section.id === activeSection ? "primary.dark" : "inherit",
                            color: section.id === activeSection ? "primary.contrastText" : "inherit",
                            '&:hover': {
                                backgroundColor: section.id === activeSection ? "primary.dark" : "",
                                '.MuiListItemText-primary': {
                                    color: section.id === activeSection ? "inherit" : "secondary.main",
                                },
                            },
                            '.MuiListItemText-primary': {
                                fontSize: '0.875rem',
                            },
                        }}
                    >
                        <ListItemText primary={`${index + 1}. ${section.title}`}/>
                    </ListItem>
                ))}
            </List>

            <Box mt={4}>
                {isClient && sections.map((section, index) => (
                    <Box key={section.id} mb={index !== sections.length - 1 ? 4 : 0}>
                        <Card elevation={3}>
                            <CardContent>
                                <Typography variant="h2" id={section.id}
                                            sx={{mb: 5, display: 'flex', alignItems: 'center'}}>
                                    {section.title}
                                    {section.id === activeSection && (
                                        <WarpEffect effect={"fadeInRight"}>
                                            <ArrowLeftIcon color="primary" sx={{height: 35, width: 35, ml: 1}}/>
                                        </WarpEffect>
                                    )}
                                </Typography>
                                {/* README content starts here */}
                                {section.id === 'overview' && (
                                    <Typography paragraph>
                                        PyNextStack is a full-stack system utilizing FastAPI with asynchronous
                                        capabilities on the
                                        backend and Next.js for the frontend showcases the robustness of Python in
                                        server-side development. This architecture provides a scalable, efficient
                                        solution that leverages FastAPI's high performance and ease of use for creating
                                        APIs, alongside Next.js for a reactive and server-side rendered user interface.
                                        The asynchronous nature of the backend ensures non-blocking operation, enhancing
                                        the system's ability to handle high volumes of requests simultaneously, which is
                                        ideal for real-time applications. This combination offers a modern, full-stack
                                        framework that is both powerful and developer-friendly, demonstrating the
                                        versatility of Python in web development.
                                    </Typography>
                                )}
                                {/* Key Features section */}
                                {section.id === 'key-features' && (
                                    <div>
                                        <Typography paragraph>
                                            Key features of this system include:
                                        </Typography>
                                        <ul>
                                            <li>Secure user registration and authentication</li>
                                            <li>Profile management functionality</li>
                                            <li>Usage of JSON Web Tokens (JWT) for authentication</li>
                                            <li>Documentation access control</li>
                                        </ul>
                                    </div>
                                )}
                                {/* Technologies Used section */}
                                {section.id === 'technologies-used' && (
                                    <div>
                                        <Typography paragraph>
                                            Technologies used in this project include:
                                        </Typography>
                                        <ul>
                                            <li>React for the frontend</li>
                                            <li>Node.js and FastAPI for the backend</li>
                                            <li>Material-UI for styling</li>
                                            <li>JSON Web Tokens (JWT) for authentication</li>
                                            <li>MongoDB for the database</li>
                                            <li>Redis for rate limiting and token management</li>
                                            <li>Docker for containerization</li>
                                            <li>Python-JOSE for JWT operations</li>
                                            <li>SMTP libraries for email notifications</li>
                                        </ul>
                                    </div>
                                )}
                                {/* Getting Started section */}
                                {section.id === 'getting-started' && (
                                    <Box mt={4}>
                                        <Typography variant="h4" gutterBottom>
                                            Prerequisites
                                        </Typography>
                                        <Typography paragraph>
                                            Before you begin, ensure you have met the following requirements:
                                        </Typography>
                                        <Box ml={2}>
                                            <Typography color={"primary"} variant="h5" gutterBottom>
                                                Docker
                                            </Typography>
                                            <Typography paragraph>
                                                This project is containerized with Docker, making it necessary to have
                                                Docker Desktop (for Windows or Mac) or Docker Engine (for Linux)
                                                installed on your system.
                                            </Typography>
                                            <Typography paragraph>
                                                To install Docker, follow the instructions on the <Link
                                                href="https://www.docker.com/get-started" target="_blank"
                                                rel="noopener noreferrer">official Docker website</Link>.
                                            </Typography>
                                        </Box>
                                        <Box ml={2} mt={2}>
                                            <Typography color={"primary"} variant="h5" gutterBottom>
                                                Python
                                            </Typography>
                                            <Typography paragraph>
                                                The project requires the latest version of Python for certain local
                                                scripts and integrations.
                                            </Typography>
                                            <Typography paragraph>
                                                To install Python, visit the <Link
                                                href="https://www.python.org/downloads/" target="_blank"
                                                rel="noopener noreferrer">official Python website</Link> and download
                                                the latest version for your operating system.
                                                Ensure that Python is properly added to your system's PATH to allow for
                                                command-line execution.
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}

                                {/* Installation section */}

                                {section.id === 'installation' && (
                                    <>
                                        <Box sx={{my: 2, display: 'flex', justifyContent: 'center'}}>
                                            <iframe
                                                width="100%"
                                                height="615"
                                                src="https://www.youtube.com/embed/H2oYT-Ame9w"
                                                title="How to Install PyNextStack Tutorial"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        </Box>
                                        <Typography variant="h6" gutterBottom>
                                            1. Clone the Repository
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box sx={{flex: 1}}>
                                                <Box sx={{bgcolor: 'background.paper', borderRadius: 2, p: 2}}>
                    <pre>
                        <code>
                            git clone https://github.com/georgekhananaev/PyNextStack
                        </code>
                    </pre>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                onClick={() => handleCopyClick('git clone https://github.com/georgekhananaev/PyNextStack')}>
                                                <FileCopyIcon/>
                                            </IconButton>
                                        </Box>

                                        <Typography variant="h6" sx={{mt: 3}} gutterBottom>
                                            2. Create new file "chatgpt_credentials.env"
                                        </Typography>

                                        <Typography gutterBottom>
                                            In the root folder of the project:
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box sx={{flex: 1}}>
                                                <Box sx={{bgcolor: 'background.paper', borderRadius: 2, p: 2}}>
                                                    <pre>
                <code>
                    {`open_ai_organization=org-your_openai_key
open_ai_secret_key=sk-your_openai_key`}
                </code>
            </pre>
                                                </Box>
                                            </Box>
                                            <IconButton onClick={() => handleCopyClick(`open_ai_organization=org-your_openai_key
                                            open_ai_secret_key=sk-your_openai_key`)}>
                                                <FileCopyIcon/>
                                            </IconButton>

                                        </Box>

                                        <Typography variant="h6" sx={{mt: 3}} gutterBottom>
                                            3. Run generate_env & Docker Compose
                                        </Typography>

                                        <Typography gutterBottom>
                                            Linux/Mac:
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box sx={{flex: 1}}>
                                                <Box sx={{bgcolor: 'background.paper', borderRadius: 2, p: 2}}>
                    <pre>
                        <code>
                            python generate_env.py ; docker-compose build --no-cache ; docker-compose up -d
                        </code>
                    </pre>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                onClick={() => handleCopyClick('python generate_env.py ; docker-compose build --no-cache ; docker-compose up -d')}>
                                                <FileCopyIcon/>
                                            </IconButton>
                                        </Box>

                                        <Typography gutterBottom>
                                            Windows/CMD:
                                        </Typography>
                                        <Box sx={{display: 'flex', alignItems: 'center'}}>
                                            <Box sx={{flex: 1}}>
                                                <Box sx={{bgcolor: 'background.paper', borderRadius: 2, p: 2}}>
                    <pre>
                        <code>
                            python generate_env.py && docker-compose build --no-cache && docker-compose up -d
                        </code>
                    </pre>
                                                </Box>
                                            </Box>
                                            <IconButton
                                                onClick={() => handleCopyClick('python generate_env.py && docker-compose build --no-cache && docker-compose up -d')}>
                                                <FileCopyIcon/>
                                            </IconButton>
                                        </Box>

                                        <Typography sx={{mt: 3}}>
                                            Need more detailed instructions? Check on GitHub: <Link
                                            href="https://github.com/georgekhananaev/" target="_blank"
                                            rel="noopener noreferrer">
                                            https://github.com/georgekhananaev/
                                        </Link>
                                        </Typography>
                                    </>
                                )}


                                {/* Usage section */}
                                {section.id === 'usage' && (
                                    <>
                                        <Typography paragraph>
                                            This section provides guidelines on how to use the application:
                                        </Typography>
                                        <Typography variant="h5" gutterBottom>
                                            Frontend (Next.js):
                                        </Typography>
                                        <Typography paragraph>
                                            To start the frontend development server:
                                            <br/>
                                            1. Navigate to the project directory in your terminal.
                                            <br/>
                                            2. Run the command: <code>npm install</code> to install dependencies.
                                            <br/>
                                            3. After installing dependencies, run the command: <code>npm run
                                            dev</code> to start the development server.
                                            <br/>
                                            4. Access the frontend at <a href="http://localhost:3000" target="_blank"
                                                                         rel="noopener noreferrer">http://localhost:3000</a>.
                                        </Typography>
                                        <Typography variant="h5" gutterBottom>
                                            Backend (FastAPI):
                                        </Typography>
                                        <Typography paragraph>
                                            To start the FastAPI server:
                                            <br/>
                                            1. Ensure MongoDB and Redis servers are running.
                                            <br/>
                                            2. Set up environment variables as specified in the README.
                                            <br/>
                                            3. Run the command: <code>uvicorn app.main:app --host 0.0.0.0 --port 8000
                                            --reload</code> to start the FastAPI server.
                                            <br/>
                                            4. Access the API documentation at <a href="http://localhost:8000/docs"
                                                                                  target="_blank"
                                                                                  rel="noopener noreferrer">http://localhost:8000/docs</a>.
                                        </Typography>
                                        {/* Add any additional usage instructions here */}
                                    </>
                                )}

                                {/* Security Practices section */}
                                {section.id === 'security-practices' && (
                                    <Typography paragraph>
                                        This application implements advanced security practices including password
                                        hashing, token validation, rate limiting, and secure API documentation access.
                                    </Typography>
                                )}
                                {/* License section */}
                                {section.id === 'license' && (
                                    <Typography paragraph>
                                        <strong>MIT License</strong>
                                        <br/><br/>
                                        Copyright (c) 2024 George Khananaev
                                        <br/><br/>
                                        Permission is hereby granted, free of charge, to any person obtaining a copy
                                        of this software and associated documentation files (the "Software"), to deal
                                        in the Software without restriction, including without limitation the rights
                                        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
                                        copies of the Software, and to permit persons to whom the Software is
                                        furnished to do so, subject to the following conditions:
                                        <br/><br/>
                                        The above copyright notice and this permission notice shall be included in all
                                        copies or substantial portions of the Software.
                                        <br/><br/>
                                        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
                                        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
                                        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
                                        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
                                        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
                                        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
                                        SOFTWARE.
                                    </Typography>
                                )}
                                {/* Credits section */}
                                {section.id === 'credits' && (
                                    <>
                                        <Typography paragraph>
                                            Developed by George Khananaev.
                                        </Typography>
                                        <Typography paragraph>
                                            Thanks to the FastAPI, MongoDB, Redis, and Docker communities for support
                                            and resources.
                                        </Typography>
                                    </>
                                )}
                                {/* README content ends here */}
                            </CardContent>
                        </Card>
                        {index !== sections.length - 1 && <Box mt={2}/>} {/* Add spacing between cards */}
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

export default Home;
