'use client';
import AgeContainer from '@/components/AgeContainer';
import Cursor from '@/components/Cursor';
import KeepScrollingContainer from '@/components/KeepScrollingContainer';
import LanguagesContainer from '@/components/LanguagesContainer';
import StartPage from '@/components/StartPage';
import TotalsContainer from '@/components/TotalsContainer';
import type { Data } from '@/lib/types';
import axios from 'axios';
import { LenisRef, ReactLenis } from 'lenis/react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const [username, setUsername] = useState('');
  const [data, setData] = useState<null | Data>(null);
  const [isScrollEnabled, setIsScrollEnabled] = useState(false);
  const startRef = useRef(null);
  const lenisRef = useRef<LenisRef>(null);
  const [isActive, setIsActive] = useState(false);

  const onSearch = async () => {
    setIsScrollEnabled(true);

    setTimeout(() => {
      if (lenisRef.current?.lenis && startRef.current) {
        lenisRef.current.lenis.scrollTo(startRef.current, {
          duration: 2,
          easing: (x: number) => {
            return x === 0 ? 0 : x === 1 ? 1 : x < 0.5 ? Math.pow(2, 20 * x - 10) / 2 : (2 - Math.pow(2, -20 * x + 10)) / 2;
          },
        });
      }
    }, 50);

    try {
      const res = await axios.get(`/api/data?username=${username}&year=${process.env.NEXT_PUBLIC_WRAPPED_YEAR}`);
      if (res.status !== 200 || !res.data) {
        setIsScrollEnabled(false);
        if (lenisRef.current?.lenis) {
          lenisRef.current.lenis.scrollTo(0, { duration: 1 });
        }
        return;
      }
      setData(res.data);
    } catch (error) {
      setIsScrollEnabled(false);
      if (lenisRef.current?.lenis) {
        lenisRef.current.lenis.scrollTo(0, { duration: 1 });
      }

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data.error);
      }
    }
  };

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{
        anchors: !isScrollEnabled, //sick hack
        lerp: 0.05,
      }}
    >
      <StartPage username={username} setUsername={setUsername} onSearch={onSearch} setIsActive={setIsActive} />
      {isScrollEnabled && (
        <div className="overflow-clip">
          <div className="h-[50vh]" />
          <KeepScrollingContainer startRef={startRef} />
          {data && (
            <>
              <TotalsContainer data={data} setIsActive={setIsActive} />
              <LanguagesContainer data={data} setIsActive={setIsActive} />
              <AgeContainer data={data} />
              <div className="h-[200vh]" />
            </>
          )}
        </div>
      )}
      <Cursor isActive={isActive} />
    </ReactLenis>
  );
}
