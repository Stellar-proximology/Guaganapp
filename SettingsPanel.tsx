import { useState } from 'react';
import { ThemeProvider } from '../ThemeProvider';
import { SettingsPanel } from '../SettingsPanel';
import { Button } from '@/components/ui/button';

export default function SettingsPanelExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full bg-background p-8">
        <Button onClick={() => setIsOpen(true)}>Open Settings</Button>
        <SettingsPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </ThemeProvider>
  );
}
