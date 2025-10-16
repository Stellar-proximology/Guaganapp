import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { APKBuilder } from '../APKBuilder';
import { Button } from '@/components/ui/button';

export default function APKBuilderExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open APK Builder</Button>
        <APKBuilder isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
