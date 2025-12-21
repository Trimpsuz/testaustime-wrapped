import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Data } from '@/lib/types';
import Big from 'big.js';
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';

const dayLabels = [
  '00:00 – 01:00',
  '01:00 – 02:00',
  '02:00 – 03:00',
  '03:00 – 04:00',
  '04:00 – 05:00',
  '05:00 – 06:00',
  '06:00 – 07:00',
  '07:00 – 08:00',
  '08:00 – 09:00',
  '09:00 – 10:00',
  '10:00 – 11:00',
  '11:00 – 12:00',
  '12:00 – 13:00',
  '13:00 – 14:00',
  '14:00 – 15:00',
  '15:00 – 16:00',
  '16:00 – 17:00',
  '17:00 – 18:00',
  '18:00 – 19:00',
  '19:00 – 20:00',
  '20:00 – 21:00',
  '21:00 – 22:00',
  '22:00 – 23:00',
  '23:00 – 24:00',
];

const weekLabels = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const yearLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function ActivityClocksContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const leftTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-500, 0])}px) translateY(${useTransform(scrollYProgress, [0.77, 1], [0, -300])}px)`;
  const middleTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-300, 0])}px) translateY(${useTransform(scrollYProgress, [0.83, 1], [0, -600])}px)`;
  const rightTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.66], [-700, 0])}px) translateY(${useTransform(scrollYProgress, [0.8, 1], [0, -500])}px)`;

  return (
    <div className="h-[200vh] relative" ref={parentRef}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center flex-col gap-64">
        <div className="text-4xl font-bold">your activity</div>
        <div className="flex items-center justify-evenly w-full">
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: leftTransform }}>
            <div className="text-3xl font-semibold">by hour</div>
            <ActivityClock data={data.activityClocks.day} labels={dayLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active hour: <span className="font-bold text-foreground">{dayLabels[data.activityClocks.day.indexOf(Math.max(...data.activityClocks.day))]}</span>
            </div>
          </motion.div>
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: middleTransform }}>
            <div className="text-3xl font-semibold">by day</div>
            <ActivityClock data={data.activityClocks.week} labels={weekLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active day: <span className="font-bold text-foreground">{weekLabels[data.activityClocks.week.indexOf(Math.max(...data.activityClocks.week))].toLowerCase()}</span>
            </div>
          </motion.div>
          <motion.div className="flex flex-col gap-8 items-center" style={{ transform: rightTransform }}>
            <div className="text-3xl font-semibold">by month</div>
            <ActivityClock data={data.activityClocks.year} labels={yearLabels} setIsActive={setIsActive} />
            <div className="text-xl font-medium text-foreground/85">
              most active month: <span className="font-bold text-foreground">{yearLabels[data.activityClocks.year.indexOf(Math.max(...data.activityClocks.year))].toLowerCase()}</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ActivityClock({ data, labels, setIsActive }: { data: number[]; labels: string[]; setIsActive: (isActive: boolean) => void }) {
  const size = 360;
  const radius = size / 2;
  const innerRadius = radius * 0.45;
  const outerRadius = radius * 0.95;
  const gapAngle = 0.02;
  const maxValue = Math.max(...data);
  const count = data.length;

  const polarToCartesian = (r: number, angle: number) => ({
    x: r * Math.cos(angle - Math.PI / 2),
    y: r * Math.sin(angle - Math.PI / 2),
  });

  const arcPath = (r1: number, r2: number, start: number, end: number) => {
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
  };

  return (
    <TooltipProvider delayDuration={100}>
      <svg
        width={size}
        height={size}
        onMouseEnter={() => {
          setIsActive(true);
        }}
        onMouseLeave={() => setIsActive(false)}
        className="cursor-pointer"
      >
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
                    <div className="font-medium">{labels[index]}</div>
                    <div>
                      {Big(value / 60 / 60)
                        .round(1)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
                      hours
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </g>
      </svg>
    </TooltipProvider>
  );
}
