export const DIMENSIONS = {
  MOVEMENT: {
    keynote: 'I Define',
    nature: 'Individuality',
    macrocosmic: 'Energy is Creation',
    aspect: 'Spirit',
    aliases: ['movement', 'spirit', 'individuality', 'i define', 'energy', 'creation']
  },
  MIND: {
    keynote: 'I Remember',
    nature: 'The Mind',
    macrocosmic: 'Gravity is Memory',
    aspect: 'Evolution',
    aliases: ['mind', 'evolution', 'i remember', 'gravity', 'memory']
  },
  BODY: {
    keynote: 'I Am',
    nature: 'The Body',
    macrocosmic: 'Matter is Touch',
    aspect: 'Being',
    aliases: ['body', 'being', 'i am', 'matter', 'touch']
  },
  EGO: {
    keynote: 'I Design',
    nature: 'The Ego',
    macrocosmic: 'Structure is Progress',
    aspect: 'Design',
    aliases: ['ego', 'design', 'i design', 'structure', 'progress']
  },
  PERSONALITY: {
    keynote: 'I Think',
    nature: 'Personality',
    macrocosmic: 'Form is Illusion',
    aspect: 'Space',
    aliases: ['personality', 'space', 'i think', 'form', 'illusion']
  }
};

export const parseSemanticInput = (input) => {
  const parts = input.split(/[,.:;]/).map(s => s.trim()).filter(Boolean);
  const lowerInput = input.toLowerCase();
  
  const field = {
    raw: input,
    center: null,
    gate: null,
    line: null,
    color: null,
    tone: null,
    base: null,
    dimension: null,
    keynote: null,
    parsed: []
  };

  parts.forEach(part => {
    const gateMatch = part.match(/gate\s*(\d+)/i);
    if (gateMatch) field.gate = parseInt(gateMatch[1]);
    
    const lineMatch = part.match(/line\s*(\d+)/i);
    if (lineMatch) field.line = parseInt(lineMatch[1]);
    
    const colorMatch = part.match(/color\s*(\d+)/i);
    if (colorMatch) field.color = parseInt(colorMatch[1]);
    
    const toneMatch = part.match(/tone\s*(\d+)/i);
    if (toneMatch) field.tone = parseInt(toneMatch[1]);
    
    const baseMatch = part.match(/base\s*(\d+)/i);
    if (baseMatch) field.base = parseInt(baseMatch[1]);
  });

  Object.entries(DIMENSIONS).forEach(([key, dim]) => {
    if (dim.aliases.some(alias => lowerInput.includes(alias))) {
      field.dimension = key;
      field.keynote = dim.keynote;
    }
  });

  return field;
};

export const generateFieldSentence = (field) => {
  const dim = DIMENSIONS[field.dimension] || DIMENSIONS.MOVEMENT;
  return `${dim.keynote} through ${dim.nature} at Gate ${field.gate || '?'}.${field.line || '?'}`;
};
