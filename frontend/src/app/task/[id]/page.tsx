"use client";
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import TaskForm from '../../components/TaskForm';
import { useParams, useRouter } from 'next/navigation';
import { useAuthContext } from '../../../context/AuthContext';
import { useTaskContext } from '../../../context/TaskContext';
import axios from 'axios';
import { fetchTaskById } from '@/app/api/tasks';
import { FormatDate } from '@/utils/FormatDate';

export default function TaskDetailPage() {
  const { id } = useParams();
  const { token, isUserLoggedIn,loading } = useAuthContext();
  const { selectedTask, setSelectedTask } = useTaskContext();
  const [editMode, setEditMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
       if (loading) return;
    if (!isUserLoggedIn()) {
      router.push('/login');
      return;
    }
    const fetchTask = async () => {
      try {
        const data = await fetchTaskById(id as string);
        setSelectedTask(data);
      } catch (err) {
        toast.error('Task not found');
        router.push('/');
      }
    };
    fetchTask();
    // eslint-disable-next-line
  }, [id, isUserLoggedIn, setSelectedTask, router]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-primary">Loading...</div>;
  if (!selectedTask) return <div className="flex items-center justify-center min-h-screen text-red-500">Task not found.</div>;

  const handleEdit = async (data: any) => {
    try {
      const res = await axios.put(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/tasks'}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedTask(res.data);
      setEditMode(false);
      toast.success('Task updated successfully!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-300">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-10">
        <h2 className="text-3xl font-bold text-primary mb-8 text-center">Task Details</h2>
        {editMode ? (
          <TaskForm initialValues={selectedTask} onSubmit={handleEdit} submitLabel="Update Task" />
        ) : (
          <>
            <div className="space-y-5">
              <div className="text-xl">
                <span className="font-bold text-primary">Title:</span> {selectedTask.title}
              </div>
              <div className="text-lg">
                <span className="font-bold text-primary">Description:</span> {selectedTask.description}
              </div>
              <div className="text-lg">
                <span className="font-bold text-primary">Due Date:</span> {FormatDate(selectedTask.dueDate)}
              </div>
              <div className="text-lg">
                <span className="font-bold text-primary">Status:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-base ${selectedTask.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{selectedTask.status}</span>
              </div>
              <div className="text-lg">
                <span className="font-bold text-primary">Priority:</span>
                <span className={`ml-2 px-3 py-1 rounded-full text-base ${selectedTask.priority === 'high' ? 'bg-rose-100 text-rose-700' : selectedTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-cyan-100 text-cyan-700'}`}>{selectedTask.priority}</span>
              </div>
              {/* <div>
                <span className="font-bold text-primary">Assigned To:</span> {selectedTask.assignedTo || 'Unassigned'}
              </div> */}
            </div>
            <div className="flex gap-6 mt-10">
              <button
                className="w-full px-5 py-3 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition text-lg"
                onClick={() => setEditMode(true)}
              >
                Edit Task
              </button>
              <button
                className="w-full px-5 py-3 bg-gray-200 rounded-lg shadow hover:bg-gray-300 transition text-lg"
                onClick={() => router.push('/')}
              >
                Back to List
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
