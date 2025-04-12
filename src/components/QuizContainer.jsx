// const response = await fetch('http://localhost:3000/chuong123-lms');
// const response = await fetch('http://localhost:3000/chuong-3-file1');
// const response = await fetch('http://192.168.100.2:3000/chuong-3-file1');
// const response = await fetch('http://localhost:3000/chuong-3-file2');
// const response = await fetch('http://localhost:3000/chuong-4-file1');
// const response = await fetch('http://localhost:3000/chuon-4-file2');

import React, { useState, useEffect } from 'react';
import { Pagination, Button } from 'antd';
import Question from './Question';
import Modal from './Modal';
import Results from './Results';

const QuizContainer = () => {
  const [shuffledQuizData, setShuffledQuizData] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState([]);
  const [answerStatus, setAnswerStatus] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showQuestionList, setShowQuestionList] = useState(false); // Toggle question list on mobile
  const questionsPerPage = 50;

  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://192.168.100.2:3000/chuong-3-file1');
      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu câu hỏi');
      }
      const data = await response.json();
      const shuffled = shuffleArray(data);
      setShuffledQuizData(shuffled);
      setAnswered(new Array(shuffled.length).fill(false));
      setAnswerStatus(new Array(shuffled.length).fill(null));
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const initQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setCurrentPage(1);
    fetchQuestions();
  };

  useEffect(() => {
    initQuiz();
  }, []);

  const handleOptionClick = (optionIndex, questionIndex) => {
    if (answered[questionIndex]) return;
    const newAnswered = [...answered];
    newAnswered[questionIndex] = true;
    setAnswered(newAnswered);
    const newAnswerStatus = [...answerStatus];
    const isCorrect = optionIndex === shuffledQuizData[questionIndex].correct;
    newAnswerStatus[questionIndex] = isCorrect ? 'correct' : 'wrong';
    setAnswerStatus(newAnswerStatus);
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    const page = Math.ceil((index + 1) / questionsPerPage);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
    setShowQuestionList(false); // Hide question list after selection on mobile
  };

  const handleNext = () => {
    if (currentQuestionIndex < shuffledQuizData.length - 1) {
      const newIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(newIndex);
      const page = Math.ceil((newIndex + 1) / questionsPerPage);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      const newIndex = currentQuestionIndex - 1;
      setCurrentQuestionIndex(newIndex);
      const page = Math.ceil((newIndex + 1) / questionsPerPage);
      if (page !== currentPage) {
        setCurrentPage(page);
      }
    }
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitQuiz = () => {
    setShowModal(false);
    setShowResults(true);
  };

  const handleRestartQuiz = () => {
    initQuiz();
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    const firstQuestionOfPage = (page - 1) * questionsPerPage;
    if (currentQuestionIndex < firstQuestionOfPage || currentQuestionIndex >= page * questionsPerPage) {
      setCurrentQuestionIndex(firstQuestionOfPage);
    }
  };

  const toggleQuestionList = () => {
    setShowQuestionList(!showQuestionList);
  };

  const answeredCount = answered.filter(Boolean).length;
  const progressPercentage = shuffledQuizData.length
    ? ((currentQuestionIndex + 1) / shuffledQuizData.length) * 100
    : 0;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = shuffledQuizData.slice(indexOfFirstQuestion, indexOfLastQuestion);

  if (loading) {
    return <div className="text-center p-4">Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4 bg-gray-100 min-h-screen">
      <div className="flex flex-col gap-4">
        {/* Toggle button for question list on mobile */}
        <div className="md:hidden">
          <Button
            type="primary"
            onClick={toggleQuestionList}
            className="w-full"
          >
            {showQuestionList ? 'Ẩn danh sách câu hỏi' : 'Hiện danh sách câu hỏi'}
          </Button>
        </div>

        {/* Question list (hidden by default on mobile) */}
        <div
          className={`w-full bg-white p-4 rounded-lg shadow-lg ${showQuestionList ? 'block' : 'hidden'
            } md:block md:w-1/4`}
        >
          <h2 className="text-base font-bold mb-3">Danh sách câu hỏi</h2>
          <div className="grid grid-cols-5 gap-1">
            {currentQuestions.map((_, index) => {
              const globalIndex = indexOfFirstQuestion + index;
              return (
                <div
                  key={globalIndex}
                  className={`p-1 text-center rounded-lg cursor-pointer text-sm 
                    ${currentQuestionIndex === globalIndex ? 'border-2 border-blue-500' : ''} 
                    ${answerStatus[globalIndex] === 'correct' ? 'bg-green-200' : ''} 
                    ${answerStatus[globalIndex] === 'wrong' ? 'bg-red-200' : ''} 
                    ${!answered[globalIndex] ? 'bg-gray-200' : ''}`}
                  onClick={() => handleQuestionSelect(globalIndex)}
                >
                  {globalIndex + 1}
                </div>
              );
            })}
          </div>
          <div className="mt-3">
            <Pagination
              current={currentPage}
              pageSize={questionsPerPage}
              total={shuffledQuizData.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="text-sm"
            />
          </div>
        </div>

        {/* Question content */}
        <div className="w-full bg-white p-4 rounded-lg shadow-lg">
          <h1 className="text-xl font-bold mb-3 text-center">
            Trắc nghiệm Tư tưởng Hồ Chí Minh
          </h1>
          <div className="mb-3 text-sm">
            Đã làm: {answeredCount}/{shuffledQuizData.length} câu
          </div>
          <div className="w-full h-4 bg-gray-200 rounded-full mb-3">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          {shuffledQuizData.length > 0 && (
            <Question
              question={shuffledQuizData[currentQuestionIndex]}
              index={currentQuestionIndex}
              answered={answered}
              handleOptionClick={handleOptionClick}
            />
          )}
          <div className="flex flex-wrap justify-between mt-4 gap-2">
            <Button
              disabled={currentQuestionIndex === 0}
              onClick={handlePrev}
              className="flex-1 min-w-[100px] h-10"
            >
              Câu trước
            </Button>
            <Button
              disabled={currentQuestionIndex === shuffledQuizData.length - 1}
              onClick={handleNext}
              className="flex-1 min-w-[100px] h-10"
            >
              Câu tiếp
            </Button>
            <Button
              type="primary"
              onClick={handleShowModal}
              className="flex-1 min-w-[100px] h-10"
            >
              Nộp bài
            </Button>
          </div>
          {showResults && (
            <Results
              score={score}
              total={shuffledQuizData.length}
              restartQuiz={handleRestartQuiz}
            />
          )}
        </div>
      </div>
      <Modal
        show={showModal}
        closeModal={handleCloseModal}
        submitQuiz={handleSubmitQuiz}
        answeredCount={answeredCount}
        totalQuestions={shuffledQuizData.length}
      />
    </div>
  );
};

export default QuizContainer;