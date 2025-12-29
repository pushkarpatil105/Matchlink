# MatchLink 🚀
### "Tinder for Internships" - Gamifying the Discovery Process

**MatchLink** is a modern, mobile-first web application designed to solve the "application fatigue" faced by students. Instead of scrolling through endless lists of text-heavy job boards, students swipe through curated internship cards equipped with real-world transparency data.

##[DEMO link]:- https://matchlink-internship.web.app/

### Platform Views
<div style="display:flex; gap:10px;">
  <img src="screenshots/home.png" width="220" />
  <img src="screenshots/card.png" width="220" />
  <img src="screenshots/stats.png" width="220" />
</div>





---

## 🌟 The Problem
Traditional internship platforms are boring and lack transparency. Students often apply to hundreds of roles only to be "ghosted," with no insight into the company's actual response behavior or the competitiveness of the role.

## ✨ Our Solution
- **Gamified Discovery:** A Tinder-style swipe interface built with `Framer Motion`.
- **Reality Check Stats:** Live badges showing **Ghosting Rates**, **Acceptance Rates**, and **Average Response Days**.
- **Data-Driven Match:** Real-time skill comparison between the user's profile and the job requirements.
- **Instant Matches:** A dedicated "Matches" tab to save and review top picks.

---

## 🛠️ Tech Stack
- **Frontend:** React.js (Vite)
- **Styling:** Tailwind CSS (Dark Mode & Glassmorphism)
- **Animations:** Framer Motion (Gesture-based swiping)
- **Database:** Google Sheets (serving as a real-time CMS via CSV fetch)
- **Hosting:** Firebase Hosting (Google Cloud Ecosystem)
- **Icons:** Lucide-React

---

## 📊 How It Works (Architecture)



1. **The Database:** Internship and User data are managed in a Google Sheet. This allows for non-technical team members to update listings in real-time without pushing code.
2. **The Fetch:** The app uses `PapaParse` to asynchronously fetch and parse the CSV data from Google’s visualization API.
3. **The Brain:** React manages the "Swipe State." Swiping right triggers an update to the local `Matches` array, which persists during the session.
4. **The UI:** Tailwind CSS handles the "Premium Dark" aesthetic, ensuring a high-end feel for Gen-Z users.

---

## 🚀 Presentation Features for Judges
- **Live Sync:** Change a value in the Google Sheet, and the app updates on refresh!
- **Mobile Responsive:** Fully optimized for PWA (Progressive Web App) use.
- **GDG Integration:** Deployed via **Firebase Hosting** for a professional `.web.app` domain.

---

## 🏗️ Future Roadmap (v2.0)
- **Firebase Auth:** Individual student logins.
- **AI Career Coach:** LLM-powered advice based on the "Skill Gap" detected in cards.
- **One-Click Apply:** Directly submitting the profile to the recruiter via the app.

---

## 👨‍💻 Developed By
- [Pushkar Patil/DataCrafters] 
- Built for the **GDG Hackathon 2025**
