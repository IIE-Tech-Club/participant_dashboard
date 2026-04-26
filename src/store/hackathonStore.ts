"use client";

import type { HackathonProgress } from "@/types/hackathon";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;

export async function fetchProgress(hackathonId: string, userId: string): Promise<HackathonProgress> {
  try {
    const response = await fetch(`${API_BASE}/registrations/${hackathonId}/user/${userId}`);
    if (!response.ok) return { hackathonId, responses: {}, status: 'Pending' };
    const data = await response.json();
    if (!data) return { hackathonId, responses: {}, status: 'Pending' };

    return {
      hackathonId,
      responses: data.responses || {},
      status: data.status || 'Pending'
    };
  } catch (error) {
    console.error("Fetch progress failure:", error);
    return { hackathonId, responses: {}, status: 'Pending' };
  }
}

export async function commitPhase(hackathonId: string, userId: string, phaseId: string, data?: any) {
  try {
    const response = await fetch(`${API_BASE}/registrations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, hackathonId, phase: phaseId, data })
    });
    return response.ok;
  } catch (error) {
    console.error(`Commit phase ${phaseId} failure:`, error);
    return false;
  }
}

// Helper to check unlock status locally based on phase order
export function isPhaseUnlocked(hackathonPhases: {id: string}[], responses: Record<string, any>, phaseId: string): boolean {
  if (!hackathonPhases || hackathonPhases.length === 0) return false;
  const idx = hackathonPhases.findIndex(p => p.id === phaseId);
  if (idx <= 0) return true; // First phase is always unlocked
  
  // To unlock current phase, all previous phases must be completed
  for (let i = 0; i < idx; i++) {
    const prevId = hackathonPhases[i].id;
    if (responses[prevId] === undefined || responses[prevId] === null) {
      return false;
    }
  }
  return true;
}
