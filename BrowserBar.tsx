import { BrowserBar } from '../BrowserBar';

export default function BrowserBarExample() {
  return (
    <div className="h-screen w-full bg-background">
      <BrowserBar
        currentUrl="https://www.example.com"
        onNavigate={(url) => console.log('Navigate to:', url)}
      />
    </div>
  );
}
