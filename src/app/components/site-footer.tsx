"use client";

import { LucideArrowUp } from 'lucide-react';
import React, { useState, useEffect } from 'react'
import { toast } from "sonner"


function isValidEmail(email: string) {
  // Simple robust email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function SiteFooter() {
    const [email, setEmail] = useState("");
      const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "invalid">("idle");
    console.log("Form status:", status);

    // Remove form feedback after 5 seconds
      useEffect(() => {
        if (status === "success" || status === "error") {
        const timer = setTimeout(() => setStatus("idle"), 5000);
        return () => clearTimeout(timer);
        }
    }, [status]);

 
      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isValidEmail(email)) {
          setStatus("invalid");
          toast("Please enter a valid email", {
          description: "Only valid emails are allowed.",
          action: {
            label: "Close",
            onClick: () => console.log("Close"),
          },
        })
          return;
        }
        setStatus("loading");
        try {
          const res = await fetch("/api/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });
          if (res.ok) {
            setStatus("success");
            toast('Thanks for subscribing!')
            setEmail("");
          } else {
            setStatus("error");
            toast('Something went wrong. Please try again.')
          }
        } catch {
          setStatus("error");
        }
      };

  return (
    <footer className="bg-(--color-bg) pt-[32px] pb-[64px] lg:pb-32 lg:pt-16 border-t border-(--color-secondary) text-(--color-primary)">
      <div className="px-[16px] md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full">
        <div className='flex flex-col items-start order-2 md:order-1'>
          <h3 className="h4 font-semibold text-neutral-800 mb-4">
            Find My Function
          </h3>
          <p className="txt-p font-medium mb-6 lg:mb-16">
            A personal project to experiment, learn and have fun with new technologies.
          </p>
          <p className="txt-p mb-[100px] max-w-[62ch]">
            Built with Next JS, TypeScript, Tailwind CSS, Puppeteer and Clerk for authentication.
          </p>
          <p className="txt-small">
            Designed and developed by <a href="https://www.reihopsti.ee/" aria-label='Link to developers Rei Sikk portfolio website' className='underline underline-offset-2' target="_blank" rel="noopener noreferrer">Rei Sikk</a>.<br/> All rights reserved {new Date().getFullYear()}.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4 order-1 md:order-2">
          <button 
          type='button'
          className="btn-main txt-small w-full max-w-[175px] ml-auto mt-6 mb-6 md:mt-0 md:mb-0"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          >
            Back to the top
            <LucideArrowUp className="ml-2 h-4 w-4" />
          </button>
          <div className="w-full max-w-[500px] mt-auto">
            <p className="text-(length:--fs-h6) w-full max-w-[300px] font-medium mb-3">
              Sign up to get monthly updates on news from the industry.
            </p>
             <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                <div className="flex">
                    <input
                    type="email"
                    placeholder="Email"
                    minLength={4}
                    maxLength={64}
                    required
                    autoComplete="email"
                    name="email"
                    id="email"
                    aria-label="Email input for newsletter subscription"
                    className="w-full p-2 border border-(--color-primary--light)  rounded-l-sm text-neutral-800 focus:outline-none focus-ring-2 focus:ring-(--color-primary) focus:border-(--color-primary) txt-small"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    />
                     <button
                        type="submit"
                        className="btn-main rounded-r-sm txt-small font-normal tracking-wide rounded-l-none max-w-[175px] w-full ml-auto flex-[40%]"
                        disabled={status === "loading" || status === "success"}
                    >
                        {status === "loading" ? "Subscribing..." : "Subscribe"}
                    </button>
                </div>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default SiteFooter