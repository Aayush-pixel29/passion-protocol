"use client";

import React, { useState } from "react";

interface FaqItem {
  question: string;
  topic: "algorithm" | "privacy" | "workflow" | "contracts" | "profile" | "limits";
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    question: "How is the Vibe Match score calculated?",
    topic: "algorithm",
    answer:
      "Passion Protocol computes compatibility deterministically using a 4-dimensional Manhattan distance formula across Pace, Comms, Risk, and Energy. Scores range from 0% to 100%, giving you an objective measure of working chemistry before you reach out.",
  },
  {
    question: "Is my contact information public?",
    topic: "privacy",
    answer:
      "No. All builders browse using pseudonym codenames (e.g. ALEX_AI, MAYA_UX). Your real name, LinkedIn profile, phone number, and direct contact URL remain encrypted and are only revealed upon mutual connection acceptance.",
  },
  {
    question: "What happens when I click Connect?",
    topic: "workflow",
    answer:
      "Clicking Connect sends a double opt-in request. The candidate can accept or politely pass. When both sides confirm interest, a private real-time messaging channel and milestone contract workspace are unlocked immediately.",
  },
  {
    question: "Are milestone contracts legally binding?",
    topic: "contracts",
    answer:
      "Milestone contracts allow partners to define deliverables, sprint scopes, and compensation agreements inside the chat. While designed for project clarity and mutual accountability, they provide documented terms that can be exported or linked to legal escrow.",
  },
  {
    question: "Can I change my role and preferences later?",
    topic: "profile",
    answer:
      "Yes, absolutely. You can update your industry discipline, target partner role, spoken languages, project pitch, and recalibrate your 4 vibe sliders at any time from your Profile settings.",
  },
  {
    question: "How many connection requests can I send per day?",
    topic: "limits",
    answer:
      "To preserve high signal-to-noise ratio and prevent spam, accounts are allotted up to 30 active outbound connection requests per 24-hour window. This ensures high intentionality in every outreach.",
  },
];

export function LandingFaq() {
  const [openIndices, setOpenIndices] = useState<Set<number>>(new Set([0]));

  const toggleItem = (idx: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <div className="faq-accordion glass-panel">
      {FAQ_DATA.map((item, idx) => {
        const isOpen = openIndices.has(idx);
        return (
          <div key={item.topic} className={`faq-item ${isOpen ? "open" : ""}`}>
            <button
              type="button"
              className="faq-trigger"
              onClick={() => toggleItem(idx)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${idx}`}
            >
              <span className="faq-question">{item.question}</span>
              <span className="faq-icon">{isOpen ? "−" : "+"}</span>
            </button>
            {isOpen && (
              <div id={`faq-answer-${idx}`} className="faq-content" role="region">
                <p>{item.answer}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
