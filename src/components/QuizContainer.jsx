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
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại của danh sách câu hỏi
  const questionsPerPage = 50; // Số câu hỏi mỗi trang

  // Hàm xáo trộn mảng
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // Lấy dữ liệu từ json-server
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      // const response = await fetch('http://localhost:3000/chuong123-lms');
      const response = await fetch('http://localhost:3000/chuong-3-file1');
      // const response = await fetch('http://localhost:3000/chuong-3-file2');
      // const response = await fetch('http://localhost:3000/chuong-4-file1');
      // const response = await fetch('http://localhost:3000/chuon-4-file2');
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

  // Khởi tạo bài kiểm tra
  const initQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setShowResults(false);
    setCurrentPage(1); // Reset về trang đầu
    fetchQuestions();
  };

  useEffect(() => {
    initQuiz();
  }, []);

  // Xử lý chọn đáp án
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

  // Chuyển đến câu hỏi khi nhấp vào danh sách
  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    // Tự động chuyển trang nếu câu hỏi nằm ngoài trang hiện tại
    const page = Math.ceil((index + 1) / questionsPerPage);
    if (page !== currentPage) {
      setCurrentPage(page);
    }
  };

  // Tiến câu hỏi
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

  // Lùi câu hỏi
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

  // Hiển thị modal nộp bài
  const handleShowModal = () => {
    setShowModal(true);
  };

  // Đóng modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Nộp bài
  const handleSubmitQuiz = () => {
    setShowModal(false);
    setShowResults(true);
  };

  // Làm lại bài kiểm tra
  const handleRestartQuiz = () => {
    initQuiz();
  };

  // Xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Nếu câu hỏi hiện tại không nằm trong trang mới, chuyển đến câu đầu tiên của trang
    const firstQuestionOfPage = (page - 1) * questionsPerPage;
    if (currentQuestionIndex < firstQuestionOfPage || currentQuestionIndex >= page * questionsPerPage) {
      setCurrentQuestionIndex(firstQuestionOfPage);
    }
  };

  // Tính số câu đã trả lời
  const answeredCount = answered.filter(Boolean).length;

  // Tính tiến độ thanh progress
  const progressPercentage = shuffledQuizData.length
    ? ((currentQuestionIndex + 1) / shuffledQuizData.length) * 100
    : 0;

  // Lấy danh sách câu hỏi cho trang hiện tại
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = shuffledQuizData.slice(indexOfFirstQuestion, indexOfLastQuestion);

  if (loading) {
    return <div className="text-center p-6">Đang tải câu hỏi...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Danh sách câu hỏi bên trái */}
        <div className="w-full md:w-1/4 bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-bold mb-4">Danh sách câu hỏi</h2>
          <div className="grid grid-cols-5 gap-2">
            {currentQuestions.map((_, index) => {
              const globalIndex = indexOfFirstQuestion + index;
              return (
                <div
                  key={globalIndex}
                  className={`p-2 text-center rounded-lg cursor-pointer 
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
          <div className="mt-4">
            <Pagination
              current={currentPage}
              pageSize={questionsPerPage}
              total={shuffledQuizData.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>

        {/* Nội dung câu hỏi bên phải */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold mb-4 text-center">Trắc nghiệm Tư tưởng Hồ Chí Minh</h1>
          <div className="mb-4">
            Đã làm: {answeredCount}/{shuffledQuizData.length} câu
          </div>
          <div className="w-full h-5 bg-gray-200 rounded-full mb-4">
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
          <div className="flex justify-between mt-6">
            <Button
              disabled={currentQuestionIndex === 0}
              onClick={handlePrev}
            >
              Câu trước
            </Button>
            <Button
              disabled={currentQuestionIndex === shuffledQuizData.length - 1}
              onClick={handleNext}
            >
              Câu tiếp
            </Button>
            <Button type="primary" onClick={handleShowModal}>
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