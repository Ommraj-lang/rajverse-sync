    # TaskFlow — Modern Professional Task Manager

**TaskFlow** is a sleek, responsive, and beginner-friendly Task Manager / To-Do List web application built with pure **HTML5**, **CSS3**, and **Vanilla JavaScript**. It requires zero frameworks, no backend server, and no external database — all your data seamlessly persists in the browser via `LocalStorage`.

---

## 🚀 Live Demo & Features

### Core Capabilities
1. **Add Tasks**: Specify Task Title, detailed Description, Priority (`Low`, `Medium`, `High`), Category (`Work`, `Personal`, `Study`, `Finance`, `Health`, `General`), and an optional Due Date.
2. **Edit Tasks**: Update title, description, priority, category, or due date in an accessible modal dialog.
3. **Delete Tasks**: Remove tasks with a safety confirmation dialog to prevent accidental clicks.
4. **Mark as Completed**: Toggle task completion with smooth checkbox animations, dynamic strikethrough, and completion timestamps.
5. **Task Priority Badges**: Visual indicator stripes and badges for `High` (coral red), `Medium` (amber), and `Low` (emerald).
6. **Smart Due Date Alerts**:
   - `Overdue`: Red highlight badge when a task has passed its due date.
   - `Due Today`: Warm amber badge for deadlines today.
   - `Due Tomorrow` / `Upcoming`: Formatted date tags.
7. **Instant Live Search**: Real-time filtering across titles and descriptions with a one-click clear button and `/` keyboard shortcut.
8. **Multi-criteria Filtering**:
   - Filter by Status: `All`, `Active`, `Completed` tabs with dynamic task counts.
   - Filter by Priority: `All Priorities`, `High`, `Medium`, `Low`.
   - Filter by Category: `Work`, `Personal`, `Study`, `Finance`, `Health`, `General`.
9. **Flexible Sorting**: Sort by Newest First, Oldest First, Due Date (Earliest / Latest), Priority (High to Low / Low to High), or Title (A–Z).
10. **Interactive Statistics Dashboard**:
    - Total Tasks count
    - In-Progress / Active tasks count
    - Completed tasks count
    - Dynamic Completion Rate percentage with an animated visual progress bar
11. **Clear Completed**: One-click cleanup button to archive or purge all finished tasks.
12. **Theme Switcher (Dark / Light Mode)**:
    - Smooth color transitions between modern slate/light mode and deep charcoal dark mode.
    - Persists your choice in `localStorage`.
    - Automatically detects system OS preferences (`prefers-color-scheme`) on initial load.
13. **Responsive Mobile Design**:
    - Fluid layout supporting desktops, laptops, tablets, and phones.
    - Mobile Floating Action Button (FAB) for convenient single-thumb task creation on phones.
14. **Toast Notifications**: Non-intrusive, timed popups confirming actions (add, edit, delete, complete).

---

## 📂 Project Structure

```
taskflow-todo-app/
├── index.html        # Semantic HTML5 markup, accessible dialogs & structure
├── style.css         # Modern CSS design system, variables, dark/light theme, responsive styles
├── script.js         # Modular Vanilla JavaScript application & state logic
├── README.md         # Project documentation & beginner guide
└── assets/
    └── favicon.svg   # Custom branded SVG favicon
```

---

## 🧠 Architecture Explained for Beginners

If you are learning web development, here is how the architecture fits together:

### 1. Separation of Concerns (SoC)
- **`index.html`** is strictly structure: header, dashboard stats, controls toolbar, task list container, native `<dialog>` modals, and toasts.
- **`style.css`** handles all visual presentation: CSS Custom Properties (`--primary`, `--bg-app`, `--border-color`) switch automatically when the `data-theme="dark"` attribute is added to `<html>`.
- **`script.js`** acts as the brain: manages application state in memory, synchronizes with `localStorage`, and updates the DOM whenever tasks change.

### 2. State-Driven UI
Instead of manually modifying DOM elements here and there, the application follows a predictable flow:
```
User Action (e.g. Add/Edit/Check) 
   ──► Update `state.tasks` 
   ──► Save to `localStorage` 
   ──► Call `renderApp()` (re-renders stats, badges, and list)
```

### 3. Data Structure of a Task
Every task in TaskFlow is a clean JavaScript object:
```javascript
{
  id: "task-1726810000000-xyz89",
  title: "Complete project proposal",
  description: "Review key metrics and draft executive summary.",
  priority: "high",       // "low" | "medium" | "high"
  category: "Work",       // "Work" | "Personal" | "Study" | "Finance" | "Health" | "General"
  dueDate: "2026-09-22",  // ISO "YYYY-MM-DD"
  completed: false,       // boolean
  createdAt: 1726810000000,
  completedAt: null
}
```

### 4. LocalStorage Persistence
`localStorage` stores strings, so we convert objects to strings with `JSON.stringify()` when saving, and parse them back with `JSON.parse()` when reading:
```javascript
// Saving
localStorage.setItem('taskflow_tasks', JSON.stringify(tasksArray));

// Loading
const tasksArray = JSON.parse(localStorage.getItem('taskflow_tasks'));
```

---

## 💻 How to Run Locally

Because TaskFlow uses pure web standards without build tools, running it is completely friction-free:

### Option 1: Direct File Opening
Double-click [`index.html`](file:///c:/Users/ASUS/OneDrive/Desktop/taskflow-todo-app/index.html) or right-click and choose **Open With > Google Chrome** (or any modern web browser).

### Option 2: Live Server (Recommended for development)
If using VS Code or Antigravity IDE:
1. Open the project folder.
2. Use an extension like **Live Server** or run a simple local HTTP server:
   ```bash
   npx serve .
   # or
   python -m http.server 3000
   ```
3. Open `http://localhost:3000` in your browser.

---

## ⌨️ Keyboard Shortcuts
- Press `/` anywhere to immediately focus the Search bar.
- Press `Esc` to close any open modal dialog.
- Press `Tab` and `Shift+Tab` to navigate through accessible form inputs and task actions.

---

## 📝 License
This project is open-source and free to use for personal and educational purposes.
