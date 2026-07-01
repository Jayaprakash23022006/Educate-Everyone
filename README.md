# 🎓 Educate Everyone

An inclusive, AI-powered education platform designed for every learner in India — regardless of socioeconomic background or ability.

## 👥 Who It's For

| Role | Features |
|------|----------|
| **BPL / Low-income Students** | AI tutor, YouTube video library, school subjects (Maths, Science, English, Social Studies) |
| **Visually Impaired** | Full screen-reader support, text-to-speech on all AI replies, high-contrast UI, voice input |
| **Hearing Impaired** | Indian Sign Language (ISL) dictionary (50 words), guided ISL lessons, pronunciation trainer |
| **College Students** | AI study helper, career prep, communication skills coach with AI feedback |
| **Teachers / Staff** | Upload lesson plans, materials & important questions — shared with all students instantly |

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or above
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/educate-everyone.git
cd educate-everyone

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder — ready to deploy to Netlify, Vercel, or GitHub Pages.

## 🔑 API Key Setup

This project uses the **Anthropic Claude API** for AI features.

> ⚠️ The API key is handled by the Claude.ai artifact proxy when running inside Claude. For standalone deployment, you need to add your own key.

For local/production use, create a `.env` file:

```env
VITE_ANTHROPIC_API_KEY=your_api_key_here
```

Then update the fetch call in `src/App.jsx`:

```js
headers: {
  "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
}
```

> 🔒 **Never commit your `.env` file.** It is already listed in `.gitignore`.

## 🛠️ Tech Stack

- **React 18** — UI framework
- **Vite 5** — Build tool & dev server
- **Lucide React** — Icons
- **Claude Sonnet 4.6** — AI backbone (Anthropic API)
- **Web Speech API** — Text-to-speech & voice input (browser built-in)
- **Google Fonts** — Fraunces & Inter

## 📁 Project Structure

```
educate-everyone/
├── public/
│   └── favicon.svg
├── src/
│   ├── App.jsx        ← All components & logic
│   └── main.jsx       ← React entry point
├── index.html
├── vite.config.js
├── package.json
├── .gitignore
└── README.md
```

## 🌐 Deploy to Vercel (Free)

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add `VITE_ANTHROPIC_API_KEY` in Environment Variables
4. Click **Deploy** ✅

## 📄 License

MIT — free to use, modify, and distribute.

---

*Built with ❤️ to make quality education accessible to every student in India.*
