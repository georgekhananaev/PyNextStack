import '@/styles/globals.css'
import React, {useCallback} from 'react';
import {Container, CssBaseline, ThemeProvider} from '@mui/material';
import Menu from "@/sections/header/menu";
import {menuItems} from "@/sections/header/menu-items";
import WrapperEffects from "@/components/warp-effects";
import {Toaster} from "react-hot-toast";
import Footer from "@/sections/footer/footer";
import {AuthProvider} from "@/api/auth/auth-context";
import {QueryClient, QueryClientProvider} from "react-query";
import {darkTheme} from "@/theme/dark-theme";
import {loadSlim} from "tsparticles-slim";
import {Particles} from "react-tsparticles";
import ScrollToTop from "@/components/scroll-top-top"; // if you are going to use `loadSlim`, install the "tsparticles-slim" package too.

const queryClient = new QueryClient();

function MyApp({Component, pageProps}) {
    const particlesInit = useCallback(async engine => {
        await loadSlim(engine);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ThemeProvider theme={darkTheme}>
                    <CssBaseline/>
                    <Toaster position="bottom-right" reverseOrder={false}/>
                    <Particles id="tsparticles" init={particlesInit} options={{
                        fpsLimit: 120,
                        interactivity: {
                            events: {
                                onClick: {
                                    enable: false,
                                    mode: "push",
                                },
                                onHover: {
                                    enable: false,
                                    mode: "repulse",
                                },
                                resize: true,
                            },
                            modes: {
                                push: {
                                    quantity: 4,
                                },
                                repulse: {
                                    distance: 200,
                                    duration: 0.4,
                                },
                            },
                        },
                        particles: {
                            color: {
                                value: "#ffffff",
                            },
                            links: {
                                color: "#ffffff",
                                distance: 150,
                                enable: true,
                                opacity: 0.1,
                                width: 1,
                            },
                            move: {
                                direction: "none",
                                enable: true,
                                outModes: {
                                    default: "bounce",
                                },
                                random: false,
                                speed: 1,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: "circle",
                            },
                            size: {
                                value: {min: 1, max: 5},
                            },
                        },
                        detectRetina: true,
                    }}/>
                    <ScrollToTop>
                        <Menu title="PyNextStack" subtitle="v30.03.2024 - Latest" navItems={menuItems}/>
                        <WrapperEffects effect={"softSlideInDown"} pageProps={pageProps}>

                            <Container sx={{mt: 3}}>
                                <Component {...pageProps} />
                            </Container>

                            <Footer/>

                        </WrapperEffects>
                    </ScrollToTop>
                </ThemeProvider>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
