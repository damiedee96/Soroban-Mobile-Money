import React, { useEffect } from 'react';
import { useAuthStore } from './src/store/authStore';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const hydrate = useAuthStore((s) => s.hydrate);
  useEffect(() => { hydrate(); }, []);
  return <AppNavigator />;
}
