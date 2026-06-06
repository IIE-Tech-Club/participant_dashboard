"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/site";
import { signOutUser } from "@/lib/firebase/client";
import Link from "next/link";
import Image from "next/image";

interface Invitation {
  _id: string;
  inviterEmail: string;
  teamName: string;
  status: string;
}

export default function ProfileDropdown() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchInvitations = async () => {
    const email = user?.email;
    if (!email) return;
    try {
      const res = await fetch(
        `${API_BASE_URL}/invitations/user/${encodeURIComponent(email)}`
      );
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error("Failed to fetch invitations", err);
    }
  };

  useEffect(() => {
    if (!user?.email) return;

    const fetchData = async () => {
      const email = user?.email;
      if (!email) return;
      try {
        const res = await fetch(
          `${API_BASE_URL}/invitations/user/${encodeURIComponent(email)}`
        );
        if (res.ok) {
          const data = await res.json();
          setInvitations(data);
        }
      } catch (err) {
        console.error("Failed to fetch invitations", err);
      }
    };

    fetchData();

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [user?.email]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleResponse = async (id: string, action: "accept" | "reject") => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invitations/${id}/${action}`, {
        method: "PUT",
      });
      if (res.ok) {
        fetchInvitations();
      }
    } catch (err) {
      console.error(`Failed to ${action} invitation`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      signOutUser(),
    ]);
    window.location.href = "/";
  };

  if (!user) return null;

  const firstName =
    user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "Hacker";

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button: User Profile Image */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setNotificationsOpen(false); // Reset notifications expand state when reopening
          }
        }}
        className="relative w-9 h-9 rounded-full border border-purple-500/30 bg-[#0f0f24] overflow-hidden shrink-0 shadow-[0_0_12px_rgba(139,92,246,0.15)] hover:border-purple-400 hover:scale-105 transition-all duration-300 outline-none flex items-center justify-center cursor-pointer"
        aria-label="Toggle user menu"
      >
        {user.photoURL ? (
          <Image
            src={user.photoURL}
            alt={firstName}
            width={36}
            height={36}
            className="object-cover w-full h-full"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#0f0f24] text-purple-300 text-sm font-black font-orbitron">
            {firstName[0].toUpperCase()}
          </div>
        )}

        {/* Notifications badge / dot */}
        {invitations.length > 0 && (
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-pink-500 rounded-full border border-[#05050a] animate-pulse" />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-3 w-72 bg-[#0f0f24]/95 border border-purple-500/20 shadow-[0_10px_40px_rgba(0,0,0,0.8)] backdrop-blur-xl rounded-lg overflow-hidden z-50 transition-all duration-300 transform origin-top-right animate-scale-in">
          {/* User Details Header */}
          <div className="px-4 py-3 border-b border-purple-500/10 flex items-center gap-3 bg-[#0a0a16]/40">
            <div className="relative w-10 h-10 rounded-full border border-purple-500/25 bg-[#0f0f24] overflow-hidden shrink-0 shadow-[0_0_10px_rgba(139,92,246,0.1)]">
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  alt={firstName}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-purple-300 text-sm font-black font-orbitron">
                  {firstName[0].toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wide truncate">
                {user.displayName || firstName}
              </p>
              <p className="font-mono text-[9px] text-slate-500 truncate">
                {user.email}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            {/* Profile Link */}
            <Link
              href={`/${user.uid}/profile`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 font-orbitron font-bold text-[10px] text-slate-400 hover:text-purple-400 hover:bg-purple-500/5 uppercase tracking-widest transition-all group border-b border-purple-500/5"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-slate-500 group-hover:text-purple-400 transition-colors"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 2a5 5 0 1 1 -5 5l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
                <path d="M14 14a5 5 0 0 1 5 5v1a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-1a5 5 0 0 1 5 -5h4z" />
              </svg>
              Profile
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-purple-400 text-xs">
                →
              </span>
            </Link>

            {/* Notifications Section */}
            <div className="border-b border-purple-500/5">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 font-orbitron font-bold text-[10px] text-slate-400 hover:text-purple-400 hover:bg-purple-500/5 uppercase tracking-widest transition-all group text-left outline-none cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className={`text-slate-500 group-hover:text-purple-400 transition-colors ${
                    invitations.length > 0 ? "animate-bounce" : ""
                  }`}
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
                </svg>
                <span>Notifications</span>
                {invitations.length > 0 && (
                  <span className="ml-2 px-1.5 py-0.5 bg-pink-500/10 border border-pink-500/30 rounded font-mono text-[8px] text-pink-400 animate-pulse">
                    {invitations.length}
                  </span>
                )}
                <span className="ml-auto text-slate-500 group-hover:text-purple-400 text-[8px] transition-transform duration-300">
                  {notificationsOpen ? "▼" : "▶"}
                </span>
              </button>

              {/* Accordion Content */}
              {notificationsOpen && (
                <div className="bg-[#0a0a16]/60 border-t border-purple-500/10 max-h-60 overflow-y-auto soft-scrollbar">
                  {invitations.length === 0 ? (
                    <div className="px-4 py-4 text-center">
                      <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                        No pending invites
                      </p>
                    </div>
                  ) : (
                    invitations.map((invite) => (
                      <div
                        key={invite._id}
                        className="p-3 border-b border-[rgba(255,255,255,0.03)] last:border-b-0 hover:bg-purple-500/5 transition-colors"
                      >
                        <p className="font-mono text-[9px] text-slate-400 mb-1 truncate">
                          From:{" "}
                          <span className="text-white">
                            {invite.inviterEmail}
                          </span>
                        </p>
                        <p className="font-orbitron font-bold text-[10px] text-white uppercase tracking-wider mb-2 truncate">
                          Squad:{" "}
                          <span className="text-purple-300">
                            {invite.teamName}
                          </span>
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleResponse(invite._id, "accept")}
                            disabled={loading}
                            className="flex-1 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-orbitron font-bold text-[8px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleResponse(invite._id, "reject")}
                            disabled={loading}
                            className="flex-1 py-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-orbitron font-bold text-[8px] uppercase tracking-widest transition-colors disabled:opacity-50 cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 font-orbitron font-bold text-[10px] text-slate-400 hover:text-rose-400 hover:bg-[rgba(244,63,94,0.04)] uppercase tracking-widest transition-all group text-left outline-none cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-slate-500 group-hover:text-rose-400 transition-colors -rotate-90"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-12a1 1 0 0 0 -.993 .883l-.007 .117v9h14v-9a1 1 0 0 0 -.883 -.993l-.117 -.007zm-5.387 3.21l.094 .083l2 2a1 1 0 0 1 -1.32 1.497l-.094 -.083l-1.293 -1.292l-1.293 1.292a1 1 0 0 1 -1.32 .083l-.094 -.083a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.32 -.083z" />
              </svg>
              Logout
              <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-rose-400 text-xs">
                →
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
