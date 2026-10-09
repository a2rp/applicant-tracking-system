![Project screenshot](./screenshot.png)

# Hirly - Applicant Tracking System

Hirly is a frontend-only applicant tracking workspace for small hiring teams. It keeps open roles, candidate profiles, and stage changes together in a focused multi-page interface.

## Pages

| Route | Purpose |
| --- | --- |
| / | Hiring overview with live candidate and role counts, configurable stage reporting, upcoming interviews, average scorecard ratings, and recent activity |
| /candidates | Search and filter profiles, create and edit candidates, attach resumes, schedule interviews, capture scorecards, and export filtered results |
| /jobs | Search, create, edit, pause, close, remove, and export roles; applicant counts update from candidate records |
| /pipeline | Filter candidates by role, move them through configurable hiring stages, and manage stage definitions |
| Any other path | Not found page with a link back to the overview |

## Hiring workflows

### Candidates

Use the global search or candidate filters to find someone by name, email, role, stage, or job. Add or edit contact details, source, location, experience, recruiter notes, and an optional PDF, DOC, or DOCX resume (up to 5 MB). The resume can be downloaded from the profile during the current session. Candidate list stage selectors and the pipeline board update the same record.

Open a profile to schedule an interview with a type, future date and time, and interviewer. Mark it complete, cancel it with confirmation, and add a structured scorecard covering role skills, communication, problem solving, and collaboration, plus written evidence. Scorecard averages appear in the overview. Candidate and role CSV exports include the currently filtered records.

Removing a candidate opens a custom confirmation dialog. Escape, the close button, clicking outside the dialog, or choosing Keep candidate leaves the record unchanged. Confirming removal updates the candidate list and session activity.

### Jobs

Create a role with its title, department, location, employment type, salary range, and hiring manager. Edit those details later or change its status between Open, Paused, and Closed. Applicant totals are calculated from the candidate records assigned to each role.

Removing a role uses a custom confirmation dialog. Candidate records assigned to that role stay in the workspace and become unassigned.

### Overview and pipeline

The overview and activity feed update from actions in the current app session. Interview counts and times come from scheduled interviews; completed or cancelled interviews leave the upcoming list. Stage bars, scorecard averages, active candidate totals, offer counts, role applicant totals, and the sidebar candidate count respond to changes across pages.

The pipeline board groups candidates by the configured hiring stages, with Rejected candidates kept out of the active board. Add custom stages from Manage stages. A stage with candidates assigned cannot be removed until those candidates move elsewhere; Applied and Rejected are required system stages. Stage updates are shared by the candidate form, candidate list, pipeline board, and overview.

## Interface details

- The fixed workspace sidebar links to the four app pages. On smaller screens, the navigation opens as a drawer and closes on route selection, outside click, or Escape.
- The top bar hides while scrolling down and returns while scrolling up. Its candidate search opens the matching candidate list. Press Ctrl+K or Command+K to focus the search field.
- The route pages load lazily and show a text-free animated spinner while a page loads.
- Candidate, interview, scorecard, role, and stage actions show custom toast feedback. Destructive actions use accessible custom confirmation dialogs.
- Search, filters, candidate and role forms, status changes, exports, interview scheduling, scorecards, stage management, modal controls, and responsive navigation are interactive.
- The visible text minimum is 13px, with body copy generally 14–16px. Reduced-motion preferences are respected.
- The document scrollbar overlays the page and appears on pointer movement or scrolling without taking layout width.
- Links and enabled buttons have border and shadow feedback. Sidebar navigation uses an animated underline, and reduced-motion preferences are respected.
- Footer links contain React Icons only. Hover or keyboard focus reveals each link's name and destination in a compact tooltip.

## Demo data and storage

The app starts with sample candidates, roles, interviews, activity, and stages. All changes live in React memory for the current page session and reset to the sample data after a full reload. The app does not use localStorage, sessionStorage, IndexedDB, or a backend. Resume file contents are read into memory only; they are not uploaded to a server and are lost on reload.

This is a frontend-only product preview. It does not provide shared accounts, server persistence, access controls, email delivery, calendar synchronization, or secure document storage.

## Images and brand assets

Candidate profile pictures are free Unsplash images saved locally in public/assets/candidates/ and used as fictional demo portraits. They are subject to the [Unsplash License](https://unsplash.com/license). The app uses the project favicon, the supplied public/logo.png in the footer, and public/preview.png for social sharing metadata. Product images are not loaded from remote URLs at runtime.

## Run locally

Use Node.js and npm from this folder.

- Install dependencies: npm install
- Start the development server: npm run dev
- Run ESLint: npm run lint
- Create a production build: npm run build
- Preview the production build: npm run preview
- Publish to GitHub Pages: npm run deploy

## Deployment

The public source repository is [github.com/a2rp/applicant-tracking-system](https://github.com/a2rp/applicant-tracking-system).

Live app: [https://a2rp.github.io/applicant-tracking-system/](https://a2rp.github.io/applicant-tracking-system/)

GitHub Pages serves the Vite build from the gh-pages branch. The Vite base path and asset metadata use the repository URL.
The build also publishes a matching 404 document so direct visits and refreshes on nested app routes load the React page.

## Future improvements

The app implements client-side interview scheduling, scorecards, configurable stages, CSV exports, and a session activity feed. Production use would need backend and service integrations for:

- Shared API persistence, team accounts, role-based permissions, and durable audit history.
- Calendar provider sync, timezone-aware invitations, email reminders, and interviewer notifications.
- Secure resume storage with access controls, malware scanning, document parsing, and retention policies.
- Historical reporting across teams and sessions, backed by durable data and export permissions.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
