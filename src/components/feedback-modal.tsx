"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquarePlus, X, Send, CheckCircle2, Bug, Lightbulb, HelpCircle, MessageCircle } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  { id: "Suggestion", label: "Suggestion", icon: Lightbulb },
  { id: "Bug Report", label: "Bug Report", icon: Bug },
  { id: "Tool Request", label: "New Tool Idea", icon: MessageSquarePlus },
  { id: "General Remark", label: "General Feedback", icon: MessageCircle },
];

export function FeedbackModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Suggestion");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const handleOpen = () => {
      setSubmitted(false);
      setIsOpen(true);
    };

    window.addEventListener("open-feedback-modal", handleOpen);
    return () => window.removeEventListener("open-feedback-modal", handleOpen);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Please enter a message before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          email,
          subject,
          message,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");

      setSubmitted(true);
      toast.success("Feedback submitted", {
        description: "Thank you for helping improve Explosive Converter!",
      });

      setTimeout(() => {
        setMessage("");
        setSubject("");
        setEmail("");
        setIsOpen(false);
        setSubmitted(false);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting feedback", {
        description: "Please try again in a few moments.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#0d0e15] border border-white/[0.12] rounded-2xl shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-text-primary/[0.04] border border-border-subtle text-text-primary">
                <MessageSquarePlus size={16} />
              </div>
              <h3 className="text-base font-semibold tracking-tight text-text-primary">
                Feedback & Suggestions
              </h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-text-primary/5 transition-colors cursor-pointer"
            >
              <X size={16} />
            </button>
          </div>

          {/* Form Content */}
          {submitted ? (
            <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
              <CheckCircle2 size={40} className="text-[#34d399] animate-bounce" />
              <h4 className="text-lg font-bold tracking-tight text-text-primary">
                Message Received!
              </h4>
              <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
                Thank you for your remarks and suggestions. Your feedback helps us shape future tools.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              {/* Category Pills */}
              <div>
                <label className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest block mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                  {CATEGORIES.map((c) => {
                    const isSelected = category === c.id;
                    const Icon = c.icon;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setCategory(c.id)}
                        className={`p-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-text-primary text-bg-base border-text-primary shadow-sm"
                            : "bg-bg-base/60 text-text-secondary border-border-subtle hover:text-text-primary hover:bg-text-primary/[0.03]"
                        }`}
                      >
                        <Icon size={13} />
                        <span className="truncate">{c.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sender Email (Optional) */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest flex items-center justify-between">
                  <span>Your Email (Optional)</span>
                  <span className="text-[10px] text-text-tertiary">For replies only</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="input-base px-3 py-2 text-xs font-mono outline-none bg-bg-base/60 placeholder:text-text-tertiary"
                />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-mono text-text-tertiary uppercase tracking-widest">
                  Message / Suggestion *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="What tool should we build next? Any bug or remark you'd like to share?"
                  className="input-base p-3 text-xs leading-relaxed outline-none bg-bg-base/60 resize-none placeholder:text-text-tertiary"
                />
              </div>

              {/* Privacy Note & Submit */}
              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <span className="text-[10px] font-mono text-text-tertiary">
                  Direct encrypted transmission
                </span>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary px-5 py-2 text-xs font-semibold flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send size={12} />
                      <span>Send Feedback</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
