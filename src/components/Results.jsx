import React from 'react';
import { Button } from 'antd';

const Results = ({ score, total, restartQuiz }) => {
    const percentage = Math.round((score / total) * 100);

    return (
        <div className="mt-6 p-4 bg-blue-100 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Kết quả</h2>
            <p>Số câu đúng: {score}/{total}</p>
            <p>Tỷ lệ đúng: {percentage}%</p>
            <Button type="primary" className="mt-4" onClick={restartQuiz}>
                Làm lại
            </Button>
        </div>
    );
};

export default Results;