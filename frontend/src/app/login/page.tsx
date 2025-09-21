"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import AuthForm from '../components/AuthForm';
import toast from 'react-hot-toast';
import { login } from '../api/auth';
import { useAuthContext } from '../../context/AuthContext';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthContext();

  const handleLogin = async (data: { username: string; password: string }) => {
    try {
      const res = await login(data.username, data.password);
      setUser(res.user);
      setToken(res.token);
      router.push('/');
      toast.success('Login successful!');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-100 to-violet-300">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Login</h2>
        <AuthForm onSubmit={handleLogin} submitLabel="Login" />
        <div className="mt-6 text-center">
          <span className="text-gray-700">Don't have an account?</span>
          <button
            className="ml-2 text-violet-600 font-semibold hover:underline"
            onClick={() => router.push('/register')}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}
