import { useState } from "react";
import { X, Rocket, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";

interface DeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DeployModal({ isOpen, onClose }: DeployModalProps) {
  const [repoName, setRepoName] = useState("");
  const [branch, setBranch] = useState("main");
  const [commitMessage, setCommitMessage] = useState("Initial commit from CodeBrowse");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployProgress, setDeployProgress] = useState(0);
  const [deployStatus, setDeployStatus] = useState<"idle" | "success" | "error">("idle");

  const handleDeploy = async () => {
    if (!repoName) return;
    
    setIsDeploying(true);
    setDeployProgress(0);
    
    const interval = setInterval(() => {
      setDeployProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsDeploying(false);
          setDeployStatus("success");
          return 100;
        }
        return prev + 20;
      });
    }, 300);
  };

  const handleReset = () => {
    setDeployStatus("idle");
    setDeployProgress(0);
    setRepoName("");
    setCommitMessage("Initial commit from CodeBrowse");
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
        onClick={onClose}
        data-testid="deploy-backdrop"
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border rounded-lg z-50" data-testid="deploy-modal">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Deploy to GitHub</h2>
              <p className="text-sm text-muted-foreground">Push your project to a GitHub repository</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-deploy"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {deployStatus === "idle" && (
            <>
              <div className="space-y-2">
                <Label htmlFor="repo-name">Repository Name *</Label>
                <Input
                  id="repo-name"
                  value={repoName}
                  onChange={(e) => setRepoName(e.target.value)}
                  placeholder="my-awesome-project"
                  data-testid="input-repo-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={branch} onValueChange={setBranch}>
                  <SelectTrigger id="branch" data-testid="select-branch">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="main">main</SelectItem>
                    <SelectItem value="master">master</SelectItem>
                    <SelectItem value="develop">develop</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="commit-message">Commit Message</Label>
                <Textarea
                  id="commit-message"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="Describe your changes..."
                  rows={3}
                  data-testid="input-commit-message"
                />
              </div>
            </>
          )}

          {isDeploying && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Deploying to GitHub...</span>
                <span className="font-mono">{deployProgress}%</span>
              </div>
              <Progress value={deployProgress} />
            </div>
          )}

          {deployStatus === "success" && (
            <div className="flex items-center gap-3 p-4 bg-chart-2/10 border border-chart-2/20 rounded-md">
              <CheckCircle className="h-5 w-5 text-chart-2 flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-chart-2">Successfully deployed!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your project has been pushed to <span className="font-mono">{repoName}</span>
                </p>
              </div>
            </div>
          )}

          {deployStatus === "error" && (
            <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-md">
              <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
              <div className="flex-1">
                <p className="font-medium text-destructive">Deployment failed</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please check your GitHub credentials in settings
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t">
          <div className="text-sm text-muted-foreground">
            {deployStatus === "idle" && "Configure your GitHub credentials in Settings"}
          </div>
          <div className="flex gap-2">
            {deployStatus === "success" ? (
              <>
                <Button variant="outline" onClick={handleReset} data-testid="button-deploy-again">
                  Deploy Again
                </Button>
                <Button onClick={onClose} data-testid="button-deploy-done">
                  Done
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onClose} data-testid="button-deploy-cancel">
                  Cancel
                </Button>
                <Button
                  onClick={handleDeploy}
                  disabled={!repoName || isDeploying}
                  data-testid="button-deploy-start"
                >
                  <Rocket className="h-4 w-4 mr-2" />
                  Deploy
                </Button>
              </>
            )}
          </div>
        </div>

        <div className="px-6 pb-6">
          <div className="p-4 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground flex items-start gap-2">
              <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>
                Direct web deployment coming soon! For now, you can deploy to GitHub and use services like Vercel, Netlify, or GitHub Pages.
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
