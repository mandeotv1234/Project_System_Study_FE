import React from "react";

const LectureDetail = () => {
  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Chi tiết bài giảng</h1>
      <p>Mô tả bài giảng: Đây là bài giảng về chủ đề ABC.</p>
      <div className="video-container">
        <video width="100%" controls>
          <source src="https://www.example.com/sample-video.mp4" type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
      </div>
    </div>
  );
};

export default LectureDetail;