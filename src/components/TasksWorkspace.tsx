import React, { useMemo, useState } from 'react';
import { Check, Circle, ListFilter, Plus, Search, Trash2 } from 'lucide-react';

interface TaskItem {
  id: string;
  title: string;
  priority: 'High' | 'Low';
  completed: boolean;
}

interface TasksWorkspaceProps {
  isDarkMode: boolean;
  tasks: TaskItem[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  handleAddTask: (e: React.FormEvent) => void;
  newTaskTitle: string;
  setNewTaskTitle: (val: string) => void;
  newTaskPriority: 'High' | 'Low';
  setNewTaskPriority: (val: 'High' | 'Low') => void;
  mode?: 'compact' | 'full';
  t: (key: string) => string;
}

export default function TasksWorkspace({
  isDarkMode,
  tasks,
  toggleTask,
  deleteTask,
  handleAddTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  mode = 'compact',
  t
}: TasksWorkspaceProps) {
  const [statusFilter, setStatusFilter] = useState<'active' | 'all' | 'done'>('active');
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'High' | 'Low'>('All');
  const [sortMode, setSortMode] = useState<'priority' | 'newest' | 'title'>('priority');
  const [searchQuery, setSearchQuery] = useState('');

  const completedCount = tasks.filter((task) => task.completed).length;
  const activeCount = tasks.length - completedCount;

  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return tasks
      .filter((task) => {
        if (statusFilter === 'active' && task.completed) return false;
        if (statusFilter === 'done' && !task.completed) return false;
        if (priorityFilter !== 'All' && task.priority !== priorityFilter) return false;
        if (query && !task.title.toLowerCase().includes(query)) return false;
        return true;
      })
      .sort((a, b) => {
        if (sortMode === 'title') return a.title.localeCompare(b.title);
        if (sortMode === 'newest') return b.id.localeCompare(a.id);
        if (a.completed !== b.completed) return Number(a.completed) - Number(b.completed);
        if (a.priority !== b.priority) return a.priority === 'High' ? -1 : 1;
        return b.id.localeCompare(a.id);
      });
  }, [priorityFilter, searchQuery, sortMode, statusFilter, tasks]);

  const panelClass = mode === 'full'
    ? 'p-4 md:p-6 rounded-xl border min-h-[calc(100vh-11rem)]'
    : 'p-4 md:p-6 rounded-xl border flex flex-col justify-between';

  const listClass = mode === 'full'
    ? 'space-y-2'
    : 'space-y-2 max-h-72 overflow-y-auto pr-1';

  return (
    <div className={`${panelClass} ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
      <div>
        <div className="flex flex-col gap-4 mb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold tracking-tight font-mono uppercase text-neutral-400">{t('dailyTasks')}</h3>
              <p className="mt-1 text-xs text-neutral-500">
                {activeCount} active / {completedCount} done
              </p>
            </div>

            <div className="flex rounded-lg border border-neutral-200 dark:border-zinc-800 overflow-hidden shrink-0">
              {(['active', 'all', 'done'] as const).map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setStatusFilter(filter)}
                  className={`px-3 py-1.5 text-[11px] font-bold uppercase transition-colors ${
                    statusFilter === filter
                      ? 'bg-blue-600 text-white'
                      : isDarkMode
                      ? 'bg-zinc-950 text-zinc-400 hover:text-zinc-100'
                      : 'bg-white text-slate-500 hover:text-slate-900'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-neutral-200 text-slate-700'
            }`}>
              <Search className="w-4 h-4 text-neutral-400" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-transparent outline-none text-xs"
              />
            </label>

            <label className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${
              isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-neutral-200 text-slate-700'
            }`}>
              <ListFilter className="w-4 h-4 text-neutral-400" />
              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value as 'All' | 'High' | 'Low')}
                className="bg-transparent outline-none text-xs cursor-pointer"
              >
                <option value="All">All priority</option>
                <option value="High">High only</option>
                <option value="Low">Low only</option>
              </select>
            </label>

            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value as 'priority' | 'newest' | 'title')}
              className={`px-3 py-2 rounded-lg border text-xs outline-none cursor-pointer ${
                isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-slate-50 border-neutral-200 text-slate-700'
              }`}
            >
              <option value="priority">Priority first</option>
              <option value="newest">Newest first</option>
              <option value="title">A-Z</option>
            </select>
          </div>
        </div>

        <div className={listClass}>
          {filteredTasks.length === 0 ? (
            <div className={`text-center rounded-lg border border-dashed py-8 ${
              isDarkMode ? 'border-zinc-800 text-zinc-500' : 'border-neutral-200 text-neutral-500'
            }`}>
              <p className="text-sm font-semibold">{tasks.length === 0 ? t('noTasks') : 'No matching tasks'}</p>
              <p className="text-xs mt-1">Change the filters or add a new task.</p>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className={`group flex items-center justify-between gap-3 p-3 rounded-lg border text-sm transition-all duration-150 ${
                  task.completed
                    ? 'opacity-65 bg-neutral-50/50 dark:bg-zinc-950/20'
                    : ''
                } ${isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-neutral-100 bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    title={task.completed ? 'Mark active' : 'Mark complete'}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isDarkMode
                        ? 'border-zinc-700 hover:border-zinc-500'
                        : 'border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {task.completed ? <Check className="w-3.5 h-3.5" /> : <Circle className="w-3.5 h-3.5 opacity-0" />}
                  </button>
                  <div className="min-w-0">
                    <p className={`font-semibold truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-800 dark:text-zinc-200'}`}>
                      {task.title}
                    </p>
                    <p className="text-[11px] mt-0.5 text-neutral-500">
                      {task.completed ? 'Completed' : 'Ready to work'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold uppercase ${
                    task.priority === 'High'
                      ? 'bg-red-500/15 text-red-500'
                      : 'bg-zinc-500/15 text-zinc-500'
                  }`}>
                    {t(task.priority.toLowerCase())}
                  </span>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    title="Delete task"
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isDarkMode
                        ? 'text-zinc-500 hover:text-red-400 hover:bg-red-500/10'
                        : 'text-slate-400 hover:text-red-600 hover:bg-red-50'
                    }`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Task input in checklist dashboard */}
      <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-neutral-100 dark:border-zinc-800 grid grid-cols-[1fr_auto_auto] gap-2">
        <input
          type="text"
          required
          placeholder="Capture a task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className={`min-w-0 px-3 py-2 text-xs rounded-lg border outline-none ${
            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'
          }`}
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as any)}
          className={`px-2 py-2 text-xs rounded-lg border cursor-pointer outline-none ${
            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'
          }`}
        >
          <option value="High">High</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="submit"
          title="Add task"
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
