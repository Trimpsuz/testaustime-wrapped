import useWindowDimensions from '@/lib/hooks/useWindowDimensions';
import { prettifyProgrammingLanguageName } from '@/lib/programmingLanguagesUtils';
import { Data, Project } from '@/lib/types';
import Big from 'big.js';
import { Check, X } from 'lucide-react';
import { easeInOut, motion, type MotionValue, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { useMemo, useRef, useState } from 'react';

export default function ProjectsContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const { height } = useWindowDimensions();
  const [showPos, setShowPos] = useState(false);

  const sortedProjects = useMemo(() => {
    return [...data.projects].sort((a: Project, b: Project) => b.duration - a.duration).slice(0, 5);
  }, [data.projects]);

  const topProjects = useMemo(() => {
    return [...sortedProjects].sort(() => 0.5 - Math.random());
  }, [sortedProjects]);

  const topProjectIndex = useMemo(() => {
    return topProjects.findIndex((project: Project, index: number, projects: Project[]) => project.duration === Math.max(...projects.map((project: Project) => project.duration)));
  }, [topProjects]);

  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (latest > 0.74) setShowPos(true);
    else setShowPos(false);
  });

  const titleTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0.1, 0.33], [0, -height / 2.33])}px) translateY(${useTransform(scrollYProgress, [0.9, 1], [0, -50])}px)`;

  const [selectedProjectIndex, setSelectedProjectIndex] = useState<number | null>(null);

  return (
    <div className="h-[200vh] relative" ref={parentRef}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap text-4xl font-semibold" style={{ transform: titleTransform }}>
          can you guess your top project?
        </motion.div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex flex-col gap-3 items-center">
          {topProjects.map((project: Project, index: number) => {
            return (
              <div key={index} className="flex flex-row gap-8 w-full justify-center items-center">
                <motion.div className={`text-4xl font-black ${(!selectedProjectIndex || !showPos) && 'opacity-0'} transition-opacity duration-500`}>
                  #{sortedProjects.findIndex((p: Project) => p.duration === project.duration) + 1}
                </motion.div>
                <ProjectContainer
                  project={project}
                  index={index}
                  setIsActive={setIsActive}
                  scrollYProgress={scrollYProgress}
                  selectedProjectIndex={selectedProjectIndex}
                  setSelectedProjectIndex={setSelectedProjectIndex}
                  topProjectIndex={topProjectIndex}
                />
                <div className="text-4xl font-black invisible">#{sortedProjects.findIndex((p: Project) => p.duration === project.duration) + 1}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ProjectContainer({
  project,
  index,
  setIsActive,
  scrollYProgress,
  selectedProjectIndex,
  setSelectedProjectIndex,
  topProjectIndex,
}: {
  project: Project;
  index: number;
  setIsActive: (isActive: boolean) => void;
  scrollYProgress: MotionValue<number>;
  selectedProjectIndex: number | null;
  setSelectedProjectIndex: (index: number | null) => void;
  topProjectIndex: number;
}) {
  const start = 0.5 + (index * 0.4 * 0.5) / 5;
  const end = start + 0.4 / 5;

  const transform = useMotionTemplate`translateX(${useTransform(scrollYProgress, [start, end], [index % 2 !== 0 ? -500 : 500, 0], { ease: easeInOut })}px)`;
  const opacity = useTransform(scrollYProgress, [start, end], [0, 1], { ease: easeInOut });

  return (
    <motion.div
      key={index}
      className={`p-4 border-2 flex flex-col min-w-[25%] rounded-sm cursor-pointer ${selectedProjectIndex && topProjectIndex === index ? 'bg-[#82dd55]' : ''} ${
        selectedProjectIndex && selectedProjectIndex !== topProjectIndex && selectedProjectIndex === index ? 'border-[#e23636]' : 'border-foreground/90'
      } transition-colors duration-500 ease-in`}
      onMouseEnter={() => {
        if (scrollYProgress.get() > end) setIsActive(true);
      }}
      onMouseLeave={() => setIsActive(false)}
      style={{ transform, opacity }}
      onClick={() => {
        if (!selectedProjectIndex && scrollYProgress.get() > 0.74) setSelectedProjectIndex(index);
      }}
    >
      <div className={`font-bold text-2xl flex flex-row items-center justify-between ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>
        {project.project_name}
        <div>
          {selectedProjectIndex && selectedProjectIndex !== topProjectIndex && selectedProjectIndex === index ? <X color="#e23636" /> : null}
          {selectedProjectIndex && topProjectIndex === index ? <Check /> : null}
        </div>
      </div>
      <div className={`font-medium text-lg ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground/85'}`}>
        {prettifyProgrammingLanguageName(project.top_language?.language).toLowerCase()}, {project.top_editor?.editor_name.toLowerCase()}, {project.top_host?.hostname.toLowerCase()}
      </div>
      <div className={`font-medium text-lg ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground/85'}`}>
        <span className={`font-bold ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>{project.total_languages}</span> language
        {project.total_languages === 1 ? '' : 's'},{' '}
        <span className={`font-bold ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>{project.total_editors}</span> editor
        {project.total_editors === 1 ? '' : 's'},{' '}
        <span className={`font-bold ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>{project.total_hosts}</span> host
        {project.total_hosts === 1 ? '' : 's'}
        <span className={`transition-opacity duration-500 ease-in ${!selectedProjectIndex && 'opacity-0'}`}>
          ,{' '}
          <span className={`font-bold ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>
            {Big(project.duration / 60 / 60)
              .round(1)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}
          </span>{' '}
          hours{' '}
          {project.duration_last_year && (
            <span className={`font-bold ${selectedProjectIndex && topProjectIndex === index ? 'text-background' : 'text-foreground'}`}>
              {project.duration >= project.duration_last_year ? '+' : '-'}
              {project.duration >= project.duration_last_year
                ? Big((project.duration / project.duration_last_year - 1) * 100)
                    .round(1)
                    .toString()
                : Big((1 - project.duration / project.duration_last_year) * 100)
                    .round(1)
                    .toString()}
              %
            </span>
          )}
        </span>
      </div>
    </motion.div>
  );
}
