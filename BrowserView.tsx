import { ThemeProvider } from '../ThemeProvider';
import { BrowserView } from '../BrowserView';

export default function BrowserViewExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full">
        <BrowserView
          url="https://www.example.com"
          onCodeDetected={(code) => console.log('Code detected:', code)}
        />
      </div>
    </ThemeProvider>
  );
}
