import React from 'react';
import { LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl hover:shadow-xl
    transform hover:scale-105 transition-all duration-300">
    <div className="text-purple-600 dark:text-purple-400 mb-4">
      <Icon className="w-8 h-8" />
    </div>
    <h3 className="text-gray-800 dark:text-white text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </div>
);

export default FeatureCard;