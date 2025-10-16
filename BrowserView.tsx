import { useState, useEffect } from "react";
import { AlertCircle, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BrowserViewProps {
  url: string;
  onCodeDetected: (code: string) => void;
}

export function BrowserView({ url, onCodeDetected }: BrowserViewProps) {
  const [hasCodeSnippets, setHasCodeSnippets] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Simulate code detection
      const randomDetection = Math.random() > 0.5;
      setHasCodeSnippets(randomDetection);
    }, 1000);

    return () => clearTimeout(timer);
  }, [url]);

  const handleExtractCode = () => {
    const sampleCode = `// Extracted code snippet
function example() {
  console.log("Code detected on the page");
  return true;
}`;
    onCodeDetected(sampleCode);
    setHasCodeSnippets(false);
  };

  return (
    <div className="relative h-full w-full bg-background" data-testid="browser-view">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <span>Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <iframe
            src={url}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin allow-forms"
            title="Browser View"
          />
          
          {hasCodeSnippets && (
            <div className="absolute top-4 right-4 animate-in fade-in slide-in-from-top-2">
              <Button
                variant="default"
                size="sm"
                onClick={handleExtractCode}
                className="shadow-lg"
                data-testid="button-extract-code"
              >
                <Code className="h-4 w-4 mr-2" />
                Code Detected - Extract
              </Button>
            </div>
          )}
        </>
      )}
      
      {!isLoading && !url && (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-2">
            <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto" />
            <p className="text-muted-foreground">Enter a URL to browse</p>
          </div>
        </div>
      )}
    </div>
  );
}
