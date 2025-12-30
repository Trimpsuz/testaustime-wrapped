'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect } from 'react';

export default function Cursor({ isActive }: { isActive: boolean }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 100, damping: 20 });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      className="fixed top-0 left-0 rounded-full mix-blend-difference pointer-events-none z-999"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
        backgroundColor: '#C4CAE4',
      }}
      animate={{
        width: isActive ? 80 : 30,
        height: isActive ? 80 : 30,
        filter: `blur(${isActive ? 10 : 0}px)`,
      }}
      transition={{
        width: { duration: 0.3, ease: 'easeOut' },
        height: { duration: 0.3, ease: 'easeOut' },
        filter: { duration: 0.3, ease: 'easeOut' },
      }}
    />
  );
}
