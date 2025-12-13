import { getAvgLanguageReleaseYear, getEstimatedAge } from '@/lib/estimateAge';
import { Data } from '@/lib/types';
import { easeInOut, motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

export default function AgeContainer({ data }: { data: Data }) {
  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const middleTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 1], [600, 0], { ease: easeInOut })}px)`;
  const bottomTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 1], [1000, 0], { ease: easeInOut })}px)`;

  const length = useTransform(scrollYProgress, [0.33, 1], [0, 1]);

  return (
    <div className="h-screen relative" ref={parentRef}>
      <div className="top-1/2 left-1/2 h-full w-full">
        <svg className="w-full h-full" viewBox="0 0 1920 570.8" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#3c709d" />
              <stop offset="100%" stopColor="#22416c" />
            </linearGradient>
          </defs>
          <motion.path
            strokeLinecap="round"
            fill="none"
            strokeWidth="3"
            stroke="url(#gradient2)"
            d="M2121.1,152.4c-80.2-60-168.1-109.7-260.9-147.6-12.8-5.2-29.9-9.5-37.1,5.6,0,0-9.1,31.5-6.3,82.3,1.9,35-25.2,66.2-51.9,88.9-26.7,22.7-59.6,37.3-93.5,46.6-21.8,6-46.2,9.7-66.2-.9-21.4-11.3-32.4-36-52.6-49.2-33.3-21.8-77.4-5.6-113.7,10.7-124.9,56.1-263.4-2.9-393.3,102.9-109.3,89-233,159.1-321.7,268.7,12.3,10.4,28.2,10.7,44.3,10.5,100.5-1.4,201-7.7,300.9-18.9,62.8-7,127-16.5,182.6-46.7,16.3-8.9,33.4-22.4,33.8-41,.3-13.3-8.3-25.1-18.1-34.1-19.8-18.2-45.1-29-69.9-39.2-151.1-62.2-312.9-102.4-432.6-213.6-11.5-10.7-45-57.6-44.7-73.3.4-19.4,8.7-64.4,26.9-71,46.7-16.8,153.7-19.8,213-21.5,97.4-2.8,205,13.8,310.3,19.8,6.5,29.2-11.7,57.9-30.7,81-76.2,92.8-177.9,160.3-268.2,239.4-51.6,45.3-99.8,94.7-154.9,135.6-55.1,41-118.7,73.7-187.1,79.5-85.6,7.3-168.9-27.7-254.5-34.5-51.2-4.1-179.8,39.1-256,19.1s57-64.7,46.9-63.4c-82.6,11-169.6,82.1-232.2,73.7"
            pathLength={length}
          />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center">
        <motion.div className="text-4xl">we estimated your age as</motion.div>
        <motion.div style={{ transform: middleTransform }} className="font-[Special_Gothic_Expanded_One] text-[12rem] text-stroke-2 tracking-tight text-[#398FD9]">
          {getEstimatedAge(data.languages, data.totalDuration)}
        </motion.div>
        <motion.div style={{ transform: bottomTransform }} className="flex flex-col items-center gap-2">
          <div className="text-xl">based on the languages you used.</div>
          <div className="text-lg">
            your average language was released in <span className="font-bold">{getAvgLanguageReleaseYear(data.languages)}</span>.
          </div>
        </motion.div>
      </div>
    </div>
  );
}
