export interface ProjectRepo {
  owner: string;
  repo: string;
  /** Fallback description shown if the GitHub API fetch fails. */
  fallback?: string;
}

export const projectRepos: ProjectRepo[] = [
  { owner: "ryuyx", repo: "OpenRange", fallback: "An open-source project." },
];
