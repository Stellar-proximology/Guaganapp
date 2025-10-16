# Guagan Browser Pro - Semantic Operating System

## Overview

Guagan Browser Pro is an experimental semantic browser and cognitive development environment that combines natural language processing, generative AI, and visual computing into a unified interface. The project aims to create an intelligent development platform where users can express intentions in natural language and have them translated into code, visuals, and interactive experiences through AI-powered interpretation and generation.

The system consists of two distinct implementations:
1. A legacy Python/Brython-based p5.js drawing application (root directory)
2. A modern React-based semantic browser with AI integrations (guagan-browser directory)

The core value proposition is enabling creation through conversation - users describe what they want to build, and the system orchestrates LLMs and generative models to scaffold, visualize, and deploy the solution.

## Recent Changes (October 2025)

**🎉 REAL AI INTEGRATION COMPLETE (Oct 15, 2025)** - Hugging Face models now powering the system:
- ✅ **Real AI Text Analysis** - Field Parser now uses Hugging Face sentence-transformers for genuine semantic embeddings
- ✅ **Real AI Image Generation** - Visual Engine now generates actual images using Stable Diffusion 2.1
- ✅ **Secure Backend API** - Express server securely handles all Hugging Face API calls without exposing keys
- ✅ **Smart Fallbacks** - Graceful degradation to local processing if AI APIs are unavailable

**MVP Implementation Complete** - Full modular intelligent browser system now operational:
- ✅ **Onboarding Engine** - 4-step user profiling system that personalizes module selection
- ✅ **Field Parser** - LLM-based semantic vector parser for natural language understanding  
- ✅ **Visual Engine** - Canvas-based visual generation with GAN-ready architecture
- ✅ **Semantic Bridge** - LLM↔GAN alignment system with cosine distance calculations
- ✅ **Extensions Framework** - Modular toggle system for 6 cognitive modules
- ✅ **Full Integration** - Complete data flow from onboarding → parsing → generation → alignment

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Modern Application (guagan-browser/)**
- **Framework**: React 19 with Vite build system
- **Styling**: Tailwind CSS 4.x with custom dark theme utilities
- **Code Editing**: Monaco Editor integration for in-browser code manipulation
- **UI Components**: Custom-built using Lucide React icons, no component library dependencies
- **State Management**: React hooks-based local state (useState, useRef)
- **Design Pattern**: Component-based architecture with modular panels (DevTools, Command Center, Extensions, Viewport)

The browser shell implements a tab-based interface with:
- Semantic address bar that interprets both URLs and natural language queries
- Viewport for rendering generated content or external resources
- Slide-in panels for developer tools and command execution
- Extension system for toggling cognitive modules

**Core Modules** (guagan-browser/src/components/):
- **OnboardingEngine.jsx** - 4-step wizard that profiles users (user type, experience, primary use, interests) and auto-configures enabled modules
- **FieldParser.jsx** - Converts natural language prompts into 8-dimensional semantic field vectors with operator/intent/entity extraction
- **VisualEngine.jsx** - Canvas-based generative visual engine that creates images from semantic vectors (GAN placeholder ready)
- **SemanticBridge.jsx** - Calculates LLM↔GAN alignment using cosine distance metrics and displays sync status
- **Extensions.jsx** - Module management UI with 6 toggleable extensions (Field Parser, Visual Engine, Semantic Bridge, Ontology Graph, Agent Builder, Quantum GAN)
- **DevTools.jsx** - Agent Builder, Website Builder, and IDE with working code generation

**Legacy Application (root directory)**
- **Framework**: Brython (Python-to-JavaScript transpiler) with p5.js
- **Rendering**: Canvas-based drawing using p5.js Processing library
- **Interaction**: Mouse and keyboard event handlers for creative sketching

### Backend Architecture

**Express Backend API Server** (`guagan-browser/server.js` - Port 3001)
- **Secure Hugging Face Proxy** - All AI API calls handled server-side to protect API keys
- **Text Embedding Endpoint** (`/api/text-embedding`)
  - Uses sentence-transformers/all-MiniLM-L6-v2 model
  - Converts text to semantic vectors
  - Properly flattens 2D Hugging Face responses to 1D float arrays
- **Image Generation Endpoint** (`/api/generate-image`)
  - Uses Stable Diffusion 2.1 model
  - Generates real AI images from text prompts
  - Returns base64-encoded images
- **Environment Variable Security** - HUGGINGFACE_API_KEY stored server-side only
- **Error Handling** - Comprehensive error responses with fallback support

**Frontend-Backend Integration**
- Vite dev server (port 5000) proxies `/api/*` requests to backend (port 3001)
- Components make secure fetch calls to backend endpoints
- No API keys exposed to client-side code

**Semantic Parsing** (`src/utils/consciousnessParser.js`)
- Domain-specific parser for "consciousness field" queries
- Maps natural language to structured semantic dimensions (Movement, Mind, Body, Ego, Personality)
- Extracts hierarchical field components (center, gate, line, color, tone, base)
- Alias resolution for flexible natural language input

### Data Architecture

**No Traditional Database**
The application currently has no persistent data layer. Future plans suggest:
- Ontology graph database for semantic relationships
- Vector store for field-based queries
- Project/session persistence layer

**Data Flow**
1. **Onboarding** → User completes 4-step profile → Generates enabledModules list → Stores in userProfile state
2. **Field Parsing** → User enters prompt in Field Parser → Extracts operator/intent/entities → Generates 8D semantic vector → Stores in fieldVector state
3. **Visual Generation** → fieldVector passed to Visual Engine → Generates canvas visualization → Emits latent vectors via onGenerate callback → Stores in visualOutput state
4. **Alignment** → Both fieldVector and visualOutput passed to Semantic Bridge → Calculates cosine distance → Displays alignment score and sync status
5. **Extensions** → User toggles modules in Extensions panel → Updates enabledModules state → Controls which modules are accessible

### Authentication & Authorization

No authentication system is currently implemented. The application operates in a client-side only mode with:
- API key management via service initialization (stored in memory)
- No user accounts or session management
- Future consideration for user profiles and project persistence

### Key Architectural Decisions

**1. Dual-Mode Interface Design**
- **Decision**: Split between simple creative tool (legacy) and complex semantic browser (modern)
- **Rationale**: Allows experimentation with different interaction paradigms - direct manipulation vs. natural language
- **Tradeoff**: Fragmented codebase, but enables parallel development of concepts

**2. Frontend-First AI Integration**
- **Decision**: Direct browser-to-API calls for AI services without backend proxy
- **Rationale**: Rapid prototyping, reduced infrastructure complexity
- **Tradeoff**: API keys exposed in browser, no rate limiting or usage tracking
- **Future Path**: Will require backend proxy for production security

**3. Semantic Field Parser**
- **Decision**: Custom domain-specific language for "consciousness fields" rather than generic NLP
- **Rationale**: Maps to a specific ontological system with defined dimensions and hierarchies
- **Tradeoff**: Limited to domain vocabulary, but provides structured semantic grounding

**4. Monaco Editor Integration**
- **Decision**: Full-featured code editor embedded in browser
- **Rationale**: Enables live code editing and inspection within the semantic environment
- **Alternative Considered**: Simple textarea (rejected for lack of syntax highlighting and IntelliSense)

**5. Modular Extension System**
- **Decision**: Pluggable cognitive modules (Field Parser, Semantic Bridge, Visual GAN, Ontology Graph, Agent Builder, Quantum GAN)
- **Rationale**: Allows runtime toggling of AI capabilities for debugging and performance
- **Implementation**: Component-level enable/disable with state-driven rendering, category filtering, and bulk enable/disable controls
- **Onboarding Integration**: User profile automatically determines which modules are enabled based on experience level and interests

**6. Callback-Based Data Flow**
- **Decision**: Parent-child component communication via callback props (onParse, onGenerate, onToggle)
- **Rationale**: Enables clean unidirectional data flow while keeping state centralized in SmartBrowser
- **Implementation**: Field Parser → onParse → fieldVector state → Visual Engine → onGenerate → visualOutput state → Semantic Bridge
- **Verified**: Architect-reviewed with no circular dependencies or re-render issues

## External Dependencies

### AI & Machine Learning Services
- **Hugging Face Inference API** - Primary AI backend for LLM and image generation
  - Text generation models (Phi-3-mini-4k-instruct)
  - Image generation models (Stable Diffusion 2.1)
  - Requires API key authentication

### Frontend Libraries & Frameworks
- **React 19.1.1** - Core UI framework
- **Vite 7.x** - Build tool and development server
- **Tailwind CSS 4.x** - Utility-first styling framework
- **Monaco Editor** - Code editor (VS Code editor component)
- **Lucide React** - Icon library
- **Axios** - HTTP client for API requests

### Legacy Dependencies (Python-based app)
- **Brython** - Python-to-JavaScript transpiler
- **p5.js** - Creative coding library (Processing for JavaScript)
- **p5.sound & p5.dom** - p5.js extensions

### Development Tools
- **ESLint** - Code linting with React-specific rules
- **PostCSS** - CSS processing with Autoprefixer
- **Vite Plugin React** - Fast Refresh and JSX support

### Third-Party APIs (Planned/Referenced)
- **GitHub API** - For push/deploy functionality (currently stubbed)
- **Future LLM providers** - GPT-4, Claude (referenced in design docs)
- **Vector databases** - For semantic search and ontology storage (not yet implemented)

### Development Environment
- **Node.js ecosystem** - npm package management
- **Replit-specific configuration** - HMR client port configuration for Replit hosting