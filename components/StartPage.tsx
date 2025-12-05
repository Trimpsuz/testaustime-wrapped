import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion } from 'motion/react';
import { AuroraBackground } from './ui/aurora-background';

export default function StartPage({ setUsername, onSearch }: { setUsername: (username: string) => void; onSearch: () => void }) {
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
        <div className="text-3xl md:text-7xl tracking-wide [word-spacing:-1.5rem] font-bold text-foreground text-center font-mono">
          your{' '}
          <motion.span
            onHoverStart={() => {
              if (swapTimeout.current) clearTimeout(swapTimeout.current);
              setHovered(true);
              hoveredRef.current = true;
              swapTimeout.current = setTimeout(() => {
                if (hoveredRef.current) setShow2025(true);
              }, 400);
            }}
            onHoverEnd={() => {
              if (swapTimeout.current) clearTimeout(swapTimeout.current);
              setHovered(false);
              hoveredRef.current = false;
              swapTimeout.current = setTimeout(() => {
                if (!hoveredRef.current) setShow2025(false);
              }, 400);
            }}
            animate={{
              rotateX: hovered ? 1080 : 0,
            }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="inline-block align-baseline"
          >
            {show2025 ? process.env.NEXT_PUBLIC_WRAPPED_YEAR : 'year'}
          </motion.span>{' '}
          in code.
        </div>

        <div className="flex flex-row items-center gap-2 ">
          <Input className="text-2xl! h-12! text-foreground!" placeholder="username" name="username" autoComplete="off" onChange={(e) => setUsername(e.target.value)} />
          <Button size="xl" className="cursor-pointer" onClick={onSearch}>
            show me
          </Button>
        </div>
      </motion.div>
    </AuroraBackground>
  );
}
