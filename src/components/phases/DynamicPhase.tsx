"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { commitPhase } from "@/store/hackathonStore";
import { useAuth } from "@/hooks/useAuth";
import type { Phase, Hackathon } from "@/types/hackathon";
import ErrorAlert from "@/components/ui/ErrorAlert";
import Loader from "@/components/ui/Loader";

interface Props {
  hackathon: Hackathon;
  phase: Phase;
  existingResponse: any;
  onComplete: () => void;
}

function isHackathonActive(h: Hackathon) {
  const now = new Date();
  if (h.startDate && new Date(h.startDate) > now)
    return { active: false, reason: `Opens on ${new Date(h.startDate).toLocaleString()}.` };
  if (h.endDate && new Date(h.endDate) < now)
    return { active: false, reason: `Ended on ${new Date(h.endDate).toLocaleString()}.` };
  return { active: true };
}

function isPhaseActive(phase: Phase) {
  const now = new Date();
  if (phase.startDate && new Date(phase.startDate) > now)
    return { active: false, reason: `Opens on ${new Date(phase.startDate).toLocaleString()}.` };
  if (phase.endDate && new Date(phase.endDate) < now)
    return { active: false, reason: `Closed on ${new Date(phase.endDate).toLocaleString()}.` };
  return { active: true };
}

function Md({ children }: { children: string }) {
  return (
    <ReactMarkdown components={{
      p: ({ ...p }) => <p className="text-[rgba(224,247,255,0.45)] font-mono-cc text-xs leading-relaxed mb-2" {...p} />,
      strong: ({ ...p }) => <strong className="text-[rgba(224,247,255,0.75)]" {...p} />,
      a: ({ ...p }) => <a className="text-[#00f5ff] underline" target="_blank" rel="noopener noreferrer" {...p} />,
      ul: ({ ...p }) => <ul className="list-disc list-inside text-[rgba(224,247,255,0.45)] font-mono-cc text-xs space-y-1 mb-2" {...p} />,
      ol: ({ ...p }) => <ol className="list-decimal list-inside text-[rgba(224,247,255,0.45)] font-mono-cc text-xs space-y-1 mb-2" {...p} />,
      h1: ({ ...p }) => <h1 className="text-white font-orbitron font-bold text-sm uppercase tracking-wider mb-2" {...p} />,
      h2: ({ ...p }) => <h2 className="text-[rgba(224,247,255,0.8)] font-orbitron font-bold text-xs uppercase tracking-wider mb-2" {...p} />,
      blockquote: ({ ...p }) => <blockquote className="border-l-2 border-[rgba(0,245,255,0.3)] pl-3 text-[rgba(224,247,255,0.4)] font-mono-cc text-xs italic mb-2" {...p} />,
      code: ({ ...p }) => <code className="bg-[rgba(255,255,255,0.05)] text-[#00f5ff] font-mono-cc text-xs px-1 py-0.5" {...p} />,
    }}>
      {children}
    </ReactMarkdown>
  );
}

function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <span className="input-label">
      <ReactMarkdown components={{
        p: ({ ...p }) => <span {...p} />,
        strong: ({ ...p }) => <strong className="text-[rgba(224,247,255,0.8)]" {...p} />,
        code: ({ ...p }) => <code className="text-[#00f5ff] font-mono-cc" {...p} />,
        a: ({ ...p }) => <a className="text-[#00f5ff] underline" target="_blank" rel="noopener noreferrer" {...p} />,
      }}>
        {label}
      </ReactMarkdown>
      {required && <span className="text-[#00f5ff] ml-1">*</span>}
    </span>
  );
}

export default function DynamicPhase({ hackathon, phase, existingResponse, onComplete }: Props) {
  const { user } = useAuth();

  const getInitial = () => {
    if (existingResponse) return existingResponse;
    const s: any = {};
    phase.fields?.forEach((f) => {
      s[f.id] = f.type === "checkbox" ? false : "";
      if (phase.id === "phase_1_registration" && user) {
        if (f.id === "name" && user.displayName) s[f.id] = user.displayName;
        if (f.id === "email" && user.email) s[f.id] = user.email;
      }
    });
    return s;
  };

  const [form, setForm] = useState<any>(getInitial());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [systemError, setSystemError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    if (!existingResponse && phase.id === "phase_1_registration" && user) {
      setForm((prev: any) => ({
        ...prev,
        name: prev.name || user.displayName || "",
        email: prev.email || user.email || "",
      }));
    }
  }, [user, phase.id, existingResponse]);

  const isCompleted = !!existingResponse;
  const isDirty = JSON.stringify(form) !== JSON.stringify(getInitial());
  const phases = hackathon.phases || [];
  const isLastPhase = phases.length > 0 && phases[phases.length - 1].id === phase.id;

  const hStatus = isHackathonActive(hackathon);
  const pStatus = phase.isMandatory ? { active: true } : isPhaseActive(phase);
  const isLocked = !hStatus.active || !pStatus.active;
  const lockReason = !hStatus.active ? hStatus.reason! : pStatus.reason!;

  const validate = () => {
    const e: Record<string, string> = {};
    phase.fields?.forEach((f) => {
      if (f.required) {
        if (f.type === "checkbox" && !form[f.id]) e[f.id] = "Required";
        else if (f.type !== "checkbox" && !String(form[f.id] ?? "").trim()) e[f.id] = `${f.label} is required`;
      }
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    setSystemError(null);
    try {
      if (!user) throw new Error("Authentication node not found.");
      const ok = await commitPhase(hackathon.id, user.uid, phase.id, { ...form });
      if (!ok) throw new Error("Protocol rejection from server.");
      if (isLastPhase) window.location.href = "/dashboard";
      else onComplete();
    } catch (err: any) {
      setSystemError(err.message || "Failed to commit data.");
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((f: any) => ({ ...f, [field]: value }));
    setErrors((e) => ({ ...e, [field]: "" }));
  };

  const uploadPDF = async (fieldId: string, file: File) => {
    if (file.type !== "application/pdf") { setErrors((e) => ({ ...e, [fieldId]: "Only PDF files are allowed." })); return; }
    if (file.size > 10 * 1024 * 1024) { setErrors((e) => ({ ...e, [fieldId]: "File exceeds 10MB." })); return; }
    setUploadingField(fieldId);
    setErrors((e) => ({ ...e, [fieldId]: "" }));
    const cn = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const up = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    if (!cn || !up) { setErrors((e) => ({ ...e, [fieldId]: "Cloudinary config missing." })); setUploadingField(null); return; }
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", up);
    fd.append("resource_type", "auto");
    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cn}/upload`, { method: "POST", body: fd });
      const data = await res.json();
      if (data.secure_url) updateField(fieldId, data.secure_url);
      else throw new Error(data.error?.message || "Upload failed");
    } catch (err: any) {
      setErrors((e) => ({ ...e, [fieldId]: "Upload failed. Try again." }));
    } finally {
      setUploadingField(null);
    }
  };

  const phaseIdx = phases.findIndex((p) => p.id === phase.id);

  return (
    <div className="w-full animate-fade-up">

      {/* Phase Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="font-mono-cc text-[9px] text-[rgba(0,245,255,0.4)] uppercase tracking-[0.3em]">
            Phase {String(phaseIdx + 1).padStart(2, "0")}
          </span>
          <span className="flex-1 h-px bg-[rgba(0,245,255,0.08)]" />
          <span className={`font-mono-cc text-[9px] uppercase tracking-widest ${
            isLocked ? "text-[#f43f5e]" : isCompleted ? "text-[#10b981]" : "text-[#f59e0b]"
          }`}>
            {isLocked ? "● Locked" : isCompleted ? "● Completed" : "● Active"}
          </span>
        </div>

        <h2 className="text-2xl lg:text-3xl font-orbitron font-black text-white uppercase tracking-tight leading-tight">
          <ReactMarkdown components={{ p: ({ ...p }) => <span {...p} /> }}>
            {phase.name}
          </ReactMarkdown>
        </h2>

        {phase.description && (
          <div className="mt-3 max-w-xl">
            <Md>{phase.description}</Md>
          </div>
        )}
      </div>

      {/* Locked Banner */}
      {isLocked && (
        <div className="mb-6 flex items-start gap-3 p-4 border border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.06)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2" className="shrink-0 mt-0.5">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
          <div>
            <p className="font-orbitron font-bold text-[10px] text-[#f43f5e] uppercase tracking-widest mb-1">Phase Locked</p>
            <p className="font-mono-cc text-[11px] text-[rgba(224,247,255,0.45)] leading-relaxed">{lockReason}</p>
          </div>
        </div>
      )}

      {/* System Error */}
      {systemError && (
        <div className="mb-6">
          <ErrorAlert title="Submission Error" message={systemError} onRetry={() => setSystemError(null)} />
        </div>
      )}

      {/* Completed Banner */}
      {isCompleted && (
        <div className="mb-6 flex items-start gap-3 p-4 border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)]">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" className="shrink-0 mt-0.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <div>
            <p className="font-orbitron font-bold text-[10px] text-[#10b981] uppercase tracking-widest mb-1">Response Logged</p>
            <p className="font-mono-cc text-[11px] text-[rgba(224,247,255,0.45)] leading-relaxed">
              Your data has been saved. You can update it below.
            </p>
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="glass-card p-6 lg:p-8 space-y-7">

          {/* Form Fields */}
          {phase.fields && (
            <div className="space-y-7">
              {phase.fields.map((field) => (
                <div key={field.id}>
                  {/* Content block */}
                  {(field.type as any) === "content" ? (
                    <div className="relative p-5 border border-[rgba(0,245,255,0.12)] bg-[rgba(0,245,255,0.03)] overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[rgba(0,245,255,0.35)]" />
                      <div className="pl-2">
                        <ReactMarkdown components={{
                          p: ({ ...p }) => <p className="mb-2 last:mb-0 font-mono-cc text-xs text-[rgba(224,247,255,0.5)] leading-relaxed" {...p} />,
                          a: ({ ...p }) => <a className="text-[#00f5ff] underline" target="_blank" rel="noopener noreferrer" {...p} />,
                          strong: ({ ...p }) => <strong className="text-[rgba(224,247,255,0.8)]" {...p} />,
                        }}>
                          {field.label}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : field.type === "checkbox" ? (
                    <label className={`flex items-start gap-3 cursor-pointer group ${isLocked ? "opacity-40 pointer-events-none" : ""}`}>
                      <div className="relative shrink-0 mt-0.5">
                        <input type="checkbox" checked={!!form[field.id]} onChange={(e) => updateField(field.id, e.target.checked)} className="sr-only" disabled={isLocked} />
                        <div className={`w-5 h-5 border transition-all duration-200 flex items-center justify-center ${
                          form[field.id] ? "bg-[#00f5ff] border-[#00f5ff]" : "border-[rgba(224,247,255,0.2)] group-hover:border-[rgba(0,245,255,0.5)]"
                        }`}>
                          {form[field.id] && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#040b14" strokeWidth="3.5">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                          )}
                        </div>
                      </div>
                      <span className="font-mono-cc text-sm text-[rgba(224,247,255,0.7)] group-hover:text-[rgba(224,247,255,0.9)] transition-colors leading-relaxed">
                        <ReactMarkdown components={{
                          p: ({ ...p }) => <span {...p} />,
                          a: ({ ...p }) => <a className="text-[#00f5ff] underline" target="_blank" rel="noopener noreferrer" {...p} />,
                          strong: ({ ...p }) => <strong className="text-white" {...p} />,
                        }}>
                          {field.label}
                        </ReactMarkdown>
                        {field.required && <span className="text-[#00f5ff] ml-1">*</span>}
                      </span>
                    </label>
                  ) : field.type === "textarea" ? (
                    <>
                      <FieldLabel label={field.label} required={field.required} />
                      <textarea
                        value={form[field.id] ?? ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className="input-field min-h-[110px] resize-y"
                        disabled={isLocked}
                        placeholder="Enter your response..."
                      />
                    </>
                  ) : field.type === "select" ? (
                    <>
                      <FieldLabel label={field.label} required={field.required} />
                      <select value={form[field.id] ?? ""} onChange={(e) => updateField(field.id, e.target.value)} className="input-field" disabled={isLocked}>
                        <option value="">Select an option</option>
                        {field.options?.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    </>
                  ) : field.type === "radio" ? (
                    <>
                      <FieldLabel label={field.label} required={field.required} />
                      <div className="mt-3 space-y-2.5">
                        {field.options?.map((opt) => (
                          <label key={opt} className={`flex items-center gap-3 cursor-pointer group ${isLocked ? "opacity-40 pointer-events-none" : ""}`}>
                            <div className="relative shrink-0">
                              <input type="radio" name={field.id} checked={form[field.id] === opt} onChange={() => updateField(field.id, opt)} className="sr-only" disabled={isLocked} />
                              <div className={`w-4 h-4 rounded-full border transition-all flex items-center justify-center ${
                                form[field.id] === opt ? "border-[#00f5ff]" : "border-[rgba(224,247,255,0.2)] group-hover:border-[rgba(0,245,255,0.4)]"
                              }`}>
                                {form[field.id] === opt && <div className="w-2 h-2 rounded-full bg-[#00f5ff]" />}
                              </div>
                            </div>
                            <span className="font-mono-cc text-sm text-[rgba(224,247,255,0.7)] group-hover:text-[rgba(224,247,255,0.9)] transition-colors">{opt}</span>
                          </label>
                        ))}
                      </div>
                    </>
                  ) : field.type === "file" ? (
                    <>
                      <FieldLabel label={field.label} required={field.required} />
                      <div className="mt-2 relative group">
                        <input type="file" accept=".pdf" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadPDF(field.id, f); }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" disabled={isLocked || !!uploadingField} />
                        <div className={`w-full border border-dashed transition-all py-8 flex flex-col items-center justify-center gap-2 ${
                          uploadingField === field.id ? "border-[rgba(0,245,255,0.5)] bg-[rgba(0,245,255,0.05)]"
                          : "border-[rgba(0,245,255,0.2)] group-hover:border-[rgba(0,245,255,0.45)] group-hover:bg-[rgba(0,245,255,0.03)]"
                        }`}>
                          {uploadingField === field.id ? (
                            <>
                              <div className="scale-50 h-6 flex items-center justify-center">
                                <Loader text="" />
                              </div>
                              <span className="font-mono-cc text-[10px] text-[#00f5ff] uppercase tracking-widest animate-pulse">Uploading...</span>
                            </>
                          ) : form[field.id] ? (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                              <span className="font-mono-cc text-[9px] text-[#10b981] break-all max-w-xs text-center">PDF Uploaded</span>
                              <span className="font-mono-cc text-[9px] text-[rgba(224,247,255,0.3)]">Click to replace</span>
                            </>
                          ) : (
                            <>
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(0,245,255,0.4)" strokeWidth="2" className="group-hover:stroke-[rgba(0,245,255,0.7)] transition-colors"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/></svg>
                              <span className="font-mono-cc text-xs text-[rgba(224,247,255,0.4)]">Upload PDF Document</span>
                              <span className="font-mono-cc text-[9px] text-[rgba(224,247,255,0.2)] uppercase tracking-widest">Max 10MB</span>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <FieldLabel label={field.label} required={field.required} />
                      <input
                        type={field.type}
                        value={form[field.id] ?? ""}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        className={`input-field ${phase.id === "phase_1_registration" && field.id === "email" ? "opacity-50 cursor-not-allowed" : ""}`}
                        disabled={isLocked}
                        readOnly={phase.id === "phase_1_registration" && field.id === "email"}
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    </>
                  )}

                  {errors[field.id] && (
                    <p className="font-mono-cc text-[10px] text-[#f43f5e] mt-1.5 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-[#f43f5e] shrink-0" />
                      {errors[field.id]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-[rgba(255,255,255,0.05)] flex items-center justify-end gap-3">
            {isCompleted && !isLastPhase && (
              <button type="button" onClick={onComplete} className="btn-ghost">
                Next Phase
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>
            )}

            {(!isCompleted || isDirty) && (
              <button type="submit" disabled={saving || isLocked} className="btn-primary">
                {saving ? (
                  <>
                    <div className="scale-50 h-5 w-5 flex items-center justify-center">
                      <Loader text="" />
                    </div>
                    Transmitting...
                  </>
                ) : isLastPhase ? (
                  <>Final Submit <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                ) : isCompleted ? (
                  "Update Data"
                ) : (
                  <>Submit <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></>
                )}
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
