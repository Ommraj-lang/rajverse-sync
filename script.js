/**
 * ============================================================================
 * TASKFLOW — PROFESSIONAL SAAS APPLICATION LOGIC
 * Production-grade vanilla JavaScript Task Manager.
 * 
 * Features:
 *  1. Configuration & Initial Data
 *  2. Application State & Storage
 *  3. DOM Elements Registry
 *  4. Task & Subtask CRUD Operations
 *  5. Pomodoro / Focus Timer Widget & Web Audio Chime
 *  6. List Drag-and-Drop Manual Reordering
 *  7. Multi-Select & Floating Bulk Actions
 *  8. Filtering, Search & Sorting Logic
 *  9. Smart Views & Live Counter Calculations
 * 10. UI Rendering (List View & Kanban Board View with Drag & Drop)
 * 11. Modal & Subtasks Builder
 * 12. Keyboard Shortcuts Modal & Event Handlers
 * 13. Quick-Add Inline Bar
 * 14. JSON Backup: Export & Import
 * 15. Demo Mode: Load Sample Tasks
 * 16. Theme & PWA Management
 * 17. Event Listeners & Bootstrap
 * ============================================================================
 */

// 1. CONFIGURATION & INITIAL DATA
const STORAGE_KEYS = {
  TASKS: 'taskflow_tasks',
  THEME: 'taskflow_theme',
  VIEW: 'taskflow_view',
  SORT: 'taskflow_sort'
};

function getLocalDateString(offsetDays = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

// 7 realistic sample demo tasks for instant portfolio showcase
function getSampleTasks() {
  return [
    {
      id: 'task-sample-1',
      title: 'Quarterly SaaS Financial Modeling & Runway Forecast',
      description: 'Analyze ARR growth, monthly burn rate, CAC payback periods, and update 18-month projections for investor deck.',
      priority: 'high',
      category: 'Work',
      dueDate: getLocalDateString(0), // Due Today
      completed: false,
      focusMinutes: 50,
      createdAt: Date.now() - 3600000 * 8,
      completedAt: null,
      subtasks: [
        { id: 'sub-s1-1', text: 'Export Stripe billing transactions', completed: true },
        { id: 'sub-s1-2', text: 'Model scenario B: 20% expansion uplift', completed: true },
        { id: 'sub-s1-3', text: 'Prepare slide 7 executive summary', completed: false }
      ]
    },
    {
      id: 'task-sample-2',
      title: 'Master Modern Web Audio API & Synth Synthesis',
      description: 'Implement polyphonic oscillator nodes, exponential gain ramps, and custom audio chime cues.',
      priority: 'medium',
      category: 'Study',
      dueDate: getLocalDateString(1), // Tomorrow
      completed: false,
      focusMinutes: 25,
      createdAt: Date.now() - 3600000 * 20,
      completedAt: null,
      subtasks: [
        { id: 'sub-s2-1', text: 'Study AudioContext lifecycle & autoplay policies', completed: true },
        { id: 'sub-s2-2', text: 'Build custom melodic arpeggio chime function', completed: false }
      ]
    },
    {
      id: 'task-sample-3',
      title: 'Review Q3 Tax Documents & Investment Allocations',
      description: 'Cross-check quarterly dividend withholdings, retirement contributions, and file state declaration forms.',
      priority: 'high',
      category: 'Finance',
      dueDate: getLocalDateString(-2), // Overdue
      completed: false,
      focusMinutes: 15,
      createdAt: Date.now() - 3600000 * 72,
      completedAt: null,
      subtasks: [
        { id: 'sub-s3-1', text: 'Download 1099 consolidated statements', completed: true },
        { id: 'sub-s3-2', text: 'Schedule 15m review with CPA', completed: false }
      ]
    },
    {
      id: 'task-sample-4',
      title: 'Full-Body Strength Workout & Mobility Session',
      description: '5x5 compound bench and deadlift routine followed by 15-minute hip flexor mobility stretches.',
      priority: 'low',
      category: 'Health',
      dueDate: getLocalDateString(0), // Due Today
      completed: true,
      focusMinutes: 45,
      createdAt: Date.now() - 3600000 * 30,
      completedAt: Date.now() - 3600000 * 3,
      subtasks: [
        { id: 'sub-s4-1', text: 'Warmup with 5 min jump rope', completed: true },
        { id: 'sub-s4-2', text: '5x5 compound sets @ 80% 1RM', completed: true }
      ]
    },
    {
      id: 'task-sample-5',
      title: 'Plan Weekend Hiking Trip in Mount Rainier',
      description: 'Check trail permits, pack cold-weather layers, download offline topo maps on Gaia GPS, and check weather alerts.',
      priority: 'medium',
      category: 'Personal',
      dueDate: getLocalDateString(5), // Upcoming
      completed: false,
      focusMinutes: 0,
      createdAt: Date.now() - 3600000 * 15,
      completedAt: null,
      subtasks: [
        { id: 'sub-s5-1', text: 'Reserve Skyline Trail overnight pass', completed: true },
        { id: 'sub-s5-2', text: 'Restock trail mix and electrolyte tablets', completed: false }
      ]
    },
    {
      id: 'task-sample-6',
      title: 'Deploy TaskFlow Production Release to Cloudflare Pages',
      description: 'Run final lighthouse audit, verify service worker caching, and configure custom domain DNS records.',
      priority: 'high',
      category: 'Work',
      dueDate: getLocalDateString(2), // Upcoming
      completed: false,
      focusMinutes: 30,
      createdAt: Date.now() - 3600000 * 10,
      completedAt: null,
      subtasks: [
        { id: 'sub-s6-1', text: 'Verify PWA manifest and splash icons', completed: true },
        { id: 'sub-s6-2', text: 'Test keyboard shortcuts across browsers', completed: false }
      ]
    },
    {
      id: 'task-sample-7',
      title: 'Read 2 Chapters of Designing Data-Intensive Applications',
      description: 'Take notes on linearizability, consensus protocols, and Raft leader election algorithms.',
      priority: 'low',
      category: 'Study',
      dueDate: getLocalDateString(7), // Next week
      completed: false,
      focusMinutes: 0,
      createdAt: Date.now() - 3600000 * 5,
      completedAt: null,
      subtasks: []
    }
  ];
}

const INITIAL_TASKS = getSampleTasks();

// 2. APPLICATION STATE
const state = {
  tasks: [],
  filters: {
    status: 'all',     // 'all' | 'active' | 'completed' (toolbar tabs)
    dateView: 'all',   // 'all' | 'today' | 'upcoming' | 'overdue' (sidebar)
    priority: 'all',   // 'all' | 'high' | 'medium' | 'low'
    category: 'all',   // 'all' | 'Work' | 'Personal' | 'Study' | 'Finance' | 'Health' | 'General'
    searchQuery: ''
  },
  sortBy: 'manual',    // 'manual' | 'createdAt-desc' | etc.
  currentLayout: 'list', // 'list' | 'board'
  editingTaskId: null,
  modalSubtasks: [],
  quickAddPriority: 'medium',
  expandedCardSubtasks: new Set(),
  selectedTaskIds: new Set(), // Multi-select task IDs for bulk actions
  confirmAction: { type: null, targetId: null, targetIds: [] },

  // Pomodoro / Focus Timer State
  focusTimer: {
    secondsTotal: 25 * 60,
    secondsLeft: 25 * 60,
    isRunning: false,
    taskId: null,
    taskTitle: 'Focus Session',
    intervalId: null
  }
};

let lastFocusedElement = null;

// 3. STORAGE OPERATIONS (LOCAL STORAGE)
const Storage = {
  loadTasks() {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (data === null) {
        this.saveTasks(INITIAL_TASKS);
        return JSON.parse(JSON.stringify(INITIAL_TASKS));
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      // Normalize backwards compatibility for subtasks and focusMinutes
      return parsed.map(task => ({
        ...task,
        subtasks: Array.isArray(task.subtasks) ? task.subtasks : [],
        focusMinutes: typeof task.focusMinutes === 'number' ? task.focusMinutes : 0
      }));
    } catch (err) {
      console.error('Error loading tasks from LocalStorage:', err);
      return [];
    }
  },

  saveTasks(tasks) {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.error('Error saving tasks to LocalStorage:', err);
    }
  },

  loadTheme() {
    return localStorage.getItem(STORAGE_KEYS.THEME);
  },

  saveTheme(theme) {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  },

  loadView() {
    return localStorage.getItem(STORAGE_KEYS.VIEW) || 'list';
  },

  saveView(view) {
    localStorage.setItem(STORAGE_KEYS.VIEW, view);
  },

  loadSort() {
    return localStorage.getItem(STORAGE_KEYS.SORT) || 'manual';
  },

  saveSort(sort) {
    localStorage.setItem(STORAGE_KEYS.SORT, sort);
  }
};

// 4. DOM ELEMENTS REGISTRY
const DOM = {
  // Theme & Search
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),

  // Focus Timer Pill
  focusTimerPill: document.getElementById('focusTimerPill'),
  focusTimerDot: document.getElementById('focusTimerDot'),
  focusTimerTask: document.getElementById('focusTimerTask'),
  focusTimerDisplay: document.getElementById('focusTimerDisplay'),
  focusTimerToggleBtn: document.getElementById('focusTimerToggleBtn'),
  focusTimerResetBtn: document.getElementById('focusTimerResetBtn'),
  focusTimerQuickFinishBtn: document.getElementById('focusTimerQuickFinishBtn'),
  focusPlayIcon: document.getElementById('focusPlayIcon'),
  focusPauseIcon: document.getElementById('focusPauseIcon'),

  // Shortcuts Button & Modal
  shortcutsToggleBtn: document.getElementById('shortcutsToggleBtn'),
  shortcutsModal: document.getElementById('shortcutsModal'),
  closeShortcutsModalBtn: document.getElementById('closeShortcutsModalBtn'),
  dismissShortcutsBtn: document.getElementById('dismissShortcutsBtn'),

  // Sidebar elements
  dashboardSidebar: document.getElementById('dashboardSidebar'),
  sidebarToggleBtn: document.getElementById('sidebarToggleBtn'),
  sidebarCloseBtn: document.getElementById('sidebarCloseBtn'),
  sidebarBackdrop: document.getElementById('sidebarBackdrop'),
  sidebarNavItems: document.querySelectorAll('.sidebar-nav-item'),
  sidebarCategoryBtns: document.querySelectorAll('.sidebar-category-btn'),
  sidebarPriorityChips: document.querySelectorAll('.priority-legend .legend-chip'),
  sidebarCountAll: document.getElementById('sidebarCountAll'),
  sidebarCountToday: document.getElementById('sidebarCountToday'),
  sidebarCountUpcoming: document.getElementById('sidebarCountUpcoming'),
  sidebarCountOverdue: document.getElementById('sidebarCountOverdue'),

  // Backup actions
  exportDataBtn: document.getElementById('exportDataBtn'),
  importDataBtn: document.getElementById('importDataBtn'),
  importFileInput: document.getElementById('importFileInput'),

  // Quick-Add Inline Bar
  quickAddForm: document.getElementById('quickAddForm'),
  quickAddTitle: document.getElementById('quickAddTitle'),
  quickAddDueDate: document.getElementById('quickAddDueDate'),
  quickAddSubmitBtn: document.getElementById('quickAddSubmitBtn'),
  quickPriorityPills: document.querySelectorAll('.quick-priority-pill'),

  // Header & Add buttons
  openAddTaskBtn: document.getElementById('openAddTaskBtn'),
  mobileFabBtn: document.getElementById('mobileFabBtn'),

  // Statistics
  statTotalValue: document.getElementById('statTotalValue'),
  statPendingValue: document.getElementById('statPendingValue'),
  statCompletedValue: document.getElementById('statCompletedValue'),
  statRateValue: document.getElementById('statRateValue'),
  statProgressBar: document.getElementById('statProgressBar'),
  statProgressBarContainer: document.getElementById('statProgressBarContainer'),

  // Filters & Sorting Toolbar
  filterTabs: document.querySelectorAll('.filter-tab'),
  badgeAllCount: document.getElementById('badgeAllCount'),
  badgeActiveCount: document.getElementById('badgeActiveCount'),
  badgeCompletedCount: document.getElementById('badgeCompletedCount'),
  priorityFilter: document.getElementById('priorityFilter'),
  categoryFilter: document.getElementById('categoryFilter'),
  sortBySelect: document.getElementById('sortBySelect'),
  clearCompletedBtn: document.getElementById('clearCompletedBtn'),

  // View Switcher (List vs Board)
  viewListBtn: document.getElementById('viewListBtn'),
  viewBoardBtn: document.getElementById('viewBoardBtn'),

  // Task List & Kanban Board
  taskList: document.getElementById('taskList'),
  kanbanBoard: document.getElementById('kanbanBoard'),
  kanbanCardsTodo: document.getElementById('kanbanCardsTodo'),
  kanbanCardsProgress: document.getElementById('kanbanCardsProgress'),
  kanbanCardsCompleted: document.getElementById('kanbanCardsCompleted'),
  kanbanCountTodo: document.getElementById('kanbanCountTodo'),
  kanbanCountProgress: document.getElementById('kanbanCountProgress'),
  kanbanCountCompleted: document.getElementById('kanbanCountCompleted'),

  // Floating Bulk Action Bar
  bulkActionBar: document.getElementById('bulkActionBar'),
  bulkSelectedCount: document.getElementById('bulkSelectedCount'),
  bulkCompleteBtn: document.getElementById('bulkCompleteBtn'),
  bulkPriorityBtn: document.getElementById('bulkPriorityBtn'),
  bulkDeleteBtn: document.getElementById('bulkDeleteBtn'),
  bulkClearBtn: document.getElementById('bulkClearBtn'),

  // Empty State
  emptyState: document.getElementById('emptyState'),
  emptyStateIcon: document.getElementById('emptyStateIcon'),
  emptyStateTitle: document.getElementById('emptyStateTitle'),
  emptyStateText: document.getElementById('emptyStateText'),
  emptyStateAddBtn: document.getElementById('emptyStateAddBtn'),
  loadSampleTasksBtn: document.getElementById('loadSampleTasksBtn'),
  emptyStateResetBtn: document.getElementById('emptyStateResetBtn'),
  activeFilterSummary: document.getElementById('activeFilterSummary'),
  resetFiltersBtn: document.getElementById('resetFiltersBtn'),

  // Add / Edit Modal & Subtasks Builder
  taskModal: document.getElementById('taskModal'),
  modalTitle: document.getElementById('modalTitle'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  cancelModalBtn: document.getElementById('cancelModalBtn'),
  taskForm: document.getElementById('taskForm'),
  taskIdInput: document.getElementById('taskIdInput'),
  taskTitleInput: document.getElementById('taskTitleInput'),
  titleError: document.getElementById('titleError'),
  titleCharCount: document.getElementById('titleCharCount'),
  taskDescInput: document.getElementById('taskDescInput'),
  descCharCount: document.getElementById('descCharCount'),
  taskPriorityInput: document.getElementById('taskPriorityInput'),
  taskCategoryInput: document.getElementById('taskCategoryInput'),
  taskDueDateInput: document.getElementById('taskDueDateInput'),
  modalSubtaskInput: document.getElementById('modalSubtaskInput'),
  modalAddSubtaskBtn: document.getElementById('modalAddSubtaskBtn'),
  modalSubtaskList: document.getElementById('modalSubtaskList'),
  modalSubtaskCounter: document.getElementById('modalSubtaskCounter'),
  saveTaskSubmitBtn: document.getElementById('saveTaskSubmitBtn'),

  // Confirmation Modal
  confirmModal: document.getElementById('confirmModal'),
  confirmTitle: document.getElementById('confirmTitle'),
  confirmMessage: document.getElementById('confirmMessage'),
  cancelConfirmBtn: document.getElementById('cancelConfirmBtn'),
  proceedConfirmBtn: document.getElementById('proceedConfirmBtn'),

  // Toasts
  toastContainer: document.getElementById('toastContainer')
};

// 5. DATE CALCULATIONS & SMART STATUS
function getDaysDifference(isoString) {
  if (!isoString) return null;
  const parts = isoString.split('-').map(Number);
  if (parts.length < 3) return null;
  const [y, m, d] = parts;
  const dueDate = new Date(y, m - 1, d);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

// 6. POMODORO / FOCUS TIMER & WEB AUDIO CHIME
function playCelebrationChime() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    // Melodic celebration arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startTime = ctx.currentTime + idx * 0.12;
      const duration = 0.35;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, startTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration + 0.05);
    });
  } catch (err) {
    console.warn('Web Audio chime not initialized:', err);
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(state.focusTimer.secondsLeft / 60);
  const secs = state.focusTimer.secondsLeft % 60;
  const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  DOM.focusTimerDisplay.textContent = formatted;
  DOM.focusTimerTask.textContent = state.focusTimer.taskTitle;
  DOM.focusTimerTask.title = state.focusTimer.taskTitle;

  DOM.focusTimerPill.classList.toggle('timer-running', state.focusTimer.isRunning);
  DOM.focusPlayIcon.hidden = state.focusTimer.isRunning;
  DOM.focusPauseIcon.hidden = !state.focusTimer.isRunning;
}

function startFocusTimer(taskId = null, taskTitle = null) {
  if (taskId) {
    state.focusTimer.taskId = taskId;
    state.focusTimer.taskTitle = taskTitle || 'Focus Session';
    state.focusTimer.secondsLeft = state.focusTimer.secondsTotal;
  }

  if (state.focusTimer.intervalId) {
    clearInterval(state.focusTimer.intervalId);
  }

  state.focusTimer.isRunning = true;
  updateTimerDisplay();

  state.focusTimer.intervalId = setInterval(() => {
    if (state.focusTimer.secondsLeft > 0) {
      state.focusTimer.secondsLeft--;
      updateTimerDisplay();
    } else {
      completeFocusSession(25);
    }
  }, 1000);
}

function pauseFocusTimer() {
  if (state.focusTimer.intervalId) {
    clearInterval(state.focusTimer.intervalId);
    state.focusTimer.intervalId = null;
  }
  state.focusTimer.isRunning = false;
  updateTimerDisplay();
}

function resetFocusTimer() {
  pauseFocusTimer();
  state.focusTimer.secondsLeft = state.focusTimer.secondsTotal;
  updateTimerDisplay();
}

function completeFocusSession(minutesToAdd = 25) {
  pauseFocusTimer();
  state.focusTimer.secondsLeft = state.focusTimer.secondsTotal;
  updateTimerDisplay();

  // If a task was attached to the session, increment focusMinutes
  if (state.focusTimer.taskId) {
    const task = state.tasks.find(t => t.id === state.focusTimer.taskId);
    if (task) {
      task.focusMinutes = (task.focusMinutes || 0) + minutesToAdd;
      Storage.saveTasks(state.tasks);
      renderApp();
    }
  }

  playCelebrationChime();
  const taskName = state.focusTimer.taskTitle !== 'Focus Session' ? ` for "${state.focusTimer.taskTitle}"` : '';
  showToast(`🎉 Focus session completed (+${minutesToAdd}m logged)${taskName}!`, 'success');
}

// 7. TASK & SUBTASK CRUD OPERATIONS
function addTask(taskData) {
  const newTask = {
    id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: taskData.title.trim(),
    description: taskData.description ? taskData.description.trim() : '',
    priority: taskData.priority || 'medium',
    category: taskData.category || 'General',
    dueDate: taskData.dueDate || '',
    completed: false,
    focusMinutes: 0,
    createdAt: Date.now(),
    completedAt: null,
    subtasks: Array.isArray(taskData.subtasks) ? taskData.subtasks : []
  };

  state.tasks.unshift(newTask);
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast('Task created successfully', 'success');
}

function updateTask(id, taskData) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.title = taskData.title.trim();
  task.description = taskData.description ? taskData.description.trim() : '';
  task.priority = taskData.priority || 'medium';
  task.category = taskData.category || 'General';
  task.dueDate = taskData.dueDate || '';
  if (Array.isArray(taskData.subtasks)) {
    task.subtasks = taskData.subtasks;
  }

  Storage.saveTasks(state.tasks);
  renderApp();
  showToast('Task updated successfully', 'info');
}

function deleteTask(id) {
  const index = state.tasks.findIndex(t => t.id === id);
  if (index === -1) return;

  state.tasks.splice(index, 1);
  state.expandedCardSubtasks.delete(id);
  state.selectedTaskIds.delete(id);
  updateBulkActionBar();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast('Task deleted', 'danger');
}

function toggleTaskComplete(id) {
  const task = state.tasks.find(t => t.id === id);
  if (!task) return;

  task.completed = !task.completed;
  task.completedAt = task.completed ? Date.now() : null;

  Storage.saveTasks(state.tasks);
  renderApp();

  const message = task.completed ? 'Task completed' : 'Task marked as active';
  showToast(message, task.completed ? 'success' : 'info');
}

function toggleSubtask(taskId, subtaskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || !task.subtasks) return;

  const sub = task.subtasks.find(s => s.id === subtaskId);
  if (!sub) return;

  sub.completed = !sub.completed;
  Storage.saveTasks(state.tasks);
  renderApp();
}

function clearCompletedTasks() {
  const count = state.tasks.filter(t => t.completed).length;
  if (count === 0) return;

  state.tasks = state.tasks.filter(t => !t.completed);
  state.selectedTaskIds.clear();
  updateBulkActionBar();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast(`Cleared ${count} completed task${count > 1 ? 's' : ''}`, 'info');
}

// 8. MULTI-SELECT & FLOATING BULK ACTIONS
function toggleTaskSelection(taskId, isChecked) {
  if (isChecked) {
    state.selectedTaskIds.add(taskId);
  } else {
    state.selectedTaskIds.delete(taskId);
  }
  updateBulkActionBar();

  // Update card selected visual class
  const card = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (card) {
    card.classList.toggle('selected', isChecked);
  }
}

function updateBulkActionBar() {
  const count = state.selectedTaskIds.size;
  if (count > 0) {
    DOM.bulkActionBar.hidden = false;
    DOM.bulkSelectedCount.textContent = `${count} selected`;
  } else {
    DOM.bulkActionBar.hidden = true;
  }
}

function clearBulkSelection() {
  state.selectedTaskIds.clear();
  updateBulkActionBar();
  const checkboxes = document.querySelectorAll('.task-multi-select-cb');
  checkboxes.forEach(cb => { cb.checked = false; });
  const cards = document.querySelectorAll('.task-card.selected');
  cards.forEach(c => c.classList.remove('selected'));
}

function bulkMarkCompleted() {
  if (state.selectedTaskIds.size === 0) return;
  let count = 0;
  state.tasks.forEach(task => {
    if (state.selectedTaskIds.has(task.id) && !task.completed) {
      task.completed = true;
      task.completedAt = Date.now();
      count++;
    }
  });
  clearBulkSelection();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast(`Marked ${count} task${count === 1 ? '' : 's'} as completed`, 'success');
}

function bulkSetHighPriority() {
  if (state.selectedTaskIds.size === 0) return;
  let count = 0;
  state.tasks.forEach(task => {
    if (state.selectedTaskIds.has(task.id)) {
      task.priority = 'high';
      count++;
    }
  });
  clearBulkSelection();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast(`Set ${count} task${count === 1 ? '' : 's'} to High Priority`, 'info');
}

function promptBulkDelete() {
  const count = state.selectedTaskIds.size;
  if (count === 0) return;

  state.confirmAction = {
    type: 'bulk-delete',
    targetId: null,
    targetIds: Array.from(state.selectedTaskIds)
  };

  DOM.confirmTitle.textContent = `Delete ${count} Task${count > 1 ? 's' : ''}?`;
  DOM.confirmMessage.textContent = `Are you sure you want to delete ${count} selected task${count > 1 ? 's' : ''}? This action cannot be undone.`;
  DOM.proceedConfirmBtn.textContent = 'Delete Selected';

  if (typeof DOM.confirmModal.showModal === 'function') {
    DOM.confirmModal.showModal();
  } else {
    DOM.confirmModal.setAttribute('open', '');
  }

  setTimeout(() => DOM.cancelConfirmBtn.focus(), 50);
}

function executeBulkDelete() {
  const count = state.selectedTaskIds.size;
  state.tasks = state.tasks.filter(t => !state.selectedTaskIds.has(t.id));
  clearBulkSelection();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast(`Deleted ${count} task${count === 1 ? '' : 's'}`, 'danger');
}

// 9. FILTER, SEARCH & SORT LOGIC
function getFilteredAndSortedTasks() {
  const query = state.filters.searchQuery.trim().toLowerCase();
  const status = state.filters.status;
  const dateView = state.filters.dateView;
  const priority = state.filters.priority;
  const category = state.filters.category;

  let result = state.tasks.filter(task => {
    // 1. Smart Date View Filter (from sidebar)
    if (dateView === 'today') {
      const diff = getDaysDifference(task.dueDate);
      if (diff !== 0) return false;
    } else if (dateView === 'upcoming') {
      const diff = getDaysDifference(task.dueDate);
      if (diff === null || diff <= 0 || task.completed) return false;
    } else if (dateView === 'overdue') {
      const diff = getDaysDifference(task.dueDate);
      if (diff === null || diff >= 0 || task.completed) return false;
    }

    // 2. Status filter (from toolbar tabs)
    if (status === 'active' && task.completed) return false;
    if (status === 'completed' && !task.completed) return false;

    // 3. Priority filter
    if (priority !== 'all' && task.priority !== priority) return false;

    // 4. Category filter
    if (category !== 'all' && task.category !== category) return false;

    // 5. Search query matches title, description, or subtasks
    if (query) {
      const titleMatch = task.title.toLowerCase().includes(query);
      const descMatch = task.description && task.description.toLowerCase().includes(query);
      const subtaskMatch = task.subtasks && task.subtasks.some(s => s.text.toLowerCase().includes(query));
      if (!titleMatch && !descMatch && !subtaskMatch) return false;
    }

    return true;
  });

  // Sort tasks (unless Manual Order is selected)
  if (state.sortBy !== 'manual') {
    result.sort((a, b) => {
      switch (state.sortBy) {
        case 'createdAt-asc':
          return a.createdAt - b.createdAt;

        case 'dueDate-asc':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);

        case 'dueDate-desc':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return b.dueDate.localeCompare(a.dueDate);

        case 'priority-desc': {
          const weights = { high: 3, medium: 2, low: 1 };
          return weights[b.priority] - weights[a.priority];
        }

        case 'priority-asc': {
          const weights = { high: 3, medium: 2, low: 1 };
          return weights[a.priority] - weights[b.priority];
        }

        case 'title-asc':
          return a.title.localeCompare(b.title);

        case 'createdAt-desc':
        default:
          return b.createdAt - a.createdAt;
      }
    });
  }

  return result;
}

function resetAllFilters() {
  state.filters.status = 'all';
  state.filters.dateView = 'all';
  state.filters.priority = 'all';
  state.filters.category = 'all';
  state.filters.searchQuery = '';
  state.sortBy = 'manual';

  DOM.searchInput.value = '';
  DOM.clearSearchBtn.hidden = true;
  DOM.priorityFilter.value = 'all';
  DOM.categoryFilter.value = 'all';
  DOM.sortBySelect.value = 'manual';
  Storage.saveSort('manual');

  // Sync toolbar tabs
  DOM.filterTabs.forEach(tab => {
    const isAll = tab.dataset.status === 'all';
    tab.classList.toggle('active', isAll);
    tab.setAttribute('aria-selected', isAll ? 'true' : 'false');
  });

  // Sync sidebar date view items
  DOM.sidebarNavItems.forEach(item => {
    const isAll = item.dataset.view === 'all';
    item.classList.toggle('active', isAll);
  });

  // Reset category & priority chips
  DOM.sidebarCategoryBtns.forEach(btn => btn.classList.remove('active'));
  DOM.sidebarPriorityChips.forEach(chip => chip.classList.remove('active'));

  renderApp();
}

// 10. UI RENDERING (LIST & KANBAN)
function renderApp() {
  renderStatistics();
  renderCounters();
  renderTasks();
}

function renderStatistics() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const inProgress = total - completed;
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  DOM.statTotalValue.textContent = total;
  DOM.statPendingValue.textContent = inProgress;
  DOM.statCompletedValue.textContent = completed;
  DOM.statRateValue.textContent = `${rate}%`;

  DOM.statProgressBar.style.width = `${rate}%`;
  DOM.statProgressBarContainer.setAttribute('aria-valuenow', rate);

  DOM.clearCompletedBtn.disabled = completed === 0;
}

function renderCounters() {
  const total = state.tasks.length;
  const completed = state.tasks.filter(t => t.completed).length;
  const active = total - completed;

  // Toolbar tab counts
  DOM.badgeAllCount.textContent = total;
  DOM.badgeActiveCount.textContent = active;
  DOM.badgeCompletedCount.textContent = completed;

  // Sidebar Smart Date Views counts
  const todayCount = state.tasks.filter(t => {
    const diff = getDaysDifference(t.dueDate);
    return diff === 0 && !t.completed;
  }).length;

  const upcomingCount = state.tasks.filter(t => {
    const diff = getDaysDifference(t.dueDate);
    return diff !== null && diff > 0 && !t.completed;
  }).length;

  const overdueCount = state.tasks.filter(t => {
    const diff = getDaysDifference(t.dueDate);
    return diff !== null && diff < 0 && !t.completed;
  }).length;

  if (DOM.sidebarCountAll) DOM.sidebarCountAll.textContent = total;
  if (DOM.sidebarCountToday) DOM.sidebarCountToday.textContent = todayCount;
  if (DOM.sidebarCountUpcoming) DOM.sidebarCountUpcoming.textContent = upcomingCount;
  if (DOM.sidebarCountOverdue) {
    DOM.sidebarCountOverdue.textContent = overdueCount;
    DOM.sidebarCountOverdue.style.display = overdueCount > 0 ? 'inline-block' : 'inline-block';
  }
}

function renderTasks() {
  const visibleTasks = getFilteredAndSortedTasks();

  const hasActiveFilters =
    state.filters.status !== 'all' ||
    state.filters.dateView !== 'all' ||
    state.filters.priority !== 'all' ||
    state.filters.category !== 'all' ||
    state.filters.searchQuery !== '';

  DOM.resetFiltersBtn.hidden = !hasActiveFilters;

  // Dynamic filter summary text
  let summary = `Showing ${visibleTasks.length} task${visibleTasks.length === 1 ? '' : 's'}`;
  if (state.filters.dateView !== 'all') {
    const viewName = state.filters.dateView.charAt(0).toUpperCase() + state.filters.dateView.slice(1);
    summary += ` in ${viewName}`;
  }
  if (hasActiveFilters) {
    DOM.activeFilterSummary.textContent = summary;
  } else {
    DOM.activeFilterSummary.textContent = `Showing all ${visibleTasks.length} tasks`;
  }

  // Handle empty state
  if (visibleTasks.length === 0) {
    DOM.taskList.hidden = true;
    DOM.kanbanBoard.hidden = true;
    DOM.emptyState.hidden = false;

    if (state.tasks.length === 0) {
      DOM.emptyStateTitle.textContent = 'No tasks yet!';
      DOM.emptyStateText.textContent = 'Stay organized and focused. Create your very first task or load sample demo tasks to explore TaskFlow.';
      DOM.emptyStateAddBtn.hidden = false;
      DOM.loadSampleTasksBtn.hidden = false;
      DOM.emptyStateResetBtn.hidden = true;
    } else if (state.filters.searchQuery.trim()) {
      const safeQuery = escapeHTML(state.filters.searchQuery.trim());
      DOM.emptyStateTitle.textContent = `No results for "${safeQuery}"`;
      DOM.emptyStateText.textContent = 'We couldn\'t find any tasks matching your search. Check for typos or clear your search.';
      DOM.emptyStateAddBtn.hidden = true;
      DOM.loadSampleTasksBtn.hidden = true;
      DOM.emptyStateResetBtn.hidden = false;
    } else {
      DOM.emptyStateTitle.textContent = 'No matching tasks found';
      DOM.emptyStateText.textContent = 'No tasks match the active filters or view. Try switching views or resetting filters.';
      DOM.emptyStateAddBtn.hidden = true;
      DOM.loadSampleTasksBtn.hidden = true;
      DOM.emptyStateResetBtn.hidden = false;
    }
    return;
  }

  DOM.emptyState.hidden = true;

  if (state.currentLayout === 'board') {
    DOM.taskList.hidden = true;
    DOM.kanbanBoard.hidden = false;
    renderKanbanBoard(visibleTasks);
  } else {
    DOM.kanbanBoard.hidden = true;
    DOM.taskList.hidden = false;
    renderTaskList(visibleTasks);
  }
}

// 11. LIST VIEW RENDERING WITH DRAG-AND-DROP REORDERING
let draggedListTaskId = null;

function renderTaskList(tasks) {
  DOM.taskList.innerHTML = '';
  const fragment = document.createDocumentFragment();
  tasks.forEach(task => {
    const card = createTaskCardElement(task);
    fragment.appendChild(card);
  });
  DOM.taskList.appendChild(fragment);
}

function createTaskCardElement(task) {
  const card = document.createElement('article');
  const isSelected = state.selectedTaskIds.has(task.id);
  card.className = `task-card ${task.completed ? 'completed' : ''} ${isSelected ? 'selected' : ''}`;
  card.dataset.id = task.id;
  card.dataset.priority = task.priority;
  card.setAttribute('role', 'listitem');
  card.draggable = true;

  const safeTitle = escapeHTML(task.title);
  const safeDesc = escapeHTML(task.description);
  const safeCategory = escapeHTML(task.category);
  const catClass = `cat-${task.category.toLowerCase()}`;
  const dueDateInfo = formatDueDate(task.dueDate, task.completed);

  // Subtasks progress info
  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const totalSubtasks = subtasks.length;
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const isSubtasksExpanded = state.expandedCardSubtasks.has(task.id);

  let subtaskBadgeHtml = '';
  if (totalSubtasks > 0) {
    const isAllDone = completedSubtasks === totalSubtasks;
    subtaskBadgeHtml = `
      <button type="button" class="badge-subtasks ${isAllDone ? 'all-completed' : ''}" data-action="toggle-subtasks" title="Toggle subtasks checklist">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 11 12 14 22 4"></polyline>
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
        </svg>
        <span>${completedSubtasks}/${totalSubtasks} subtasks</span>
      </button>
    `;
  }

  // Focus minutes badge
  let focusBadgeHtml = '';
  if (task.focusMinutes && task.focusMinutes > 0) {
    focusBadgeHtml = `
      <span class="badge badge-focus" title="${task.focusMinutes} minutes spent focusing">
        ⏱ ${task.focusMinutes}m
      </span>
    `;
  }

  // Collapsible subtask checklist HTML
  let subtasksListHtml = '';
  if (totalSubtasks > 0 && isSubtasksExpanded) {
    const items = subtasks.map(sub => `
      <li class="task-subtask-item ${sub.completed ? 'completed' : ''}">
        <input 
          type="checkbox" 
          class="task-subtask-checkbox" 
          data-subtask-id="${sub.id}"
          ${sub.completed ? 'checked' : ''}
          aria-label="Toggle subtask: ${escapeHTML(sub.text)}"
        >
        <span class="task-subtask-text">${escapeHTML(sub.text)}</span>
      </li>
    `).join('');

    subtasksListHtml = `
      <div class="task-subtasks-container">
        <ul class="task-subtasks-checklist">
          ${items}
        </ul>
      </div>
    `;
  }

  card.innerHTML = `
    <div class="task-card-left-controls">
      <div class="drag-handle" title="Drag to reorder" aria-label="Drag to reorder">⋮⋮</div>
      <input 
        type="checkbox" 
        class="task-multi-select-cb" 
        ${isSelected ? 'checked' : ''} 
        aria-label="Select task for bulk actions"
        title="Select for bulk action"
      >
      <div class="task-checkbox-wrapper">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? 'checked' : ''} 
          aria-label="Mark task '${safeTitle}' as ${task.completed ? 'active' : 'completed'}"
          title="${task.completed ? 'Mark as active' : 'Mark as completed'}"
        >
      </div>
    </div>

    <div class="task-card-body">
      <div class="task-title-row">
        <h3 class="task-title">${safeTitle}</h3>
      </div>

      ${safeDesc ? `<p class="task-description">${safeDesc}</p>` : ''}

      <div class="task-meta-row">
        <span class="badge badge-priority-${task.priority}">
          ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </span>

        <span class="badge badge-category">
          <span class="cat-dot ${catClass}" aria-hidden="true"></span>
          ${safeCategory}
        </span>

        ${dueDateInfo ? `
          <span class="due-date-chip ${dueDateInfo.statusClass}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              ${dueDateInfo.iconSvg}
            </svg>
            ${dueDateInfo.label}
          </span>
        ` : ''}

        ${focusBadgeHtml}
        ${subtaskBadgeHtml}
      </div>

      ${subtasksListHtml}
    </div>

    <div class="task-actions">
      <button class="task-action-btn focus-task-btn" aria-label="Focus on task '${safeTitle}'" title="Focus session on this task (25m)">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      </button>
      <button class="task-action-btn edit-btn" aria-label="Edit task '${safeTitle}'" title="Edit task">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="task-action-btn delete-btn" aria-label="Delete task '${safeTitle}'" title="Delete task">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </button>
    </div>
  `;

  // Multi-select checkbox listener
  const multiSelectCb = card.querySelector('.task-multi-select-cb');
  multiSelectCb.addEventListener('change', (e) => {
    e.stopPropagation();
    toggleTaskSelection(task.id, multiSelectCb.checked);
  });

  // Task Completion checkbox
  const checkbox = card.querySelector('.task-checkbox');
  checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

  // Focus Button on Card: loads into header focus timer and starts
  const focusBtn = card.querySelector('.focus-task-btn');
  focusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startFocusTimer(task.id, task.title);
    showToast(`Focus session started for: "${task.title}"`, 'info');
  });

  // Edit Button
  const editBtn = card.querySelector('.edit-btn');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openTaskModal('edit', task, editBtn);
  });

  // Delete Button
  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptDeleteTask(task.id, task.title, deleteBtn);
  });

  // Toggle subtask checklist expansion
  const toggleSubtasksBtn = card.querySelector('[data-action="toggle-subtasks"]');
  if (toggleSubtasksBtn) {
    toggleSubtasksBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (state.expandedCardSubtasks.has(task.id)) {
        state.expandedCardSubtasks.delete(task.id);
      } else {
        state.expandedCardSubtasks.add(task.id);
      }
      renderTasks();
    });
  }

  // Subtask item checkboxes
  const subCheckboxes = card.querySelectorAll('.task-subtask-checkbox');
  subCheckboxes.forEach(cb => {
    cb.addEventListener('change', (e) => {
      e.stopPropagation();
      const subId = cb.dataset.subtaskId;
      toggleSubtask(task.id, subId);
    });
  });

  // HTML5 Drag-and-Drop Reordering handlers on List View Card
  card.addEventListener('dragstart', (e) => {
    draggedListTaskId = task.id;
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('list-dragging');
  });

  card.addEventListener('dragend', () => {
    draggedListTaskId = null;
    card.classList.remove('list-dragging');
    document.querySelectorAll('.task-card').forEach(c => {
      c.classList.remove('list-drag-over-top', 'list-drag-over-bottom');
    });
  });

  card.addEventListener('dragover', (e) => {
    if (!draggedListTaskId || draggedListTaskId === task.id) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    const rect = card.getBoundingClientRect();
    const midY = rect.top + rect.height / 2;
    if (e.clientY < midY) {
      card.classList.add('list-drag-over-top');
      card.classList.remove('list-drag-over-bottom');
    } else {
      card.classList.add('list-drag-over-bottom');
      card.classList.remove('list-drag-over-top');
    }
  });

  card.addEventListener('dragleave', () => {
    card.classList.remove('list-drag-over-top', 'list-drag-over-bottom');
  });

  card.addEventListener('drop', (e) => {
    e.preventDefault();
    card.classList.remove('list-drag-over-top', 'list-drag-over-bottom');

    const sourceId = e.dataTransfer.getData('text/plain') || draggedListTaskId;
    if (!sourceId || sourceId === task.id) return;

    const fromIdx = state.tasks.findIndex(t => t.id === sourceId);
    const toIdx = state.tasks.findIndex(t => t.id === task.id);
    if (fromIdx === -1 || toIdx === -1) return;

    // Move item in state.tasks
    const [movedTask] = state.tasks.splice(fromIdx, 1);
    const rect = card.getBoundingClientRect();
    const insertAfter = e.clientY >= (rect.top + rect.height / 2);

    const newTargetIdx = state.tasks.findIndex(t => t.id === task.id);
    state.tasks.splice(insertAfter ? newTargetIdx + 1 : newTargetIdx, 0, movedTask);

    // Switch sort mode to manual order
    state.sortBy = 'manual';
    DOM.sortBySelect.value = 'manual';
    Storage.saveSort('manual');

    Storage.saveTasks(state.tasks);
    renderApp();
    showToast('Task order updated', 'info');
  });

  return card;
}

// 12. KANBAN BOARD RENDERING & HTML5 DRAG-AND-DROP
function renderKanbanBoard(tasks) {
  const todoTasks = tasks.filter(t => !t.completed && t.priority !== 'high');
  const progressTasks = tasks.filter(t => !t.completed && t.priority === 'high');
  const completedTasks = tasks.filter(t => t.completed);

  DOM.kanbanCountTodo.textContent = todoTasks.length;
  DOM.kanbanCountProgress.textContent = progressTasks.length;
  DOM.kanbanCountCompleted.textContent = completedTasks.length;

  populateKanbanColumn(DOM.kanbanCardsTodo, todoTasks, 'todo');
  populateKanbanColumn(DOM.kanbanCardsProgress, progressTasks, 'inprogress');
  populateKanbanColumn(DOM.kanbanCardsCompleted, completedTasks, 'completed');
}

function populateKanbanColumn(container, columnTasks, columnType) {
  container.innerHTML = '';
  if (columnTasks.length === 0) {
    const emptyHint = document.createElement('div');
    emptyHint.className = 'kanban-empty-hint';
    emptyHint.textContent = 'Drag tasks here';
    container.appendChild(emptyHint);
    return;
  }

  columnTasks.forEach(task => {
    const card = createKanbanCardElement(task);
    container.appendChild(card);
  });
}

function createKanbanCardElement(task) {
  const card = document.createElement('div');
  card.className = `kanban-card ${task.completed ? 'completed' : ''}`;
  card.draggable = true;
  card.dataset.id = task.id;
  card.dataset.priority = task.priority;

  const safeTitle = escapeHTML(task.title);
  const safeDesc = escapeHTML(task.description);
  const safeCategory = escapeHTML(task.category);
  const catClass = `cat-${task.category.toLowerCase()}`;
  const dueDateInfo = formatDueDate(task.dueDate, task.completed);

  const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
  const completedSubs = subtasks.filter(s => s.completed).length;

  card.innerHTML = `
    <div class="kanban-card-header">
      <span class="badge badge-category">
        <span class="cat-dot ${catClass}" aria-hidden="true"></span>
        ${safeCategory}
      </span>
      <span class="badge badge-priority-${task.priority}">
        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
      </span>
    </div>

    <h4 class="kanban-card-title">${safeTitle}</h4>
    ${safeDesc ? `<p class="kanban-card-desc">${safeDesc}</p>` : ''}

    <div class="kanban-card-footer">
      <div class="kanban-card-meta">
        ${dueDateInfo ? `
          <span class="due-date-chip ${dueDateInfo.statusClass}">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              ${dueDateInfo.iconSvg}
            </svg>
            ${dueDateInfo.label}
          </span>
        ` : ''}
        ${task.focusMinutes > 0 ? `
          <span class="badge badge-focus" title="${task.focusMinutes}m spent focusing">
            ⏱ ${task.focusMinutes}m
          </span>
        ` : ''}
        ${subtasks.length > 0 ? `
          <span class="badge badge-subtasks" title="${completedSubs}/${subtasks.length} subtasks completed">
            ✓ ${completedSubs}/${subtasks.length}
          </span>
        ` : ''}
      </div>

      <div class="task-actions">
        <button class="task-action-btn focus-task-btn" aria-label="Focus on task" title="Focus (25m)">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
        </button>
        <button class="task-action-btn edit-btn" aria-label="Edit task" title="Edit">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="task-action-btn delete-btn" aria-label="Delete task" title="Delete">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
    </div>
  `;

  // HTML5 Drag Event handlers
  card.addEventListener('dragstart', (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    e.dataTransfer.effectAllowed = 'move';
    card.classList.add('dragging');
  });

  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  // Focus Button
  const focusBtn = card.querySelector('.focus-task-btn');
  focusBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    startFocusTimer(task.id, task.title);
    showToast(`Focus session started for: "${task.title}"`, 'info');
  });

  // Edit Button
  const editBtn = card.querySelector('.edit-btn');
  editBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    openTaskModal('edit', task, editBtn);
  });

  // Delete Button
  const deleteBtn = card.querySelector('.delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    promptDeleteTask(task.id, task.title, deleteBtn);
  });

  return card;
}

function setupKanbanDropzones() {
  const columns = [
    { el: document.getElementById('kanbanColTodo'), type: 'todo', name: 'To Do' },
    { el: document.getElementById('kanbanColProgress'), type: 'inprogress', name: 'In Progress' },
    { el: document.getElementById('kanbanColCompleted'), type: 'completed', name: 'Completed' }
  ];

  columns.forEach(col => {
    if (!col.el) return;

    col.el.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      col.el.classList.add('drag-over');
    });

    col.el.addEventListener('dragleave', (e) => {
      if (!col.el.contains(e.relatedTarget)) {
        col.el.classList.remove('drag-over');
      }
    });

    col.el.addEventListener('drop', (e) => {
      e.preventDefault();
      col.el.classList.remove('drag-over');
      const taskId = e.dataTransfer.getData('text/plain');
      if (!taskId) return;

      const task = state.tasks.find(t => t.id === taskId);
      if (!task) return;

      // Update task status and priority based on destination column
      if (col.type === 'todo') {
        task.completed = false;
        task.completedAt = null;
        if (task.priority === 'high') {
          task.priority = 'medium';
        }
      } else if (col.type === 'inprogress') {
        task.completed = false;
        task.completedAt = null;
        task.priority = 'high';
      } else if (col.type === 'completed') {
        task.completed = true;
        task.completedAt = Date.now();
      }

      Storage.saveTasks(state.tasks);
      renderApp();
      showToast(`Task moved to ${col.name}`, 'info');
    });
  });
}

function switchLayout(layout) {
  state.currentLayout = layout;
  Storage.saveView(layout);

  DOM.viewListBtn.classList.toggle('active', layout === 'list');
  DOM.viewListBtn.setAttribute('aria-pressed', layout === 'list' ? 'true' : 'false');

  DOM.viewBoardBtn.classList.toggle('active', layout === 'board');
  DOM.viewBoardBtn.setAttribute('aria-pressed', layout === 'board' ? 'true' : 'false');

  renderTasks();
}

// 13. FORMATTING & TOAST NOTIFICATIONS
function formatDueDate(isoString, isCompleted) {
  if (!isoString) return null;

  const diffDays = getDaysDifference(isoString);
  if (diffDays === null) return null;

  const [y, m, d] = isoString.split('-').map(Number);
  const dueDate = new Date(y, m - 1, d);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const formattedDate = `${months[dueDate.getMonth()]} ${dueDate.getDate()}`;

  const calendarSvg = '<rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line>';
  const checkSvg = '<polyline points="20 6 9 17 4 12"></polyline>';

  if (isCompleted) {
    return { label: formattedDate, statusClass: '', iconSvg: checkSvg };
  }

  if (diffDays < 0) {
    return { label: `Overdue: ${formattedDate}`, statusClass: 'status-overdue', iconSvg: calendarSvg };
  } else if (diffDays === 0) {
    return { label: 'Due Today', statusClass: 'status-today', iconSvg: calendarSvg };
  } else if (diffDays === 1) {
    return { label: 'Due Tomorrow', statusClass: '', iconSvg: calendarSvg };
  }

  return { label: `Due: ${formattedDate}`, statusClass: '', iconSvg: calendarSvg };
}

function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');

  let iconSvg = '';
  if (type === 'success') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6L9 17l-5-5"></path></svg>`;
  } else if (type === 'danger') {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
  } else {
    iconSvg = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
  }

  toast.innerHTML = `${iconSvg}<span>${escapeHTML(message)}</span>`;
  DOM.toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 250);
  }, 2600);
}

// 14. MODAL & SUBTASKS BUILDER MANAGEMENT
function openTaskModal(mode = 'add', task = null, triggerEl = null) {
  lastFocusedElement = triggerEl || document.activeElement;

  DOM.taskTitleInput.classList.remove('has-error');
  DOM.taskTitleInput.removeAttribute('aria-invalid');
  DOM.titleError.classList.remove('visible');

  // Set min date to today
  DOM.taskDueDateInput.min = getLocalDateString(0);

  if (mode === 'edit' && task) {
    state.editingTaskId = task.id;
    DOM.modalTitle.textContent = 'Edit Task';
    DOM.saveTaskSubmitBtn.textContent = 'Update Task';
    DOM.taskIdInput.value = task.id;
    DOM.taskTitleInput.value = task.title;
    DOM.taskDescInput.value = task.description || '';
    DOM.taskPriorityInput.value = task.priority;
    DOM.taskCategoryInput.value = task.category;
    DOM.taskDueDateInput.value = task.dueDate || '';

    state.modalSubtasks = Array.isArray(task.subtasks)
      ? task.subtasks.map(s => ({ ...s }))
      : [];

    DOM.titleCharCount.textContent = `${task.title.length} / 120`;
    DOM.descCharCount.textContent = `${(task.description || '').length} / 500`;
  } else {
    state.editingTaskId = null;
    DOM.modalTitle.textContent = 'Add New Task';
    DOM.saveTaskSubmitBtn.textContent = 'Save Task';
    DOM.taskForm.reset();
    DOM.taskIdInput.value = '';
    DOM.taskPriorityInput.value = 'medium';
    DOM.taskCategoryInput.value = state.filters.category !== 'all' ? state.filters.category : 'Work';

    state.modalSubtasks = [];

    DOM.titleCharCount.textContent = '0 / 120';
    DOM.descCharCount.textContent = '0 / 500';
  }

  DOM.modalSubtaskInput.value = '';
  renderModalSubtasks();

  if (typeof DOM.taskModal.showModal === 'function') {
    DOM.taskModal.showModal();
  } else {
    DOM.taskModal.setAttribute('open', '');
  }

  setTimeout(() => DOM.taskTitleInput.focus(), 60);
}

function closeTaskModal() {
  if (typeof DOM.taskModal.close === 'function') {
    DOM.taskModal.close();
  } else {
    DOM.taskModal.removeAttribute('open');
  }
  state.editingTaskId = null;
  state.modalSubtasks = [];

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function renderModalSubtasks() {
  DOM.modalSubtaskList.innerHTML = '';
  const count = state.modalSubtasks.length;
  DOM.modalSubtaskCounter.textContent = `${count} item${count === 1 ? '' : 's'}`;

  state.modalSubtasks.forEach((sub, idx) => {
    const li = document.createElement('li');
    li.className = `modal-subtask-item ${sub.completed ? 'completed' : ''}`;

    li.innerHTML = `
      <div class="modal-subtask-item-left">
        <input 
          type="checkbox" 
          class="task-subtask-checkbox" 
          ${sub.completed ? 'checked' : ''}
          aria-label="Toggle subtask completion"
        >
        <span class="modal-subtask-item-text">${escapeHTML(sub.text)}</span>
      </div>
      <button type="button" class="modal-subtask-remove-btn" title="Remove subtask" aria-label="Remove subtask">
        &times;
      </button>
    `;

    const checkbox = li.querySelector('.task-subtask-checkbox');
    checkbox.addEventListener('change', () => {
      sub.completed = checkbox.checked;
      li.classList.toggle('completed', sub.completed);
    });

    const removeBtn = li.querySelector('.modal-subtask-remove-btn');
    removeBtn.addEventListener('click', () => {
      state.modalSubtasks.splice(idx, 1);
      renderModalSubtasks();
    });

    DOM.modalSubtaskList.appendChild(li);
  });
}

function addSubtaskFromModal() {
  const text = DOM.modalSubtaskInput.value.trim();
  if (!text) return;

  state.modalSubtasks.push({
    id: 'sub_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    text,
    completed: false
  });

  DOM.modalSubtaskInput.value = '';
  renderModalSubtasks();
  DOM.modalSubtaskInput.focus();
}

// 15. SHORTCUTS MODAL
function openShortcutsModal() {
  lastFocusedElement = document.activeElement;
  if (typeof DOM.shortcutsModal.showModal === 'function') {
    DOM.shortcutsModal.showModal();
  } else {
    DOM.shortcutsModal.setAttribute('open', '');
  }
}

function closeShortcutsModal() {
  if (typeof DOM.shortcutsModal.close === 'function') {
    DOM.shortcutsModal.close();
  } else {
    DOM.shortcutsModal.removeAttribute('open');
  }
  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

function toggleShortcutsModal() {
  if (DOM.shortcutsModal.open) {
    closeShortcutsModal();
  } else {
    openShortcutsModal();
  }
}

// 16. CONFIRMATION DIALOGS
function promptDeleteTask(taskId, taskTitle, triggerEl = null) {
  lastFocusedElement = triggerEl || document.activeElement;
  state.confirmAction = { type: 'single', targetId: taskId, targetIds: [] };

  DOM.confirmTitle.textContent = 'Delete Task?';
  DOM.confirmMessage.textContent = `Are you sure you want to delete "${taskTitle}"? This cannot be undone.`;
  DOM.proceedConfirmBtn.textContent = 'Delete';

  if (typeof DOM.confirmModal.showModal === 'function') {
    DOM.confirmModal.showModal();
  } else {
    DOM.confirmModal.setAttribute('open', '');
  }

  setTimeout(() => DOM.cancelConfirmBtn.focus(), 50);
}

function promptClearCompleted(triggerEl = null) {
  const completedCount = state.tasks.filter(t => t.completed).length;
  if (completedCount === 0) return;

  lastFocusedElement = triggerEl || document.activeElement;
  state.confirmAction = { type: 'clear-completed', targetId: null, targetIds: [] };

  DOM.confirmTitle.textContent = 'Clear Completed Tasks?';
  DOM.confirmMessage.textContent = `Are you sure you want to remove all ${completedCount} completed task${completedCount > 1 ? 's' : ''}? This action cannot be undone.`;
  DOM.proceedConfirmBtn.textContent = 'Clear All';

  if (typeof DOM.confirmModal.showModal === 'function') {
    DOM.confirmModal.showModal();
  } else {
    DOM.confirmModal.setAttribute('open', '');
  }

  setTimeout(() => DOM.cancelConfirmBtn.focus(), 50);
}

function closeConfirmModal() {
  if (typeof DOM.confirmModal.close === 'function') {
    DOM.confirmModal.close();
  } else {
    DOM.confirmModal.removeAttribute('open');
  }
  state.confirmAction = { type: null, targetId: null, targetIds: [] };

  if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
    lastFocusedElement.focus();
  }
}

// 17. JSON DATA BACKUP (EXPORT & IMPORT)
function exportTasksBackup() {
  if (state.tasks.length === 0) {
    showToast('No tasks to export', 'info');
    return;
  }

  try {
    const dataStr = JSON.stringify(state.tasks, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    const dateStr = getLocalDateString(0);
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute('download', `taskflow-backup-${dateStr}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
    showToast(`Exported ${state.tasks.length} tasks successfully`, 'success');
  } catch (err) {
    console.error('Export error:', err);
    showToast('Failed to export tasks', 'danger');
  }
}

function importTasksBackup(file) {
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid format: backup must be an array of tasks');
      }

      const sanitized = parsed.map(item => ({
        id: item.id || ('task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6)),
        title: (item.title || 'Untitled Task').toString().trim(),
        description: (item.description || '').toString().trim(),
        priority: ['low', 'medium', 'high'].includes(item.priority) ? item.priority : 'medium',
        category: item.category || 'General',
        dueDate: item.dueDate || '',
        completed: Boolean(item.completed),
        focusMinutes: typeof item.focusMinutes === 'number' ? item.focusMinutes : 0,
        createdAt: Number(item.createdAt) || Date.now(),
        completedAt: item.completedAt ? Number(item.completedAt) : null,
        subtasks: Array.isArray(item.subtasks)
          ? item.subtasks.map(s => ({
              id: s.id || ('sub_' + Math.random().toString(36).substring(2, 6)),
              text: (s.text || '').toString().trim(),
              completed: Boolean(s.completed)
            }))
          : []
      }));

      state.tasks = sanitized;
      state.selectedTaskIds.clear();
      updateBulkActionBar();
      Storage.saveTasks(state.tasks);
      renderApp();
      showToast(`Restored ${sanitized.length} tasks from backup`, 'success');
    } catch (err) {
      console.error('Import error:', err);
      showToast('Failed to import: Invalid JSON file', 'danger');
    } finally {
      DOM.importFileInput.value = '';
    }
  };

  reader.onerror = () => {
    showToast('Error reading backup file', 'danger');
    DOM.importFileInput.value = '';
  };

  reader.readAsText(file);
}

// 18. DEMO MODE: LOAD SAMPLE TASKS
function loadSampleTasksDemo() {
  state.tasks = getSampleTasks();
  state.selectedTaskIds.clear();
  updateBulkActionBar();
  Storage.saveTasks(state.tasks);
  renderApp();
  showToast('7 sample demo tasks loaded! Explore all features.', 'success');
}

// 19. THEME MANAGEMENT
function initTheme() {
  const savedTheme = Storage.loadTheme();
  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.setAttribute('data-theme', theme);
  Storage.saveTheme(theme);
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
}

// 20. SIDEBAR & MOBILE NAVIGATION
function openSidebar() {
  DOM.dashboardSidebar.classList.add('open');
  DOM.sidebarBackdrop.classList.add('active');
}

function closeSidebar() {
  DOM.dashboardSidebar.classList.remove('open');
  DOM.sidebarBackdrop.classList.remove('active');
}

// 21. EVENT LISTENERS SETUP
function setupEventListeners() {
  // Theme toggle
  DOM.themeToggleBtn.addEventListener('click', toggleTheme);

  // Focus Timer Pill controls
  DOM.focusTimerToggleBtn.addEventListener('click', () => {
    if (state.focusTimer.isRunning) {
      pauseFocusTimer();
      showToast('Focus timer paused', 'info');
    } else {
      startFocusTimer();
      showToast('Focus timer started', 'info');
    }
  });

  DOM.focusTimerResetBtn.addEventListener('click', () => {
    resetFocusTimer();
    showToast('Focus timer reset to 25:00', 'info');
  });

  DOM.focusTimerQuickFinishBtn.addEventListener('click', () => {
    completeFocusSession(5);
  });

  // Shortcuts Modal triggers
  DOM.shortcutsToggleBtn.addEventListener('click', toggleShortcutsModal);
  DOM.closeShortcutsModalBtn.addEventListener('click', closeShortcutsModal);
  DOM.dismissShortcutsBtn.addEventListener('click', closeShortcutsModal);
  DOM.shortcutsModal.addEventListener('click', (e) => {
    const rect = DOM.shortcutsModal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      closeShortcutsModal();
    }
  });

  // Search input live filtering
  DOM.searchInput.addEventListener('input', (e) => {
    state.filters.searchQuery = e.target.value;
    DOM.clearSearchBtn.hidden = e.target.value.length === 0;
    renderTasks();
  });

  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    state.filters.searchQuery = '';
    DOM.clearSearchBtn.hidden = true;
    DOM.searchInput.focus();
    renderTasks();
  });

  // Quick-Add Inline Bar submission
  DOM.quickAddForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = DOM.quickAddTitle.value.trim();
    if (!title) return;

    const dueDate = DOM.quickAddDueDate.value || '';
    const priority = state.quickAddPriority || 'medium';
    const category = state.filters.category !== 'all' ? state.filters.category : 'General';

    addTask({
      title,
      description: '',
      priority,
      category,
      dueDate,
      subtasks: []
    });

    DOM.quickAddTitle.value = '';
    DOM.quickAddDueDate.value = '';
    DOM.quickAddTitle.focus();
  });

  // Quick-Add Priority Pills
  DOM.quickPriorityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      DOM.quickPriorityPills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-checked', 'false');
      });
      pill.classList.add('active');
      pill.setAttribute('aria-checked', 'true');
      state.quickAddPriority = pill.dataset.priority;
    });
  });

  // View Switcher (List vs Board)
  DOM.viewListBtn.addEventListener('click', () => switchLayout('list'));
  DOM.viewBoardBtn.addEventListener('click', () => switchLayout('board'));

  // Multi-Select Bulk Actions
  DOM.bulkCompleteBtn.addEventListener('click', bulkMarkCompleted);
  DOM.bulkPriorityBtn.addEventListener('click', bulkSetHighPriority);
  DOM.bulkDeleteBtn.addEventListener('click', promptBulkDelete);
  DOM.bulkClearBtn.addEventListener('click', clearBulkSelection);

  // Modal open triggers
  DOM.openAddTaskBtn.addEventListener('click', (e) => openTaskModal('add', null, e.currentTarget));
  DOM.mobileFabBtn.addEventListener('click', (e) => openTaskModal('add', null, e.currentTarget));
  DOM.emptyStateAddBtn.addEventListener('click', (e) => openTaskModal('add', null, e.currentTarget));
  DOM.loadSampleTasksBtn.addEventListener('click', loadSampleTasksDemo);
  DOM.emptyStateResetBtn.addEventListener('click', resetAllFilters);

  // Modal close triggers
  DOM.closeModalBtn.addEventListener('click', closeTaskModal);
  DOM.cancelModalBtn.addEventListener('click', closeTaskModal);

  DOM.taskModal.addEventListener('click', (e) => {
    const rect = DOM.taskModal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      closeTaskModal();
    }
  });

  // Subtasks Builder in Modal
  DOM.modalAddSubtaskBtn.addEventListener('click', addSubtaskFromModal);
  DOM.modalSubtaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubtaskFromModal();
    }
  });

  // Live character counting & validation error clearing
  DOM.taskTitleInput.addEventListener('input', () => {
    const len = DOM.taskTitleInput.value.length;
    DOM.titleCharCount.textContent = `${len} / 120`;

    if (DOM.taskTitleInput.value.trim()) {
      DOM.taskTitleInput.classList.remove('has-error');
      DOM.taskTitleInput.removeAttribute('aria-invalid');
      DOM.titleError.classList.remove('visible');
    }
  });

  DOM.taskDescInput.addEventListener('input', () => {
    const len = DOM.taskDescInput.value.length;
    DOM.descCharCount.textContent = `${len} / 500`;
  });

  // Modal form submit
  DOM.taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = DOM.taskTitleInput.value.trim();

    if (!title) {
      DOM.taskTitleInput.classList.add('has-error');
      DOM.taskTitleInput.setAttribute('aria-invalid', 'true');
      DOM.titleError.classList.add('visible');
      DOM.taskTitleInput.focus();
      return;
    }

    const taskData = {
      title,
      description: DOM.taskDescInput.value,
      priority: DOM.taskPriorityInput.value,
      category: DOM.taskCategoryInput.value,
      dueDate: DOM.taskDueDateInput.value,
      subtasks: state.modalSubtasks
    };

    if (state.editingTaskId) {
      updateTask(state.editingTaskId, taskData);
    } else {
      addTask(taskData);
    }

    closeTaskModal();
  });

  // Confirm modal actions
  DOM.cancelConfirmBtn.addEventListener('click', closeConfirmModal);
  DOM.proceedConfirmBtn.addEventListener('click', () => {
    if (state.confirmAction.type === 'single' && state.confirmAction.targetId) {
      deleteTask(state.confirmAction.targetId);
    } else if (state.confirmAction.type === 'bulk-delete') {
      executeBulkDelete();
    } else if (state.confirmAction.type === 'clear-completed') {
      clearCompletedTasks();
    }
    closeConfirmModal();
  });

  DOM.confirmModal.addEventListener('click', (e) => {
    const rect = DOM.confirmModal.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) {
      closeConfirmModal();
    }
  });

  // Filter toolbar tabs (Status: All, Active, Completed)
  DOM.filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      DOM.filterTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      state.filters.status = tab.dataset.status;
      renderTasks();
    });
  });

  // Sidebar Smart Date Views
  DOM.sidebarNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;

      DOM.sidebarNavItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      state.filters.dateView = view;
      closeSidebar();
      renderTasks();
    });
  });

  // Sidebar Category Filter Buttons
  DOM.sidebarCategoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const cat = btn.dataset.category;
      const isAlreadyActive = btn.classList.contains('active');

      DOM.sidebarCategoryBtns.forEach(b => b.classList.remove('active'));

      if (isAlreadyActive) {
        state.filters.category = 'all';
        DOM.categoryFilter.value = 'all';
      } else {
        btn.classList.add('active');
        state.filters.category = cat;
        DOM.categoryFilter.value = cat;
      }

      closeSidebar();
      renderTasks();
    });
  });

  // Sidebar Priority Legend Chips
  DOM.sidebarPriorityChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const priority = chip.dataset.priority;
      const isAlreadyActive = chip.classList.contains('active');

      DOM.sidebarPriorityChips.forEach(c => c.classList.remove('active'));

      if (isAlreadyActive) {
        state.filters.priority = 'all';
        DOM.priorityFilter.value = 'all';
      } else {
        chip.classList.add('active');
        state.filters.priority = priority;
        DOM.priorityFilter.value = priority;
      }

      closeSidebar();
      renderTasks();
    });
  });

  // Toolbar Dropdown filters
  DOM.priorityFilter.addEventListener('change', (e) => {
    state.filters.priority = e.target.value;
    DOM.sidebarPriorityChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.priority === e.target.value);
    });
    renderTasks();
  });

  DOM.categoryFilter.addEventListener('change', (e) => {
    state.filters.category = e.target.value;
    DOM.sidebarCategoryBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.category === e.target.value);
    });
    renderTasks();
  });

  DOM.sortBySelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    Storage.saveSort(e.target.value);
    renderTasks();
  });

  DOM.clearCompletedBtn.addEventListener('click', (e) => promptClearCompleted(e.currentTarget));
  DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);

  // Backup: Export & Import
  DOM.exportDataBtn.addEventListener('click', exportTasksBackup);
  DOM.importDataBtn.addEventListener('click', () => DOM.importFileInput.click());
  DOM.importFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      importTasksBackup(e.target.files[0]);
    }
  });

  // Mobile sidebar drawer
  if (DOM.sidebarToggleBtn) DOM.sidebarToggleBtn.addEventListener('click', openSidebar);
  if (DOM.sidebarCloseBtn) DOM.sidebarCloseBtn.addEventListener('click', closeSidebar);
  if (DOM.sidebarBackdrop) DOM.sidebarBackdrop.addEventListener('click', closeSidebar);

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const isEditing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName) || document.activeElement.isContentEditable;

    // Esc closes any open modal or cancels multi-selection
    if (e.key === 'Escape') {
      if (DOM.shortcutsModal && DOM.shortcutsModal.open) {
        closeShortcutsModal();
        return;
      }
      if (DOM.taskModal && DOM.taskModal.open) {
        closeTaskModal();
        return;
      }
      if (DOM.confirmModal && DOM.confirmModal.open) {
        closeConfirmModal();
        return;
      }
      if (state.selectedTaskIds.size > 0) {
        clearBulkSelection();
        return;
      }
    }

    // Ignore single key shortcuts if user is typing
    if (isEditing) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    if (e.key === '?') {
      e.preventDefault();
      toggleShortcutsModal();
    } else if (e.key === '/' ) {
      e.preventDefault();
      DOM.searchInput.focus();
    } else if (e.key === 'n' || e.key === 'N') {
      e.preventDefault();
      openTaskModal('add');
    } else if (e.key === 'q' || e.key === 'Q') {
      e.preventDefault();
      DOM.quickAddTitle.focus();
    } else if (e.key === 'b' || e.key === 'B') {
      e.preventDefault();
      switchLayout(state.currentLayout === 'list' ? 'board' : 'list');
    } else if (e.key === '1') {
      e.preventDefault();
      state.filters.dateView = 'all';
      DOM.sidebarNavItems.forEach(i => i.classList.toggle('active', i.dataset.view === 'all'));
      renderTasks();
    } else if (e.key === '2') {
      e.preventDefault();
      state.filters.dateView = 'today';
      DOM.sidebarNavItems.forEach(i => i.classList.toggle('active', i.dataset.view === 'today'));
      renderTasks();
    } else if (e.key === '3') {
      e.preventDefault();
      state.filters.dateView = 'upcoming';
      DOM.sidebarNavItems.forEach(i => i.classList.toggle('active', i.dataset.view === 'upcoming'));
      renderTasks();
    } else if (e.key === '4') {
      e.preventDefault();
      state.filters.dateView = 'overdue';
      DOM.sidebarNavItems.forEach(i => i.classList.toggle('active', i.dataset.view === 'overdue'));
      renderTasks();
    }
  });

  // Initialize Kanban Dropzones
  setupKanbanDropzones();
}

// 22. BOOTSTRAP APPLICATION
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  state.tasks = Storage.loadTasks();
  state.currentLayout = Storage.loadView();
  state.sortBy = Storage.loadSort();

  if (DOM.sortBySelect) {
    DOM.sortBySelect.value = state.sortBy;
  }

  // Set initial view toggle button state
  if (DOM.viewListBtn && DOM.viewBoardBtn) {
    DOM.viewListBtn.classList.toggle('active', state.currentLayout === 'list');
    DOM.viewListBtn.setAttribute('aria-pressed', state.currentLayout === 'list' ? 'true' : 'false');
    DOM.viewBoardBtn.classList.toggle('active', state.currentLayout === 'board');
    DOM.viewBoardBtn.setAttribute('aria-pressed', state.currentLayout === 'board' ? 'true' : 'false');
  }

  updateTimerDisplay();
  setupEventListeners();
  renderApp();
});
