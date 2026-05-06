import React from "react";

function SearchForm({ studentId, setStudentId, handleSearch }) {
  return (
    <div className="search-form">
      <input
        type="text"
        placeholder="Nhập MSSV..."
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={handleSearch}>Tra cứu</button>
    </div>
  );
}

export default SearchForm;