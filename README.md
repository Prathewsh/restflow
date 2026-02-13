# RestFlow

**RestFlow** is a lightweight, minimal web based REST client built on **Sveltekit**, inspired by tools like Thunder Client and Postman — but focused on speed, simplicity, and zero bloat.

Perfect for quick API testing without heavy Electron apps.

---

## Features

- **Collections Management**: Organize your API requests into logical folders.
- **Persistent Local Storage**: Your data stays in your browser, no cloud account needed.
- **Super lightweight & fast**: Zero bloat, instant loading.
- **Extended HTTP Support**: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`.
- **Dynamic Request Body**:
  - Raw JSON / Text with auto-sync.
  - Form Data (multipart/key-value) management.
- **Advanced Response Viewer**:
  - Status codes and status text.
  - **Request latency** tracking (ms).
  - Pretty-printed JSON formatting.
- **Clean, Modern UI**: Dark-themed, glassmorphic design focused on UX.

---

## Built With

- **Sveltekit** / **Svelte 5**
- Native **Fetch API**
- Reactive Svelte Stores
- Vanilla CSS (Tailwind aware)

---

## Recent Updates (Changelog)

### v0.1.1 - Collections & Persistence Focus

#### Added
- **Global Store Engine**: Re-engineered Svelte stores to support nested collections and persistent sync to `localStorage`.
- **CRUD Operations**: Complete management for Collections and Requests (Create, Rename via double-click, Delete with confirmation).
- **Hydration Logic**: Implemented a hydration guard to prevent the "Sample Data flash" during server-to-client transitions.
- **Enhanced Sidebar**: Method-labeled badges and hover-triggered action buttons for a cleaner workspace.
- **Latency Tracking**: Response viewer now calculates and displays request time in milliseconds.
- **Logo Asset**: Integrated official `restflow_logo.png` into the sidebar.

#### Improved
- **Drafting System**: Request Builder now maintains independent state for every request, auto-saving drafts as you type.
- **Accessibility (a11y)**: Added ARIA roles and full keyboard navigation support (Enter/Space) to the sidebar.
- **Responsive Layout**: Refined main workspace for better handling of long URLs and large JSON bodies.

#### Fixed
- Resolved Svelte compiler errors regarding invalid nested HTML buttons in the navigation.
- Fixed SSR mismatches where default sample data would briefly appear before local data loaded.
- Standardized HTTP method color tokens across the sidebar and builder.

---

## Contributing

Contributions are welcome!

- Fork the repo
- Create a new branch
- Commit your changes
- Open a Pull Request
