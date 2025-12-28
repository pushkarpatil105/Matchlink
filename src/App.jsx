import React, { useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, Briefcase, User, Sparkles, TrendingUp, Users, AlertCircle, CheckCircle2 } from 'lucide-react';
import Papa from 'papaparse';

// User profile with skills
const userProfile = {
  name: "Alex Developer",
  skills: ["React", "JavaScript", "Python", "Node.js", "UI/UX", "TypeScript"],
  location: "Indore, India"
};

const App = () => {
  const [internships, setInternships] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('discover');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    try {
      setLoading(true);
      setError(null);

      // Your Google Sheet URL - published to web as CSV
      const sheetURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSUMH_Lt6BLN8Dm1J5-oT1RDrXAtpM8OfJ-qNS50qovHrm9VGINraW1ZYvG9hadc41eEovCPXar1v7U/pub?gid=0&single=true&output=csv';

      console.log('🔍 Fetching from URL:', sheetURL);

      Papa.parse(sheetURL, {
        download: true,
        header: false,
        skipEmptyLines: true,
        dynamicTyping: false,
        complete: (results) => {
          console.log('✅ Raw data fetched:', results.data.length, 'rows');
          
          if (results.data && results.data.length > 0) {
            // Find the actual header row (skip empty or blank rows at the top)
            let headerRowIndex = 0;
            let headerRow = [];
            
            for (let i = 0; i < results.data.length; i++) {
              const row = results.data[i];
              // Check if this row has actual content (like "ID", "Company Name")
              if (row.some(cell => cell && cell.toString().trim().length > 0)) {
                headerRow = row;
                headerRowIndex = i;
                break;
              }
            }

            if (headerRow.length === 0) {
              throw new Error('Could not find header row in sheet');
            }

            console.log('📋 Headers:', headerRow);
            
            // Convert remaining rows to objects using the header row
            const validData = results.data.slice(headerRowIndex + 1)
              .filter(row => row.some(cell => cell && cell.toString().trim().length > 0))
              .map(row => {
                const obj = {};
                headerRow.forEach((header, index) => {
                  const cleanHeader = header.trim();
                  obj[cleanHeader] = row[index] || '';
                });
                return obj;
              })
              .filter(row => row['Company Name'] || row['company']);

            console.log('✨ Valid rows after filtering:', validData.length);
            console.log('🔍 First row sample:', validData[0]);

            if (validData.length > 0) {
              setInternships(validData);
              setLoading(false);
            } else {
              throw new Error('No valid internship data found in sheet');
            }
          } else {
            throw new Error('Sheet returned empty data');
          }
        },
        error: (error) => {
          console.error('❌ Papaparse error:', error);
          setError(`Failed to parse CSV: ${error.message}`);
          setLoading(false);
        }
      });

    } catch (error) {
      console.error('❌ Fetch error:', error);
      setError(error.message);
      setLoading(false);
    }
  };

  const calculateSkillMatch = (internship) => {
    const requiredSkills = (internship['Required Skills'] || internship['required_skills'] || '').toLowerCase();
    const matchedSkills = userProfile.skills.filter(skill => 
      requiredSkills.includes(skill.toLowerCase())
    );
    return Math.min(100, Math.round((matchedSkills.length / Math.max(userProfile.skills.length, 1)) * 100));
  };

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      setMatches([...matches, internships[currentIndex]]);
    }
    setCurrentIndex(currentIndex + 1);
  };

  const handleButtonClick = (direction) => {
    handleSwipe(direction);
  };

  // Helper function to parse percentage values
  const parsePercentage = (value) => {
    if (!value || value === 'N/A') return null;
    const num = parseInt(value.toString().replace('%', ''));
    return isNaN(num) ? null : num;
  };

  const ProgressBar = ({ percentage, label }) => {
    if (percentage === null) return <p className="text-gray-400 text-sm">{label}: N/A</p>;
    
    return (
      <div className="space-y-1">
        <div className="flex justify-between items-center mb-1">
          <p className="text-gray-400 text-sm">{label}</p>
          <span className="text-white font-semibold text-sm">{percentage}%</span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2 overflow-hidden border border-gray-600/30">
          <motion.div
            className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>
    );
  };

  const SwipeCard = ({ internship, index }) => {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-300, 300], [-30, 30]);
    const opacity = useTransform(x, [-300, -150, 0, 150, 300], [0, 1, 1, 1, 0]);

    const handleDragEnd = (event, info) => {
      if (Math.abs(info.offset.x) > 150) {
        handleSwipe(info.offset.x > 0 ? 'right' : 'left');
      }
    };

    const skillMatch = calculateSkillMatch(internship);
    const companyName = internship['Company Name'] || internship['company'] || 'Company';
    const role = internship['Role'] || internship['role'] || 'Internship Role';
    const location = internship['Location'] || internship['location'] || '';
    const description = internship['Description'] || internship['description'] || '';
    const ghostRateRaw = internship['Ghost Rate%'] || internship['Ghost Rate'] || internship['ghost_rate'] || 'N/A';
    const acceptanceRateRaw = internship['Acceptance rate%'] || internship['Acceptance Rate'] || internship['acceptance_rate'] || 'N/A';
    const requiredSkills = internship['Required Skills'] || internship['required_skills'] || '';
    
    const ghostRateNum = parsePercentage(ghostRateRaw);
    const acceptanceRateNum = parsePercentage(acceptanceRateRaw);
    
    const isHighGhostRate = ghostRateNum !== null && ghostRateNum > 40;
    const ghostColor = isHighGhostRate ? 'text-red-400' : 'text-green-400';
    const ghostBgColor = isHighGhostRate ? 'bg-red-500/10' : 'bg-green-500/10';

    return (
      <motion.div
        style={{ x, rotate, opacity }}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        onDragEnd={handleDragEnd}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <div className="relative w-full h-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-green-500/10 opacity-50"></div>

          <motion.div
            className="absolute inset-0 bg-green-500/30 backdrop-blur-sm flex items-center justify-center z-10"
            style={{ opacity: useTransform(x, [0, 150], [0, 1]) }}
          >
            <div className="bg-green-500 rounded-full p-8 shadow-lg shadow-green-500/50">
              <Heart className="w-20 h-20 text-white" fill="white" />
            </div>
          </motion.div>

          <motion.div
            className="absolute inset-0 bg-red-500/30 backdrop-blur-sm flex items-center justify-center z-10"
            style={{ opacity: useTransform(x, [-150, 0], [1, 0]) }}
          >
            <div className="bg-red-500 rounded-full p-8 shadow-lg shadow-red-500/50">
              <X className="w-20 h-20 text-white" />
            </div>
          </motion.div>

          <div className="relative p-8 h-full flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h2 className="text-4xl font-bold text-white drop-shadow-lg">
                      {companyName}
                    </h2>
                    <CheckCircle2 className="w-7 h-7 text-blue-400 flex-shrink-0" fill="currentColor" />
                  </div>
                  <div className="flex items-center gap-2 text-purple-300">
                    <Briefcase className="w-5 h-5" />
                    <p className="text-xl">{role}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-4 py-2 rounded-full shadow-lg shadow-green-500/50 flex-shrink-0">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-white" />
                    <span className="text-white font-bold text-lg">{skillMatch}%</span>
                  </div>
                  <p className="text-white text-xs text-center">Match</p>
                </div>
              </div>

              {location && (
                <div className="bg-gray-800/50 backdrop-blur px-4 py-2 rounded-full inline-block mb-6 border border-gray-700/50">
                  <p className="text-gray-300">📍 {location}</p>
                </div>
              )}

              {description && (
                <div className="bg-gray-800/30 backdrop-blur p-4 rounded-2xl mb-6 border border-gray-700/30">
                  <p className="text-gray-300 leading-relaxed">
                    {description}
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm p-5 rounded-2xl border border-blue-500/30">
                <h3 className="text-blue-300 font-semibold mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Reality Stats
                </h3>
                <div className="space-y-4">
                  {/* Acceptance Rate Progress Bar */}
                  <ProgressBar percentage={acceptanceRateNum} label="Acceptance Rate" />
                  
                  {/* Ghost Rate Color-Coded */}
                  <div className={`${ghostBgColor} p-3 rounded-xl border border-gray-600/30`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{isHighGhostRate ? '👻' : '✨'}</span>
                        <p className="text-gray-400 text-sm">Ghost Rate</p>
                      </div>
                      <p className={`text-2xl font-bold ${ghostColor}`}>
                        {ghostRateNum !== null ? `${ghostRateNum}%` : 'N/A'}
                      </p>
                    </div>
                    {isHighGhostRate && (
                      <p className="text-red-300 text-xs mt-2">⚠️ High ghosting rate - responses may be slow</p>
                    )}
                  </div>
                </div>
              </div>

              {requiredSkills && (
                <div className="bg-gray-800/30 backdrop-blur p-4 rounded-2xl border border-gray-700/30">
                  <p className="text-gray-400 text-sm mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {requiredSkills.split(',').slice(0, 6).map((skill, i) => (
                      <span key={i} className="bg-purple-600/30 text-purple-200 px-3 py-1 rounded-full text-sm border border-purple-500/30">
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const LoadingState = () => (
    <div className="flex items-center justify-center h-full">
      <div className="text-center bg-gray-800/50 backdrop-blur-xl p-12 rounded-3xl border border-purple-500/30">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="absolute inset-0 border-4 border-purple-500/30 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Loading Opportunities...</h2>
        <p className="text-gray-400">Fetching internships from Google Sheets</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="flex items-center justify-center h-full px-4">
      <div className="text-center bg-red-900/20 backdrop-blur-xl p-12 rounded-3xl border border-red-500/30 max-w-2xl">
        <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h2 className="text-3xl font-bold text-white mb-3">Failed to Load Data</h2>
        <p className="text-gray-300 mb-6">{error}</p>
        <div className="bg-gray-800/50 p-4 rounded-xl text-left mb-6">
          <p className="text-gray-400 text-sm mb-2">Troubleshooting Steps:</p>
          <ul className="text-gray-300 text-sm space-y-1 list-disc list-inside">
            <li>Check if your Google Sheet is published to the web</li>
            <li>Verify the sheet name is "internships" (case-sensitive)</li>
            <li>Make sure the sheet has data with headers</li>
            <li>Check browser console (F12) for detailed error logs</li>
          </ul>
        </div>
        <button
          onClick={fetchInternships}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
        >
          Retry Loading
        </button>
      </div>
    </div>
  );

  const DiscoverView = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState />;
    }

    if (currentIndex >= internships.length) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center bg-gray-800/50 backdrop-blur-xl p-12 rounded-3xl border border-purple-500/30 max-w-md">
            <Sparkles className="w-20 h-20 text-purple-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-3">No More Cards!</h2>
            <p className="text-gray-400 text-lg">Check your matches or refresh for more opportunities</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-full gap-8 px-4">
        <div className="relative w-full max-w-2xl" style={{ height: '600px' }}>
          {internships.slice(currentIndex, currentIndex + 3).map((internship, index) => (
            <div
              key={currentIndex + index}
              className="absolute inset-0"
              style={{
                zIndex: 3 - index,
                transform: `scale(${1 - index * 0.05}) translateY(${index * 20}px)`,
              }}
            >
              {index === 0 ? (
                <SwipeCard internship={internship} index={currentIndex + index} />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl rounded-3xl border border-purple-500/20 shadow-xl"></div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-6 items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick('left')}
            className="bg-gradient-to-br from-red-500 to-red-600 p-6 rounded-full shadow-2xl shadow-red-500/50 border-4 border-red-400/30 hover:shadow-red-500/70 transition-all"
          >
            <X className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => handleButtonClick('right')}
            className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-full shadow-2xl shadow-green-500/50 border-4 border-green-400/30 hover:shadow-green-500/70 transition-all"
          >
            <Heart className="w-10 h-10 text-white" strokeWidth={3} fill="white" />
          </motion.button>
        </div>
      </div>
    );
  };

  const MatchesView = () => (
    <div className="max-w-6xl mx-auto px-6 py-8 overflow-y-auto h-full">
      <h2 className="text-4xl font-bold text-white mb-8 flex items-center gap-3">
        <Heart className="text-green-400" fill="currentColor" />
        Your Matches ({matches.length})
      </h2>
      {matches.length === 0 ? (
        <div className="text-center py-20 bg-gray-800/30 backdrop-blur-xl rounded-3xl border border-gray-700/30">
          <Heart className="w-24 h-24 text-gray-600 mx-auto mb-6" />
          <p className="text-gray-400 text-xl">No matches yet. Start swiping!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((match, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl p-6 rounded-2xl border border-green-500/30 shadow-lg shadow-green-500/10 hover:shadow-green-500/30 transition-all hover:scale-105"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {match['Company Name'] || match['company']}
                  </h3>
                  <p className="text-purple-300 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {match['Role'] || match['role']}
                  </p>
                </div>
                <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30">
                  <span className="text-green-400 font-semibold text-sm">{calculateSkillMatch(match)}%</span>
                </div>
              </div>
              {(match['Location'] || match['location']) && (
                <p className="text-gray-400 text-sm mb-3">📍 {match['Location'] || match['location']}</p>
              )}
              <div className="flex gap-2 mt-4">
                <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                  Ghost: {match['Ghost Rate'] || match['ghost_rate'] || 'N/A'}
                </span>
                <span className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded-full">
                  Accept: {match['Acceptance Rate'] || match['acceptance_rate'] || 'N/A'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const ProfileView = () => (
    <div className="max-w-4xl mx-auto px-6 py-8 overflow-y-auto h-full">
      <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-xl rounded-3xl border border-purple-500/30 p-10 shadow-2xl">
        <div className="text-center mb-10">
          <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl shadow-purple-500/50">
            <User className="w-16 h-16 text-white" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-2">{userProfile.name}</h2>
          <p className="text-gray-400 text-lg">📍 {userProfile.location}</p>
        </div>

        <div className="mb-10">
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <Sparkles className="text-purple-400" />
            Your Skills
          </h3>
          <div className="flex flex-wrap gap-3">
            {userProfile.skills.map((skill, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-gradient-to-r from-purple-600/40 to-pink-600/40 text-white px-5 py-3 rounded-full border border-purple-500/50 shadow-lg text-lg font-medium"
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/30 text-center">
            <Users className="w-12 h-12 text-green-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{matches.length}</p>
            <p className="text-gray-400">Matches</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/30 text-center">
            <Briefcase className="w-12 h-12 text-purple-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{currentIndex}</p>
            <p className="text-gray-400">Reviewed</p>
          </div>
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700/30 text-center">
            <Sparkles className="w-12 h-12 text-pink-400 mx-auto mb-3" />
            <p className="text-4xl font-bold text-white mb-1">{internships.length}</p>
            <p className="text-gray-400">Available</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-950 flex flex-col overflow-hidden">
      <header className="bg-gray-900/50 backdrop-blur-xl border-b border-purple-500/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center gap-3">
            <Sparkles className="text-purple-400" />
            MatchLink
          </h1>

          <nav className="hidden md:flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('discover')}
              className={`px-6 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'discover'
                  ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50 shadow-lg shadow-purple-500/20'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              Discover
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('matches')}
              className={`px-6 py-3 rounded-xl transition-all font-medium relative ${
                activeTab === 'matches'
                  ? 'bg-green-600/30 text-green-300 border border-green-500/50 shadow-lg shadow-green-500/20'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              Matches
              {matches.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {matches.length}
                </span>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 rounded-xl transition-all font-medium ${
                activeTab === 'profile'
                  ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50 shadow-lg shadow-pink-500/20'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/30'
              }`}
            >
              Profile
            </motion.button>
          </nav>
        </div>
      </header>

      <main className="flex-1 overflow-hidden">
        {activeTab === 'discover' && <DiscoverView />}
        {activeTab === 'matches' && <MatchesView />}
        {activeTab === 'profile' && <ProfileView />}
      </main>

      <div className="md:hidden bg-gray-900/70 backdrop-blur-xl border-t border-purple-500/20 px-6 py-4 shadow-2xl">
        <div className="flex justify-around items-center">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('discover')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              activeTab === 'discover'
                ? 'bg-purple-600/30 text-purple-300 border border-purple-500/50'
                : 'text-gray-500'
            }`}
          >
            <Sparkles className="w-6 h-6" />
            <span className="text-xs font-medium">Discover</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('matches')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all relative ${
              activeTab === 'matches'
                ? 'bg-green-600/30 text-green-300 border border-green-500/50'
                : 'text-gray-500'
            }`}
          >
            <Heart className="w-6 h-6" />
            <span className="text-xs font-medium">Matches</span>
            {matches.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {matches.length}
              </span>
            )}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-2xl transition-all ${
              activeTab === 'profile'
                ? 'bg-pink-600/30 text-pink-300 border border-pink-500/50'
                : 'text-gray-500'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs font-medium">Profile</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default App;
