<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# StudyClub24 - AI-Powered Learning Platform

Complete learning platform with AI tutoring, courses, flashcards, and progress tracking.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Firebase account
- Gemini API key

### Installation
```bash
npm install
```

### Environment Setup
1. Set `GEMINI_API_KEY` in [.env.local](.env.local)
2. Configure Firebase in [firebaseConfig.ts](firebaseConfig.ts)

### Development
```bash
npm run dev              # Start dev server
npm run admin            # Open admin dashboard
npm run seed             # Seed database
```

## 📚 Content Management System

### New to Content Upload?
**Start here:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

### Quick Links
- [QUICK_START.md](QUICK_START.md) - 5-minute setup
- [HOW_TO_FEED_DATA.md](HOW_TO_FEED_DATA.md) - Complete upload guide
- [QUICK_REFERENCE.html](QUICK_REFERENCE.html) - Printable cheat sheet
- [sample-flashcards.csv](sample-flashcards.csv) - CSV template

### First Upload in 5 Minutes
```bash
# 1. Deploy security rules
firebase deploy --only firestore:rules,storage

# 2. Seed database
npm run seed

# 3. Set admin role in Firebase Console
# users collection → your user → add field: role = "admin"

# 4. Open admin dashboard
npm run admin

# 5. Upload content via UI
```

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS
- **Backend**: Firebase (Firestore, Storage, Auth, Functions)
- **Mobile**: Capacitor (Android/iOS)
- **Payment**: Razorpay
- **AI**: Google Gemini

### Project Structure
```
studyclub24-7-1-26/
├── components/           # React components
│   ├── Admin/           # Admin dashboard & uploader
│   ├── Auth/            # Authentication
│   ├── Courses/         # Course pages
│   └── ...
├── services/            # Business logic
│   ├── contentService.ts      # Firebase data operations
│   ├── contentProcessor.ts    # File processing
│   ├── geminiService.ts       # AI tutoring
│   └── ...
├── types/               # TypeScript definitions
│   └── content.types.ts       # Content types
├── scripts/             # Utility scripts
│   └── seedData.ts           # Database seeding
├── firestore.rules      # Database security
├── storage.rules        # File storage security
└── ...
```

## 📖 Documentation

### For Content Creators
- [QUICK_START.md](QUICK_START.md) - Fast setup
- [HOW_TO_FEED_DATA.md](HOW_TO_FEED_DATA.md) - Upload guide
- [UPLOAD_CHECKLIST.md](UPLOAD_CHECKLIST.md) - Progress tracker
- [UPLOAD_WORKFLOW.html](UPLOAD_WORKFLOW.html) - Visual guide

### For Developers
- [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md) - API docs
- [COURSE_CONTENT_ARCHITECTURE_PLAN.html](COURSE_CONTENT_ARCHITECTURE_PLAN.html) - Architecture
- [components/Admin/README.md](components/Admin/README.md) - Dashboard internals

### Templates & Examples
- [sample-flashcards.csv](sample-flashcards.csv) - Flashcard template
- [QUICK_REFERENCE.html](QUICK_REFERENCE.html) - Quick reference card

## 🎯 Features

### ✨ AI Tutoring
- Powered by Google Gemini
- Multiple modes: Chat, Flashcards, Quiz, Study Plans
- Scientific calculator with step-by-step solutions
- Image analysis for math problems

### 📚 Course Library
- Organized by Course → Chapter → Topic
- Flashcards with spaced repetition
- Interactive summaries with LaTeX support
- Progress tracking per topic

### 👤 User Features
- Authentication with Firebase
- Profile with badges and achievements
- Leaderboard and points system
- Subscription management (Razorpay)

### 🎨 Admin Dashboard
- Upload content via drag-drop UI
- Seed database with sample data
- Manage courses, chapters, topics
- CSV flashcard parsing
- Bulk content upload

## 🛠️ Development

### NPM Scripts
```bash
# Development
npm run dev                    # Start dev server (port 5173)
npm run dev:3000              # Start on port 3000
npm run build                 # Production build
npm run preview               # Preview production build

# Admin & Data
npm run admin                 # Open admin dashboard
npm run seed                  # Seed database with sample data

# Firebase
firebase deploy                              # Deploy everything
firebase deploy --only firestore:rules       # Deploy DB rules
firebase deploy --only storage              # Deploy storage rules
firebase deploy --only hosting              # Deploy website
npm run firebase:deploy:hosting             # Build + deploy hosting
npm run firebase:deploy:functions           # Deploy functions
npm run firebase:logs                       # View logs

# Android
npm run android:build         # Build Android APK
npm run android:open          # Open in Android Studio
```

### Environment Variables
Create `.env.local`:
```env
VITE_GEMINI_API_KEY=your_gemini_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## 🔐 Security

### Firestore Rules
- Public: Read course structure
- Premium: Access premium content
- Authenticated: Write own progress
- Admin: Full write access

### Storage Rules  
- Admin: Upload to courses/
- Authenticated: Read all files
- Users: Upload to own folders

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage
```

## 📱 Mobile

### Build Android APK
```bash
npm run android:build
```

### Open in Android Studio
```bash
npm run android:open
```

## 🚀 Deployment

### Deploy Everything
```bash
npm run build
firebase deploy
```

### Deploy Hosting Only
```bash
npm run firebase:deploy:hosting
```

### Deploy Functions Only
```bash
npm run firebase:deploy:functions
```

## 📊 Content Upload Workflow

```
1. Prepare Content
   ├── flashcards.csv (Q&A pairs)
   ├── summary.txt/docx
   └── images/ (optional)

2. Deploy Security Rules
   └── firebase deploy --only firestore:rules,storage

3. Seed Database (first time)
   └── npm run seed

4. Set Admin Role
   └── Firebase Console → users → role: "admin"

5. Upload Content
   ├── npm run admin
   ├── Click "Upload Content"
   ├── Fill form
   └── Upload files

6. Verify
   ├── Check Firebase Console
   └── Test on frontend
```

## 🐛 Troubleshooting

### Permission Denied Errors
**Fix:** Deploy security rules first
```bash
firebase deploy --only firestore:rules,storage
```

### Admin Access Denied
**Fix:** Set admin role in Firestore
```
users/{yourUserId} → role: "admin"
```

### CSV Parse Errors
**Fix:** Check format matches [sample-flashcards.csv](sample-flashcards.csv)
- First row: `front,back,difficulty,hint`
- Difficulty: `easy`, `medium`, or `hard`

### Files Not Showing
**Fix:** Clear cache
```javascript
localStorage.clear();
location.reload();
```

## 📞 Support

- **Documentation**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Issues**: Check browser console (F12)
- **Firebase**: [Console](https://console.firebase.google.com)
- **Logs**: `npm run firebase:logs`

## 📝 License

Private project - All rights reserved

## 🤝 Contributing

1. Read [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
2. Follow code style
3. Test thoroughly
4. Submit PR with description

---

**View app in AI Studio**: https://ai.studio/apps/drive/1dqV3WIi9EzgvOtsg83GsUXiXlQzDo4gG

**Firebase Project**: my-website-map-470209

**Version**: 1.0.0
