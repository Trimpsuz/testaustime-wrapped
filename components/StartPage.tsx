'use client';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { AuroraBackground } from './ui/aurora-background';
import useWindowDimensions from '@/lib/hooks/useWindowDimensions';

export default function StartPage({
  username,
  setUsername,
  onSearch,
  setIsActive,
}: {
  username: string;
  setUsername: (username: string) => void;
  onSearch: () => void;
  setIsActive: (isActive: boolean) => void;
}) {
  const { width } = useWindowDimensions();

  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const swapTimeout = useRef<NodeJS.Timeout | null>(null);
  const [show2025, setShow2025] = useState(false);

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.8, ease: 'easeInOut' }}
        className="relative flex flex-col gap-12 items-center justify-center px-4"
      >
        <div className="text-7xl tracking-wide [word-spacing:-1.5rem] font-bold text-foreground text-center font-mono">
          your{' '}
          <span
            className="inline-block align-baseline relative mh-[1.2em] mw-[4ch]"
            onMouseEnter={() => {
              setIsActive(true);
              if (swapTimeout.current) clearTimeout(swapTimeout.current);
              setHovered(true);
              hoveredRef.current = true;
              swapTimeout.current = setTimeout(() => {
                if (hoveredRef.current) setShow2025(true);
              }, 400);
            }}
            onMouseLeave={() => {
              setIsActive(false);
              if (swapTimeout.current) clearTimeout(swapTimeout.current);
              setHovered(false);
              hoveredRef.current = false;
              swapTimeout.current = setTimeout(() => {
                if (!hoveredRef.current) setShow2025(false);
              }, 400);
            }}
          >
            <motion.span
              animate={{
                rotateX: hovered ? 1080 : 0,
              }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="inline-block align-baseline"
            >
              {show2025 ? process.env.NEXT_PUBLIC_WRAPPED_YEAR : 'year'}
            </motion.span>
          </span>{' '}
          in code.
        </div>

        {width > 1850 && /Chrome/.test(navigator.userAgent) ? (
          <div className="flex flex-row items-center gap-2">
            <Input
              onMouseOver={() => {
                setIsActive(true);
              }}
              onMouseLeave={() => {
                setIsActive(false);
              }}
              className="text-2xl! h-12! text-foreground!"
              placeholder="username"
              name="username"
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button
              onMouseOver={() => {
                setIsActive(true);
              }}
              onMouseLeave={() => {
                setIsActive(false);
              }}
              size="xl"
              className="cursor-pointer"
              onClick={onSearch}
              disabled={!username || !/^[0-9A-Za-z_]{2,32}$/.test(username)}
            >
              show me
            </Button>
          </div>
        ) : (
          <div className="text-2xl">sorry, your browser is not supported or your screen is too small</div>
        )}
      </motion.div>
    </AuroraBackground>
  );
}
