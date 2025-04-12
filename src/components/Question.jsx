import React from 'react';

const Question = ({ question, index, answered, handleOptionClick }) => {
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
            onClick={() => handleOptionClick(i, index)}
          >
            {option}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Question;