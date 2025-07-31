"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("mithra_user");
      if (stored) setUser(JSON.parse(stored));
      else router.push("/auth");
    }
  }, [router]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">Settings</h2>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="rounded-lg border px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-500"
            />
          </div>
          {/* Add more settings fields here as needed */}
        </div>
      </div>
    </div>
  );
}
