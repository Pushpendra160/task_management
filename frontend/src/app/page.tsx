"use client";
import React, { useEffect, useState } from 'react';
import { useAuthContext } from '../context/AuthContext';
import { useTaskContext } from '../context/TaskContext';
import { fetchTasks, deleteTask, updateTaskStatus, updateTaskPriority } from './api/tasks';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import * as Dialog from '@radix-ui/react-dialog';
import { createTask } from './api/tasks';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { setUser, setToken } = useAuthContext();
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<any>(null);
    const { token, loading, isUserLoggedIn } = useAuthContext();
  const { tasks, setTasks, setSelectedTask } = useTaskContext();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [open, setOpen] = useState(false);
  const limit = 5;
  const router = useRouter();

  useEffect(() => {
      if (loading) return; // Wait for AuthContext to finish loading
      if (!isUserLoggedIn()) {
        router.push('/login');
        return;
      }
      fetchTasks( page, limit).then((data) => {
        setTasks(data.tasks);
        setTotal(data.total);
      });
    }, [ loading, page, setTasks, router, isUserLoggedIn]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any>(null);

  const confirmDeleteTask = async () => {
    if (!token || !taskToDelete) return;
    try {
      await deleteTask(token, taskToDelete._id);
      setTasks(tasks.filter((t) => t._id !== taskToDelete._id));
      toast.success('Task deleted successfully!');
    } catch (err: any) {
      toast.error('Delete failed');
    }
    setDeleteDialogOpen(false);
    setTaskToDelete(null);
  };

  const handleDelete = (task: any) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleStatusChange = async (task: any, status: 'pending' | 'completed') => {
    if (!token) return;
    try {
      await updateTaskStatus(token, task._id, status);
      setTasks(tasks.map((t) => (t._id === task._id ? { ...t, status } : t)));
      toast.success('Task status updated!');
    } catch (err: any) {
      toast.error('Status update failed');
    }
  };

  const handlePriorityChange = async (task: any, priority: 'low' | 'medium' | 'high') => {
    if (!token) return;
    try {
      await updateTaskPriority(token, task._id, priority);
      setTasks(tasks.map((t) => (t._id === task._id ? { ...t, priority } : t)));
      toast.success('Task priority updated!');
    } catch (err: any) {
      toast.error('Priority update failed');
    }
  };

  const handleSelect = (task: any) => {
    setSelectedTask(task);
    setEditTask(task);
    setEditOpen(true);
  };
  const handleEditTask = async (data: any) => {
    if (!token || !editTask) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/tasks'}/${editTask._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setTasks(tasks.map((t) => (t._id === editTask._id ? updated : t)));
      setEditOpen(false);
      setEditTask(null);
      toast.success('Task updated successfully!');
    } catch (err: any) {
      toast.error('Update failed');
    }
  };

  const handleAddTask = async (data: any) => {
    if (!token) return;
    try {
      const newTask = await createTask(token, data);
      setTasks([...tasks, newTask]);
      setOpen(false);
      toast.success('Task added successfully!');
    } catch (err: any) {
      toast.error('Add failed');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-primary">Task List</h2>
        <div className="flex items-center gap-4">
          <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Trigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition">
                <Plus size={18} /> Add Task
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-4 text-primary">Add New Task</Dialog.Title>
                <TaskForm onSubmit={handleAddTask} submitLabel="Add Task" />
                <Dialog.Close asChild>
                  <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition w-full">Cancel</button>
                </Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        
        </div>
      </div>
      <TaskList
        tasks={tasks}
        onSelect={handleSelect}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog.Root open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4 text-primary">Confirm Delete</Dialog.Title>
            <p className="mb-6 text-gray-700">Are you sure you want to delete this task?</p>
            <div className="flex gap-4">
              <button
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                onClick={confirmDeleteTask}
              >
                Delete
              </button>
              <Dialog.Close asChild>
                <button className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
              </Dialog.Close>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root open={editOpen} onOpenChange={setEditOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/40 z-40" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
            <Dialog.Title className="text-lg font-semibold mb-4 text-primary">Edit Task</Dialog.Title>
            {editTask && (
              <TaskForm initialValues={editTask} onSubmit={handleEditTask} submitLabel="Update Task" />
            )}
            <Dialog.Close asChild>
              <button className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition w-full" onClick={() => setEditOpen(false)}>Cancel</button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          className="px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-primary font-medium">
          Page {page} of {Math.ceil(total / limit) || 1}
        </span>
        <button
          className="px-4 py-2 rounded bg-primary text-white disabled:bg-gray-300"
          disabled={page * limit >= total}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
