import React, { useEffect, useState } from "react";
import "./App.css";
import SearchForm from "./SearchForm";
import Results from "./Results";
import studentsData from "./data/students.json";
import resultsData from "./data/results.json";

function App() {
  const [studentId, setStudentId] = useState("");
  const [searchId, setSearchId] = useState("");
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = () => {
    if (studentId.trim() === "") {
      setError("Vui lòng nhập mã số sinh viên.");
      setResults(null);
      return;
    }

    setSearchId(studentId.trim().toUpperCase());
  };

  useEffect(() => {
    if (searchId === "") return;

    setIsLoading(true);
    setError("");
    setResults(null);

    const timer = setTimeout(() => {
      const foundStudent = studentsData.find(
        (item) => item.mssv.toUpperCase() === searchId
      );

      const foundResult = resultsData.find(
        (item) => item.mssv.toUpperCase() === searchId
      );

      if (foundStudent && foundResult) {
        setResults({
          student: foundStudent,
          subjects: foundResult.scores,
        });
      } else {
        setError("Không tìm thấy sinh viên hoặc chưa có dữ liệu điểm.");
      }

      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [searchId]);

  return (
    <div className="app">
      <h1 className="title">Tra cứu thông tin sinh viên</h1>

      <SearchForm
        studentId={studentId}
        setStudentId={setStudentId}
        handleSearch={handleSearch}
      />

      {isLoading && <p className="loading">Đang tải...</p>}

      {error && <p className="error">{error}</p>}

      {!isLoading && !error && results && <Results results={results} />}
    </div>
  );
}

export default App;