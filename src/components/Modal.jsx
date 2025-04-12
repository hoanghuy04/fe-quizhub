import React from 'react';
import { Modal as AntModal, Button } from 'antd';

const Modal = ({ show, closeModal, submitQuiz, answeredCount, totalQuestions }) => {
  return (
    <AntModal
      title="Xác nhận nộp bài"
      visible={show}
      onCancel={closeModal}
      footer={[
        <Button key="continue" onClick={closeModal}>
          Tiếp tục làm bài
        </Button>,
        <Button key="submit" type="primary" onClick={submitQuiz}>
          Nộp bài
        </Button>,
      ]}
    >
      <p>Bạn đã làm {answeredCount}/{totalQuestions} câu</p>
      <p>Bạn có chắc chắn muốn nộp bài?</p>
    </AntModal>
  );
};

export default Modal;