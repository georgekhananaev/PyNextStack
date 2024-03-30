// useAuthenticatedRoute.js
import React from 'react';
import {useRouter} from 'next/router';
import Loading from "@/components/loading";
import {useAuth} from "@/api/auth/auth-context"; // Adjust the import path as necessary

const useAuthenticatedRoute = (WrappedComponent, redirectUrl = '/login') => {
    return function ProtectedRoute(props) {
        const {isAuthenticated, isLoading} = useAuth();
        const router = useRouter();

        React.useEffect(() => {
            if (!isLoading && !isAuthenticated) {
                // noinspection JSIgnoredPromiseFromCall
                router.push(redirectUrl);
            }
        }, [isAuthenticated, isLoading, router, redirectUrl]);

        if (isLoading) {
            return <Loading/>;
        }

        return <WrappedComponent {...props} />;
    };
};

export default useAuthenticatedRoute;
