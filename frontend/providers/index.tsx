'use client';

import { SessionProvider } from 'next-auth/react';
import QueryProvider from './QueryProvider';
import AuthCallbackHandler from '@/components/auth/AuthCallbackHandler';

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryProvider>
                {/* After Google sign-in, exchange id_token for backend JWT and store it */}
                <AuthCallbackHandler />
                {children}
            </QueryProvider>
        </SessionProvider>
    );
}
