import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { AIAssistPanel } from '../AIAssistPanel';
import { Button } from '@/components/ui/button';

export default function AIAssistPanelExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open AI Assistant</Button>
        <AIAssistPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
