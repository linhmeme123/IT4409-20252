import React from "react";

function Results({ results }) {
  return (
    <div className="result-box">
      <div className="student-info">
        <h2>Thông tin sinh viên</h2>
        <p>
          <strong>MSSV:</strong> {results.student.mssv}
        </p>
        <p>
          <strong>Họ tên:</strong> {results.student.name}
        </p>
      </div>

      <h2>Kết quả học tập</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Midterm</th>
            <th>Fullterm</th>
            <th>Semester</th>
          </tr>
        </thead>
        <tbody>
          {results.subjects.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.midterm}</td>
              <td>{item.fullterm}</td>
              <td>{item.semester}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Results;