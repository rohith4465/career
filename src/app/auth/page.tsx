"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginWithEmail, registerWithEmail, loginWithPhone, setupRecaptcha, onUserChanged, logoutFirebase } from "../lib/firebaseAuth";

export default function AuthPage() {
  const [tab, setTab] = useState<'email' | 'phone'>("email");
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [firebaseUser, setFirebaseUser] = useState<any>(null);
  const [otpSent, setOtpSent] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = onUserChanged(user => {
      setFirebaseUser(user);
      if (user) {
        localStorage.setItem("mithra_user", JSON.stringify({ email: user.email, photo: user.photoURL }));
      } else {
        localStorage.removeItem("mithra_user");
      }
    });
    return () => unsub();
  }, []);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Setup recaptcha
      const verifier = setupRecaptcha("recaptcha-container");
      await loginWithPhone(phone, verifier);
      setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    }
  };

  // For demo, OTP verification step is not shown (would require confirmationResult)

  if (firebaseUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col items-center gap-6">
          <span className="inline-block h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
            {firebaseUser.photoURL ? (
              <img src={firebaseUser.photoURL} alt="Profile" className="h-24 w-24 object-cover" />
            ) : (
              <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            )}
          </span>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{firebaseUser.email || firebaseUser.phoneNumber}</div>
          <button onClick={() => logoutFirebase()} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg py-2 px-6 transition">Logout</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-100 dark:from-gray-900 dark:to-gray-800">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <button className={`px-4 py-2 rounded-l-lg ${tab === 'email' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('email')}>Email</button>
          <button className={`px-4 py-2 rounded-r-lg ${tab === 'phone' ? 'bg-purple-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'}`} onClick={() => setTab('phone')}>Phone</button>
        </div>
        {tab === 'email' ? (
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
              required
            />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg py-2 mt-2 transition"
            >
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
            <input
              type="tel"
              placeholder="Phone number (with country code)"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className="rounded-lg border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 dark:bg-gray-800 dark:text-white"
              required
            />
            <div id="recaptcha-container" />
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg py-2 mt-2 transition"
              disabled={otpSent}
            >
              {otpSent ? "OTP Sent" : "Send OTP"}
            </button>
          </form>
        )}
        <div className="mt-4 text-center">
          <button
            className="text-sm text-blue-600 hover:underline dark:text-blue-300"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
