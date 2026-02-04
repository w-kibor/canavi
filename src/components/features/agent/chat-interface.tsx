"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/utils/cn";
import { StudentSubject } from "@/lib/logic/subject-mapping";

interface ChatInterfaceProps {
    grades: StudentSubject[];
    hasCalculated: boolean;
}

interface Message {
    role: "user" | "model";
    text: string;
}

export function ChatInterface({ grades, hasCalculated }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: "model", text: "Hello! I am your Career Counselor. Once you've entered your grades, ask me about any course (e.g., 'Can I study Law at UoN?') and I'll analyze if you qualify." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || !hasCalculated) return;

        const userMsg = input;
        setInput("");
        setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: userMsg, grades }),
            });

            const data = await res.json();

            if (data.error) {
                setMessages((prev) => [...prev, { role: "model", text: "Error: " + data.error }]);
            } else {
                setMessages((prev) => [...prev, { role: "model", text: data.reply }]);
            }
        } catch (error) {
            console.error(error);
            setMessages((prev) => [...prev, { role: "model", text: "Something went wrong. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-[600px] flex flex-col border-slate-200 shadow-lg mt-8 lg:mt-0">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
                <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Bot className="w-5 h-5" />
                    Career Counselor Agent
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-4 overflow-hidden">
                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {messages.map((m, i) => (
                        <div key={i} className={cn("flex w-full", m.role === "user" ? "justify-end" : "justify-start")}>
                            <div className={cn(
                                "max-w-[85%] rounded-lg px-4 py-3 text-sm",
                                m.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                            )}>
                                {m.text}
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-slate-100 rounded-lg px-4 py-3 text-sm flex gap-1">
                                <span className="animate-bounce">●</span>
                                <span className="animate-bounce delay-100">●</span>
                                <span className="animate-bounce delay-200">●</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="mt-4 flex gap-2 pt-4 border-t border-slate-100">
                    <input
                        className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={hasCalculated ? "Ask about a course..." : "Please calculate points first..."}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                        disabled={!hasCalculated || isLoading}
                    />
                    <Button onClick={handleSend} disabled={!hasCalculated || isLoading || !input.trim()}>
                        <Send className="w-4 h-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
