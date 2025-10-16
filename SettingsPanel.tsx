import { useState } from "react";
import { X, Eye, EyeOff, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "./ThemeToggle";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [showHfKey, setShowHfKey] = useState(false);
  const [showGhToken, setShowGhToken] = useState(false);
  const [hfApiKey, setHfApiKey] = useState("");
  const [ghToken, setGhToken] = useState("");
  const [ghUsername, setGhUsername] = useState("");

  const handleSave = () => {
    localStorage.setItem('hf_api_key', hfApiKey);
    localStorage.setItem('gh_token', ghToken);
    localStorage.setItem('gh_username', ghUsername);
    console.log('Settings saved');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
        data-testid="settings-backdrop"
      />
      <div className="fixed right-0 top-0 h-full w-96 bg-card border-l z-50 overflow-y-auto" data-testid="settings-panel">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Settings</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              data-testid="button-close-settings"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 p-6 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Key className="h-5 w-5 text-chart-3" />
                <h3 className="text-base font-medium">API Keys</h3>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="hf-api-key">Hugging Face API Key</Label>
                  <div className="relative">
                    <Input
                      id="hf-api-key"
                      type={showHfKey ? "text" : "password"}
                      value={hfApiKey}
                      onChange={(e) => setHfApiKey(e.target.value)}
                      placeholder="hf_..."
                      className="pr-10 font-mono text-sm"
                      data-testid="input-hf-key"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowHfKey(!showHfKey)}
                      data-testid="button-toggle-hf-key"
                    >
                      {showHfKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from{" "}
                    <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      huggingface.co
                    </a>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gh-username">GitHub Username</Label>
                  <Input
                    id="gh-username"
                    type="text"
                    value={ghUsername}
                    onChange={(e) => setGhUsername(e.target.value)}
                    placeholder="username"
                    data-testid="input-gh-username"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gh-token">GitHub Personal Access Token</Label>
                  <div className="relative">
                    <Input
                      id="gh-token"
                      type={showGhToken ? "text" : "password"}
                      value={ghToken}
                      onChange={(e) => setGhToken(e.target.value)}
                      placeholder="ghp_..."
                      className="pr-10 font-mono text-sm"
                      data-testid="input-gh-token"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-9 w-9"
                      onClick={() => setShowGhToken(!showGhToken)}
                      data-testid="button-toggle-gh-token"
                    >
                      {showGhToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Create a token at{" "}
                    <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      github.com/settings/tokens
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-base font-medium">Appearance</h3>
              <div className="flex items-center justify-between">
                <Label>Theme</Label>
                <ThemeToggle />
              </div>
            </div>
          </div>

          <div className="p-6 border-t">
            <Button
              onClick={handleSave}
              className="w-full"
              data-testid="button-save-settings"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
