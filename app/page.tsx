'use client';

import StartPage from '@/components/StartPage';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');

  return <StartPage setUsername={setUsername} />;
}
