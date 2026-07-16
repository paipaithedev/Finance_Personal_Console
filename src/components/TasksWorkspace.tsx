import React from 'react';
import { Check, Plus } from 'lucide-react';

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
  handleAddTask: (e: React.FormEvent) => void;
  newTaskTitle: string;
  setNewTaskTitle: (val: string) => void;
  newTaskPriority: 'High' | 'Low';
  setNewTaskPriority: (val: 'High' | 'Low') => void;
  t: (key: string) => string;
}

export default function TasksWorkspace({
  isDarkMode,
  tasks,
  toggleTask,
  handleAddTask,
  newTaskTitle,
  setNewTaskTitle,
  newTaskPriority,
  setNewTaskPriority,
  t
}: TasksWorkspaceProps) {
  return (
    <div className={`p-4 md:p-6 rounded-xl border flex flex-col justify-between ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-neutral-200'}`}>
      <div>
        <h3 className="text-sm font-bold tracking-tight mb-4 font-mono uppercase text-neutral-400">{t('dailyTasks')}</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
          {tasks.length === 0 ? (
            <p className="text-xs text-neutral-500 py-4 text-center">{t('noTasks')}</p>
          ) : (
            tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border text-sm transition-all duration-150 ${
                  task.completed
                    ? 'opacity-65 bg-neutral-50/50 dark:bg-zinc-950/20'
                    : ''
                } ${isDarkMode ? 'border-zinc-800 bg-zinc-950/40' : 'border-neutral-100 bg-slate-50/50'}`}
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => toggleTask(task.id)}
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors cursor-pointer ${
                      task.completed
                        ? 'bg-blue-600 border-blue-600 text-white'
                        : isDarkMode
                        ? 'border-zinc-700 hover:border-zinc-500'
                        : 'border-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {task.completed && <Check className="w-3 h-3" />}
                  </button>
                  <span className={`font-medium truncate ${task.completed ? 'line-through text-neutral-500' : 'text-neutral-800 dark:text-zinc-200'}`}>
                    {task.title}
                  </span>
                </div>

                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold shrink-0 ml-2 uppercase ${
                  task.priority === 'High'
                    ? 'bg-red-500/15 text-red-500'
                    : 'bg-zinc-500/15 text-zinc-500'
                }`}>
                  {t(task.priority.toLowerCase())}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Task input in checklist dashboard */}
      <form onSubmit={handleAddTask} className="mt-4 pt-4 border-t border-neutral-100 dark:border-zinc-800 flex gap-2">
        <input
          type="text"
          required
          placeholder="New productivity task..."
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          className={`flex-1 px-3 py-1.5 text-xs rounded-lg border outline-none ${
            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-neutral-200 text-slate-800'
          }`}
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value as any)}
          className={`px-2 py-1.5 text-xs rounded-lg border cursor-pointer outline-none ${
            isDarkMode ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-white border-neutral-200 text-slate-700'
          }`}
        >
          <option value="High">H</option>
          <option value="Low">L</option>
        </select>
        <button
          type="submit"
          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
