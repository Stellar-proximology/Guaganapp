import { useState } from "react";
import { X, Sparkles, Gamepad2, Smartphone, Globe, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface TemplateLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: Template) => void;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: "beginner" | "intermediate" | "advanced";
  icon: typeof Sparkles;
  features: string[];
}

export function TemplateLibrary({ isOpen, onClose, onSelectTemplate }: TemplateLibraryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const templates: Template[] = [
    {
      id: "game-2d",
      name: "2D Platformer Game",
      description: "Full-featured 2D game with physics, collision detection, and level editor",
      category: "game",
      complexity: "advanced",
      icon: Gamepad2,
      features: ["Physics Engine", "Level Editor", "Sprite Animation", "Sound System"],
    },
    {
      id: "game-3d",
      name: "3D Adventure Game",
      description: "3D game framework with camera controls, terrain, and character movement",
      category: "game",
      complexity: "advanced",
      icon: Gamepad2,
      features: ["3D Graphics", "Camera System", "Character Controller", "Inventory System"],
    },
    {
      id: "app-mobile",
      name: "Mobile App Framework",
      description: "Cross-platform mobile app with navigation, state management, and API integration",
      category: "app",
      complexity: "intermediate",
      icon: Smartphone,
      features: ["Routing", "State Management", "API Client", "Local Storage"],
    },
    {
      id: "app-dashboard",
      name: "Analytics Dashboard",
      description: "Data visualization dashboard with charts, tables, and real-time updates",
      category: "app",
      complexity: "intermediate",
      icon: Zap,
      features: ["Charts & Graphs", "Real-time Data", "Export Functions", "Dark Mode"],
    },
    {
      id: "web-ecommerce",
      name: "E-Commerce Platform",
      description: "Full e-commerce solution with cart, checkout, and payment integration",
      category: "web",
      complexity: "advanced",
      icon: Globe,
      features: ["Shopping Cart", "Payment Gateway", "Product Catalog", "Order Management"],
    },
    {
      id: "web-social",
      name: "Social Media App",
      description: "Social platform with posts, likes, comments, and user profiles",
      category: "web",
      complexity: "advanced",
      icon: Sparkles,
      features: ["User Auth", "Feed System", "Notifications", "File Upload"],
    },
  ];

  const categories = [
    { id: "all", label: "All Templates", icon: Sparkles },
    { id: "game", label: "Games", icon: Gamepad2 },
    { id: "app", label: "Apps", icon: Smartphone },
    { id: "web", label: "Web Apps", icon: Globe },
  ];

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
        onClick={onClose}
        data-testid="template-backdrop"
      />
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[80vh] bg-card border rounded-lg z-50 flex flex-col" data-testid="template-library">
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-xl font-semibold">Template Library</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Start with powerful, production-ready templates
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-templates"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-templates"
            />
          </div>

          <div className="flex gap-2">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? "secondary" : "ghost"}
                size="sm"
                className={selectedCategory === cat.id ? "toggle-elevate toggle-elevated" : ""}
                onClick={() => setSelectedCategory(cat.id)}
                data-testid={`button-category-${cat.id}`}
              >
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.label}
              </Button>
            ))}
          </div>
        </div>

        <ScrollArea className="flex-1 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <Card
                key={template.id}
                className="hover-elevate cursor-pointer"
                onClick={() => onSelectTemplate(template)}
                data-testid={`card-template-${template.id}`}
              >
                <CardHeader className="gap-2 space-y-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <Badge
                          variant={
                            template.complexity === "beginner"
                              ? "secondary"
                              : template.complexity === "intermediate"
                              ? "default"
                              : "outline"
                          }
                          className="mt-1"
                        >
                          {template.complexity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <CardDescription className="mt-2">{template.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {template.features.map((feature) => (
                      <Badge key={feature} variant="outline">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </>
  );
}
