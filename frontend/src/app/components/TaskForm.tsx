"use client";
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Task } from '../../context/TaskContext';
    import dayjs from 'dayjs';

const taskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  dueDate: z.string().min(1, 'Due date is required'),
  priority: z.enum(['low', 'medium', 'high']),
  // assignedTo: z.string().optional(),
});

type TaskFormProps = {
  initialValues?: Partial<Task>;
  onSubmit: (data: any) => void;
  submitLabel?: string;
};


type TaskFormFields = z.infer<typeof taskSchema>;

export default function TaskForm({ initialValues = {}, onSubmit, submitLabel = 'Save' }: TaskFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TaskFormFields>({
    resolver: zodResolver(taskSchema),
    // defaultValues: initialValues as TaskFormFields,
  });
    const formKeys: Array<keyof TaskFormFields> = ['title', 'description', 'dueDate', 'priority'];
    formKeys.forEach((key) => {
      let value = initialValues[key] ?? '';
      if (key === 'dueDate' && value) {
        value = dayjs(value).format('YYYY-MM-DD');
      }
      setValue(key, value);
    });
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Title</label>
        <input
          {...register('title')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.title && <span className="text-xs text-red-500">{errors.title.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Due Date</label>
        <input
          type="date"
          {...register('dueDate')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.dueDate && <span className="text-xs text-red-500">{errors.dueDate.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Priority</label>
        <select
          {...register('priority')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>
      <button
        type="submit"
        className="w-full mt-2 px-4 py-2 bg-primary text-white rounded-lg shadow hover:bg-primary-dark transition"
      >
        {submitLabel}
      </button>
    </form>
  );
}
