import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2, ChevronRight, Wallet, UserPlus } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "../../lib/utils";
import { knowledgeBase as mockKnowledgeBase } from "../../lib/knowledgeBase";

export interface LocalChatMessage {
  role: 'user' | 'model';
  content: string;
  type?: 'text' | 'action';
  actionData?: any;
}

export function AIChat() {
  const [messages, setMessages] = useState<LocalChatMessage[]>([
    { 
      role: 'model', 
      content: "您好！我是您的匯豐中小企 AI 助手。今天有什麼可以幫到您的業務發展？我可以協助您辦理開戶、跨境轉賬或查詢業務融資方案。" 
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: LocalChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate thinking delay for "Agentic" feel
    setTimeout(() => {
      let botResponse = "感謝您的查詢。目前我正在處理您的請求。雖然我是一個 AI 助手，但我可以引導您到正確的銀行服務。請問您是想查詢特定交易還是新的銀行服務？";
      let actionType: 'text' | 'action' = 'text';
      let actionData = null;

      const lowerInput = input.toLowerCase();
      const match = mockKnowledgeBase.find(item => 
        item.keywords.some(kw => lowerInput.includes(kw))
      );

      if (match) {
        botResponse = match.response;
        if (match.action) {
          actionType = 'action';
          actionData = { type: match.action };
        }
      }

      setMessages(prev => [...prev, { 
        role: 'model', 
        content: botResponse,
        type: actionType,
        actionData
      }]);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto p-4 md:p-6 gap-4 overflow-hidden">
      <div className="flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-hsbc-red flex items-center justify-center text-white">
                <Bot className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-xl font-bold text-hsbc-black">匯豐中小企 AI 助手</h1>
                <div className="flex items-center gap-2 text-xs text-green-600">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    隨時準備為您的業務提供支援
                </div>
            </div>
        </div>
        <Badge variant="outline" className="bg-white border-gray-200 text-gray-500 font-normal">
            Beta - 智能虛擬助手
        </Badge>
      </div>

      <Card className="flex-1 flex flex-col min-h-0 overflow-hidden border-gray-200 shadow-sm rounded-2xl bg-white/50 backdrop-blur-sm">
        <div className="flex-1 overflow-y-auto scroll-smooth p-4 md:p-6" ref={scrollRef}>
          <div className="space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn(
                    "flex gap-4 max-w-[85%]",
                    message.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                  )}
                >
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm",
                    message.role === 'user' ? "bg-black text-white" : "bg-hsbc-red text-white"
                  )}>
                    {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  
                  <div className="space-y-3">
                    <div className={cn(
                      "p-4 rounded-2xl text-sm leading-relaxed",
                      message.role === 'user' 
                        ? "bg-black text-white rounded-tr-none" 
                        : "bg-white border border-gray-100 shadow-sm rounded-tl-none text-gray-800"
                    )}>
                      {message.content}
                    </div>

                    {message.type === 'action' && message.actionData?.type === 'ACCOUNT_OPENING' && (
                      <ActionCard 
                        title="匯豐商業戶口申請"
                        description="開始您的數碼銀行之旅。預計申請時間：5 分鐘。"
                        icon={<UserPlus className="w-5 h-5 text-hsbc-red" />}
                        bgColor="bg-red-50/50"
                        actionLabel="繼續申請項目"
                      />
                    )}

                    {message.type === 'action' && message.actionData?.type === 'TRANSFER' && (
                      <ActionCard 
                        title="智能轉賬設定"
                        description="使用匯豐「轉數快」或電匯進行即時結算。"
                        icon={<Wallet className="w-5 h-5 text-hsbc-red" />}
                        bgColor="bg-blue-50/50"
                        actionLabel="初始化轉賬"
                      />
                    )}
                  </div>
                </motion.div>
              ))}
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
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); handleSend(); }}>
            <Input
              placeholder="例如：我想開立新的商業戶口..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="rounded-xl border-gray-200 focus-visible:ring-hsbc-red"
              disabled={isLoading}
            />
            <Button size="icon" className="shrink-0 bg-hsbc-red hover:bg-[#b0000e] text-white rounded-xl shadow-md transition-all active:scale-95" disabled={isLoading}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
          <p className="text-[10px] text-center mt-3 text-gray-400">
            由匯豐生成式 AI 技術驅動。所有銀行操作均受匯豐安全加密技術保護。
          </p>
        </div>
      </Card>
    </div>
  );
}

function ActionCard({ title, description, icon, bgColor, actionLabel }: { title: string, description: string, icon: React.ReactNode, bgColor: string, actionLabel: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn("p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col gap-3", bgColor)}
    >
      <div className="flex gap-3 items-start">
        <div className="p-2 bg-white rounded-lg shadow-sm">
          {icon}
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-gray-900">{title}</h4>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">{description}</p>
        </div>
      </div>
      <Button variant="outline" size="sm" className="w-full bg-white hover:bg-gray-50 hover:text-hsbc-red border-gray-200 rounded-lg group">
        {actionLabel}
        <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
}
