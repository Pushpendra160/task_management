"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import toast from 'react-hot-toast';
import { register } from '../api/auth';

export default function RegisterPage() {
  const router = useRouter();

  const handleRegister = async (data: { username: string; password: string }) => {
    try {
      await register(data.username, data.password, 'user');
      toast.success('Registration successful! Please login.');
      router.push('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-300">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Register</h2>
        <AuthForm onSubmit={handleRegister} submitLabel="Register" />
        <div className="mt-6 text-center">
          <span className="text-gray-700">Already have an account?</span>
          <button
            className="ml-2 text-violet-600 font-semibold hover:underline"
            onClick={() => router.push('/login')}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
