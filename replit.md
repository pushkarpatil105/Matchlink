# MatchLink - Tinder-Style Internship Discovery App

## Project Overview
A React + Vite application for discovering and matching with internship opportunities. Features a swipeable card interface with dark theme and glassmorphism UI, dual CSV integration for internship data and user profiles, and comprehensive internship stats.

## Core Features
- **Discover Tab**: Swipeable internship cards with drag-to-dismiss interactions
- **Matches Tab**: View saved internship matches
- **Profile Tab**: User profile with skills, stats, and bio
- **Reality Stats**: Acceptance Rate, Ghost Rate, and Avg Response Time for each internship
- **Skill Matching**: Automatic match percentage based on user skills vs required skills

## Recent Improvements (Dec 29, 2025)

### Robust CSV Parsing Implementation ✅
- **Header Sanitization**: CSV headers are now lowercased and trimmed during parsing for consistency
- **Value Cleaning**: Implemented `cleanNumericValue()` helper that removes % signs and non-numeric characters
- **Fallback Lookups**: All header references support multiple formats (Original, lowercase, snake_case)
- **Console Logging**: Added detailed logs showing sanitized headers and extracted values for debugging

### CSV Data Structure
**Internships CSV (gid=0)**:
- Headers: `ID, Company Name, Role, Location, Skills Required, Acceptance rate%, Ghost Rate%, Avg. response Days, Image url, Badge type, Description`
- All headers are automatically lowercased during parsing: `id, company name, role, location, ...`

**User Profile CSV (gid=1307811639)**:
- Headers: `User ID, Full Name, E-mail, Major, My Skills, Bio, Profile pic url, Total swipes`
- Stored as first data row in sheet

### Reality Stats Display
- **Acceptance Rate**: Formatted as percentage (e.g., "2%"), includes progress bar
- **Ghost Rate**: Color-coded - green (<40%), red (>40%) with warning message
- **Avg Response Time**: Displays in days (e.g., "25 days")

### Data Parsing Logic
1. CSV is parsed via papaparse with `header: false`
2. Headers are manually extracted and sanitized (trim + toLowerCase)
3. Data rows are mapped to objects with sanitized keys
4. Values are cleaned of special characters before display
5. Multiple fallback options handle various column name formats

## Technical Stack
- **Frontend**: React 18 + Vite
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS
- **CSV Parsing**: PapaParse
- **Icons**: Lucide React
- **Color Scheme**: Deep charcoal/slate backgrounds with electric purple accents

## File Structure
```
src/
├── App.jsx          # Main component with all features
├── App.css          # Custom styles (cache control, animations)
├── index.jsx        # React entry point
package.json         # Dependencies
vite.config.js       # Vite configuration
tailwind.config.js   # Tailwind setup
postcss.config.js    # PostCSS setup
```

## Running the App
```bash
npm install          # Install dependencies
npm run dev          # Start development server on port 5000
```

## Deployed Data Sources
- Internships: Google Sheets published as CSV (gid=0)
- User Profile: Google Sheets published as CSV (gid=1307811639)
- Both use `pub?...&single=true&output=csv` for CSV export

## Known Considerations
- Loading states show "..." for missing data
- Default skill match is 75% if user profile data is unavailable
- Ghost Rate threshold for warning: 40% or higher
- All calculations are rounded to nearest integer
