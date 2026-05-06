const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Kết nối MongoDB
mongoose
  .connect(
    "mongodb+srv://20235135:Linh166105%40@cluster0.kidttnz.mongodb.net/it4409-db?appName=Cluster0"
  )
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(3001, () => {
      console.log("API running on port 3001");
    });
  })
  .catch((err) => {
    console.error("Connection Error:", err);
    process.exit(1);
  });

// Tạo schema User
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
  },
  {
    collection: "users-linhmeme",
  }
);

const User = mongoose.model("User", userSchema);

// API 1: CREATE - Thêm người dùng
app.post("/api/users", async (req, res) => {
  try {
    const newUser = await User.create(req.body);

    res.status(201).json({
      message: "Tạo người dùng thành công",
      data: newUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Tạo người dùng thất bại",
      error: err.message,
    });
  }
});

// API 2: READ - Lấy danh sách người dùng
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      message: "Lấy danh sách người dùng thành công",
      data: users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Lỗi server",
      error: err.message,
    });
  }
});

// API 3: UPDATE - Cập nhật người dùng theo id
app.put("/api/users/:id", async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    res.status(200).json({
      message: "Cập nhật người dùng thành công",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Cập nhật người dùng thất bại",
      error: err.message,
    });
  }
});

// API 4: DELETE - Xóa người dùng theo id
app.delete("/api/users/:id", async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng",
      });
    }

    res.status(200).json({
      message: "Xóa người dùng thành công",
      data: deletedUser,
    });
  } catch (err) {
    res.status(400).json({
      message: "Xóa người dùng thất bại",
      error: err.message,
    });
  }
});
