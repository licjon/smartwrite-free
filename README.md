# SmartWrite Free 🚀

A satirical AI writing assistant that demonstrates the pitfalls of over-automation and aggressive upselling in productivity software. This project showcases modern web development best practices while delivering a humorous commentary on AI-powered writing tools.

## 🎯 Purpose

SmartWrite Free is a tongue-in-cheek demonstration of how AI writing assistants might behave if they were overly aggressive about "improving" your text and constantly pushing premium upgrades. It's both educational and entertaining, serving as a commentary on the current state of AI-powered productivity tools.

## ✨ Features

- **Real-time Text Interference**: Automatically "improves" your writing with corporate jargon
- **Escalating Popup Aggression**: Popups become increasingly pushy about upgrading
- **Fake AI Suggestions**: Generates satirical writing advice
- **Professional UI**: Clean, modern interface that mimics real productivity software
- **Responsive Design**: Works on desktop and mobile devices
- **TypeScript**: Full type safety and modern JavaScript features
- **Modular Architecture**: Clean separation of concerns

## 🛠️ Tech Stack

- **TypeScript** - Type safety and modern JavaScript features
- **Vite** - Fast build tool and development server
- **ESLint + Prettier** - Code quality and formatting
- **CSS3** - Modern styling with animations and responsive design
- **GitHub Pages** - Free hosting and deployment

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smartwrite-free.git
cd smartwrite-free
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript type checking

## 📁 Project Structure

```
smartwrite-free/
├── src/
│   ├── scripts/
│   │   ├── main.ts              # Application entry point
│   │   └── writing-assistant.ts # Main application logic
│   ├── styles/
│   │   └── main.css             # All styles
│   ├── types/
│   │   └── index.ts             # TypeScript type definitions
│   └── utils/
│       ├── constants.ts         # Application constants
│       └── helpers.ts           # Utility functions
├── index.html                   # Main HTML file
├── package.json                 # Project configuration
├── tsconfig.json               # TypeScript configuration
├── vite.config.js              # Vite configuration
├── .eslintrc.js                # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # This file
```

## 🌐 Deployment

### GitHub Pages

1. Update the `homepage` field in `package.json` with your GitHub Pages URL
2. Update the `base` field in `vite.config.js` to match your repository name
3. Build the project:
```bash
npm run build
```
4. Push the `dist` folder to the `gh-pages` branch or enable GitHub Pages in your repository settings

### Manual Deployment

1. Build the project:
```bash
npm run build
```
2. Upload the contents of the `dist` folder to your web server

## 🎨 Customization

### Adding New Word Replacements

Edit `src/utils/constants.ts` to add new word replacements:

```typescript
export const WORD_REPLACEMENTS: WordReplacement[] = [
  // ... existing replacements
  { original: 'new', replacement: 'innovative', category: 'corporate' },
];
```

### Modifying Popup Behavior

Adjust the popup frequency and messages in `src/utils/constants.ts`:

```typescript
export const CONFIG = {
  POPUP_FREQUENCY: 50, // Show popup every 50 keystrokes
  // ... other config
};
```

### Styling Changes

All styles are in `src/styles/main.css`. The project uses CSS custom properties for easy theming.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the proliferation of AI writing assistants
- Built with modern web development best practices
- Designed to be both educational and entertaining

## ⚠️ Disclaimer

This is a satirical project created for educational and entertainment purposes. It is not affiliated with any real AI writing assistant companies.

---

**Happy coding! 🎉** 