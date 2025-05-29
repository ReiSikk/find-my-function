"use client";

import { LucideArrowUp } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react'

function SiteFooter() {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("loading");
        try {
        const res = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
        });
        if (res.ok) {
            setStatus("success");
            setEmail("");
        } else {
            setStatus("error");
        }
        } catch {
        setStatus("error");
        }
    };


  return (
    <footer className="bg-(--color-bg) py-16 lg:py-32 border-t border-(--color-secondary) text-(--color-primary)">
      <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-(length:--fs-h4) font-semibold text-neutral-800 mb-8 lg:mb-16">
            Find My Function
          </h3>
          <p className="text-(length:--fs-p) mb-4">
            A personal project to experiment, learn and have fun with new technologies.
          </p>
          <p className="text-(length:--fs-small) text-neutral-500">
            Built with Next JS, TypeScript, Tailwind CSS, Puppeteer and Clerk for authentication.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end justify-between space-y-4">
          <Link href="" className="btn-main text-(length:--fs-small) w-full max-w-[225px]">
            Back to the top
            <LucideArrowUp className="ml-2 h-4 w-4" />
          </Link>
          <div className="w-full max-w-sm">
            <p className="text-(length:--fs-small) mb-2">
              Sign up to get monthly updates on news from the industry.
            </p>
             <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                 type="email"
                placeholder="Email"
                className="w-full p-2 border border-neutral-700 rounded text-neutral-800"
                value={email}
                onChange={e => setEmail(e.target.value)}
                />
                <button type="submit" className="btn-main">
                 Subscribe
                </button>
                {status === "success" && <p className="text-green-600 mt-2">Thanks for subscribing!</p>}
                {status === "error" && <p className="text-red-600 mt-2">Something went wrong. Please try again.</p>}
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter