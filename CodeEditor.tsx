import { useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Upload, Clipboard, Sparkles, Rocket, Download, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CodeEditorProps {
  onDeploy: () => void;
  onExport: () => void;
  onAIAssist: () => void;
}

export function CodeEditor({ onDeploy, onExport, onAIAssist }: CodeEditorProps) {
  const { theme } = useTheme();
  const [code, setCode] = useState("// Start coding here...\n");
  const [language, setLanguage] = useState("javascript");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setCode(content);
        
        const ext = file.name.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
          'js': 'javascript',
          'ts': 'typescript',
          'tsx': 'typescript',
          'jsx': 'javascript',
          'py': 'python',
          'java': 'java',
          'cpp': 'cpp',
          'c': 'c',
          'html': 'html',
          'css': 'css',
          'json': 'json',
        };
        if (ext && langMap[ext]) {
          setLanguage(langMap[ext]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setCode(text);
    } catch (err) {
      console.error('Failed to read clipboard:', err);
    }
  };

  const handleFormat = () => {
    console.log('Format code triggered');
  };

  return (
    <div className="flex flex-col h-full bg-card">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        accept=".js,.ts,.tsx,.jsx,.py,.java,.cpp,.c,.html,.css,.json,.txt"
      />
      
      <div className="flex items-center justify-between gap-2 p-3 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleUpload}
            data-testid="button-upload"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePaste}
            data-testid="button-paste"
          >
            <Clipboard className="h-4 w-4 mr-2" />
            Paste
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFormat}
            data-testid="button-format"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Format
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" data-testid="button-language">
                {language}
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setLanguage('javascript')}>JavaScript</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('typescript')}>TypeScript</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('python')}>Python</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('html')}>HTML</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('css')}>CSS</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage('json')}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onExport}
            data-testid="button-export"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={onDeploy}
            data-testid="button-deploy"
          >
            <Rocket className="h-4 w-4 mr-2" />
            Deploy
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || "")}
          theme={theme === "dark" ? "vs-dark" : "light"}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        className="absolute bottom-6 right-6 h-12 w-12 rounded-full bg-chart-3 hover:bg-chart-3 text-white shadow-lg"
        onClick={onAIAssist}
        data-testid="button-ai-assist"
      >
        <Sparkles className="h-5 w-5" />
      </Button>
    </div>
  );
}
