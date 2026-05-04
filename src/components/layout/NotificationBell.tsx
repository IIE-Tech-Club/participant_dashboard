"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { API_BASE_URL } from "@/lib/site";

interface Invitation {
  _id: string;
  inviterEmail: string;
  teamName: string;
  status: string;
}

export default function NotificationBell() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    const email = user?.email;
    if (!email) return;
    try {
      const res = await fetch(`${API_BASE_URL}/invitations/user/${encodeURIComponent(email)}`);
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
          `${API_BASE_URL}/invitations/user/${encodeURIComponent(email)}`,
        );
        if (res.ok) {
          const data = await res.json();
          setInvitations(data);
        }
      } catch (err) {
        console.error("Failed to fetch invitations", err);
      }
    };

    fetchData(); // ✅ safe now

    const interval = setInterval(fetchData, 10000);

    return () => clearInterval(interval);
  }, [user?.email]);

  const handleResponse = async (id: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/invitations/${id}/${action}`, {
        method: "PUT"
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

  if (!user) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-300 hover:text-cyan-400 transition-colors"
      >
        {invitations.length > 0 ? (
          // 🔔 ringing bell
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5 group-hover:animate-bounce animate-bounce"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M17.451 2.344a1 1 0 0 1 1.41 -.099a12.05 12.05 0 0 1 3.048 4.064a1 1 0 1 1 -1.818 .836a10.05 10.05 0 0 0 -2.54 -3.39a1 1 0 0 1 -.1 -1.41z" />
            <path d="M5.136 2.245a1 1 0 0 1 1.312 1.51a10.05 10.05 0 0 0 -2.54 3.39a1 1 0 1 1 -1.817 -.835a12.05 12.05 0 0 1 3.045 -4.065z" />
            <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
            <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
          </svg>
        ) : (
          // 🔕 normal bell
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M14.235 19c.865 0 1.322 1.024 .745 1.668a3.992 3.992 0 0 1 -2.98 1.332a3.992 3.992 0 0 1 -2.98 -1.332c-.552 -.616 -.158 -1.579 .634 -1.661l.11 -.006h4.471z" />
            <path d="M12 2c1.358 0 2.506 .903 2.875 2.141l.046 .171l.008 .043a8.013 8.013 0 0 1 4.024 6.069l.028 .287l.019 .289v2.931l.021 .136a3 3 0 0 0 1.143 1.847l.167 .117l.162 .099c.86 .487 .56 1.766 -.377 1.864l-.116 .006h-16c-1.028 0 -1.387 -1.364 -.493 -1.87a3 3 0 0 0 1.472 -2.063l.021 -.143l.001 -2.97a8 8 0 0 1 3.821 -6.454l.248 -.146l.01 -.043a3.003 3.003 0 0 1 2.562 -2.29l.182 -.017l.176 -.004z" />
          </svg>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0a1220] border border-[rgba(0,245,255,0.2)] shadow-[0_4px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-down z-50">
          <div className="p-3 border-b border-[rgba(0,245,255,0.1)] flex items-center justify-between">
            <span className="font-orbitron font-bold text-[10px] text-cyan-400 uppercase tracking-widest">
              Incoming Transmissions
            </span>
            <span className="font-mono text-[9px] text-slate-500">
              {invitations.length} Pending
            </span>
          </div>

          <div className="max-h-96 overflow-y-auto soft-scrollbar">
            {invitations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">
                  No pending invites
                </p>
              </div>
            ) : (
              invitations.map((invite) => (
                <div
                  key={invite._id}
                  className="p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,245,255,0.02)] transition-colors"
                >
                  <p className="font-mono text-[10px] text-slate-400 mb-1">
                    From:{" "}
                    <span className="text-white">{invite.inviterEmail}</span>
                  </p>
                  <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wider mb-3">
                    Squad:{" "}
                    <span className="text-cyan-400">{invite.teamName}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleResponse(invite._id, "accept")}
                      disabled={loading}
                      className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-orbitron font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleResponse(invite._id, "reject")}
                      disabled={loading}
                      className="flex-1 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-orbitron font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
