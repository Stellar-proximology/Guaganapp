import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { TemplateLibrary } from '../TemplateLibrary';
import { Button } from '@/components/ui/button';

export default function TemplateLibraryExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open Template Library</Button>
        <TemplateLibrary
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onSelectTemplate={(template) => console.log('Selected:', template)}
        />
      </div>
    </ThemeProvider>
  );
}
