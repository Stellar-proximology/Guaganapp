import { ThemeProvider } from '@/components/ThemeProvider';
import Home from '../home';

export default function HomeExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <Home />
    </ThemeProvider>
  );
}
