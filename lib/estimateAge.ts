import { normalizeProgrammingLanguageName } from './programmingLanguagesUtils';
import type { Language } from './types';

const LANGUAGE_RELEASE_YEARS: Record<string, number> = {
  typescript: 2012,
  typescriptreact: 2013,
  javascript: 1995,
  javascriptreact: 2013,
  json: 2001,
  html: 1993,
  css: 1996,
  rust: 2015,
  abap: 1983,
  bat: 1985,
  bibtex: 1985,
  coffeescript: 2009,
  cpp: 1985,
  csharp: 2000,
  'cuda-cpp': 2007,
  fsharp: 2005,
  jsonc: 2001,
  latex: 1985,
  'objective-c': 1984,
  'objective-cpp': 1985,
  php: 1995,
  powershell: 2006,
  scss: 2006,
  sass: 2010,
  shaderlab: 2005,
  sh: 1989,
  sql: 1986,
  text: 1982,
  vb: 1991,
  'vue-html': 2014,
  xml: 1998,
  xsl: 1998,
  yaml: 2001,
  toml: 2013,
  cabalconfig: 2005,
  zsh: 1990,
  nginx: 2004,
  sshconfig: 1995,
  dockercompose: 2014,
  mdx: 2017,
  dockerfile: 2013,
  sbt: 2018,
  java: 1995,
  kotlin: 2011,
  scala: 2004,
  'scala 3': 2021,
  markdown: 2004,
  perl: 1987,
  jade: 1996,
  make: 1976,
  groovy: 2007,
  c: 1972,
  tailwindcss: 2019,
  python: 1991,
  cmake: 2000,
  ruby: 1995,
  'gradle-kotlin-dsl': 2016,
  'java-properties': 1995,
  vue: 2014,
  dart: 2011,
  postcss: 2013,
  astro: 2022,
  prisma: 2019,
  ansible: 2012,
  go: 2012,
  handlebars: 2013,
  typst: 2023,
  jinja: 2008,
  gotmpl: 2016,
  svelte: 2016,
  proto: 2016,
  nix: 2006,
  gleam: 2016,
  terraform: 2014,
  hcl: 2016,
  bib: 1985,
  tf: 2014,
  tex: 1978,
  bst: 1985,
  haskell: 1990,
  postscr: 1997,
  lean: 2013,
  lua: 1994,
  graphql: 2015,
  idris2: 2021,
  matlab: 1984,
  vim: 1991,
  scheme: 1975,
  fennel: 2016,
  glsl: 2002,
  wgsl: 2021,
  list: 1960,
  meson: 2013,
  d: 2001,
  j: 1990,
  r: 1993,
};

export const getEstimatedAge = (languages: Language[], totalDuration: number, baselineAge: number = 18, currentYear: number = new Date().getFullYear()) => {
  if (languages.length === 0) return baselineAge;

  if (totalDuration === 0) return baselineAge;

  let weightedAge = 0;

  for (const language of languages) {
    if (!language.language || normalizeProgrammingLanguageName(language.language.toLowerCase()) === null) continue;

    const releaseYear = LANGUAGE_RELEASE_YEARS[normalizeProgrammingLanguageName(language.language.toLowerCase())!];

    if (!releaseYear) continue;

    weightedAge += (currentYear - releaseYear) * (language.duration / totalDuration);
  }

  return Math.round(baselineAge + weightedAge);
};

export const getAvgLanguageReleaseYear = (languages: Language[]) => {
  if (languages.length === 0) return 0;

  let sum = 0;
  let langsAmt = 0;

  for (const language of languages) {
    if (!language.language || normalizeProgrammingLanguageName(language.language.toLowerCase()) === null) continue;

    const releaseYear = LANGUAGE_RELEASE_YEARS[normalizeProgrammingLanguageName(language.language.toLowerCase())!];

    if (!releaseYear) continue;

    sum += releaseYear;
    langsAmt += 1;
  }

  return Math.round(sum / langsAmt);
};
