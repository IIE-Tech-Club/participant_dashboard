"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import Loader from "@/components/ui/Loader";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Link from "next/link";

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    year: "",
    branch: "",
    collegeName: "",
    bio: "",
    phone: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`,
        );
        if (!res.ok) throw new Error("Failed to load profile data.");
        const data = await res.json();

        setFormData({
          name: data.name || user.displayName || "",
          gender: data.gender || "",
          year: data.year || "",
          branch: data.branch || "",
          collegeName: data.collegeName || "",
          bio: data.bio || "",
          phone: data.phone || "",
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to connect to database.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/${user.uid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!res.ok) throw new Error("Failed to update profile.");
      setSuccess(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Update failed.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-68px)]">
        <Loader text="Loading Profile Data..." />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10 lg:py-16">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/dashboard" className="btn-ghost px-3! py-2!">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </Link>
        <div>
          <h1 className="font-orbitron font-black text-2xl md:text-4xl text-white uppercase tracking-tight">
            Agent <span className="text-[#00f5ff]">Profile</span>
          </h1>
          <p className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)] mt-1 tracking-widest uppercase">
            Update Your Attributes
          </p>
        </div>
      </div>

      {error && (
        <ErrorAlert
          title="Update Failed"
          message={error}
          onRetry={() => setError(null)}
          className="mb-6"
        />
      )}

      {success && (
        <div className="mb-6 p-4 border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.05)] rounded flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse-dot" />
          <p className="font-mono-cc text-sm text-[#10b981] uppercase tracking-wider">
            Profile updated successfully.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
        {/* Email Field (Disabled) */}
        <div>
          <label className="input-label">Identified Email (Immutable)</label>
          <input
            type="email"
            value={user?.email || ""}
            disabled
            className="input-field opacity-50 cursor-not-allowed bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.05)]"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="input-label">Agent Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="e.g. +1 234 567 8900"
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
              <option value="Prefer not to say">Prefer not to say</option>
            </select>
          </div>

          <div>
            <label className="input-label">Current Year</label>
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input-field"
            >
              <option value="">Select Year</option>
              <option value="1st Year">1st Year</option>
              <option value="2nd Year">2nd Year</option>
              <option value="3rd Year">3rd Year</option>
              <option value="4th Year">4th Year</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="input-label">Branch / Major</label>
            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              placeholder="e.g. Computer Science"
              className="input-field"
            />
          </div>

          <div>
            <label className="input-label">College / University Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="e.g. MIT"
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="input-label">Bio / System Log</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="A brief description about your skills and interests..."
            className="input-field min-h-[100px] resize-y"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="btn-primary">
            {saving ? "SYNCING..." : "SAVE PROFILE CHANGES"}
          </button>
        </div>
      </form>
    </div>
  );
}
