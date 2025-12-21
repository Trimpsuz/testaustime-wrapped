export type Entry = {
  id: number;
  start_time: string;
  duration: number;
  project_name: string;
  language: string;
  editor_name: string;
  hostname: string;
};

export type Project = {
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

export type Language = {
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

export type Editor = {
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

export type Host = {
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

export type Data = {
  projects: Project[];
  languages: Language[];
  editors: Editor[];
  hosts: Host[];
  totalDuration: number;
  totalProjects: number;
  totalLanguages: number;
  totalEditors: number;
  totalHosts: number;
  totalDurationLastYear: number;
  totalProjectsLastYear: number;
  totalLanguagesLastYear: number;
  totalEditorsLastYear: number;
  totalHostsLastYear: number;
  activityClocks: {
    day: number[];
    week: number[];
    year: number[];
  };
};
