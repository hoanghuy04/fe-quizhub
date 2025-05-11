import React, { useState } from 'react';

const Question = ({ question, index, answered, handleOptionClick }) => {
  const [selected, setSelected] = useState(null);

  const handleClick = (optionIndex) => {
    if (!answered[index]) {
      setSelected(optionIndex);
      handleOptionClick(optionIndex, index);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
      <div className="space-y-2">
        {question.options.map((option, i) => (
          <div
            key={i}
            className={`p-3 border rounded-lg cursor-pointer transition-colors 
              ${answered[index] && i === question.correct ? 'bg-green-100' : ''}
              ${answered[index] && i !== question.correct && answered[index].selected === i ? 'bg-red-100' : ''}
              hover:bg-gray-100`}
            onClick={() => handleClick(i)}
          >
            {option}
          </div>
        ))}
      </div>
      {answered[index] && question.location && (
        <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
          <strong>Nguồn:</strong> {question.location}
        </div>
      )}
    </div>
  );
};

export default Question;