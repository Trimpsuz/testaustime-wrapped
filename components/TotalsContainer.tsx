import { Data } from '@/lib/types';
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

  return (
    <div className="relative h-[400vh] w-screen" ref={parentRef}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div ref={centerRef} style={{ transform: transformCenter }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
          <motion.div style={{ transform: transformBigText }} className="font-black text-9xl text-stroke-2 tracking-tight text-[#398FD9]">
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
                {Math.round(data.totalDuration / 60 / 60 / 24)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
              </span>{' '}
              days.
            </motion.div>
            <motion.div style={{ transform: transformSmallText2, opacity: opacitySmallText2 }} className="text-foreground/90 text-lg">
              {data.totalDuration !== data.totalDurationLastYear && (
                <span className="font-bold text-foreground">
                  {data.totalDuration >= data.totalDurationLastYear
                    ? Math.round((data.totalDuration / data.totalDurationLastYear - 1) * 100)
                    : Math.round((1 - data.totalDuration / data.totalDurationLastYear) * 100)}
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
            {item.value >= item.valueLastYear ? Math.round((item.value / item.valueLastYear - 1) * 100) : Math.round((1 - item.value / item.valueLastYear) * 100)}%
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
