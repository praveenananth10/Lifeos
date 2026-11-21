import { useContext } from 'react';
import { LifeOSContext } from '../context/lifeos-context';
import type { LifeOSContextType } from '../context/lifeos-context';

export function useLifeOS(): LifeOSContextType {
  const context = useContext(LifeOSContext);
  if (!context) {
    throw new Error('useLifeOS must be used within a LifeOSProvider');
  }
  return context;
}

