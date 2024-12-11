import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TextService from '../services/TextService';

const TypingTest = () => {
  const navigate = useNavigate();
  const [practiceText, setPracticeText] = useState({ category: '', text: '' });
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const textService = TextService.getInstance();
    setPracticeText(textService.getRandomText());
  }, []);

  const calculateWPM = useCallback(() => {
    const words = input.trim().split(/\s+/).length;
    const minutes = (Date.now() - startTime) / 1000 / 60;
    return Math.round(words / minutes);
  }, [input, startTime]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!started) setStarted(true);
    const newInput = e.target.value;
    setInput(newInput);
    
    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== practiceText.text[i]) errorCount++;
    }
    setErrors(errorCount);
    
    // Update WPM
    setWpm(calculateWPM());
  };

  const handleDone = () => {
    navigate('/results', {
      state: {
        wpm: calculateWPM(),
        errors,
        accuracy: ((input.length - errors) / input.length) * 100,
        category: practiceText.category
      }
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 py-12 px-4 flex items-center justify-center">
      <div className="max-w-4xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 transition-all duration-300 transform hover:scale-105">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="text-xl font-bold text-gray-800 dark:text-white">WPM: {wpm}</div>
            <div className="text-sm text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-3 py-1 rounded-full">
              {practiceText.category}
            </div>
          </div>
          <button
            onClick={handleDone}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
            disabled={!started || input.length === 0}
          >
            Done
          </button>
        </div>

        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-lg leading-relaxed shadow-inner">
          {practiceText.text.split('').map((char, index) => {
            let color = 'text-gray-600 dark:text-gray-400';
            if (index < input.length) {
              color = input[index] === char 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400';
            }
            return <span key={index} className={color}>{char}</span>;
          })}
        </div>

        <textarea
          className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg 
            focus:border-purple-500 focus:ring-2 focus:ring-purple-200 text-lg
            dark:bg-gray-700 dark:text-white shadow-md transition-all duration-300"
          rows={5}
          value={input}
          onChange={handleInput}
          placeholder="Start typing..."
          onPaste={(e) => e.preventDefault()}
        />
      </div>
    </div>
  );
};

export default TypingTest;
