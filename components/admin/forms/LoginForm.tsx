"use client";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Leaf } from "lucide-react";
import { panel, label, input, submitBtn } from "../shared";

export const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await signIn("credentials", {
      username: username,
      password: password,
      redirect: false,
      callbackUrl: "/admin/dashboard",
    });

    if (result && result.error) {
      console.error("Sign-in error:", result.error);
    } else if (result) {
      console.log("Signed in successfully!");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fefaf2] px-4 pb-16 pt-28">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">
            <Leaf className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-stone-900">
            Admin Console
          </h1>
          <p className="mt-1 font-mono text-xs uppercase tracking-widest text-stone-500">
            Earth Again
          </p>
        </div>

        <div className={`${panel} p-8`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={label}>Username</label>
              <input
                type="text"
                className={input}
                placeholder="admin"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
                required
              />
            </div>
            <div>
              <label className={label}>Password</label>
              <input
                type="password"
                className={input}
                placeholder="••••••••"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                required
              />
            </div>
            <button type="submit" className={submitBtn}>
              Sign in
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-stone-400">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
};
