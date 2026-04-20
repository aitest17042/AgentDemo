import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRightLeft,
  BadgeDollarSign,
  Bot,
  Building2,
  ChevronRight,
  Landmark,
  Loader2,
  Send,
  TrendingUp,
  User,
  UserPlus,
  Wallet,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  createAssistantMessage,
  createEmptySessionState,
  createUserMessage,
  createWelcomeMessage,
  runAgentTurn,
  type LocalChatMessage,
  type StorageDetails,
} from "../../lib/agentEngine";
import { actionCardConfig, type SuggestionOption } from "../../lib/knowledgeBase";
import { loadPersistedAgentState, savePersistedAgentState } from "../../lib/localState";
import { cn } from "../../lib/utils";

const DEFAULT_STORAGE: StorageDetails = {
  kind: "local-file",
  label: "目前工作區檔案",
  path: "local-data/agent-state.json",
};

const actionIconMap = {
  userPlus: UserPlus,
  wallet: Wallet,
  building: Building2,
  exchange: ArrowRightLeft,
  funding: BadgeDollarSign,
  landmark: Landmark,
  growth: TrendingUp,
} as const;

type ActionCardDetails = (typeof actionCardConfig)[keyof typeof actionCardConfig];

export function AIChat() {
  const [messages, setMessages] = useState<LocalChatMessage[]>([]);
  const [sessionState, setSessionState] = useState(createEmptySessionState());
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [storageDetails, setStorageDetails] = useState<StorageDetails>(DEFAULT_STORAGE);

  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<LocalChatMessage[]>([]);
  const sessionStateRef = useRef(sessionState);
  const storageRef = useRef(storageDetails);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    sessionStateRef.current = sessionState;
  }, [sessionState]);

  useEffect(() => {
    storageRef.current = storageDetails;
  }, [storageDetails]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    let isCancelled = false;

    async function hydrateState() {
      const { state, storage } = await loadPersistedAgentState();

      if (isCancelled) {
        return;
      }

      setStorageDetails(storage);
      setSessionState(state.sessionState);
      setMessages(state.messages.length > 0 ? state.messages : [createWelcomeMessage(storage)]);
      setIsHydrated(true);
    }

    hydrateState();

    return () => {
      isCancelled = true;
    };
  }, []);

  const submitPrompt = async (prompt?: string) => {
    const nextInput = (prompt ?? input).trim();

    if (!nextInput || isLoading || !isHydrated) {
      return;
    }

    const userMessage = createUserMessage(nextInput);
    const nextMessages = [...messagesRef.current, userMessage];

    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    window.setTimeout(async () => {
      const result = runAgentTurn(nextInput, sessionStateRef.current, storageRef.current);
      const assistantMessage = createAssistantMessage(result.assistantMessage);
      const updatedMessages = [...nextMessages, assistantMessage];

      setMessages(updatedMessages);
      setSessionState(result.sessionState);

      const updatedStorage = await savePersistedAgentState({
        version: 1,
        messages: updatedMessages,
        sessionState: result.sessionState,
        updatedAt: new Date().toISOString(),
      });

      setStorageDetails(updatedStorage);
      setIsLoading(false);
    }, 850);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 gap-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-hsbc-red flex items-center justify-center text-white shrink-0">
            <Bot className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-hsbc-black">匯豐中小企 AI 助手</h1>
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-2 text-green-600">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                隨時準備為您的業務提供支援
              </div>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="bg-white border-gray-200 text-gray-500 font-normal shrink-0">
          Beta - 智能虛擬助手
        </Badge>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-gray-200 shadow-sm rounded-2xl bg-white/50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message) => {
                const actionConfig = message.actionData?.type
                  ? actionCardConfig[message.actionData.type]
                  : null;

                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-4 max-w-[88%]",
                      message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto",
                    )}
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                        message.role === "user"
                          ? "bg-black text-white"
                          : "bg-hsbc-red text-white",
                      )}
                    >
                      {message.role === "user" ? (
                        <User className="w-4 h-4" />
                      ) : (
                        <Bot className="w-4 h-4" />
                      )}
                    </div>

                    <div className="space-y-3 min-w-0">
                      <div
                        className={cn(
                          "p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap",
                          message.role === "user"
                            ? "bg-black text-white rounded-tr-none"
                            : "bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800",
                        )}
                      >
                        {message.content}
                      </div>

                      {message.type === "action" && actionConfig && (
                        <ActionCard
                          config={actionConfig}
                          prompt={message.actionData?.prompt ?? actionConfig.prompt}
                          onTrigger={submitPrompt}
                          disabled={isLoading}
                        />
                      )}

                      {message.role === "model" && message.suggestions && message.suggestions.length > 0 && (
                        <SuggestionChips
                          suggestions={message.suggestions}
                          onTrigger={submitPrompt}
                          disabled={isLoading}
                        />
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isLoading && (
              <div className="flex gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="w-8 h-8 rounded-full bg-hsbc-red flex items-center justify-center text-white">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm rounded-tl-none">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-hsbc-red rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-hsbc-red rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-1.5 h-1.5 bg-hsbc-red rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="p-4 border-t bg-white shrink-0">
          <form
            className="flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              submitPrompt();
            }}
          >
            <Input
              placeholder="例如：JPY-USD 匯率、我想規劃外匯對沖，或查 AAPL 股價..."
              value={input}
              onChange={(event) => setInput(event.target.value)}
              className="rounded-xl border-gray-200 focus-visible:ring-hsbc-red"
              disabled={isLoading || !isHydrated}
            />
            <Button
              size="icon"
              className="shrink-0 bg-hsbc-red hover:bg-[#b0000e] text-white rounded-xl shadow-md transition-all active:scale-95"
              disabled={isLoading || !isHydrated}
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}

function ActionCard({
  config,
  prompt,
  onTrigger,
  disabled,
}: {
  config: ActionCardDetails;
  prompt: string;
  onTrigger: (prompt: string) => void;
  disabled: boolean;
}) {
  const Icon = actionIconMap[config.icon as keyof typeof actionIconMap] ?? Landmark;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3", {
        "bg-red-50/70": config.tone === "tone-red" || config.tone === "tone-rose",
        "bg-blue-50/70": config.tone === "tone-blue",
        "bg-amber-50/70": config.tone === "tone-amber",
        "bg-slate-50/80": config.tone === "tone-slate",
        "bg-emerald-50/70": config.tone === "tone-emerald",
        "bg-violet-50/70": config.tone === "tone-purple",
      })}
    >
      <div className="flex gap-3 items-start">
        <div className="p-2 bg-white rounded-lg shadow-sm text-hsbc-red">
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-gray-900">{config.title}</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{config.description}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="w-full bg-white hover:bg-gray-50 hover:text-hsbc-red border-gray-200 rounded-lg group"
        onClick={() => onTrigger(prompt)}
        disabled={disabled}
      >
        {config.actionLabel}
        <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}

function SuggestionChips({
  suggestions,
  onTrigger,
  disabled,
}: {
  suggestions: SuggestionOption[];
  onTrigger: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((suggestion) => (
        <button
          key={`${suggestion.label}-${suggestion.prompt}`}
          type="button"
          className="px-3 py-1.5 rounded-full border border-gray-200 bg-white text-xs text-gray-700 hover:border-hsbc-red hover:text-hsbc-red transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => onTrigger(suggestion.prompt)}
          disabled={disabled}
        >
          {suggestion.label}
        </button>
      ))}
    </div>
  );
}