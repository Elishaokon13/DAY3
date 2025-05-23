'use client';

import { Web3ReactProvider } from '@web3-react/core';
import { ethers } from 'ethers';
import { ReactNode } from 'react';

function getLibrary(provider: any) {
  try {
    const library = new ethers.providers.Web3Provider(provider);
    library.pollingInterval = 12000;
    return library;
  } catch (error) {
    console.error('Error initializing Web3 library:', error);
    return null;
  }
}

interface Props {
  children: ReactNode;
}

export function Web3Provider({ children }: Props) {
  return (
    <Web3ReactProvider getLibrary={getLibrary} connectorStorageKey="eth-buying-ai">
      {children}
    </Web3ReactProvider>
  );
} 