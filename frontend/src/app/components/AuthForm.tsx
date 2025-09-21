"use client";
import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const authSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

type AuthFormProps = {
  onSubmit: (data: { username: string; password: string }) => void;
  submitLabel?: string;
};

export default function AuthForm({ onSubmit, submitLabel = 'Login' }: AuthFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(authSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Username</label>
        <input
          {...register('username')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.username && <span className="text-xs text-red-500">{errors.username.message as string}</span>}
      </div>
      <div>
        <label className="block text-sm font-medium text-primary mb-1">Password</label>
        <input
          type="password"
          {...register('password')}
          className="w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password && <span className="text-xs text-red-500">{errors.password.message as string}</span>}
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
