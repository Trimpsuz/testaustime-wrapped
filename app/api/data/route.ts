import { type NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

type Entry = {
  id: number;
  start_time: string;
  duration: number;
  project_name: string;
  language: string;
  editor_name: string;
  hostname: string;
};

type Project = {
  project_name: string;
  duration: number;
  start_time: string;
  total_languages?: number;
  total_editors?: number;
  total_hosts?: number;
  top_language?: Language;
  top_editor?: Editor;
  top_host?: Host;
  duration_last_year?: number;
  total_languages_last_year?: number;
  total_editors_last_year?: number;
  total_hosts_last_year?: number;
  top_language_last_year?: Language;
  top_editor_last_year?: Editor;
  top_host_last_year?: Host;
};

type Language = {
  language: string;
  duration: number;
  start_time: string;
  total_projects?: number;
  total_editors?: number;
  total_hosts?: number;
  top_project?: Project;
  top_editor?: Editor;
  top_host?: Host;
  duration_last_year?: number;
  total_projects_last_year?: number;
  total_editors_last_year?: number;
  total_hosts_last_year?: number;
  top_project_last_year?: Project;
  top_editor_last_year?: Editor;
  top_host_last_year?: Host;
};

type Editor = {
  editor_name: string;
  duration: number;
  start_time: string;
  total_projects?: number;
  total_languages?: number;
  total_hosts?: number;
  top_project?: Project;
  top_language?: Language;
  top_host?: Host;
  duration_last_year?: number;
  total_projects_last_year?: number;
  total_languages_last_year?: number;
  total_hosts_last_year?: number;
  top_project_last_year?: Project;
  top_language_last_year?: Language;
  top_host_last_year?: Host;
};

type Host = {
  hostname: string;
  duration: number;
  start_time: string;
  total_projects?: number;
  total_editors?: number;
  total_languages?: number;
  top_project?: Project;
  top_editor?: Editor;
  top_language?: Language;
  duration_last_year?: number;
  total_projects_last_year?: number;
  total_editors_last_year?: number;
  total_languages_last_year?: number;
  top_project_last_year?: Project;
  top_editor_last_year?: Editor;
  top_language_last_year?: Language;
};

const splitSession = (
  startDate: Date,
  duration: number,
  config: {
    key: (d: Date) => number | string;
    nextBoundary: (d: Date) => Date;
  }
) => {
  const result: Record<string | number, number> = {};
  let remaining = duration;
  let cursor = new Date(startDate);

  while (remaining > 0) {
    const nextBoundary = config.nextBoundary(cursor);
    const diffSeconds = Math.min((nextBoundary.getTime() - cursor.getTime()) / 1000, remaining);

    const key = config.key(cursor);
    result[key] = (result[key] || 0) + diffSeconds;

    remaining -= diffSeconds;
    cursor = new Date(cursor.getTime() + diffSeconds * 1000);
  }

  return result;
};

const parseData = (data: Entry[]) => {
  const projects: Project[] = Array.from(
    data
      .reduce((acc: Map<string, Project>, entry: Entry) => {
        const { project_name, start_time, duration } = entry;

        if (acc.has(project_name)) {
          const existing = acc.get(project_name)!;

          if (new Date(start_time) < new Date(existing.start_time)) {
            existing.start_time = start_time;
          }

          existing.duration += duration;
        } else {
          acc.set(project_name, {
            project_name,
            start_time,
            duration,
          });
        }

        return acc;
      }, new Map<string, Project>())
      .values()
  );

  for (const project of projects) {
    project.total_languages = [...new Set(data.filter((entry: Entry) => entry.project_name === project.project_name).map((item: Entry) => item.language))].length;
    project.total_editors = [...new Set(data.filter((entry: Entry) => entry.project_name === project.project_name).map((item: Entry) => item.editor_name))].length;
    project.total_hosts = [...new Set(data.filter((entry: Entry) => entry.project_name === project.project_name).map((item: Entry) => item.hostname))].length;

    project.top_language = Array.from<Language>(
      data
        .filter((entry: Entry) => entry.project_name === project.project_name)
        .reduce((acc: Map<string, Language>, entry: Entry) => {
          const { language, start_time, duration } = entry;

          if (acc.has(language)) {
            const existing = acc.get(language)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(language, {
              language,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Language>())
        .values()
    ).sort((a: Language, b: Language) => b.duration - a.duration)[0];

    project.top_editor = Array.from<Editor>(
      data
        .filter((entry: Entry) => entry.project_name === project.project_name)
        .reduce((acc: Map<string, Editor>, entry: Entry) => {
          const { editor_name, start_time, duration } = entry;

          if (acc.has(editor_name)) {
            const existing = acc.get(editor_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(editor_name, {
              editor_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Editor>())
        .values()
    ).sort((a: Editor, b: Editor) => b.duration - a.duration)[0];

    project.top_host = Array.from<Host>(
      data
        .filter((entry: Entry) => entry.project_name === project.project_name)
        .reduce((acc: Map<string, Host>, entry: Entry) => {
          const { hostname, start_time, duration } = entry;

          if (acc.has(hostname)) {
            const existing = acc.get(hostname)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(hostname, {
              hostname,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Host>())
        .values()
    ).sort((a: Host, b: Host) => b.duration - a.duration)[0];
  }

  const languages: Language[] = Array.from(
    data
      .reduce((acc: Map<string, Language>, entry: Entry) => {
        const { language, start_time, duration } = entry;

        if (acc.has(language)) {
          const existing = acc.get(language)!;

          if (new Date(start_time) < new Date(existing.start_time)) {
            existing.start_time = start_time;
          }

          existing.duration += duration;
        } else {
          acc.set(language, {
            language,
            start_time,
            duration,
          });
        }

        return acc;
      }, new Map<string, Language>())
      .values()
  );

  for (const language of languages) {
    language.total_projects = [...new Set(data.filter((entry: Entry) => entry.language === language.language).map((item: Entry) => item.project_name))].length;
    language.total_editors = [...new Set(data.filter((entry: Entry) => entry.language === language.language).map((item: Entry) => item.editor_name))].length;
    language.total_hosts = [...new Set(data.filter((entry: Entry) => entry.language === language.language).map((item: Entry) => item.hostname))].length;

    language.top_project = Array.from<Project>(
      data
        .filter((entry: Entry) => entry.language === language.language)
        .reduce((acc: Map<string, Project>, entry: Entry) => {
          const { project_name, start_time, duration } = entry;

          if (acc.has(project_name)) {
            const existing = acc.get(project_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(project_name, {
              project_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Project>())
        .values()
    ).sort((a: Project, b: Project) => b.duration - a.duration)[0];

    language.top_editor = Array.from<Editor>(
      data
        .filter((entry: Entry) => entry.language === language.language)
        .reduce((acc: Map<string, Editor>, entry: Entry) => {
          const { editor_name, start_time, duration } = entry;

          if (acc.has(editor_name)) {
            const existing = acc.get(editor_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(editor_name, {
              editor_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Editor>())
        .values()
    ).sort((a: Editor, b: Editor) => b.duration - a.duration)[0];

    language.top_host = Array.from<Host>(
      data
        .filter((entry: Entry) => entry.language === language.language)
        .reduce((acc: Map<string, Host>, entry: Entry) => {
          const { hostname, start_time, duration } = entry;

          if (acc.has(hostname)) {
            const existing = acc.get(hostname)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(hostname, {
              hostname,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Host>())
        .values()
    ).sort((a: Host, b: Host) => b.duration - a.duration)[0];
  }

  const editors: Editor[] = Array.from(
    data
      .reduce((acc: Map<string, Editor>, entry: Entry) => {
        const { editor_name, start_time, duration } = entry;

        if (acc.has(editor_name)) {
          const existing = acc.get(editor_name)!;

          if (new Date(start_time) < new Date(existing.start_time)) {
            existing.start_time = start_time;
          }

          existing.duration += duration;
        } else {
          acc.set(editor_name, {
            editor_name,
            start_time,
            duration,
          });
        }

        return acc;
      }, new Map<string, Editor>())
      .values()
  );

  for (const editor of editors) {
    editor.total_projects = [...new Set(data.filter((entry: Entry) => entry.editor_name === editor.editor_name).map((item: Entry) => item.project_name))].length;
    editor.total_languages = [...new Set(data.filter((entry: Entry) => entry.editor_name === editor.editor_name).map((item: Entry) => item.language))].length;
    editor.total_hosts = [...new Set(data.filter((entry: Entry) => entry.editor_name === editor.editor_name).map((item: Entry) => item.hostname))].length;

    editor.top_project = Array.from<Project>(
      data
        .filter((entry: Entry) => entry.editor_name === editor.editor_name)
        .reduce((acc: Map<string, Project>, entry: Entry) => {
          const { project_name, start_time, duration } = entry;

          if (acc.has(project_name)) {
            const existing = acc.get(project_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(project_name, {
              project_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Project>())
        .values()
    ).sort((a: Project, b: Project) => b.duration - a.duration)[0];

    editor.top_language = Array.from<Language>(
      data
        .filter((entry: Entry) => entry.editor_name === editor.editor_name)
        .reduce((acc: Map<string, Language>, entry: Entry) => {
          const { language, start_time, duration } = entry;

          if (acc.has(language)) {
            const existing = acc.get(language)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(language, {
              language,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Language>())
        .values()
    ).sort((a: Language, b: Language) => b.duration - a.duration)[0];

    editor.top_host = Array.from<Host>(
      data
        .filter((entry: Entry) => entry.editor_name === editor.editor_name)
        .reduce((acc: Map<string, Host>, entry: Entry) => {
          const { hostname, start_time, duration } = entry;

          if (acc.has(hostname)) {
            const existing = acc.get(hostname)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(hostname, {
              hostname,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Host>())
        .values()
    ).sort((a: Host, b: Host) => b.duration - a.duration)[0];
  }

  const hosts: Host[] = Array.from(
    data
      .reduce((acc: Map<string, Host>, entry: Entry) => {
        const { hostname, start_time, duration } = entry;

        if (acc.has(hostname)) {
          const existing = acc.get(hostname)!;

          if (new Date(start_time) < new Date(existing.start_time)) {
            existing.start_time = start_time;
          }

          existing.duration += duration;
        } else {
          acc.set(hostname, {
            hostname,
            start_time,
            duration,
          });
        }

        return acc;
      }, new Map<string, Host>())
      .values()
  );

  for (const host of hosts) {
    host.total_projects = [...new Set(data.filter((entry: Entry) => entry.hostname === host.hostname).map((item: Entry) => item.project_name))].length;
    host.total_editors = [...new Set(data.filter((entry: Entry) => entry.hostname === host.hostname).map((item: Entry) => item.editor_name))].length;
    host.total_languages = [...new Set(data.filter((entry: Entry) => entry.hostname === host.hostname).map((item: Entry) => item.language))].length;

    host.top_project = Array.from<Project>(
      data
        .filter((entry: Entry) => entry.hostname === host.hostname)
        .reduce((acc: Map<string, Project>, entry: Entry) => {
          const { project_name, start_time, duration } = entry;

          if (acc.has(project_name)) {
            const existing = acc.get(project_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(project_name, {
              project_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Project>())
        .values()
    ).sort((a: Project, b: Project) => b.duration - a.duration)[0];

    host.top_language = Array.from<Language>(
      data
        .filter((entry: Entry) => entry.hostname === host.hostname)
        .reduce((acc: Map<string, Language>, entry: Entry) => {
          const { language, start_time, duration } = entry;

          if (acc.has(language)) {
            const existing = acc.get(language)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(language, {
              language,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Language>())
        .values()
    ).sort((a: Language, b: Language) => b.duration - a.duration)[0];

    host.top_editor = Array.from<Editor>(
      data
        .filter((entry: Entry) => entry.language === host.hostname)
        .reduce((acc: Map<string, Editor>, entry: Entry) => {
          const { editor_name, start_time, duration } = entry;

          if (acc.has(editor_name)) {
            const existing = acc.get(editor_name)!;

            if (new Date(start_time) < new Date(existing.start_time)) {
              existing.start_time = start_time;
            }

            existing.duration += duration;
          } else {
            acc.set(editor_name, {
              editor_name,
              start_time,
              duration,
            });
          }

          return acc;
        }, new Map<string, Editor>())
        .values()
    ).sort((a: Editor, b: Editor) => b.duration - a.duration)[0];
  }

  const totalDuration = data.reduce((acc: number, entry: Entry) => acc + entry.duration, 0);
  const totalProjects = projects.length;
  const totalLanguages = languages.length;
  const totalEditors = editors.length;
  const totalHosts = hosts.length;

  return { projects, languages, editors, hosts, totalDuration, totalProjects, totalLanguages, totalEditors, totalHosts };
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const username = searchParams.get('username');
  const year = searchParams.get('year');

  if (!username || !year) {
    return NextResponse.json({ error: 'Missing username or year' }, { status: 400 });
  }

  if (Number(year) < 2022 || Number(year) > new Date().getFullYear()) {
    return NextResponse.json({ error: 'Invalid year' }, { status: 400 });
  }

  if (!/^[0-9A-Za-z_]{2,32}$/.test(username)) {
    return NextResponse.json({ error: 'Invalid username' }, { status: 400 });
  }

  try {
    let { data } = await axios.get(`https://api.testaustime.fi/users/${username}/activity/data`);

    const dataLastYear = data.filter((entry: Entry) => entry.start_time.startsWith(String(Number(year) - 1)));
    data = data.filter((entry: Entry) => entry.start_time.startsWith(year));

    if (data.length === 0) {
      return NextResponse.json({ error: 'No data found' }, { status: 404 });
    }

    const { projects, languages, editors, hosts, totalDuration, totalProjects, totalLanguages, totalEditors, totalHosts } = parseData(data);
    const parsedLastYear = parseData(dataLastYear);

    for (const project of projects) {
      const lastYearProject = parsedLastYear.projects.find((item: Project) => item.project_name === project.project_name);

      if (lastYearProject) {
        project.duration_last_year = lastYearProject.duration;
        project.total_languages_last_year = lastYearProject.total_languages;
        project.total_editors_last_year = lastYearProject.total_editors;
        project.total_hosts_last_year = lastYearProject.total_hosts;
        project.top_language_last_year = lastYearProject.top_language;
        project.top_editor_last_year = lastYearProject.top_editor;
        project.top_host_last_year = lastYearProject.top_host;
      }
    }

    for (const language of languages) {
      const lastYearLanguage = parsedLastYear.languages.find((item: Language) => item.language === language.language);

      if (lastYearLanguage) {
        language.duration_last_year = lastYearLanguage.duration;
        language.total_projects_last_year = lastYearLanguage.total_projects;
        language.total_editors_last_year = lastYearLanguage.total_editors;
        language.total_hosts_last_year = lastYearLanguage.total_hosts;
        language.top_project_last_year = lastYearLanguage.top_project;
        language.top_editor_last_year = lastYearLanguage.top_editor;
        language.top_host_last_year = lastYearLanguage.top_host;
      }
    }

    for (const editor of editors) {
      const lastYearEditor = parsedLastYear.editors.find((item: Editor) => item.editor_name === editor.editor_name);

      if (lastYearEditor) {
        editor.duration_last_year = lastYearEditor.duration;
        editor.total_projects_last_year = lastYearEditor.total_projects;
        editor.total_languages_last_year = lastYearEditor.total_languages;
        editor.total_hosts_last_year = lastYearEditor.total_hosts;
        editor.top_project_last_year = lastYearEditor.top_project;
        editor.top_language_last_year = lastYearEditor.top_language;
        editor.top_host_last_year = lastYearEditor.top_host;
      }
    }

    for (const host of hosts) {
      const lastYearHost = parsedLastYear.hosts.find((item: Host) => item.hostname === host.hostname);

      if (lastYearHost) {
        host.duration_last_year = lastYearHost.duration;
        host.total_projects_last_year = lastYearHost.total_projects;
        host.total_languages_last_year = lastYearHost.total_languages;
        host.total_editors_last_year = lastYearHost.total_editors;
        host.top_project_last_year = lastYearHost.top_project;
        host.top_language_last_year = lastYearHost.top_language;
        host.top_editor_last_year = lastYearHost.top_editor;
      }
    }

    const activityClocks = {
      day: (() => {
        const hours = Array(24).fill(0);

        data.forEach((entry: Entry) => {
          const start = new Date(entry.start_time);
          const duration = entry.duration;

          const parts = splitSession(start, duration, {
            key: (d: Date) => d.getHours(),
            nextBoundary: (d: Date) => {
              const next = new Date(d);
              next.setHours(d.getHours() + 1, 0, 0, 0);
              return next;
            },
          });

          for (const [hour, seconds] of Object.entries(parts)) {
            hours[Number(hour)] += seconds;
          }
        });

        return hours;
      })(),
      week: (() => {
        const weekdays = Array(7).fill(0);

        data.forEach((entry: Entry) => {
          const start = new Date(entry.start_time);

          const parts = splitSession(start, entry.duration, {
            key: (d) => d.getDay(),
            nextBoundary: (d) => {
              const next = new Date(d);
              next.setHours(24, 0, 0, 0);
              return next;
            },
          });

          for (const [weekday, seconds] of Object.entries(parts)) {
            weekdays[Number(weekday)] += seconds;
          }
        });

        return weekdays;
      })(),
      year: (() => {
        const months = Array(12).fill(0);

        data.forEach((entry: Entry) => {
          const start = new Date(entry.start_time);
          const duration = entry.duration;

          const parts = splitSession(start, duration, {
            key: (d: Date) => d.getMonth(),
            nextBoundary: (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 1),
          });

          for (const [month, seconds] of Object.entries(parts)) {
            months[Number(month)] += seconds;
          }
        });

        return months;
      })(),
    };

    return NextResponse.json({ projects, languages, editors, hosts, totalDuration, totalProjects, totalLanguages, totalEditors, totalHosts, activityClocks });
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
