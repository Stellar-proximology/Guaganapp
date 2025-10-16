import { ThemeProvider } from '../ThemeProvider';
import { CodeEditor } from '../CodeEditor';

export default function CodeEditorExample() {
  return (
    <ThemeProvider defaultTheme="dark">
      <div className="h-screen w-full">
        <CodeEditor
          onDeploy={() => console.log('Deploy triggered')}
          onExport={() => console.log('Export triggered')}
          onAIAssist={() => console.log('AI assist triggered')}
        />
      </div>
    </ThemeProvider>
  );
}
