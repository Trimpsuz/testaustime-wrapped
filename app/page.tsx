'use client';

import StartPage from '@/components/StartPage';
import axios from 'axios';
import { useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);

  const onSearch = async () => {
    try {
      const res = await axios.get(`/api/data?username=${username}&year=${process.env.NEXT_PUBLIC_WRAPPED_YEAR}`);

      if (res.status !== 200 || !res.data) return;

      setData(res.data);
    } catch (error) {
      if (axios.isAxiosError(error)) toast.error(error.response?.data.error);
    }
  };

  return (
    <>
      <StartPage username={username} setUsername={setUsername} onSearch={onSearch} />
      {data ? <div>Lorem ipsum</div> : ''}
    </>
  );
}
