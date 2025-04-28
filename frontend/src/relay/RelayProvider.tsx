import React from 'react';
import { RelayEnvironmentProvider } from 'react-relay';
import { environment } from '../RelayEnvironment';

type RelayProviderProps = {
  children: React.ReactNode;
};

export function RelayProvider({ children }: RelayProviderProps) {
  return (
    <RelayEnvironmentProvider environment={environment}>
      {children}
    </RelayEnvironmentProvider>
  );
}