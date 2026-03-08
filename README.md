# Survey App

A beautiful, interactive survey/questionnaire application built with React. Collect responses from multiple people with custom questions, answer notes, and response tracking.

## Features

✨ **Question Management**
- Create, edit, and delete survey questions
- Add optional notes to questions for context (visible to respondents)
- Customize answer options for each question

✨ **Respondent Experience**
- Clean, intuitive interface for answering surveys
- Multiple choice options with custom answer capability
- Add notes with their answers for additional context
- Skip questions and come back to them later
- Progress tracking

✨ **Response Collection**
- Share survey links with respondents
- Generate personalized links with respondent names
- Collect responses with timestamps
- View all responses with answer details and notes
- Uses browser localStorage for data persistence

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/survey-app.git
cd survey-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will open at `http://localhost:3000`

## Development

### Available Scripts

**Start development server:**
```bash
npm start
```

**Build for production:**
```bash
npm run build
```

## Deployment to GitHub Pages

This project is configured with **GitHub Actions** for automatic deployment. No local npm install needed!

### Initial Setup (One-time)

1. **Create a GitHub repository** called `survey-app`

2. **Upload your files to GitHub:**
   - Use GitHub's web interface to create the repository and upload the files
   - Or if you have git installed, push the code to main branch

3. **Update `package.json`** - Change the `homepage` field:
   ```json
   "homepage": "https://yourusername.github.io/survey-app"
   ```
   Replace `yourusername` with your GitHub username.

4. **Enable GitHub Pages:**
   - Go to your repository on GitHub
   - Click **Settings** (top right)
   - Scroll to **Pages** (left sidebar)
   - Under "Build and deployment":
     - Source: Select **"GitHub Actions"**
   - Click **Save**

### Automatic Deployment

Once configured, the GitHub Action will automatically:
- Run whenever you push code to the `main` branch
- Install dependencies
- Build your app
- Deploy to GitHub Pages

Your site will be live at: `https://yourusername.github.io/survey-app`

It may take 1-2 minutes after pushing for deployment to complete. Check the **Actions** tab to monitor progress.

### Updating Your App

Simply edit files in GitHub's web editor or push changes - the workflow runs automatically!

## How to Use

### As a Survey Creator

1. **Create Questions**: Start with the default questions or edit them
2. **Add Notes**: Edit a question to add optional context notes (visible to respondents)
3. **Share**: Click "Share Survey" button to get shareable links
4. **Collect**: Send links to respondents
5. **Review**: View responses in the "Show Responses" section

### As a Respondent

1. **Open Link**: Click the survey link shared with you
2. **Answer**: Select answers from the options or provide custom answers
3. **Add Notes**: Optionally add notes with each answer
4. **Navigate**: Use Previous/Next/Skip buttons to navigate
5. **Submit**: Submit when all questions are answered

## Data Storage

- Survey data is stored in browser **localStorage**
- Each survey has a unique ID in the URL
- Responses are stored per survey ID
- Data persists across browser sessions
- Data is tied to the specific browser/device

**Note**: For production use with multiple devices/browsers, consider integrating a backend database like Firebase or PostgreSQL.

## Customization

### Styling

The app uses **Tailwind CSS**. To customize styling:
1. Edit `tailwind.config.js` for theme changes
2. Modify inline styles in `src/App.jsx` for component-specific styling

### Questions

Default sample questions can be modified in `src/App.jsx` in the `useState` hook.

## Architecture

```
survey-app/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx           # Main component
│   ├── index.js          # React entry point
│   └── index.css         # Global styles
├── package.json          # Dependencies & scripts
├── tailwind.config.js    # Tailwind configuration
└── README.md             # This file
```

## Browser Support

Works in all modern browsers that support:
- ES6+ JavaScript
- localStorage API
- CSS Grid/Flexbox

## Future Enhancements

- [ ] Backend integration for persistent storage
- [ ] Export responses to CSV/JSON
- [ ] Question templates
- [ ] Response analytics
- [ ] Multi-page surveys
- [ ] Conditional logic
- [ ] Response branching

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please open an issue on GitHub.
