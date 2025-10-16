import { useState } from 'react';
import { Brain, Zap, Code, Sparkles, ChevronRight } from 'lucide-react';

export default function OnboardingEngine({ onComplete, theme }) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({
    userType: '',
    experience: '',
    primaryUse: '',
    interests: []
  });

  const questions = [
    {
      id: 'userType',
      title: 'Welcome to Guagan Browser Pro',
      subtitle: 'Let\'s personalize your experience',
      question: 'What describes you best?',
      options: [
        { value: 'developer', label: 'Developer', icon: Code, desc: 'I build apps and websites' },
        { value: 'creative', label: 'Creative', icon: Sparkles, desc: 'I design and create visual content' },
        { value: 'researcher', label: 'Researcher', icon: Brain, desc: 'I explore ideas and learn' },
        { value: 'builder', label: 'Builder', icon: Zap, desc: 'I make things happen' }
      ]
    },
    {
      id: 'experience',
      title: 'Experience Level',
      question: 'How familiar are you with AI tools?',
      options: [
        { value: 'beginner', label: 'Beginner', desc: 'New to AI tools' },
        { value: 'intermediate', label: 'Intermediate', desc: 'Used some AI tools before' },
        { value: 'advanced', label: 'Advanced', desc: 'I work with AI regularly' },
        { value: 'expert', label: 'Expert', desc: 'I build AI systems' }
      ]
    },
    {
      id: 'primaryUse',
      title: 'What will you use this for?',
      question: 'Select your primary goal',
      options: [
        { value: 'development', label: 'Development', desc: 'Build apps, sites, and tools' },
        { value: 'generation', label: 'Content Generation', desc: 'Create visual and text content' },
        { value: 'research', label: 'Research', desc: 'Explore and learn new concepts' },
        { value: 'automation', label: 'Automation', desc: 'Automate tasks with AI agents' }
      ]
    },
    {
      id: 'interests',
      title: 'Almost done!',
      question: 'What interests you most? (Select all that apply)',
      multiple: true,
      options: [
        { value: 'llm', label: 'Language Models', desc: 'Chat, text generation, AI assistants' },
        { value: 'gan', label: 'Image Generation', desc: 'Visual creation with GANs' },
        { value: 'agents', label: 'AI Agents', desc: 'Autonomous task executors' },
        { value: 'semantic', label: 'Semantic Web', desc: 'Knowledge graphs, ontologies' },
        { value: 'quantum', label: 'Quantum Computing', desc: 'QGAN and quantum systems' }
      ]
    }
  ];

  const currentQuestion = questions[step];

  const handleSelect = (value) => {
    if (currentQuestion.multiple) {
      const current = profile[currentQuestion.id] || [];
      const updated = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      setProfile({ ...profile, [currentQuestion.id]: updated });
    } else {
      setProfile({ ...profile, [currentQuestion.id]: value });
      if (step < questions.length - 1) {
        setTimeout(() => setStep(step + 1), 300);
      }
    }
  };

  const handleComplete = () => {
    const modeProfile = {
      ...profile,
      enabledModules: generateModules(profile),
      uiMode: generateUIMode(profile),
      timestamp: Date.now()
    };
    onComplete(modeProfile);
  };

  const generateModules = (prof) => {
    const modules = ['browser'];
    
    if (prof.interests?.includes('llm') || prof.primaryUse === 'development') {
      modules.push('fieldParser');
    }
    if (prof.interests?.includes('gan') || prof.primaryUse === 'generation') {
      modules.push('visualEngine');
    }
    if (prof.interests?.includes('agents') || prof.primaryUse === 'automation') {
      modules.push('agentBuilder');
    }
    if (prof.interests?.includes('semantic')) {
      modules.push('ontologyGraph');
    }
    if (prof.interests?.includes('quantum')) {
      modules.push('quantumGAN');
    }
    if (prof.userType === 'developer' || prof.experience === 'expert') {
      modules.push('devTools');
    }
    
    return modules;
  };

  const generateUIMode = (prof) => {
    if (prof.experience === 'beginner') return 'simple';
    if (prof.experience === 'expert' || prof.userType === 'developer') return 'advanced';
    return 'standard';
  };

  const isSelected = (value) => {
    if (currentQuestion.multiple) {
      return profile[currentQuestion.id]?.includes(value);
    }
    return profile[currentQuestion.id] === value;
  };

  const canProceed = currentQuestion.multiple && profile[currentQuestion.id]?.length > 0;

  return (
    <div className="h-full flex items-center justify-center p-8" style={{ backgroundColor: theme.background }}>
      <div className="max-w-2xl w-full">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <span className="text-sm" style={{ color: theme.text + 'AA' }}>
              Step {step + 1} of {questions.length}
            </span>
            <span className="text-sm" style={{ color: theme.primary }}>
              {Math.round(((step + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                backgroundColor: theme.primary,
                width: `${((step + 1) / questions.length) * 100}%`
              }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2" style={{ color: theme.text }}>
            {currentQuestion.title}
          </h2>
          {currentQuestion.subtitle && (
            <p className="text-sm mb-4" style={{ color: theme.text + '80' }}>
              {currentQuestion.subtitle}
            </p>
          )}
          <p className="text-xl" style={{ color: theme.text + 'CC' }}>
            {currentQuestion.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {currentQuestion.options.map((option) => {
            const Icon = option.icon;
            const selected = isSelected(option.value);
            
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className="p-6 rounded-lg border-2 transition-all text-left hover:scale-105"
                style={{
                  backgroundColor: selected ? theme.primary + '20' : theme.secondary,
                  borderColor: selected ? theme.primary : theme.primary + '30',
                  color: theme.text
                }}
              >
                <div className="flex items-start gap-4">
                  {Icon && (
                    <div className="p-3 rounded-lg" style={{ backgroundColor: theme.primary + '30' }}>
                      <Icon size={24} style={{ color: theme.primary }} />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-1">{option.label}</h3>
                    <p className="text-sm" style={{ color: theme.text + '80' }}>
                      {option.desc}
                    </p>
                  </div>
                  {selected && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: theme.primary }}>
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-6 py-3 rounded-lg transition disabled:opacity-30"
            style={{ 
              backgroundColor: theme.secondary,
              color: theme.text
            }}
          >
            Back
          </button>

          {step === questions.length - 1 ? (
            <button
              onClick={handleComplete}
              disabled={!canProceed}
              className="px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-30"
              style={{ 
                backgroundColor: theme.primary,
                color: theme.background
              }}
            >
              Complete Setup
              <ChevronRight size={20} />
            </button>
          ) : currentQuestion.multiple && (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed}
              className="px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition disabled:opacity-30"
              style={{ 
                backgroundColor: theme.primary,
                color: theme.background
              }}
            >
              Continue
              <ChevronRight size={20} />
            </button>
          )}
        </div>

        {/* Skip */}
        <div className="text-center mt-6">
          <button
            onClick={() => onComplete({ userType: 'skip', enabledModules: ['browser', 'devTools'], uiMode: 'standard' })}
            className="text-sm hover:opacity-70 transition"
            style={{ color: theme.text + '60' }}
          >
            Skip onboarding
          </button>
        </div>
      </div>
    </div>
  );
}
