import { Data } from '@/lib/types';
import Big from 'big.js';
import { motion, MotionValue, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

export default function TotalsContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const parentRef = useRef(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const sideRef = useRef<HTMLDivElement>(null);

  const [offset, setOffset] = useState(500);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const ySmallText2 = useTransform(scrollYProgress, [0, 0.33], [700, 0]);
  const opacitySmallText2 = useTransform(scrollYProgress, [0.2, 0.33], [0, 1]);
  const ySmallText = useTransform(scrollYProgress, [0, 0.33], [500, 0]);
  const opacitySmallText = useTransform(scrollYProgress, [0.15, 0.33], [0, 1]);
  const yBigText = useTransform(scrollYProgress, [0, 0.33], [300, 0]);

  const xCenter = useTransform(scrollYProgress, [0.33, 0.66], [0, -offset]);
  const xSide = useTransform(scrollYProgress, [0.33, 0.66], [offset, 0]);
  const yCenter = useTransform(scrollYProgress, [0.66, 1], [0, -200]);
  const ySide = useTransform(scrollYProgress, [0.66, 1], [0, -500]);
  const opacity = useTransform(scrollYProgress, [0.33, 0.66], [0, 1]);

  const transformSmallText = useMotionTemplate`translateY(${ySmallText}px)`;
  const transformSmallText2 = useMotionTemplate`translateY(${ySmallText2}px)`;
  const transformBigText = useMotionTemplate`translateY(${yBigText}px)`;
  const transformCenter = useMotionTemplate`translateX(${xCenter}px) translateY(${yCenter}px)`;
  const transformSide = useMotionTemplate`translateX(${xSide}px) translateY(${ySide}px)`;

  // crazy hack
  useEffect(() => {
    const calculateOffset = () => {
      if (centerRef.current && sideRef.current) {
        const centerWidth = centerRef.current.offsetWidth;
        const sideWidth = sideRef.current.offsetWidth;
        const gap = 100;

        const requiredOffset = (centerWidth + sideWidth) / 2 + gap;
        setOffset(requiredOffset);
      }
    };

    calculateOffset();
    window.addEventListener('resize', calculateOffset);

    return () => window.removeEventListener('resize', calculateOffset);
  }, []);

  const length = useTransform(scrollYProgress, [0.2, 0.9], [0, 1]);

  return (
    <div className="relative h-[400vh] w-screen" ref={parentRef}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="top-1/2 left-1/2 h-full w-full">
          <svg className="w-full h-full" viewBox="0 0 1920 589.3" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="gradient2" x1="100%" y1="0%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#3c709d" />
                <stop offset="100%" stopColor="#22416c" />
              </linearGradient>
            </defs>
            <motion.path
              d="M1945.5,164.3c-94.8,27.2-179.3,89.1-233.8,171.3-6.4,9.7-14.7,20.8-26.2,20.1-6.5-.4-12.1-4.6-16.9-9-22.3-20.4-37.1-47.4-55.8-71.1-18.7-23.7-45.7-56.9-74.2-46.9-100.8,35.1-138.3,26.3-138.3,26.3-15.9-2.7-30-11.4-45.3-16.4-17.7-5.7-36.7-6.3-55.3-6.2-39,.1-78.1,2.7-117,0s-29.8-2.8-44.4-5.9c-32.2-6.6-60.4-21.6-89.8-35.3-22.6-10.5-44.3-23.1-64.5-37.9-52-38.2-91.8-91.2-110.3-153.4,0,0-15.5,157.7-227.4,248.2,103.8,19.5,195.2,95.1,233.8,193.4,27.5-118.9,78-213.8,186.9-268.8-156.4,119.4-300.8,184.4-496.8,201.7-47,4.2-78,62.9-124.9,68.5-29.9,3.6-57.9-13.2-86.8-21.4-35.8-10.2-75.3-7-109,8.8-35.4,16.6-63.2,45.7-93.7,70.1-91.8,73.6-209.2,105.7-322.9,135.9"
              stroke="url(#gradient2)"
              strokeLinecap="round"
              fill="none"
              strokeWidth="3"
              pathLength={length}
            />
          </svg>
        </div>
        <motion.div ref={centerRef} style={{ transform: transformCenter }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
          <motion.div style={{ transform: transformBigText }} className="font-[Special_Gothic_Expanded_One] text-9xl text-stroke-2 tracking-tight text-[#398FD9]">
            {Math.round(data.totalDuration / 60)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          </motion.div>
          <div className="flex flex-col items-center">
            <motion.div style={{ transform: transformSmallText, opacity: opacitySmallText }} className="text-foreground/90 text-lg">
              you coded for{' '}
              <span className="font-bold text-foreground">
                {Math.round(data.totalDuration / 60)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </span>{' '}
              minutes. that&apos;s{' '}
              <span className="font-bold text-foreground">
                {Big(data.totalDuration / 60 / 60 / 24)
                  .round(1)
                  .toString()
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </span>{' '}
              days.
            </motion.div>
            <motion.div style={{ transform: transformSmallText2, opacity: opacitySmallText2 }} className="text-foreground/90 text-lg">
              {data.totalDuration !== data.totalDurationLastYear && (
                <span className="font-bold text-foreground">
                  {data.totalDuration >= data.totalDurationLastYear
                    ? Big((data.totalDuration / data.totalDurationLastYear - 1) * 100)
                        .round(1)
                        .toString()
                    : Big((1 - data.totalDuration / data.totalDurationLastYear) * 100)
                        .round(1)
                        .toString()}
                </span>
              )}{' '}
              {data.totalDuration !== data.totalDurationLastYear && <span>{data.totalDuration >= data.totalDurationLastYear ? 'percent more' : 'percent less'}</span>}{' '}
              {data.totalDuration !== data.totalDurationLastYear ? 'compared to last year.' : 'same as last year!'}
            </motion.div>
          </div>
        </motion.div>
        <motion.div ref={sideRef} style={{ transform: transformSide, opacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-6 items-start justify-center">
          <div className="text-6xl font-bold">split across</div>
          <div className="flex flex-col gap-2">
            {[
              { name: 'project', value: data.totalProjects, valueLastYear: data.totalProjectsLastYear },
              { name: 'language', value: data.totalLanguages, valueLastYear: data.totalLanguagesLastYear },
              { name: 'editor', value: data.totalEditors, valueLastYear: data.totalEditorsLastYear },
              { name: 'host', value: data.totalHosts, valueLastYear: data.totalHostsLastYear },
            ].map((item, index, arr) => (
              <SplitItem key={index} scrollYProgress={scrollYProgress} item={item} index={index} arr={arr} totalDuration={data.totalDuration} setIsActive={setIsActive} />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SplitItem({
  scrollYProgress,
  item,
  index,
  arr,
  totalDuration,
  setIsActive,
}: {
  scrollYProgress: MotionValue<number>;
  item: {
    name: string;
    value: number;
    valueLastYear: number;
  };
  index: number;
  arr: { name: string; value: number; valueLastYear: number }[];
  totalDuration: number;
  setIsActive: (isActive: boolean) => void;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const y = useTransform(scrollYProgress, [0.33, 0.66], [20 * (index + 1), 0]);
  const opacity = useTransform(scrollYProgress, [0.45, 0.66], [(arr.length + 1 - index + 1) / (arr.length + 1), 1]);
  const transform = useMotionTemplate`translateY(${y}px)`;

  return (
    <motion.div
      key={index}
      className="text-2xl text-foreground/85 cursor-pointer overflow-hidden"
      style={{ transform, opacity }}
      onMouseEnter={() => {
        setIsHovered(true);
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsActive(false);
      }}
    >
      <div>
        {arr.length - 1 === index ? 'and' : ''} <span className="font-semibold text-foreground">{item.value}</span> {item.value > 1 ? item.name + 's' : item.name}
        {'. '}
        {item.value !== item.valueLastYear && (
          <span className="font-semibold text-foreground">
            {item.value >= item.valueLastYear ? '+' : '-'}
            {item.value >= item.valueLastYear
              ? Big((item.value / item.valueLastYear - 1) * 100)
                  .round(1)
                  .toString()
              : Big((1 - item.value / item.valueLastYear) * 100)
                  .round(1)
                  .toString()}
            %
          </span>
        )}{' '}
        {item.value !== item.valueLastYear ? 'compared to last year.' : 'same as last year.'}
      </div>
      <motion.div
        initial={{ opacity: 0, height: 0, marginTop: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          height: isHovered ? 'auto' : 0,
          marginTop: isHovered ? 4 : 0,
        }}
        transition={{ duration: 0.2 }}
        className="text-lg text-foreground/70"
      >
        <span className="font-semibold text-foreground/90">
          {Math.round(totalDuration / 60 / item.value)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
        </span>{' '}
        min per {item.name} on average.
      </motion.div>
    </motion.div>
  );
}
