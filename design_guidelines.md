# Design Guidelines: AI-Powered Browser with Integrated Development Environment

## Design Approach: Hybrid System (Developer-Focused)

**Primary Inspiration**: VS Code, Linear, GitHub Desktop, Replit
**Rationale**: Professional development tool requiring clean information hierarchy, efficient workflows, and minimal visual distraction. Users need to focus on code and content simultaneously.

---

## Core Design Elements

### A. Color Palette

**Dark Mode Primary** (Default):
- Background Deep: 220 15% 8%
- Background Elevated: 220 15% 12%
- Background Panel: 220 15% 16%
- Border Subtle: 220 15% 24%
- Text Primary: 220 10% 95%
- Text Secondary: 220 8% 70%
- Accent Primary: 217 91% 60% (Blue - for actions)
- Accent Success: 142 76% 45% (Green - for deployments)
- Accent Warning: 38 92% 50% (Amber - for AI features)
- Code Editor Background: 220 13% 18%

**Light Mode**:
- Background: 220 15% 98%
- Background Elevated: 0 0% 100%
- Text Primary: 220 15% 15%
- Borders: 220 10% 88%

### B. Typography

**Font Stack**:
- **Primary UI**: 'Inter', system-ui, sans-serif (Google Fonts)
- **Code/Mono**: 'JetBrains Mono', 'Fira Code', monospace (Google Fonts)

**Scale**:
- Headers: 24px (semibold) for main sections, 18px (medium) for panel titles
- Body: 14px (regular) for UI text, 13px for code editor
- Small: 12px for metadata, status indicators

### C. Layout System

**Spacing Primitives**: Use Tailwind units of 2, 4, 6, 8, 12, 16
- Tight spacing: p-2, gap-2 (component internals)
- Standard: p-4, gap-4 (default UI spacing)
- Section: p-6, p-8 (panel padding, major sections)
- Large: p-12, p-16 (modal padding, hero spacing if applicable)

**Grid Structure**:
- Split-view: 40/60 or 50/50 browser/editor pane ratio (user adjustable with drag handle)
- Settings panels: max-w-4xl centered
- Toolbar heights: h-12 for top navigation, h-10 for secondary toolbars

### D. Component Library

**Navigation & Chrome**:
- **Top Browser Bar**: Full-width dark header with address bar (rounded input), back/forward buttons (icon-only), refresh, home icons (Heroicons). Height: h-14
- **Mode Toggle**: Prominent button (top-right) with "Browser" / "Code" / "Split" options. Active state with accent color background
- **Settings Icon**: Gear icon (top-right corner) opening slide-over panel

**Code Editor Panel**:
- **Monaco Editor**: Full-height integration with VSCode dark+ theme
- **Toolbar**: Top-aligned with Upload (file icon), Paste (clipboard icon), Format (sparkles icon), Deploy (rocket icon) buttons. Spacing: gap-2, padding: p-3
- **Language Selector**: Dropdown showing auto-detected or manually selected language
- **AI Assistant Button**: Floating button (bottom-right of editor) with Hugging Face logo, amber accent glow

**Browser Panel**:
- **Content Frame**: Clean iframe with subtle border (border-slate-800)
- **Code Detection Badge**: When code snippets detected, small floating badge (top-right of browser panel) "Code Detected - Switch to Editor" with pulse animation

**Settings Panel**:
- **Slide-over**: Right-side panel (w-96) with backdrop blur
- **Sections**: API Keys (Hugging Face, GitHub), Preferences, Theme toggle
- **Input Fields**: Dark inputs with subtle borders, monospace for API keys, eye icon for show/hide
- **Save Button**: Full-width accent button at bottom

**Deployment Modal**:
- **GitHub Deploy**: Modal (max-w-2xl) with repository name input, branch selector, commit message textarea
- **Export Options**: Download as ZIP button with file icon
- **Status Indicators**: Progress bars for upload/deployment with success/error states

**AI Integration Panel**:
- **Slide-up Panel**: Bottom sheet (h-80) with chat interface
- **Prompt Input**: Textarea with "Ask AI to help with code..." placeholder
- **Response Area**: Code-formatted responses with copy buttons
- **Quick Actions**: Pre-defined prompts as chips (e.g., "Explain this code", "Find bugs", "Optimize")

### E. Interaction Patterns

**Minimal Animations** (performance-critical app):
- Smooth panel transitions: 200ms ease-in-out
- Button states: Simple opacity/background changes (no transforms)
- Loading states: Subtle spinner for AI/deploy actions
- Split view drag handle: Real-time resize with 1px visual indicator

**Focus States**:
- Keyboard navigation: 2px accent-colored outline on all interactive elements
- Active editor: Subtle glow on editor border when focused

### F. Special Features

**Code Detection System**:
- Auto-scan browser content for `<code>`, `<pre>` blocks
- Visual indicator: Small floating badge with "Extract Code" option
- One-click transfer to Monaco editor

**Split View Layout**:
- Resizable divider (cursor: col-resize) with 4px hit area
- Minimum pane width: 320px
- Persist user's preferred split ratio in localStorage

**Project Management**:
- File tree sidebar (left, w-64, collapsible) when in code mode
- Tabs for multiple open files (horizontal scroll if needed)
- Unsaved changes indicator (dot on tab)

---

## Accessibility Considerations

- All form inputs maintain consistent dark backgrounds with clear labels
- Focus indicators with 2px accent borders on all interactive elements  
- Icon buttons include aria-labels for screen readers
- Color contrast ratios meet WCAG AA standards (4.5:1 minimum)
- Keyboard shortcuts overlay (Cmd/Ctrl+K for quick access)

---

## Key Principles

1. **Developer-First UX**: Prioritize code visibility and editing efficiency over decorative elements
2. **Seamless Context Switching**: Browser ↔ Code ↔ AI transitions should feel instant and natural
3. **Information Density**: Pack functionality without clutter - use collapsible panels and contextual menus
4. **Professional Aesthetic**: Clean, modern, VSCode-inspired with subtle AI enhancement indicators
5. **Performance**: Minimal animations, optimized rendering for split-view scenarios