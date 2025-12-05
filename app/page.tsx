'use client';

import StartPage from '@/components/StartPage';
import axios from 'axios';
import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState(null);

  const onSearch = async () => {
    const res = await axios.get(`/api/data?username=${username}&year=${process.env.NEXT_PUBLIC_WRAPPED_YEAR}`);

    setData(res.data);
  };

  return (
    <>
      <StartPage setUsername={setUsername} onSearch={onSearch} />
      {data ? <div>Lorem ipsum</div> : ''}
    </>
  );
}
