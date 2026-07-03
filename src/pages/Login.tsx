import { createUserProfile } from "../services/userService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  loginWithGoogle,
  loginWithEmail,
} from "../firebase/auth";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleGoogleLogin() {
    try {
      setLoading(true);

     const user = await loginWithGoogle();

        await createUserProfile(user);

navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Google sign in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    try {
      setLoading(true);

      await loginWithEmail(email, password);

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            OAP Funding Tracker
          </h1>

          <p className="mt-2 text-gray-500">
            Sign in to continue
          </p>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="mb-4 w-full rounded-lg bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 disabled:opacity-50"
        >
          Continue with Google
        </button>

        <div className="my-4 text-center text-gray-400">
          OR
        </div>

        <input
          type="email"
          placeholder="Email"

          value={email}

          onChange={(e) => setEmail(e.target.value)}

          className="mb-3 w-full rounded-lg border p-3"
        />

        <input
          type="password"
          placeholder="Password"

          value={password}

          onChange={(e) => setPassword(e.target.value)}

          className="mb-5 w-full rounded-lg border p-3"
        />

        <button
          onClick={handleEmailLogin}
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          Login
        </button>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don't have an account? Register
        </p>

      </div>
    </div>
  );
}