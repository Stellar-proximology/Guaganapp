import { useState } from "react";
import { X, Smartphone, Download, Settings2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

interface APKBuilderProps {
  isOpen: boolean;
  onClose: () => void;
}

export function APKBuilder({ isOpen, onClose }: APKBuilderProps) {
  const [appName, setAppName] = useState("");
  const [packageName, setPackageName] = useState("");
  const [versionCode, setVersionCode] = useState("1");
  const [versionName, setVersionName] = useState("1.0.0");
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildComplete, setBuildComplete] = useState(false);

  const handleBuild = async () => {
    if (!appName || !packageName) return;

    setIsBuilding(true);
    setBuildProgress(0);
    setBuildComplete(false);

    const steps = [
      { label: "Preparing project...", duration: 500 },
      { label: "Compiling resources...", duration: 800 },
      { label: "Building APK...", duration: 1000 },
      { label: "Signing APK...", duration: 600 },
      { label: "Optimizing...", duration: 400 },
    ];

    let currentProgress = 0;
    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, step.duration));
      currentProgress += 100 / steps.length;
      setBuildProgress(Math.min(currentProgress, 100));
    }

    setIsBuilding(false);
    setBuildComplete(true);
  };

  const handleDownload = () => {
    console.log("Downloading APK:", { appName, packageName, versionName });
    // Simulate download
    const blob = new Blob(["APK content"], { type: "application/vnd.android.package-archive" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${appName.replace(/\s+/g, "-").toLowerCase()}-${versionName}.apk`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setBuildComplete(false);
    setBuildProgress(0);
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
        data-testid="apk-builder-backdrop"
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-card border rounded-lg z-50" data-testid="apk-builder">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-chart-2/10 flex items-center justify-center">
              <Smartphone className="h-5 w-5 text-chart-2" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">APK Builder</h2>
              <p className="text-sm text-muted-foreground">Build Android packages from your projects</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-apk-builder"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {!buildComplete && !isBuilding && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">App Name *</Label>
                  <Input
                    id="app-name"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="My Awesome App"
                    data-testid="input-app-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="package-name">Package Name *</Label>
                  <Input
                    id="package-name"
                    value={packageName}
                    onChange={(e) => setPackageName(e.target.value)}
                    placeholder="com.example.app"
                    data-testid="input-package-name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version-code">Version Code</Label>
                  <Input
                    id="version-code"
                    type="number"
                    value={versionCode}
                    onChange={(e) => setVersionCode(e.target.value)}
                    placeholder="1"
                    data-testid="input-version-code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="version-name">Version Name</Label>
                  <Input
                    id="version-name"
                    value={versionName}
                    onChange={(e) => setVersionName(e.target.value)}
                    placeholder="1.0.0"
                    data-testid="input-version-name"
                  />
                </div>
              </div>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Settings2 className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium mb-1">Build Configuration</h4>
                      <div className="space-y-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Release Build</Badge>
                          <Badge variant="outline">Optimized</Badge>
                          <Badge variant="outline">Signed</Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {isBuilding && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Building APK...</span>
                <span className="font-mono">{Math.round(buildProgress)}%</span>
              </div>
              <Progress value={buildProgress} />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                <span>This may take a few moments</span>
              </div>
            </div>
          )}

          {buildComplete && (
            <div className="space-y-4">
              <div className="p-4 bg-chart-2/10 border border-chart-2/20 rounded-md">
                <div className="flex items-start gap-3">
                  <Smartphone className="h-5 w-5 text-chart-2 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-chart-2 mb-1">APK Built Successfully!</h4>
                    <p className="text-sm text-muted-foreground">
                      {appName} v{versionName} is ready to download
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <Badge variant="outline">Size: ~5.2 MB</Badge>
                      <Badge variant="outline">Android 5.0+</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleDownload} className="w-full" data-testid="button-download-apk">
                <Download className="h-4 w-4 mr-2" />
                Download APK
              </Button>
            </div>
          )}

          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p>
                    APK files are for Android devices. To install on your device, enable "Unknown Sources" in Settings.
                    For production apps, sign your APK with a release keystore.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex items-center justify-between gap-3 p-6 border-t">
          {buildComplete ? (
            <>
              <div className="text-sm text-muted-foreground">Ready to distribute your app</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleReset} data-testid="button-build-another">
                  Build Another
                </Button>
                <Button onClick={onClose} data-testid="button-done-apk">
                  Done
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm text-muted-foreground">Build requires project files</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose} data-testid="button-cancel-apk">
                  Cancel
                </Button>
                <Button
                  onClick={handleBuild}
                  disabled={!appName || !packageName || isBuilding}
                  data-testid="button-build-apk"
                >
                  <Smartphone className="h-4 w-4 mr-2" />
                  Build APK
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
