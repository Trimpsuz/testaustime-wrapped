import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import type { Data } from '@/lib/types';
import { Share2 } from 'lucide-react';
import { motion, useMotionTemplate, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import SvgToPng from './SvgToPng';
import { Button } from './ui/button';

export default function EndContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const parentTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 1], [-500, 0])}px)`;

  const length = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div className="h-screen relative" ref={parentRef} style={{ transform: parentTransform }}>
      <div className="top-1/2 left-1/2 h-full w-full">
        <svg className="w-full h-full" viewBox="0 0 1920 829.3" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3c709d" />
              <stop offset="100%" stopColor="#22416c" />
            </linearGradient>
          </defs>
          <motion.path
            strokeLinecap="round"
            fill="none"
            strokeWidth="3"
            stroke="url(#gradient)"
            d="M-32.2,473.8c28.1-24.7,65.3-37.3,102.6-41.1,37.2-3.7,74.8.8,111.7,6.9,30.3,5,61,11.1,91.6,7.9,35.2-3.7,67.7-19.5,99.9-34.1,72.1-32.6,149.4-60.6,228.3-55,49.6,40.9,62,113.6,69.8,177.4,10.1,82.3,20.3,164.6,30.4,247,.9,7.6,2,15.6,6.3,21.9,7.9,11.8,23.9,14.4,38,15.4,107.6,7.7,214.4-17.4,321.8-27.5,71.5-6.7,144.1-6.9,214-23.7,19.9-4.8,40.4-11.5,54.2-26.6,18.6-20.5,20.1-50.8,20-78.4-.4-68.9-5.2-137.7-14.2-206-5.4-40.5-12.9-82.3-36.9-115.4-20.7-5-43-6.6-64.3-7-127.5-2.2-254.2,20.9-381.7,20.5-15,0-29.9-.4-44.8,1-9.5.9-19.5,2.7-26.8,8.8-9.2,7.7-12.3,20.3-14.9,32-10.1,46.2-26.7,89.7-42,134.5,30,8,58.5-14.4,87.8-24.7,11.9-4.2,24.4-6.5,37-6.7,3.3,0,6.8.1,9.4,2.1,2.3,1.7,3.5,4.4,4.6,7,8.3,19.3,16.7,38.5,25,57.8,10.5-50.5,33.4-98.4,66-138.4,29.6,38.7,67.3,71.2,110,94.6,2.7,1.5,5.7,3,8.7,2.3,3.3-.7,5.5-3.7,7.4-6.4,15.6-22.4,35.3-44.1,61.6-51.7,20.4-5.9,42.2-2.6,63.3.2,2.3.3,4.8.6,7-.2,4.6-1.7,6.3-7.8,4.9-12.5s-5.2-8.3-8.8-11.7c-23.2-21.5-48.4-40.7-73.5-60-9.7-7.4-19.4-14.9-30.6-19.8-27.6-12.2-59.4-7.3-89.3-3-144.6,20.5-292.4,18.9-436.6-4.8-7.8-27.5-13.8-58.1-13.6-86.7.2-31.4,8.4-67.3,36.2-81.9,15.3-8,33.4-7.8,50.6-7.6,70.5,1,141-.6,211.4-4.8,59.4-3.5,119.8-9.1,175.1-31.2,55.3-22.1,105.6-63.1,126.1-119,.8-2.3,1.6-4.8,1-7.2-.7-2.3-2.6-4-4.6-5.3-13.8-9.1-32-6.4-48-2.2-67.3,17.4-129.3,54.6-176.3,105.8-11.1-22.4-36.6-31.6-57-46.1s-37.7-20.9-61.2-29.6c-16.2-6-42.4-6.7-59.5-9.4-17.1-2.6-36.6,1.3-47.1,15.1-8.9,11.7-9.3,28.3-4,42s15.7,24.8,27.1,34.2c61.4,51,148.1,55.6,227.9,52.2,103.8-4.5,207.1-18.5,308.3-42,6.5-1.5,13.4-3.1,19.8-.9,9,3,14.1,12.2,17.9,20.9,30.2,69.1,28.9,121.1-6.3,187.8,25.6-4.7,29.4-8.6,48.9-14.2,38-10.9,78.2-15.5,116.8-6.9,25.2,5.6,49.2,15.7,74,22.9,66.9,19.4,138.4,16.8,207.2,5.8,68.8-11,135.9-30.3,204.2-44.3"
            pathLength={length}
          />
        </svg>
      </div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center flex-col gap-4">
        <div className="text-foreground text-6xl font-extrabold">that&apos;s {process.env.NEXT_PUBLIC_WRAPPED_YEAR} all wrapped up</div>
        <div className="text-foreground/90 text-2xl font-medium">hope you enjoyed</div>
        <Dialog>
          <DialogTrigger asChild>
            <Button
              onMouseOver={() => {
                setIsActive(true);
              }}
              onMouseLeave={() => {
                setIsActive(false);
              }}
              size="xl"
              className="cursor-pointer"
            >
              <Share2 />
              share
            </Button>
          </DialogTrigger>
          <DialogContent setIsActive={setIsActive}>
            <DialogTitle className="invisible">share</DialogTitle>
            <SvgToPng svgString={data.imageBase64!} alt="share image" setIsActive={setIsActive} />
          </DialogContent>
        </Dialog>

        <Button
          onMouseOver={() => {
            setIsActive(true);
          }}
          onMouseLeave={() => {
            setIsActive(false);
          }}
          size="default"
          variant="outline"
          className="cursor-pointer"
          onClick={() => window.location.reload()}
        >
          restart
        </Button>
      </div>
    </motion.div>
  );
}
