import { readFile, writeFile } from 'node:fs/promises';
const root = new URL('../', import.meta.url);
const source = JSON.parse(await readFile(new URL('content.json', root), 'utf8'));
const publicContent = {
  identity: { email: source.identity.email },
  projects: source.projects.map(project => ({
    ...project,
    what_i_built: project.client_confidential ? '' : project.what_i_built,
    architecture: project.client_confidential ? '' : project.architecture,
  })),
  achievements: source.achievements,
};
await writeFile(new URL('public-content.json', root), JSON.stringify(publicContent, null, 2) + '\n');
