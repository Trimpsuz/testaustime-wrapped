import { ChevronDown } from 'lucide-react';
import { motion, useScroll, useTransform } from 'motion/react';
import { RefObject } from 'react';

export default function KeepScrollingContainer({ startRef }: { startRef: RefObject<null> }) {
  const { scrollYProgress } = useScroll({
    target: startRef,
    offset: ['start end', 'end end'],
  });

  const length = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <div className="h-screen relative" ref={startRef}>
      <div className="top-1/2 left-1/2 h-full w-full">
        <svg className="w-full h-full" viewBox="-25.7 107.3 1965 855" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3c709d" />
              <stop offset="100%" stopColor="#22416c" />
            </linearGradient>
          </defs>
          <motion.path
            d="M-25.7,423.7C55.7,237,219.6,217.9,290,229.7c205,34.3,226.9,349.5-134.2,654.5-121.3,136.2-197.6-17.5-112.6-24.4,85-6.9,287.9,130.1,423.2,97.1,135.3-33,133.9-190.5,133.6-187.3-32.9,329.5,490.5,130.3,375.4-296.1-99.4-368.3-324.7-329.4-370.2,14.5-21.6,141.1,57.8,439.4,90.6,44.5.3-2.8,9.3-58-8.1-181.9-16.7-170.6-122.4-89.3-61.7-23.1,45.5,51.6,211.2,16.2,269-13.9,57.8-30.1,140.1-165.4,271.9-148.9,98.2,12.3,345.8,168.5,3.5,677.3,0,0-124.9,171.1-166.5,69.4-41.6-101.8,86.7-94.8,126-64.8,39.3,30.1,120.3,102.9,185,92.5s66.6-46.1,69.7-59.1c.5-2,2.8-2.7,4.4-1.5,167.8,166.9,523.3,13.4,374.6-361.5-66.5-148.6-241.8-111.5-272.2-118.3,0-.3-26.1-205.3-26.1-205.6-.6-2.6-9.9-43.9,40.5-47.3,52-3.5,379-3.8,433.4-38.5"
            stroke="url(#gradient)"
            strokeLinecap="round"
            fill="none"
            strokeWidth="3"
            pathLength={length}
          />
        </svg>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-semibold text-foreground text-center w-full">
        you worked hard in {process.env.NEXT_PUBLIC_WRAPPED_YEAR}. we kept track.
      </div>
      <div className="absolute bottom-1/6 w-full flex flex-col items-center gap-6 text-foreground/90">
        <div className="text-lg font-medium">keep scrolling</div>
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
        >
          <ChevronDown className="w-10 h-10" />
        </motion.div>
      </div>
    </div>
  );
}
