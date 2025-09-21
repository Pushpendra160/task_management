"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { Task } from '../../context/TaskContext';
import { FormatDate } from '@/utils/FormatDate';

type TaskListProps = {
  tasks: Task[];
  onSelect: (task: Task) => void;
  onDelete: (task: Task) => void;
  onStatusChange: (task: Task, status: 'pending' | 'completed') => void;
  onPriorityChange: (task: Task, priority: 'low' | 'medium' | 'high') => void;
};

const priorityStyles = {
  low: 'border-cyan-300 bg-cyan-50',
  medium: 'border-yellow-300 bg-yellow-50',
  high: 'border-rose-300 bg-rose-50',
};


export default function TaskList({ tasks, onSelect, onDelete, onStatusChange, onPriorityChange }: TaskListProps) {
  const router = useRouter();
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className={`rounded-xl border-2 p-4 flex flex-col md:flex-row md:items-center md:justify-between shadow-sm transition ${priorityStyles[task.priority]} hover:shadow-md`}
        >
          <div className="flex-1">
            <h4 className="text-2xl font-bold text-primary mb-2">{task.title}</h4>
            <div className="text-lg text-gray-700 mb-2">Due: <span className="font-semibold">{FormatDate(task.dueDate)}</span></div>
            <div className="text-base mb-3">
              <span className={`inline-block px-3 py-1 rounded-full ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{task.status}</span>
            </div>
            <div className="flex flex-wrap gap-3 items-center">
              <button
                className="px-4 py-2 rounded bg-violet-500 text-white text-base hover:bg-violet-600 transition"
                onClick={() => router.push(`/task/${task._id}`)}
              >
                Details
              </button>
              <button
                className="px-4 py-2 rounded bg-rose-500 text-white text-base hover:bg-rose-600 transition"
                onClick={() => onDelete(task)}
              >
                Delete
              </button>
              <button
                className="px-4 py-2 rounded bg-emerald-500 text-white text-base hover:bg-emerald-600 transition"
                onClick={() => onStatusChange(task, task.status === 'pending' ? 'completed' : 'pending')}
              >
                Mark as {task.status === 'pending' ? 'Completed' : 'Pending'}
              </button>
              <select
                value={task.priority}
                onChange={(e) => onPriorityChange(task, e.target.value as 'low' | 'medium' | 'high')}
                className="rounded border border-gray-300 px-3 py-2 text-base focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
