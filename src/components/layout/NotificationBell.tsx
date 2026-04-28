"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function NotificationBell() {
  const { user } = useAuth();
  const [invitations, setInvitations] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchInvitations = async () => {
    if (!user?.email) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/user/${encodeURIComponent(user.email)}`);
      if (res.ok) {
        const data = await res.json();
        setInvitations(data);
      }
    } catch (err) {
      console.error("Failed to fetch invitations", err);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchInvitations();
      // Poll every 10 seconds for real-time feel
      const interval = setInterval(fetchInvitations, 10000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleResponse = async (id: string, action: 'accept' | 'reject') => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invitations/${id}/${action}`, {
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
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
        {invitations.length > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse border-2 border-[#040b14]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-[#0a1220] border border-[rgba(0,245,255,0.2)] shadow-[0_4px_32px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-fade-down z-50">
          <div className="p-3 border-b border-[rgba(0,245,255,0.1)] flex items-center justify-between">
            <span className="font-orbitron font-bold text-[10px] text-cyan-400 uppercase tracking-widest">Incoming Transmissions</span>
            <span className="font-mono text-[9px] text-slate-500">{invitations.length} Pending</span>
          </div>
          
          <div className="max-h-96 overflow-y-auto soft-scrollbar">
            {invitations.length === 0 ? (
              <div className="p-6 text-center">
                <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">No pending invites</p>
              </div>
            ) : (
              invitations.map((invite) => (
                <div key={invite._id} className="p-4 border-b border-[rgba(255,255,255,0.05)] hover:bg-[rgba(0,245,255,0.02)] transition-colors">
                  <p className="font-mono text-[10px] text-slate-400 mb-1">From: <span className="text-white">{invite.inviterEmail}</span></p>
                  <p className="font-orbitron font-bold text-xs text-white uppercase tracking-wider mb-3">
                    Squad: <span className="text-cyan-400">{invite.teamName}</span>
                  </p>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleResponse(invite._id, 'accept')}
                      disabled={loading}
                      className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-orbitron font-bold text-[9px] uppercase tracking-widest transition-colors disabled:opacity-50"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => handleResponse(invite._id, 'reject')}
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
