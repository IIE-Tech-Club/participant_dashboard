"use client";

import { useState, useEffect, use } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Link from "next/link";
import Image from "next/image";

interface ProfileData {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  role: string;
  gender?: string;
  year?: string;
  branch?: string;
  collegeName?: string;
  bio?: string;
  phone?: string;
  team?: string;
  track?: string;
  status?: string;
  createdAt: string;
}

export default function PublicProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = use(params);
  const { user: currentUser, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}`,
        );
        if (!res.ok) {
          if (res.status === 404) throw new Error("Agent not found in the database.");
          throw new Error("Failed to retrieve agent data.");
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Network protocol failure.");
      } finally {
        setLoading(false);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  if (loading || authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)] bg-[#050505]">
        <Loader text="Decrypting Agent Profile..." />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-4xl mx-auto px-5 py-20">
        <ErrorAlert
          title="Access Denied"
          message={error || "Target identity not found."}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-8 flex justify-center">
          <Link href="/" className="btn-secondary">
            RETURN TO BASE
          </Link>
        </div>
      </div>
    );
  }

  const isOwnProfile = currentUser?.uid === profile.uid;

  return (
    <div className="min-h-screen bg-[#050505] py-12 px-6 lg:py-20">
      <div className="max-w-5xl mx-auto">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-fade-in">
          <div>
            <div className="flex items-center gap-2 mb-2 text-[#00f5ff] font-mono-cc text-xs tracking-widest uppercase opacity-70">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00f5ff] animate-pulse" />
              Public Identity Hub
            </div>
            <h1 className="font-orbitron font-black text-4xl md:text-6xl text-white uppercase tracking-tighter leading-none">
              Agent <span className="text-[#00f5ff]">{profile.name.split(" ")[0]}</span>
            </h1>
          </div>

          <div className="flex gap-4">
            {isOwnProfile && (
              <>
                <Link href="/dashboard" className="btn-primary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <path d="M9 22V12h6v10" />
                  </svg>
                  DASHBOARD
                </Link>
                <Link href={`/${profile.uid}/settings`} className="btn-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  EDIT
                </Link>
              </>
            )}
            <button 
              onClick={handleShare}
              className={`btn-ghost flex items-center gap-2 px-4! transition-all duration-300 ${copied ? 'text-green-400 border-green-400/50 bg-green-400/5' : ''}`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {copied ? (
                  <path d="M20 6L9 17l-5-5" />
                ) : (
                  <>
                    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                  </>
                )}
              </svg>
              {copied ? 'COPIED!' : 'SHARE LINK'}
            </button>
          </div>
        </div>

        {/* Profile Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Visual Identity */}
          <div className="space-y-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="glass-card overflow-hidden p-1 border-[#00f5ff20] group">
              <div className="relative aspect-square bg-[#0a0a0a] overflow-hidden rounded">
                {profile.photoURL ? (
                  <Image 
                    src={profile.photoURL} 
                    alt={profile.name} 
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 30vw"
                    className="object-cover hover:grayscale-0 transition-all duration-700 scale-105 group-hover:scale-100"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#00f5ff20]">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                )}
                
                {/* Overlay Decals */}
                <div className="absolute top-4 left-4 p-2 bg-black/60 backdrop-blur rounded border border-[#00f5ff20] font-mono-cc text-[10px] text-[#00f5ff] tracking-wider uppercase">
                  Class: {profile.role?.toLowerCase() === 'student' ? 'Participant' : profile.role}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Intel */}
          <div className="lg:col-span-2 space-y-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            
            {/* Bio Section */}
            <div className="glass-card p-8 border-[#00f5ff10] relative overflow-hidden">
               {/* Decorative Background Element */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#00f5ff05] rounded-full blur-3xl pointer-events-none" />
              
              <h3 className="font-orbitron text-xl text-white uppercase tracking-wider mb-6 flex items-center gap-3">
                <span className="w-6 h-px bg-[#00f5ff]" />
                Agent Narrative
              </h3>
              
              <div className="relative">
                <div className="absolute left-0 top-0 w-[2px] h-full bg-linear-to-b from-[#00f5ff40] to-transparent" />
                <p className="pl-6 font-grotesk text-lg text-white/70 leading-relaxed italic">
                  {profile.bio || "This agent has chosen to remain in the shadows, leaving no data in their narrative log. Their silence speaks volumes of their tactical focus."}
                </p>
              </div>
            </div>

            {/* Attributes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Educational Nexus */}
              <div className="glass-card p-8 border-[#00f5ff10]">
                <h3 className="font-orbitron text-sm text-[#00f5ff] uppercase tracking-widest mb-6">Educational Nexus</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-mono-cc text-[10px] text-white/30 uppercase tracking-tighter">Institute</label>
                    <p className="font-grotesk text-white font-medium">{profile.collegeName || "Classified"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div>
                      <label className="font-mono-cc text-[10px] text-white/30 uppercase tracking-tighter">Branch</label>
                      <p className="font-grotesk text-white">{profile.branch || "Unspecified"}</p>
                    </div>
                    <div>
                      <label className="font-mono-cc text-[10px] text-white/30 uppercase tracking-tighter">Academic Year</label>
                      <p className="font-grotesk text-white">{profile.year || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Personal Signature */}
              <div className="glass-card p-8 border-[#00f5ff10]">
                <h3 className="font-orbitron text-sm text-[#00f5ff] uppercase tracking-widest mb-6">Personal Signature</h3>
                <div className="space-y-4">
                  <div>
                    <label className="font-mono-cc text-[10px] text-white/30 uppercase tracking-tighter">Gender</label>
                    <p className="font-grotesk text-white">{profile.gender || "Undeclared"}</p>
                  </div>
                  {/* We don't show email/phone publicly unless specified, but for this "Intro" page we can show email as it's often a point of contact for intro pages */}
                  <div>
                    <label className="font-mono-cc text-[10px] text-white/30 uppercase tracking-tighter">Direct Uplink</label>
                    <p className="font-grotesk text-[#00f5ff] opacity-80">{profile.email}</p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Footer Tag - Centered with respect to the whole page */}
        <div className="flex justify-center mt-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <div className="px-6 py-2 border border-white/5 rounded-full bg-white/2 flex items-center gap-3">
            <span className="font-mono-cc text-[10px] text-white/20 uppercase tracking-[0.2em]">Verified CodeCraft Participant</span>
            <span className="w-1 h-1 rounded-full bg-[#00f5ff30]" />
            <span className="font-mono-cc text-[10px] text-white/20 uppercase tracking-[0.2em]">{new Date().getFullYear()}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slideUp 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
