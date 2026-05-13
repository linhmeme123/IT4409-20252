const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    const PORT = process.env.PORT || 3001;

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Connection Error:", err);
    process.exit(1);
  });

const userSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        required: [true, "Tên không được để trống"],
        minlength: [2, "Tên phải có ít nhất 2 ký tự"],
      },
      age: {
        type: Number,
        required: [true, "Tuổi không được để trống"],
        min: [0, "Tuổi phải lớn hơn hoặc bằng 0"],
      },
      email: {
        type: String,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
        required: [true, "Email không được để trống"],
      },
      address: {
        type: String,
        required: false,
      }
    },
    {
      collection: "users-linhmeme",
    }
  );

// TODO: tạo model User
    const User = mongoose.model("User", userSchema);

// GET /api/users?page=1&limit=5&search=abc
// Cần:
// - page mặc định 1
// - limit mặc định 5
// - giới hạn limit hợp lý, ví dụ tối đa 50
// - search theo name, email, address bằng regex i
// - trả về page, limit, total, totalPages, data
app.get("/api/users", async (req, res) => {
  try {
    let { page = 1, limit = 5, search = "" } = req.query;
    page = Math.max(parseInt(page, 10) || 1, 1);
    limit = Math.min(Math.max(parseInt(limit, 10) || 5, 1), 50);
    search = String(search).trim();

    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { address: { $regex: search, $options: "i" } },
      ],
    };

    const total = await User.countDocuments(query);
    const totalPages = Math.ceil(total / limit);
    const data = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ page, limit, total, totalPages, data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// POST /api/users
// Cần:
// - trim name, email, address
// - ép age về Number
// - validate bằng Mongoose
// - trả status 201 nếu thành công
app.post("/api/users", async (req, res) => {
  try {
    const { name = "", age, email = "", address = "" } = req.body;

    const newUser = new User({
      name: String(name).trim(),
      age: Number(age),
      email: String(email).trim(),
      address: address ? String(address).trim() : undefined,
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// PUT /api/users/:id
// Cần:
// - kiểm tra id hợp lệ bằng mongoose.Types.ObjectId.isValid(id)
// - chỉ cập nhật các field được gửi lên
// - dùng { new: true, runValidators: true }
app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const updateData = {};
    const allowedFields = ["name", "age", "email", "address"];
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] =
          typeof req.body[field] === "string"
            ? req.body[field].trim()
            : req.body[field];
      }
    }

    if (updateData.age !== undefined) {
      updateData.age = Number(updateData.age);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    if (err.name === "ValidationError") {
      res.status(400).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Server error" });
    }
  }
});

// DELETE /api/users/:id
// Cần:
// - kiểm tra id hợp lệ
// - findByIdAndDelete
// - nếu không thấy thì trả 404
app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "ID không hợp lệ" });
    }

    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }

    res.json({ message: "Xóa người dùng thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use(express.static(path.join(__dirname, "../frontend")));
