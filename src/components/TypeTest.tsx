import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface TypeTestProps {
  text: string;
}

const TypeTest: React.FC<TypeTestProps> = ({ text }) => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [wpm, setWpm] = useState(0);
  const [errors, setErrors] = useState(0);

  const calculateWPM = useCallback(() => {
    const words = input.trim().split(/\s+/).length;
    const minutes = input.length / 5 / 60; // Assuming average word length of 5 characters
    return Math.round(words / minutes);
  }, [input]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    
    // Calculate errors
    let errorCount = 0;
    for (let i = 0; i < newInput.length; i++) {
      if (newInput[i] !== text[i]) errorCount++;
    }
    setErrors(errorCount);
    setWpm(calculateWPM());

    // Check if test is complete
    if (newInput.length >= text.length) {
      navigate('/results', {
        state: {
          wpm: calculateWPM(),
          errors: errorCount,
          accuracy: ((newInput.length - errorCount) / newInput.length) * 100
        }
      });
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
      <div className="flex justify-between items-center mb-8">
        <div className="text-xl dark:text-white">WPM: {wpm}</div>
        <div className="text-xl dark:text-white">Errors: {errors}</div>
      </div>

      <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg text-lg leading-relaxed">
        {text.split('').map((char, index) => {
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
          dark:bg-gray-700 dark:text-white"
        rows={5}
        value={input}
        onChange={handleInput}
        placeholder="Start typing..."
      />
    </div>
  );
};