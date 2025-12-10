import useWindowDimensions from '@/lib/hooks/useWindowDimensions';
import { prettifyProgrammingLanguageName } from '@/lib/programmingLanguagesUtils';
import type { Data, Language } from '@/lib/types';
import Big from 'big.js';
import { ChevronDown, ChevronUp, Equal } from 'lucide-react';
import { easeInOut, motion, type MotionValue, useMotionTemplate, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import React, { useRef, useState } from 'react';

export default function LanguagesContainer({ data, setIsActive }: { data: Data; setIsActive: (isActive: boolean) => void }) {
  const { height, width } = useWindowDimensions();

  const sortedLanguages = [...data.languages.sort((a: Language, b: Language) => b.duration - a.duration)];
  const sortedLanguagesLastYear = [...data.languages.sort((a: Language, b: Language) => (b.duration_last_year ?? 0) - (a.duration_last_year ?? 0))].filter(
    (language) => language.duration_last_year !== undefined
  );

  const parentRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: parentRef,
    offset: ['start end', 'end end'],
  });

  const transformParent = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0, 0.2475], [-600, 0])}px)`;
  const transformText = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0.2475, 0.375], [0, -height / 2.66])}px) translateY(${useTransform(scrollYProgress, [0.75, 1], [0, -500])}px)`;
  const cardsTransform = useMotionTemplate`translateY(${useTransform(scrollYProgress, [0.2475, 0.4725], [800, 0], { ease: easeInOut })}px)`;

  const fontSize = useMotionTemplate`${useTransform(scrollYProgress, [0.25, 0.4725], [3, 1.25], { ease: easeInOut })}rem`;

  const cardTransforms = [
    useMotionTemplate`translateX(${useTransform(scrollYProgress, [0.495 + (0.2475 / 5) * 2, 0.495 + (0.2475 / 5) * 3], [0, width * (2 / 5) - 4 * 8], {
      ease: (x: number) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    })}px)
    translateY(${useTransform(scrollYProgress, [0.8 + 0.15 * (4 / 5), 1], [0, -800 + 160 * 2])}px)`,
    useMotionTemplate`translateX(${useTransform(scrollYProgress, [0.495 + (0.2475 / 5) * 3, 0.495 + (0.2475 / 5) * 4], [0, width * (1 / 5) - 4 * 4], {
      ease: (x: number) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    })}px)
    translateY(${useTransform(scrollYProgress, [0.8 + 0.15 * (3 / 5), 1], [0, -800 + 160])}px)`,
    useMotionTemplate`translateY(${useTransform(scrollYProgress, [0.8, 1], [0, -800 + 160 * 4])}px)`,
    useMotionTemplate`translateX(${useTransform(scrollYProgress, [0.495 + (0.2475 / 5) * 1, 0.495 + (0.2475 / 5) * 2], [0, -width * (1 / 5) + 4 * 4], {
      ease: (x: number) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    })}px)
    translateY(${useTransform(scrollYProgress, [0.8 + 0.15 * (1 / 5), 1], [0, -800 + 160 * 3])}px)`,
    useMotionTemplate`translateX(${useTransform(scrollYProgress, [0.495, 0.495 + (0.2475 / 5) * 1], [0, -width * (2 / 5) + 4 * 8], {
      ease: (x: number) => {
        return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
      },
    })}px)
    translateY(${useTransform(scrollYProgress, [0.8 + 0.15 * (2 / 5), 1], [0, -800])}px)`,
  ];

  const cardNumberStyles = [
    'text-transparent bg-clip-text bg-[radial-gradient(ellipse_farthest-corner_at_right_bottom,#FEDB37_0%,#FDB931_8%,#9f7928_30%,#8A6E2F_40%,transparent_80%),radial-gradient(ellipse_farthest-corner_at_left_top,#FFFFFF_0%,#FFFFAC_8%,#D1B464_25%,#5d4a1f_62.5%,#5d4a1f_100%)]',
    'text-transparent bg-clip-text bg-[radial-gradient(ellipse_farthest-corner_at_right_bottom,#C0C0C0_0%,#A9A9A9_8%,#7F7F7F_30%,#6E6E6E_40%,transparent_80%),radial-gradient(ellipse_farthest-corner_at_left_top,#FFFFFF_0%,#E0E0E0_8%,#B0B0B0_25%,#5d5d5d_62.5%,#5d5d5d_100%)]',
    'text-transparent bg-clip-text bg-[radial-gradient(ellipse_farthest-corner_at_right_bottom,#CD7F32_0%,#B76E34_8%,#8B5A2B_30%,#7C4822_40%,transparent_80%),radial-gradient(ellipse_farthest-corner_at_left_top,#F0E6D2_0%,#E6C89A_8%,#B97C50_25%,#5d3a1f_62.5%,#5d3a1f_100%)]',
    'text-background',
    'text-background',
  ];

  return (
    <motion.div className="h-[400vh] relative" ref={parentRef} style={{ transform: transformParent }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-nowrap text-xl" style={{ transform: transformText, fontSize }}>
          you used <span className="font-bold">{data.totalLanguages}</span> language{data.totalLanguages > 1 ? 's' : '. variety is overrated'}
          {data.totalLanguages > 1 && (sortedLanguages[0].duration / sortedLanguages[1].duration >= 2 ? '. one was overwhelmingly your favorite.' : ' and kept them balanced.')}
        </motion.div>
        <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-screen h-screen flex flex-row items-center justify-center" style={{ transform: cardsTransform }}>
          {['translate-x-8', 'translate-x-4', '', '-translate-x-4', '-translate-x-8'].map((translate, i) => {
            return (
              <FlippableCard
                key={i}
                i={i}
                sortedLanguages={sortedLanguages}
                cardNumberStyles={cardNumberStyles}
                translate={translate}
                cardTransforms={cardTransforms}
                setIsActive={setIsActive}
                scrollYProgress={scrollYProgress}
                data={data}
                sortedLanguagesLastYear={sortedLanguagesLastYear}
              />
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
}

const CardContent = ({
  i,
  sortedLanguages,
  cardNumberStyles,
  data,
  sortedLanguagesLastYear,
}: {
  i: number;
  sortedLanguages: Language[];
  cardNumberStyles: string[];
  data: Data;
  sortedLanguagesLastYear: Language[];
}) => (
  <div key={i} className="absolute w-full h-full flex flex-col gap-3 py-4 px-6">
    <div className="flex flex-row font-semibold items-center gap-2 flex-wrap text-background">
      <h1 className={`text-6xl font-black ${cardNumberStyles[5 - (i + 1)]}`}>#{5 - i}</h1>
      {sortedLanguagesLastYear.findIndex((language) => language.language === sortedLanguages[5 - (i + 1)].language) !== -1 ? (
        sortedLanguagesLastYear.findIndex((language) => language.language === sortedLanguages[5 - (i + 1)].language) < 5 - (i + 1) ? (
          <div className="flex flex-row items-center text-lg">
            <ChevronDown size={28} color="#e23636" />
            <span className="text-[#e23636]">{Math.abs(sortedLanguagesLastYear.findIndex((language) => language.language === sortedLanguages[5 - (i + 1)].language) - (5 - (i + 1)))}</span>
          </div>
        ) : sortedLanguagesLastYear.findIndex((language) => language.language === sortedLanguages[5 - (i + 1)].language) === 5 - (i + 1) ? (
          <div className="flex flex-row items-center text-lg">
            <Equal size={26} color="oklch(0.708 0 0)" />
          </div>
        ) : (
          <div className="flex flex-row items-center text-lg">
            <ChevronUp size={28} color="#82dd55" />
            <span className="text-[#82dd55]">{Math.abs(sortedLanguagesLastYear.findIndex((language) => language.language === sortedLanguages[5 - (i + 1)].language) - (5 - (i + 1)))}</span>
          </div>
        )
      ) : (
        <div className="flex flex-row items-center text-lg">
          <ChevronUp size={28} color="#82dd55" />
          <span className="text-[#82dd55]">{Math.abs(sortedLanguages.length - (5 - (i + 1)))}</span>
        </div>
      )}
    </div>
    <div className="text-4xl font-bold ps-[0.25em]">
      <h1 className="bg-background text-foreground relative inline border-solid border-foreground whitespace-pre-wrap after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-full after:w-[0.25em] after:bg-background">
        <span className="relative z-1 pe-[0.25em]">{prettifyProgrammingLanguageName(sortedLanguages[5 - (i + 1)].language)}</span>
      </h1>
    </div>
    <div className="flex flex-col text-3xl font-medium text-background">
      <div>
        <span className="font-bold">
          {Math.round(sortedLanguages[5 - (i + 1)].duration / 60)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
        </span>
        minutes
      </div>
      <div>
        or{' '}
        <span className="text-3xl font-bold text-background">
          {Big((sortedLanguages[5 - (i + 1)].duration / data.totalDuration) * 100)
            .round(1)
            .toString()}
          %
        </span>
      </div>
    </div>
  </div>
);

const FlippableCard = ({
  i,
  sortedLanguages,
  cardNumberStyles,
  translate,
  cardTransforms,
  setIsActive,
  scrollYProgress,
  data,
  sortedLanguagesLastYear,
}: {
  i: number;
  sortedLanguages: Language[];
  cardNumberStyles: string[];
  translate: string;
  cardTransforms: MotionValue<string>[];
  setIsActive: (isActive: boolean) => void;
  scrollYProgress: MotionValue<number>;
  data: Data;
  sortedLanguagesLastYear: Language[];
}) => {
  const [hovered, setHovered] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  const ref = useRef<HTMLDivElement>(null);

  const [scrollTreshold, setIsScrollTreshold] = useState(false);

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    switch (i) {
      case 4: {
        setIsScrollTreshold(true);
        break;
      }
      case 3: {
        setIsScrollTreshold(latest > 0.495);
        break;
      }
      case 2: {
        setIsScrollTreshold(latest > 0.495 + (0.2475 / 5) * 1);
        break;
      }
      case 1: {
        setIsScrollTreshold(latest > 0.495 + (0.2475 / 5) * 3);
        break;
      }
      case 0: {
        setIsScrollTreshold(latest > 0.495 + (0.2475 / 5) * 2);
        break;
      }
    }
  });

  return (
    <motion.div
      ref={ref}
      onMouseEnter={(e: React.MouseEvent) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();

        setDirection(e.clientX - rect.left < rect.width / 2 ? 1 : -1);

        setHovered(true);
        setIsActive(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
        setIsActive(false);
      }}
      key={i}
      className={`absolute ${translate} w-1/6 aspect-2/3 drop-shadow-sm`}
      style={{ zIndex: i, transform: cardTransforms[i] }}
    >
      <motion.div className="relative w-full h-full" style={{ perspective: 1000 }}>
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{
            rotateY: scrollTreshold && hovered ? -180 * direction : 0,
          }}
          transition={{
            duration: 0.6,
            ease: (x: number) => {
              const c1 = 1.70158;
              const c2 = c1 * 1.525;

              return x < 0.5 ? (Math.pow(2 * x, 2) * ((c2 + 1) * 2 * x - c2)) / 2 : (Math.pow(2 * x - 2, 2) * ((c2 + 1) * (x * 2 - 2) + c2) + 2) / 2;
            },
          }}
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          <div className="absolute inset-0 backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
            <div className="flex flex-col items-center justify-between bg-foreground w-full h-full rounded-xl">
              <div className="w-full">
                <CardContent i={i} sortedLanguages={sortedLanguages} cardNumberStyles={cardNumberStyles} data={data} sortedLanguagesLastYear={sortedLanguagesLastYear} />
              </div>
              <div className="w-full rotate-180">
                <CardContent i={i} sortedLanguages={sortedLanguages} cardNumberStyles={cardNumberStyles} data={data} sortedLanguagesLastYear={sortedLanguagesLastYear} />
              </div>
            </div>
          </div>
          <div
            className="absolute inset-0 rotate-y-180 backface-hidden"
            style={{
              transform: 'rotateY(180deg)',
              backfaceVisibility: 'hidden',
            }}
          >
            <div className="flex flex-col gap-2 items-center justify-start w-full h-full bg-foreground text-background rounded-xl py-4 px-6">
              <h1 className={`text-5xl font-bold ${cardNumberStyles[5 - (i + 1)]}`}>
                {Big(sortedLanguages[5 - (i + 1)].duration / 60 / 60 / 24)
                  .round(1)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')}{' '}
                hours
              </h1>
              <div className="text-2xl font-medium text-background/95">
                {sortedLanguages[5 - (i + 1)].duration_last_year ? (
                  <>
                    that&apos;s{' '}
                    {sortedLanguages[5 - (i + 1)].duration !== sortedLanguages[5 - (i + 1)].duration_last_year && (
                      <span className="font-bold">
                        {sortedLanguages[5 - (i + 1)].duration >= sortedLanguages[5 - (i + 1)].duration_last_year!
                          ? Big((sortedLanguages[5 - (i + 1)].duration / sortedLanguages[5 - (i + 1)].duration_last_year! - 1) * 100)
                              .round(1)
                              .toString()
                          : Big((1 - sortedLanguages[5 - (i + 1)].duration / sortedLanguages[5 - (i + 1)].duration_last_year!) * 100)
                              .round(1)
                              .toString()}
                      </span>
                    )}{' '}
                    {sortedLanguages[5 - (i + 1)].duration !== sortedLanguages[5 - (i + 1)].duration_last_year && (
                      <span>{sortedLanguages[5 - (i + 1)].duration >= sortedLanguages[5 - (i + 1)].duration_last_year! ? 'percent more' : 'percent less'}</span>
                    )}{' '}
                    {sortedLanguages[5 - (i + 1)].duration !== sortedLanguages[5 - (i + 1)].duration_last_year ? <>compared&nbsp;to last year.</> : <>same&nbsp;as last year!</>}
                  </>
                ) : (
                  <>you didn&apos;t use this&nbsp;language&nbsp;last year.</>
                )}
              </div>
              <div className="text-2xl w-full font-medium flex flex-col gap-1 text-background/95">
                <div className="text-3xl font-bold">used in</div>
                <div>
                  <div>
                    <span className="font-bold">{sortedLanguages[5 - (i + 1)].total_projects}</span> project{sortedLanguages[5 - (i + 1)].total_projects! > 1 ? 's' : ''}.{' '}
                    {sortedLanguages[5 - (i + 1)].total_projects_last_year && sortedLanguages[5 - (i + 1)].total_projects !== sortedLanguages[5 - (i + 1)].total_projects_last_year && (
                      <span className="font-semibold">
                        {sortedLanguages[5 - (i + 1)].total_projects! >= sortedLanguages[5 - (i + 1)].total_projects_last_year! ? '+' : '-'}
                        {sortedLanguages[5 - (i + 1)].total_projects! >= sortedLanguages[5 - (i + 1)].total_projects_last_year!
                          ? Big((sortedLanguages[5 - (i + 1)].total_projects! / sortedLanguages[5 - (i + 1)].total_projects_last_year! - 1) * 100)
                              .round(1)
                              .toString()
                          : Big((1 - sortedLanguages[5 - (i + 1)].total_projects! / sortedLanguages[5 - (i + 1)].total_projects_last_year!) * 100)
                              .round(1)
                              .toString()}
                        %
                      </span>
                    )}
                  </div>
                  <div>
                    on <span className="font-bold">{sortedLanguages[5 - (i + 1)].total_editors}</span> editor{sortedLanguages[5 - (i + 1)].total_editors! > 1 ? 's' : ''}.{' '}
                    {sortedLanguages[5 - (i + 1)].total_editors_last_year && sortedLanguages[5 - (i + 1)].total_editors !== sortedLanguages[5 - (i + 1)].total_editors_last_year && (
                      <span className="font-semibold">
                        {sortedLanguages[5 - (i + 1)].total_editors! >= sortedLanguages[5 - (i + 1)].total_editors_last_year! ? '+' : '-'}
                        {sortedLanguages[5 - (i + 1)].total_editors! >= sortedLanguages[5 - (i + 1)].total_editors_last_year!
                          ? Big((sortedLanguages[5 - (i + 1)].total_editors! / sortedLanguages[5 - (i + 1)].total_editors_last_year! - 1) * 100)
                              .round(1)
                              .toString()
                          : Big((1 - sortedLanguages[5 - (i + 1)].total_editors! / sortedLanguages[5 - (i + 1)].total_editors_last_year!) * 100)
                              .round(1)
                              .toString()}
                        %
                      </span>
                    )}
                  </div>
                  <div>
                    and on <span className="font-bold">{sortedLanguages[5 - (i + 1)].total_hosts}</span> host{sortedLanguages[5 - (i + 1)].total_hosts! > 1 ? 's' : ''}.{' '}
                    {sortedLanguages[5 - (i + 1)].total_hosts_last_year && sortedLanguages[5 - (i + 1)].total_hosts !== sortedLanguages[5 - (i + 1)].total_hosts_last_year && (
                      <span className="font-semibold">
                        {sortedLanguages[5 - (i + 1)].total_hosts! >= sortedLanguages[5 - (i + 1)].total_hosts_last_year! ? '+' : '-'}
                        {sortedLanguages[5 - (i + 1)].total_hosts! >= sortedLanguages[5 - (i + 1)].total_hosts_last_year!
                          ? Big((sortedLanguages[5 - (i + 1)].total_hosts! / sortedLanguages[5 - (i + 1)].total_hosts_last_year! - 1) * 100)
                              .round(1)
                              .toString()
                          : Big((1 - sortedLanguages[5 - (i + 1)].total_hosts! / sortedLanguages[5 - (i + 1)].total_hosts_last_year!) * 100)
                              .round(1)
                              .toString()}
                        %
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-bold">top</div>
                  <div className="text-nowrap text-ellipsis line-clamp-1">
                    <span className="font-semibold">project: </span>
                    {sortedLanguages[5 - (i + 1)].top_project?.project_name.toLowerCase()}
                  </div>
                  <div className="text-nowrap text-ellipsis line-clamp-1">
                    <span className="font-semibold">editor: </span>
                    {sortedLanguages[5 - (i + 1)].top_editor?.editor_name.toLowerCase()}
                  </div>

                  <div className="text-nowrap text-ellipsis line-clamp-1">
                    <span className="font-semibold">host: </span>
                    {sortedLanguages[5 - (i + 1)].top_host?.hostname.toLowerCase()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
