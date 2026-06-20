## Learned User Preferences

- Follow `docs/ARCHITECTURE.md` exactly for folder structure, API routes, roles, auth flow, and database schema.
- Implement one assignment phase at a time; do not build features from later phases early.
- Do not change the database schema unless absolutely necessary.
- Do not invent new features beyond `requirement.txt` and the architecture blueprint.
- When asked for fixes or a specific phase, limit scope to that request only.
- Do not generate code during read-only audit or review tasks unless explicitly asked.
- Do not create git commits unless explicitly requested.
- On Windows PowerShell, chain shell commands with `;` rather than `&&`.

## Learned Workspace Facts

- Nestify is a MERN assignment: a property rental and booking marketplace.
- Client stack: React, Vite, Tailwind CSS, DaisyUI, TanStack Query, React Hook Form, Framer Motion, Recharts.
- Server stack: Node.js, Express, MongoDB, JWT; Firebase Auth for email/password and Google login.
- Payments use Stripe Checkout; roles are tenant, owner, and admin (Google sign-in defaults to tenant).
- Assignment spec is `requirement.txt`; technical blueprint is `docs/ARCHITECTURE.md`.
- UI design references are root HTML mockups: `home.html`, `browse.html`, `details.html`, `list_your_property.html`, `owner_dashboard.html`, `tanant_dashboard.html`.
- Project was built in phased roadmap order: Phase 0 through Phase 6 (auth through admin dashboard).
