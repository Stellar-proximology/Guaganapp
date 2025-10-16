import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { DeployModal } from '../DeployModal';
import { Button } from '@/components/ui/button';

export default function DeployModalExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open Deploy Modal</Button>
        <DeployModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
