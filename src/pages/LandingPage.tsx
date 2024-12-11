import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Clock, Trophy, Sparkles, Github} from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const features = [

  {
    icon: Activity,
    title: "Real-time Analysis",
    description: "Track your WPM and accuracy as you type"
  },
  {
    icon: Clock,
    title: "Instant Results",
    description: "Get immediate feedback on your typing performance"
  },
  {
    icon: Trophy,
    title: "Detailed Insights",
    description: "Comprehensive performance analytics and statistics"
  }
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6 ">
            <div className="relative">
              <Sparkles className="w-12 h-12 lg:w-16 lg:h-16  text-purple-600 dark:text-purple-400" />
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold ml-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
              TypeMaster
            </h1>
          </div>
          <p className="text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Master the art of typing with real-time analytics and personalized insights
          </p>
          <div className="flex items-center justify-center gap-8 flex-col sm:flex-row">
            <button
              onClick={() => navigate('/practice')}
              className="bg-purple-600 dark:bg-purple-500 text-white px-8 py-3 rounded-lg 
                font-semibold text-lg hover:bg-purple-700 dark:hover:bg-purple-600 
                transition-all transform hover:scale-105 hover:shadow-lg"
            >
              Start Typing Test
            </button>
            <button
              onClick={() => window.open('https://github.com/itsrajcode/TypeMaster', '_blank')}
              className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 
                px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-200 
                dark:hover:bg-gray-700 transition-all flex gap-2"
            >
              <Github className="w-6 h-6" />
              Github
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16 max-w-4xl mx-auto">
          {[
            { label: 'Active Users', value: '10K+' },
            { label: 'Tests Completed', value: '1M+' },
            { label: 'Avg. WPM Improvement', value: '40%' },
            { label: 'Practice Texts', value: '100+' },
          ].map((stat, index) => (
            <div key={index} className="text-center p-6 rounded-xl bg-gray-50 dark:bg-gray-800">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-16">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gray-50 dark:bg-gray-800">
          <h2 className="text-3xl font-bold mb-4 text-gray-800 dark:text-white">
            Ready to improve your typing skills?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Join thousands of users who have enhanced their typing speed and accuracy
          </p>
          <button
            onClick={() => navigate('/practice')}
            className="bg-purple-600 dark:bg-purple-500 text-white px-8 py-3 rounded-lg 
              font-semibold text-lg hover:bg-purple-700 dark:hover:bg-purple-600 
              transition-all transform hover:scale-105 hover:shadow-lg"
          >
            Get Started Now
          </button>
        </div>
      </div>
      <footer className='text-center text-gray-600 dark:text-gray-300 p-12'>
        <p className='text-sm font-semibold font-serif mb-1'>&copy; 2024 TypeMaster. All rights reserved.</p>
        <p className='font-bold font-mono'>Build with ❤️ by <a href="https://github.com/itsrajcode">Raj</a></p>
      </footer>
    </div>
  );
};

export default LandingPage;