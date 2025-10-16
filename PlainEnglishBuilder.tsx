import { ThemeProvider } from '../ThemeProvider';
import { PlainEnglishBuilder } from '../PlainEnglishBuilder';

export default function PlainEnglishBuilderExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full">
        <PlainEnglishBuilder
          onGenerateCode={(desc) => console.log('Generate:', desc)}
        />
      </div>
    </ThemeProvider>
  );
}
