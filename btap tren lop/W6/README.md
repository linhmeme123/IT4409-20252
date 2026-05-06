# Ứng dụng tra cứu thông tin sinh viên (React)

Ứng dụng được xây dựng bằng React để tra cứu thông tin sinh viên theo MSSV.

- App là component chính, quản lý toàn bộ state của ứng dụng.
- Sử dụng useState để quản lý studentId, results, isLoading và error.
- SearchForm là component dùng để nhập MSSV và thực hiện tìm kiếm.
- Results là component hiển thị thông tin sinh viên và bảng kết quả học tập.
- useEffect được kích hoạt khi người dùng bấm nút "Tra cứu" (khi searchId thay đổi).
- Dữ liệu được mô phỏng lấy từ 2 file JSON bằng setTimeout (giả lập gọi API).
- Nếu tìm thấy dữ liệu, ứng dụng hiển thị kết quả; ngược lại sẽ hiển thị thông báo lỗi.