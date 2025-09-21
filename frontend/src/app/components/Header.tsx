
"use client"
import React from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import * as Dialog from '@radix-ui/react-dialog';

const Header = () => {
  const { user, setUser, setToken } = useAuthContext();
  const router = useRouter();


  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  const confirmLogout = () => {
    setUser(null);
    setToken(null);
    router.push('/login');
    toast.success('Logged out successfully!');
    setLogoutDialogOpen(false);
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-4 bg-primary text-white shadow">
      <h1 className="text-2xl font-bold">Todo App</h1>
      {user && (
        <div className="flex items-center gap-4">
          <span className="font-semibold text-2xl">Welcome {user.username}!</span>
          <Dialog.Root open={logoutDialogOpen} onOpenChange={setLogoutDialogOpen}>
            <Dialog.Trigger asChild>
              <button
                className="px-4 py-2 bg-rose-500 rounded-lg shadow hover:bg-rose-700 transition font-semibold"
              >
                Logout
              </button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />
              <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white p-6 shadow-lg">
                <Dialog.Title className="text-lg font-semibold mb-4 text-primary">Confirm Logout</Dialog.Title>
                <p className="mb-6 text-gray-700">Are you sure you want to logout?</p>
                <div className="flex gap-4">
                  <button
                    className="w-full px-4 py-2 bg-rose-600 text-white rounded-lg shadow hover:bg-rose-700 transition"
                    onClick={confirmLogout}
                  >
                    Logout
                  </button>
                  <Dialog.Close asChild>
                    <button className="w-full px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">Cancel</button>
                  </Dialog.Close>
                </div>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
        </div>
      )}
    </header>
  );
}

export default Header