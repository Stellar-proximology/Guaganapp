import { useState } from 'react';
import { ViewModeToggle, ViewMode } from '../ViewModeToggle';

export default function ViewModeToggleExample() {
  const [mode, setMode] = useState<ViewMode>('browser');
  
  return (
    <div className="h-screen w-full bg-background p-8">
      <ViewModeToggle mode={mode} onChange={setMode} />
    </div>
  );
}
