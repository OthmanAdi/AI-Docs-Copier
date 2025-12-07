# AI Docs Copier

> Transform any documentation into AI-friendly formats with one click.

A powerful browser extension that detects documentation websites and provides instant export to AI-optimized formats including Markdown, llms.txt, and plain text. Seamlessly integrates with ChatGPT, Claude, Cursor, and VS Code.

---

## 🎯 What It Does

AI Docs Copier solves a daily pain point for developers: copying documentation into AI tools for analysis and questions. Instead of manually copying, formatting, and cleaning up docs, this extension:

- **Automatically detects** documentation sites using intelligent multi-strategy detection
- **Extracts clean content** using Mozilla's Readability algorithm with smart fallbacks
- **Converts to AI-friendly formats** including Markdown, llms.txt, and plain text
- **Opens directly in AI platforms** like ChatGPT and Claude with pre-filled prompts
- **Integrates with IDEs** via Cursor and VS Code deeplinks

---

## ✨ Features

### Smart Documentation Detection
Uses 5 detection strategies to identify documentation sites:
- Meta tag platform detection (Docusaurus, Sphinx, GitBook, MkDocs, Jekyll, Hugo)
- URL pattern analysis (`/docs/`, `/api/`, `/guide/`, etc.)
- DOM structure recognition (sidebars, TOCs, navigation patterns)
- Content analysis (headings and titles)
- llms.txt file presence detection

### Multiple Export Formats
- **Markdown**: Clean, LLM-ready markdown with proper formatting
- **llms.txt**: Structured index format for AI consumption (following [llmstxt.org](https://llmstxt.org) spec)
- **Plain Text**: Simple text extraction for lightweight use

### AI Platform Integration
- **ChatGPT**: One-click open with GPT-4o and pre-filled context
- **Claude**: Direct integration with pre-filled prompts
- **Cursor IDE**: Deeplink support for immediate editing
- **VS Code**: Deeplink integration for developer workflows

### Content Extraction Pipeline
1. **Primary**: Mozilla Readability.js for article/documentation extraction
2. **Fallback**: CSS selector matching for 15+ documentation platforms
3. **Ultimate Fallback**: Sanitized body content extraction
4. **Security**: All content sanitized with DOMPurify

### Trial & Subscription System
- 2-day free trial (no payment required)
- Subscription management via chrome.storage.sync
- Access control for premium features
- Upgrade prompts with clear pricing

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 6 with Turborepo monorepo
- **Styling**: Tailwind CSS 3
- **Browser**: Manifest V3 for Chrome/Edge/Brave/Opera
- **Content Extraction**: @mozilla/readability + DOMPurify
- **Markdown Conversion**: Turndown.js with GFM plugin

### Project Structure
```
ai-docs-copier/
├── chrome-extension/          # Extension manifest and background scripts
│   ├── manifest.ts            # Manifest V3 configuration
│   └── src/background/        # Service worker
├── pages/                     # Extension pages
│   ├── content-ui/            # Floating button and export menu
│   ├── popup/                 # Extension popup
│   └── options/               # Settings page
├── packages/                  # Shared packages
│   ├── shared/                # Core business logic
│   │   ├── lib/ai-integrations.ts
│   │   ├── lib/content-extractor.ts
│   │   ├── lib/docs-detector.ts
│   │   ├── lib/markdown-converter.ts
│   │   ├── lib/llms-txt-generator.ts
│   │   ├── lib/mcp-registry.ts
│   │   └── lib/subscription.ts
│   ├── storage/               # Chrome storage helpers
│   ├── ui/                    # Shared UI components
│   └── hmr/                   # Hot module reload
└── dist/                      # Built extension (load in browser)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 22.15.1
- pnpm 10.11.0 (install with `npm install -g pnpm`)
- Chrome, Edge, Brave, or any Chromium-based browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/OthmanAdi/ai-docs-copier.git
   cd ai-docs-copier
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Run development build**
   ```bash
   pnpm dev
   ```

4. **Load in browser**
   - Open Chrome and navigate to `chrome://extensions`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` directory from this project

### Production Build
```bash
pnpm build        # For Chrome/Edge
pnpm build:firefox # For Firefox
```

### Create Distribution Package
```bash
pnpm zip          # Creates extension-YYYYMMDD-HHmmss.zip in dist-zip/
```

---

## 🎨 Usage

1. **Navigate to any documentation site** (e.g., docs.langchain.com, react.dev, docs.python.org)
2. **Click the floating "Copy for AI" button** that appears in the bottom right
3. **Choose your export option**:
   - Copy as Markdown/llms.txt/Plain Text
   - Open directly in ChatGPT or Claude
4. **Or right-click** anywhere on the page and use the "AI Docs Copier" context menu

---

## 🛠️ Development

### Install dependencies for specific modules
```bash
# For root
pnpm i <package> -w

# For specific module
pnpm i <package> -F <module-name>
```

### Update extension version
```bash
pnpm update-version 1.2.0
```

### Environment Variables
See `packages/env/README.md` for environment variable configuration.

### Module Management
Enable/disable extension features:
```bash
pnpm module-manager
```

---

## 📦 Core Dependencies

- **@mozilla/readability** - Content extraction engine
- **turndown** - HTML to Markdown conversion
- **turndown-plugin-gfm** - GitHub Flavored Markdown support
- **dompurify** - HTML sanitization
- **react** - UI framework
- **tailwindcss** - Styling

---

## 🗺️ Roadmap

### Current Status: MVP Complete ✅
- [x] Smart documentation detection
- [x] Multi-format export (Markdown, llms.txt, plain text)
- [x] AI platform integration (ChatGPT, Claude)
- [x] Floating UI with export menu
- [x] Context menu integration
- [x] Trial system implementation

### Planned Features
- [ ] Preview dialog before copying
- [ ] Copy history explorer
- [ ] MCP server installation UI
- [ ] Cloud library with AI organization
- [ ] User accounts and cross-device sync
- [ ] Custom export templates
- [ ] Firefox and Safari support

---

## 💼 Business Model

This project is **open source** with a dual licensing approach:
- **Free Version**: Open source repository for developers and community
- **Paid Version**: Chrome Web Store with 2-day free trial, then monthly/yearly subscription

This model builds trust through transparency while sustaining development.

---

## 🤝 Contributing

Contributions are welcome! This is an early-stage project, and we're open to:
- Bug reports and fixes
- Feature suggestions
- Documentation improvements
- Code quality enhancements

Please open an issue first to discuss major changes.

---

## 📄 License

MIT License - See [LICENSE](LICENSE) file for details.

---

---

## 👨‍💻 About the Author

**Ahmad Othman Ammar Adi** (Othman Adi)

Full Stack Developer, AI Agents Orchestrator, and passionate educator from Hama, Syria — now based in Berlin, Germany.

- 🎓 **Education**: Completed apprenticeship in Computer Science
- 👨‍🏫 **Teaching**: 8,000+ documented teaching lectures since 2020
- 📚 **Formats**: Workshops (days to weeks), intensive courses (2-6 months), and long-term programs including multi-year weekend coding classes for kids
- 💼 **Current Role**: AI Agents Orchestrator at migRaven

**Connect:**
- 🌐 Website: [othmanadi.com](https://othmanadi.com)
- 💼 LinkedIn: [codingwithadi](https://linkedin.com/in/codingwithadi)
- 🐙 GitHub: [OthmanAdi](https://github.com/OthmanAdi)

---

**Made with ❤️ for developers who live in documentation**
