import { useState } from "react";
import { Sparkles, Send, X, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface AIAssistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIAssistPanel({ isOpen, onClose }: AIAssistPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const quickPrompts = [
    "Explain this code",
    "Find bugs",
    "Optimize performance",
    "Add comments",
    "Refactor code",
  ];

  const handleSend = async () => {
    if (!prompt.trim()) return;

    const userMessage = prompt;
    setPrompt("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I'd be happy to help with: "${userMessage}"\n\nPlease configure your Hugging Face API key in Settings to enable AI assistance. Once configured, I'll be able to provide code suggestions, explanations, and optimizations using advanced language models.`,
        },
      ]);
      setIsLoading(false);
    }, 1000);
  };

  const handleQuickPrompt = (promptText: string) => {
    setPrompt(promptText);
  };

  const handleCopy = (content: string, index: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 h-80 bg-card border-t z-30 flex flex-col" data-testid="ai-assist-panel">
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-chart-3/10 flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-chart-3" />
          </div>
          <div>
            <h3 className="font-medium">AI Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by Hugging Face</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          data-testid="button-close-ai"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">Ask AI to help with your code</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {quickPrompts.map((qp) => (
                  <Button
                    key={qp}
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickPrompt(qp)}
                    data-testid={`button-quick-${qp.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {qp}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
              >
                {msg.role === "assistant" && (
                  <div className="h-8 w-8 rounded-md bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-4 w-4 text-chart-3" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === "assistant" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 h-7 text-xs"
                      onClick={() => handleCopy(msg.content, idx)}
                      data-testid={`button-copy-${idx}`}
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3">
                <div className="h-8 w-8 rounded-md bg-chart-3/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="h-4 w-4 text-chart-3 animate-pulse" />
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm text-muted-foreground">Thinking...</p>
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask AI anything about your code..."
            className="resize-none"
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            data-testid="input-ai-prompt"
          />
          <Button
            onClick={handleSend}
            disabled={!prompt.trim() || isLoading}
            data-testid="button-send-ai"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
