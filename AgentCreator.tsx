import { useState } from "react";
import { X, Bot, Plus, Trash2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AgentCreatorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AgentAction {
  id: string;
  type: string;
  description: string;
}

export function AgentCreator({ isOpen, onClose }: AgentCreatorProps) {
  const [agentName, setAgentName] = useState("");
  const [agentPurpose, setAgentPurpose] = useState("");
  const [agentModel, setAgentModel] = useState("gpt-3.5-turbo");
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [newActionType, setNewActionType] = useState("");
  const [newActionDesc, setNewActionDesc] = useState("");

  const actionTypes = [
    "API Call",
    "Data Processing",
    "File Management",
    "Code Generation",
    "UI Interaction",
    "Custom Logic",
  ];

  const handleAddAction = () => {
    if (newActionType && newActionDesc) {
      setActions([
        ...actions,
        {
          id: Date.now().toString(),
          type: newActionType,
          description: newActionDesc,
        },
      ]);
      setNewActionType("");
      setNewActionDesc("");
    }
  };

  const handleRemoveAction = (id: string) => {
    setActions(actions.filter((action) => action.id !== id));
  };

  const handleCreateAgent = () => {
    console.log("Creating agent:", {
      name: agentName,
      purpose: agentPurpose,
      model: agentModel,
      actions,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
        data-testid="agent-creator-backdrop"
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[85vh] bg-card border rounded-lg z-50 flex flex-col" data-testid="agent-creator">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">Agent Creator</h2>
              <p className="text-sm text-muted-foreground">Build custom AI agents for your app</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-agent-creator"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="agent-name">Agent Name *</Label>
                <Input
                  id="agent-name"
                  value={agentName}
                  onChange={(e) => setAgentName(e.target.value)}
                  placeholder="My Custom Agent"
                  data-testid="input-agent-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-purpose">Purpose & Instructions *</Label>
                <Textarea
                  id="agent-purpose"
                  value={agentPurpose}
                  onChange={(e) => setAgentPurpose(e.target.value)}
                  placeholder="Describe what this agent should do..."
                  rows={4}
                  data-testid="input-agent-purpose"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agent-model">AI Model</Label>
                <Select value={agentModel} onValueChange={setAgentModel}>
                  <SelectTrigger id="agent-model" data-testid="select-agent-model">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="claude-3">Claude 3</SelectItem>
                    <SelectItem value="llama-2">LLaMA 2</SelectItem>
                    <SelectItem value="mistral">Mistral</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Agent Actions</Label>
                <Badge variant="secondary">{actions.length} actions</Badge>
              </div>

              <Card>
                <CardHeader className="space-y-0 pb-4">
                  <CardTitle className="text-sm font-medium">Add New Action</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Select value={newActionType} onValueChange={setNewActionType}>
                    <SelectTrigger data-testid="select-action-type">
                      <SelectValue placeholder="Select action type" />
                    </SelectTrigger>
                    <SelectContent>
                      {actionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    value={newActionDesc}
                    onChange={(e) => setNewActionDesc(e.target.value)}
                    placeholder="Describe the action..."
                    data-testid="input-action-description"
                  />

                  <Button
                    onClick={handleAddAction}
                    disabled={!newActionType || !newActionDesc}
                    className="w-full"
                    data-testid="button-add-action"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Action
                  </Button>
                </CardContent>
              </Card>

              {actions.length > 0 && (
                <div className="space-y-2">
                  {actions.map((action) => (
                    <Card key={action.id} className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline">{action.type}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAction(action.id)}
                            data-testid={`button-remove-action-${action.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

        <div className="p-6 border-t">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              Agents can be integrated into your apps and games
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose} data-testid="button-cancel-agent">
                Cancel
              </Button>
              <Button
                onClick={handleCreateAgent}
                disabled={!agentName || !agentPurpose}
                data-testid="button-create-agent"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                Create Agent
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
