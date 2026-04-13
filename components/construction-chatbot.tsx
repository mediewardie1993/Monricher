"use client";

import Image from "next/image";
import { AnimatePresence, MotionConfig, motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  chatbotIntents,
  chatbotName,
  defaultLeadData,
  fallbackMessage,
  greetingMessage,
  inquiryKeywords,
  leadSteps,
  quickReplies,
  type LeadData
} from "@/lib/chatbot-config";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: number;
};

type PersistedChat = {
  messages: Message[];
  leadData: LeadData;
  activeLeadStep: number | null;
  faqCount: number;
};

const STORAGE_KEY = "monricher-chatbot-state";

const quickReplySeeds: Record<string, string> = {
  "Our Services": "services",
  "View Projects": "projects",
  "Request a Quote": "request a quote",
  "Service Areas": "service area",
  "Project Timeline": "timeline",
  "Contact Us": "contact"
};

const CTA_MESSAGE = "Would you like to request a quote?";
const floatingDialogues = [
  "How can I help you today?",
  "Need a quick quote estimate?",
  "Want to explore our services?"
];

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

const createMessage = (role: Message["role"], content: string): Message => ({
  id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  role,
  content,
  timestamp: Date.now()
});

const formatTimestamp = (timestamp?: number) => {
  if (!timestamp) return "";

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit"
  }).format(timestamp);
};

const findIntent = (input: string) => {
  const normalizedInput = normalizeText(input);
  return chatbotIntents.find((intent) =>
    intent.keywords.some((keyword) => normalizedInput.includes(normalizeText(keyword)))
  );
};

const shouldStartLeadCapture = (input: string) => {
  const normalizedInput = normalizeText(input);
  return inquiryKeywords.some((keyword) => normalizedInput.includes(normalizeText(keyword)));
};

export function ConstructionChatbot() {
  const prefersReducedMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([createMessage("assistant", greetingMessage)]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeLeadStep, setActiveLeadStep] = useState<number | null>(null);
  const [leadData, setLeadData] = useState<LeadData>(defaultLeadData);
  const [faqCount, setFaqCount] = useState(0);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [showFloatingDialogue, setShowFloatingDialogue] = useState(true);
  const [floatingDialogueIndex, setFloatingDialogueIndex] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const typingTimerRef = useRef<number | null>(null);

  const showQuickReplies = useMemo(
    () => activeLeadStep === null && messages.length <= 5,
    [activeLeadStep, messages.length]
  );

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        setHasHydrated(true);
        return;
      }

      const parsed = JSON.parse(stored) as PersistedChat;
      if (parsed.messages?.length) {
        setMessages(parsed.messages);
      }
      if (parsed.leadData) {
        setLeadData({ ...defaultLeadData, ...parsed.leadData });
      }
      if (typeof parsed.activeLeadStep === "number") {
        setActiveLeadStep(parsed.activeLeadStep);
      }
      if (typeof parsed.faqCount === "number") {
        setFaqCount(parsed.faqCount);
      }
    } catch {
      // Ignore malformed persisted state and fall back to the default greeting.
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;

    const payload: PersistedChat = {
      messages,
      leadData,
      activeLeadStep,
      faqCount
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [activeLeadStep, faqCount, hasHydrated, leadData, messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      block: "end"
    });
  }, [messages, isTyping, prefersReducedMotion]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowFloatingDialogue(false);
      return;
    }

    if (prefersReducedMotion) {
      setShowFloatingDialogue(true);
      return;
    }

    setShowFloatingDialogue(true);
    const initialHide = window.setTimeout(() => setShowFloatingDialogue(false), 15000);

    const intervalId = window.setInterval(() => {
      setFloatingDialogueIndex((current) => (current + 1) % floatingDialogues.length);
      setShowFloatingDialogue(true);
      window.setTimeout(() => setShowFloatingDialogue(false), 15000);
    }, 30000);

    return () => {
      window.clearTimeout(initialHide);
      window.clearInterval(intervalId);
    };
  }, [isOpen, prefersReducedMotion]);

  const queueAssistantReply = (content: string, callback?: () => void) => {
    setIsTyping(true);

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    const delay = prefersReducedMotion ? 0 : 720;
    typingTimerRef.current = window.setTimeout(() => {
      setIsTyping(false);
      setMessages((current) => [...current, createMessage("assistant", content)]);
      callback?.();
    }, delay);
  };

  const appendUserMessage = (content: string) => {
    setMessages((current) => [...current, createMessage("user", content)]);
  };

  const beginLeadCapture = () => {
    setActiveLeadStep(0);
    setLeadData(defaultLeadData);
    queueAssistantReply(leadSteps[0].question);
  };

  const completeLeadCapture = (nextLeadData: LeadData) => {
    const summary = [
      "Thank you. Here is a summary of your inquiry:",
      `Project type: ${nextLeadData.projectType}`,
      `Location: ${nextLeadData.location}`,
      `Scope of work: ${nextLeadData.scope}`,
      `Budget: ${nextLeadData.budget}`,
      `Timeline: ${nextLeadData.timeline}`,
      `Name: ${nextLeadData.name}`,
      `Contact info: ${nextLeadData.contact}`,
      "",
      "Our team can review this information and get back to you with the next steps.",
      "Responses are for general guidance. Final recommendations depend on project assessment."
    ].join("\n");

    // Future backend or email API integration can be connected here.
    console.log("Monricher lead inquiry", nextLeadData);

    setActiveLeadStep(null);
    queueAssistantReply(summary);
  };

  const handleLeadResponse = (value: string) => {
    if (activeLeadStep === null) return;

    const currentStep = leadSteps[activeLeadStep];
    const nextLeadData = {
      ...leadData,
      [currentStep.key]: value
    };

    setLeadData(nextLeadData);

    const nextStepIndex = activeLeadStep + 1;
    if (nextStepIndex < leadSteps.length) {
      setActiveLeadStep(nextStepIndex);
      queueAssistantReply(leadSteps[nextStepIndex].question);
      return;
    }

    completeLeadCapture(nextLeadData);
  };

  const handleFaqFlow = (value: string) => {
    const intent = findIntent(value);
    const nextFaqCount = faqCount + 1;
    setFaqCount(nextFaqCount);

    if (shouldStartLeadCapture(value)) {
      const intro = intent?.response ?? "We'd be glad to help with your inquiry.";
      queueAssistantReply(intro, beginLeadCapture);
      return;
    }

    queueAssistantReply(intent?.response ?? fallbackMessage, () => {
      if (nextFaqCount >= 3) {
        setMessages((current) => {
          const alreadyShown = current.some((message) => message.content === CTA_MESSAGE);
          return alreadyShown ? current : [...current, createMessage("assistant", CTA_MESSAGE)];
        });
      }
    });
  };

  const handleSend = (value: string) => {
    const trimmedValue = value.trim();
    if (!trimmedValue) return;

    appendUserMessage(trimmedValue);
    setInputValue("");

    if (activeLeadStep !== null) {
      handleLeadResponse(trimmedValue);
      return;
    }

    handleFaqFlow(trimmedValue);
  };

  const clearChat = () => {
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current);
    }

    setIsTyping(false);
    setMessages([createMessage("assistant", greetingMessage)]);
    setLeadData(defaultLeadData);
    setActiveLeadStep(null);
    setFaqCount(0);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="fixed bottom-3 right-3 z-50 flex max-w-[calc(100vw-1rem)] flex-col items-end gap-2.5 sm:bottom-6 sm:right-6 sm:max-w-[calc(100vw-1.5rem)] sm:gap-3">
        <AnimatePresence initial={false}>
          {isOpen ? (
            <motion.section
              key="chat-panel"
              id="monricher-chat-panel"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.985 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="w-[calc(100vw-1rem)] overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/95 shadow-[0_30px_90px_rgba(2,6,18,0.48)] backdrop-blur-xl sm:w-[24rem] sm:rounded-[28px]"
              aria-label={chatbotName}
            >
              <div className="border-b border-white/10 bg-white/[0.03] px-4 py-4 sm:px-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] sm:h-14 sm:w-14">
                      <Image
                        src="/assistant.png"
                        alt="Monricher Assistant"
                        fill
                        sizes="56px"
                        className="object-contain p-1"
                      />
                    </div>
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-slate-400">
                        Premium Support
                      </p>
                      <h2 className="mt-1 text-base font-semibold text-white sm:text-lg">
                        {chatbotName}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-slate-400">
                        Clear guidance for services, quotes, and project inquiries.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearChat}
                      className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                    >
                      Clear chat
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsOpen(false)}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate-300 transition hover:-translate-y-0.5 hover:border-white/20 hover:text-white"
                      aria-label="Close chatbot"
                    >
                      x
                    </button>
                  </div>
                </div>
              </div>

              <div className="max-h-[min(48vh,24rem)] overflow-y-auto px-3 py-4 sm:max-h-[26rem] sm:px-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <article
                      key={message.id}
                      className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[88%] rounded-3xl px-4 py-3 shadow-sm ${
                          message.role === "user"
                            ? "rounded-br-xl bg-[#c8a16b] text-slate-950"
                            : "rounded-bl-xl border border-white/8 bg-white/[0.04] text-slate-100"
                        }`}
                      >
                        <p className="whitespace-pre-line text-[0.95rem] leading-7">{message.content}</p>
                        <p
                          className={`mt-2 text-[0.7rem] ${
                            message.role === "user" ? "text-slate-800/80" : "text-slate-500"
                          }`}
                        >
                          {formatTimestamp(message.timestamp)}
                        </p>
                      </div>
                    </article>
                  ))}

                  {isTyping ? (
                    <div className="flex justify-start">
                      <div className="rounded-3xl rounded-bl-xl border border-white/8 bg-white/[0.04] px-4 py-3 text-slate-300">
                        <div className="flex items-center gap-1.5">
                          <span className="h-2 w-2 rounded-full bg-slate-400/80 animate-pulse" />
                          <span className="h-2 w-2 rounded-full bg-slate-400/70 animate-pulse [animation-delay:120ms]" />
                          <span className="h-2 w-2 rounded-full bg-slate-400/60 animate-pulse [animation-delay:240ms]" />
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
                <div ref={messagesEndRef} />
              </div>

              {showQuickReplies ? (
                <div className="flex flex-wrap gap-2 border-t border-white/10 px-3 py-3 sm:px-4">
                  {quickReplies.map((reply) => (
                    <button
                      key={reply}
                      type="button"
                      onClick={() => handleSend(quickReplySeeds[reply] ?? reply)}
                      className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200 transition hover:-translate-y-0.5 hover:border-[#c8a16b]/60 hover:bg-[#c8a16b]/10 hover:text-white"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              ) : null}

              <form
                className="border-t border-white/10 bg-slate-950/80 px-3 py-4 sm:px-4"
                onSubmit={(event) => {
                  event.preventDefault();
                  handleSend(inputValue);
                }}
              >
                <label className="sr-only" htmlFor="monricher-chat-input">
                  Message {chatbotName}
                </label>
                <div className="flex items-end gap-2">
                  <textarea
                    id="monricher-chat-input"
                    rows={1}
                    value={inputValue}
                    onChange={(event) => setInputValue(event.target.value)}
                    placeholder={
                      activeLeadStep !== null
                        ? "Type your answer here"
                        : "Ask about services, timelines, service areas, or request a quote"
                    }
                    className="max-h-32 min-h-[3.25rem] flex-1 resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[0.95rem] text-white outline-none transition placeholder:text-slate-500 focus:border-[#c8a16b]/60 focus:ring-2 focus:ring-[#c8a16b]/15"
                    aria-describedby="monricher-chat-disclaimer"
                  />
                  <button
                    type="submit"
                    className="inline-flex min-h-[3.25rem] items-center justify-center rounded-2xl bg-[#c8a16b] px-4 text-sm font-semibold text-slate-950 transition hover:-translate-y-0.5 hover:bg-[#d5b17f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c8a16b]/40"
                  >
                    Send
                  </button>
                </div>
                <p id="monricher-chat-disclaimer" className="mt-3 text-xs leading-6 text-slate-500">
                  Responses are for general guidance. Final recommendations depend on project assessment.
                </p>
              </form>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <div className="flex flex-col items-end gap-2">
          <AnimatePresence initial={false}>
            {!isOpen && showFloatingDialogue ? (
              <motion.div
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.08, y: 14 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.14, y: 10 }}
                transition={{
                  duration: prefersReducedMotion ? 0 : 0.56,
                  ease: [0.42, 0, 0.58, 1]
                }}
                className="mr-2 max-w-[11.75rem] rounded-[22px] rounded-br-md border border-white/10 bg-slate-950/95 px-3 py-2.5 text-sm leading-6 text-slate-100 shadow-[0_20px_50px_rgba(2,6,18,0.34)] backdrop-blur-xl sm:mr-3 sm:max-w-[15rem] sm:px-4 sm:py-3"
              >
                {floatingDialogues[floatingDialogueIndex]}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <motion.button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            whileHover={prefersReducedMotion ? undefined : { y: -3 }}
            whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
            className="group relative inline-flex items-end gap-3 border-0 bg-transparent p-0 text-left shadow-none transition"
            aria-expanded={isOpen}
            aria-controls="monricher-chat-panel"
            aria-label={`Open ${chatbotName}`}
          >
            <span className="pointer-events-none absolute inset-x-6 bottom-2 h-6 rounded-full bg-slate-950/35 blur-xl transition duration-300 group-hover:opacity-90" />
            <span className="relative h-[5.8rem] w-[4.8rem] overflow-visible sm:h-[7.5rem] sm:w-[6rem]">
              <Image
                src="/assistant.png"
                alt="Monricher Assistant"
                fill
                sizes="96px"
                className="object-contain drop-shadow-[0_20px_24px_rgba(2,6,18,0.42)]"
              />
            </span>
          </motion.button>
        </div>
      </div>
    </MotionConfig>
  );
}
