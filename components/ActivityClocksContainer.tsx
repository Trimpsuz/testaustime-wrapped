import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Data } from '@/lib/types';
import Big from 'big.js';
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { memo, useMemo, useRef } from 'react';
import { dayLabels, weekLabels, yearLabels } from '../lib/utils';

export default function ActivityClocksContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const leftTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-500, 0])}px) translateY(${useTransform(scrollYProgress, [0.77, 1], [0, -300])}px)`;
  const middleTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-300, 0])}px) translateY(${useTransform(scrollYProgress, [0.83, 1], [0, -600])}px)`;
  const rightTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-700, 0])}px) translateY(${useTransform(scrollYProgress, [0.8, 1], [0, -500])}px)`;

  const mostActiveHour = useMemo(() => dayLabels[data.activityClocks.day.indexOf(Math.max(...data.activityClocks.day))], [data.activityClocks.day]);

  const mostActiveDay = useMemo(() => weekLabels[data.activityClocks.week.indexOf(Math.max(...data.activityClocks.week))].toLowerCase(), [data.activityClocks.week]);

  const mostActiveMonth = useMemo(() => yearLabels[data.activityClocks.year.indexOf(Math.max(...data.activityClocks.year))].toLowerCase(), [data.activityClocks.year]);

  return (
    <div className="h-[200vh] relative" ref={parentRef}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center flex-col gap-64">
        <div className="text-4xl font-bold">your activity</div>
        <div className="flex items-center justify-evenly w-full">
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: leftTransform }}>
            <div className="text-3xl font-semibold">by hour</div>
            <ActivityClock data={data.activityClocks.day} labels={dayLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active hour: <span className="font-bold text-foreground">{mostActiveHour}</span>
            </div>
          </motion.div>
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: middleTransform }}>
            <div className="text-3xl font-semibold">by day</div>
            <ActivityClock data={data.activityClocks.week} labels={weekLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active day: <span className="font-bold text-foreground">{mostActiveDay}</span>
            </div>
          </motion.div>
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: rightTransform }}>
            <div className="text-3xl font-semibold">by month</div>
            <ActivityClock data={data.activityClocks.year} labels={yearLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active month: <span className="font-bold text-foreground">{mostActiveMonth}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const ActivityClock = memo(function ActivityClock({ data, labels, setIsActive }: { data: number[]; labels: string[]; setIsActive: (isActive: boolean) => void }) {
  const size = 360;
  const radius = size / 2;
  const innerRadius = radius * 0.45;
  const outerRadius = radius * 0.95;
  const gapAngle = 0.02;
  const maxValue = Math.max(...data);
  const count = data.length;

  const polarToCartesian = useMemo(
    () => (r: number, angle: number) => ({
      x: r * Math.cos(angle - Math.PI / 2),
      y: r * Math.sin(angle - Math.PI / 2),
    }),
    []
  );

  const arcPath = useMemo(
    () => (r1: number, r2: number, start: number, end: number) => {
      const p1 = polarToCartesian(r1, start);
      const p2 = polarToCartesian(r2, start);
      const p3 = polarToCartesian(r2, end);
      const p4 = polarToCartesian(r1, end);

      return `
      M ${p1.x} ${p1.y}
      L ${p2.x} ${p2.y}
      A ${r2} ${r2} 0 0 1 ${p3.x} ${p3.y}
      L ${p4.x} ${p4.y}
      A ${r1} ${r1} 0 0 0 ${p1.x} ${p1.y}
      Z
    `;
    },
    [polarToCartesian]
  );

  const handleMouseEnter = useMemo(() => () => setIsActive(true), [setIsActive]);
  const handleMouseLeave = useMemo(() => () => setIsActive(false), [setIsActive]);

  const tooltipContents = useMemo(
    () =>
      data.map((value, index) => ({
        label: labels[index],
        hours: Big(value / 60 / 60)
          .round(1)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, ' '),
      })),
    [data, labels]
  );

  return (
    <TooltipProvider delayDuration={100}>
      <svg width={size} height={size} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="cursor-pointer">
        <g transform={`translate(${radius}, ${radius})`}>
          {data.map((value, index) => {
            const start = (index / count) * 2 * Math.PI + gapAngle / 2;
            const end = ((index + 1) / count) * 2 * Math.PI - gapAngle / 2;

            const intensity = Math.sqrt(value / maxValue);

            const minThickness = 2;
            const maxThickness = outerRadius - innerRadius;
            const thickness = Math.max(minThickness, intensity * maxThickness);

            const valueOuter = innerRadius + thickness;

            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <g>
                    <path d={arcPath(innerRadius, outerRadius, start, end)} fill="var(--muted)" />
                    {value > 0 && <path d={arcPath(innerRadius, valueOuter, start, end)} fill="#398FD9" opacity={0.3 + intensity * 0.7} />}
                  </g>
                </TooltipTrigger>

                <TooltipContent>
                  <div className="text-sm">
                    <div className="font-medium">{tooltipContents[index].label}</div>
                    <div>{tooltipContents[index].hours} hours</div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </g>
      </svg>
    </TooltipProvider>
  );
});
