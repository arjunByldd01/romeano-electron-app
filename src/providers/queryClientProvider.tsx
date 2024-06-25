import React from 'react';

import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
interface ChildProps {
  children: React.ReactNode;
}
export const queryCache = new QueryCache();

const QueryProvider = ({ children }: ChildProps) => {
  const queryClient = new QueryClient({
    queryCache: queryCache,
  });
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
export { QueryProvider };
