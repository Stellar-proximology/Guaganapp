import { useState } from "react";
import { ArrowLeft, ArrowRight, RefreshCw, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface BrowserBarProps {
  onNavigate: (url: string) => void;
  currentUrl: string;
}

export function BrowserBar({ onNavigate, currentUrl }: BrowserBarProps) {
  const [url, setUrl] = useState(currentUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let processedUrl = url.trim();
    
    if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
      processedUrl = 'https://' + processedUrl;
    }
    
    onNavigate(processedUrl);
  };

  const handleRefresh = () => {
    onNavigate(currentUrl);
  };

  const handleHome = () => {
    const homeUrl = 'https://www.google.com';
    setUrl(homeUrl);
    onNavigate(homeUrl);
  };

  return (
    <div className="flex items-center gap-2 p-3 border-b bg-card" data-testid="browser-bar">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          data-testid="button-back"
          onClick={() => console.log('Navigate back')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          data-testid="button-forward"
          onClick={() => console.log('Navigate forward')}
        >
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          data-testid="button-refresh"
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          data-testid="button-home"
          onClick={handleHome}
        >
          <Home className="h-4 w-4" />
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL or search..."
            className="pl-10 font-mono text-sm"
            data-testid="input-url"
          />
        </div>
      </form>
    </div>
  );
}
