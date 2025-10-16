import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { AgentCreator } from '../AgentCreator';
import { Button } from '@/components/ui/button';

export default function AgentCreatorExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open Agent Creator</Button>
        <AgentCreator isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
