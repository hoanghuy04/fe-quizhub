import React from 'react';
import { Button } from 'antd';

const Results = ({ score, total, restartQuiz, retryIncorrect, isRetryMode }) => {
    return (
        <div className="text-center mt-6">
            <h2 className="text-lg font-bold">Kết quả bài kiểm tra</h2>
            <p className="text-base mb-4">
                Bạn đã trả lời đúng {score}/{total} câu ({((score / total) * 100).toFixed(2)}%).
            </p>
            <div className="flex flex-wrap justify-center gap-2">
                <Button
                    type="primary"
                    onClick={restartQuiz}
                    className="min-w-[120px] h-10"
                >
                    Làm lại toàn bộ
                </Button>
                {!isRetryMode && (
                    <Button
                        type="default"
                        onClick={retryIncorrect}
                        className="min-w-[120px] h-10"
                    >
                        Làm lại câu sai
                    </Button>
                )}
            </div>
        </div>
    );
};

export default Results;