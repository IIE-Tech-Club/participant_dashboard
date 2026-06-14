"use client";

interface ErrorAlertProps {
  title: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export default function ErrorAlert({ title, message, onRetry, className }: ErrorAlertProps) {
  return (
    <div className={`relative border border-[rgba(244,63,94,0.25)] bg-[rgba(244,63,94,0.06)] p-5 overflow-hidden ${className || ""}`}>
      {/* Left accent */}
      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#f43f5e]" />

      {/* Corner brackets */}
      <span className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[rgba(244,63,94,0.4)] pointer-events-none" />

      <div className="pl-1">
        <div className="flex items-center gap-2 mb-2">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f43f5e" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p className="font-orbitron font-bold text-[10px] text-[#f43f5e] uppercase tracking-[0.2em]">
            {title}
          </p>
        </div>

        <p className="font-mono-cc text-[12px] text-[#fecdd3] leading-relaxed mb-4">
          {message}
        </p>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1.5 font-orbitron font-bold text-[10px] text-[#f43f5e] border border-[#f43f5e] bg-[rgba(244,63,94,0.1)] hover:bg-[#f43f5e] hover:text-white uppercase tracking-widest transition-colors py-1.5 px-3 rounded-md"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.5"/>
            </svg>
            Retry Action
          </button>
        )}
      </div>
    </div>
  );
}
