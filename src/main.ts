import './styles/redesign.css';
import content from '../public-content.json';

const escapeHtml = (value: string): string => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const titles = ['WifiWala', 'Student headcount', 'Autonomous RC car', 'The Judge', 'GallaMandi', 'AirNet WhatsApp chatbot', 'WhatsApp interview bot', 'IDM Clone'];
const slugs = ['wifiwala', 'student-headcount', 'autonomous-car', 'the-judge', 'gallamandi', 'airnet-chatbot', 'interview-bot', 'idm-clone'];

document.getElementById('award-list')!.innerHTML = content.achievements.map(award => `<li><strong>${escapeHtml(award.title)}</strong><span>${escapeHtml(award.detail)} · ${escapeHtml(award.year)}</span></li>`).join('');
document.getElementById('archive-list')!.innerHTML = content.projects.slice(3).map((project, i) => `<button class="archive-row" data-project="${i + 3}"><strong>${titles[i + 3]}</strong><span>${escapeHtml(project.status)}</span><span aria-hidden="true">↗</span></button>`).join('');

const dialog = document.getElementById('project-dialog') as HTMLDialogElement;
const dialogContent = document.getElementById('dialog-content')!;
let returnHash = '#work';
let returnFocus: HTMLElement | null = null;
function openProject(index: number, updateHash = true): void {
  const project = content.projects[index];
  if (!project) return;
  if (!dialog.open) {
    returnFocus = document.activeElement as HTMLElement;
    returnHash = location.hash.startsWith('#project-') ? '#work' : location.hash;
  }
  const section = (title: string, text: string) => `<section class="case-section"><h3>${title}</h3><p>${escapeHtml(text)}</p></section>`;
  dialogContent.innerHTML = `<p class="case-status">${escapeHtml(project.status)} <span aria-hidden="true">·</span> ${escapeHtml(project.role)}</p><h2 id="dialog-title">${titles[index]}</h2><p class="case-pitch">${escapeHtml(project.pitch)}</p>${project.measurable_outcome ? `<p class="case-outcome">${escapeHtml(project.measurable_outcome)}</p>` : ''}${section('The problem', project.problem)}${project.client_confidential ? '<p class="private-note">Completed during my PMIU internship. Client implementation details are private.</p>' : section('What I built', project.what_i_built)}<details class="case-technical"><summary>Technical details <span class="expand-icon" aria-hidden="true">+</span></summary>${!project.client_confidential ? `<p>${escapeHtml(project.architecture)}</p>` : ''}<div class="tags">${project.stack.map(tech => `<span>${escapeHtml(tech)}</span>`).join('')}</div></details><div class="case-links">${project.public_links.length ? `<a class="primary-link" href="https://${escapeHtml(project.public_links[0].replace(/^https?:\/\//, ''))}" target="_blank" rel="noopener noreferrer">Visit ${titles[index]} <span aria-hidden="true">↗</span></a>` : ''}<a class="quiet-link" href="mailto:${content.identity.email}?subject=${encodeURIComponent('Let’s talk about ' + titles[index])}">Ask me about it <span aria-hidden="true">↗</span></a></div>`;
  if (!dialog.open) dialog.showModal();
  document.body.classList.add('dialog-open');
  dialog.scrollTop = 0;
  (dialog.querySelector('.dialog-close') as HTMLButtonElement).focus();
  if (updateHash) history.pushState(null, '', '#project-' + slugs[index]);
}
function syncProjectFromUrl(): void {
  const index = slugs.indexOf(location.hash.replace('#project-', ''));
  if (location.hash.startsWith('#project-') && index >= 0) openProject(index, false);
  else if (dialog.open) dialog.close();
}
document.querySelectorAll<HTMLButtonElement>('[data-project]').forEach(button => button.addEventListener('click', () => openProject(Number(button.dataset.project))));
dialog.querySelector('.dialog-close')!.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => {
  document.body.classList.remove('dialog-open');
  if (location.hash.startsWith('#project-')) history.replaceState(null, '', location.pathname + location.search + returnHash);
  returnFocus?.focus({ preventScroll: true });
});
window.addEventListener('popstate', syncProjectFromUrl);
window.addEventListener('hashchange', syncProjectFromUrl);
syncProjectFromUrl();
