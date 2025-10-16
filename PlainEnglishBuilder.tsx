import { useState } from "react";
import { MessageSquare, Send, Lightbulb, Wand2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PlainEnglishBuilderProps {
  onGenerateCode: (description: string) => void;
  onClose?: () => void;
}

export function PlainEnglishBuilder({ onGenerateCode, onClose }: PlainEnglishBuilderProps) {
  const [description, setDescription] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const examplePrompts = [
    "Create a todo list app with checkboxes",
    "Make a simple calculator",
    "Build a photo gallery with filters",
    "Create a weather app that shows the forecast",
    "Make a chat interface",
  ];

  const handleSubmit = async () => {
    if (!description.trim()) return;

    setIsProcessing(true);
    setSuggestions([
      "I'll create that for you! Based on your description, I'm building:",
      "✓ User interface with modern design",
      "✓ Core functionality as described",
      "✓ Mobile-friendly layout",
      "✓ Ready to customize further",
    ]);

    setTimeout(() => {
      setIsProcessing(false);
      onGenerateCode(description);
    }, 2000);
  };

  const handleExampleClick = (example: string) => {
    setDescription(example);
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <div className="p-4 sm:p-6 border-b">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold">Describe Your Idea</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Tell me what you want to build in plain English
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-plain-english-x"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 p-4 sm:p-6">
        <div className="space-y-6">
          {suggestions.length === 0 ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Lightbulb className="h-4 w-4 text-chart-3" />
                  <span>Try these examples:</span>
                </div>
                <div className="grid gap-2">
                  {examplePrompts.map((prompt) => (
                    <Button
                      key={prompt}
                      variant="outline"
                      className="justify-start text-left h-auto py-3 px-4 whitespace-normal"
                      onClick={() => handleExampleClick(prompt)}
                      data-testid={`button-example-${prompt.substring(0, 20)}`}
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <Card className="bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Wand2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">How it works:</p>
                      <ol className="space-y-1 list-decimal list-inside">
                        <li>Describe what you want to build</li>
                        <li>I'll generate the code for you</li>
                        <li>Review and customize it</li>
                        <li>Build your app or game!</li>
                      </ol>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <div className="space-y-3">
              {suggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 animate-in fade-in slide-in-from-bottom-2"
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Wand2 className="h-4 w-4 text-primary" />
                  </div>
                  <div className="bg-muted rounded-lg p-3 flex-1">
                    <p className="text-sm">{suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 sm:p-6 border-t space-y-3">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Example: I want to make a simple game where you catch falling objects..."
          className="resize-none min-h-[100px]"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          data-testid="input-plain-english"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Press Cmd/Ctrl + Enter to generate
          </p>
          <Button
            onClick={handleSubmit}
            disabled={!description.trim() || isProcessing}
            className="w-full sm:w-auto"
            data-testid="button-generate-code"
          >
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Generate Code
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
