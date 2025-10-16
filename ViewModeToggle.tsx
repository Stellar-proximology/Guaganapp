import { Code, Globe, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ViewMode = "browser" | "code" | "split";

interface ViewModeToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export function ViewModeToggle({ mode, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center gap-1 bg-muted rounded-md p-1" data-testid="view-mode-toggle">
      <Button
        variant={mode === "browser" ? "secondary" : "ghost"}
        size="sm"
        className={mode === "browser" ? "toggle-elevate toggle-elevated" : ""}
        onClick={() => onChange("browser")}
        data-testid="button-browser-mode"
      >
        <Globe className="h-4 w-4 mr-2" />
        Browser
      </Button>
      <Button
        variant={mode === "code" ? "secondary" : "ghost"}
        size="sm"
        className={mode === "code" ? "toggle-elevate toggle-elevated" : ""}
        onClick={() => onChange("code")}
        data-testid="button-code-mode"
      >
        <Code className="h-4 w-4 mr-2" />
        Code
      </Button>
      <Button
        variant={mode === "split" ? "secondary" : "ghost"}
        size="sm"
        className={mode === "split" ? "toggle-elevate toggle-elevated" : ""}
        onClick={() => onChange("split")}
        data-testid="button-split-mode"
      >
        <PanelLeftClose className="h-4 w-4 mr-2" />
        Split
      </Button>
    </div>
  );
}
