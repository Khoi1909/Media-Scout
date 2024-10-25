const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware để xử lý dữ liệu từ form
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Đường dẫn tới file chứa thông tin người dùng (cơ bản)
const usersFile = path.join('C:', 'Users', '84329', 'OneDrive', 'Documents', 'Media', 'user.json');

// Cấu hình CORS để frontend có thể giao tiếp với server
app.use(cors({
    origin: 'http://127.0.0.1:5500', // Hoặc địa chỉ frontend của bạn
    credentials: true
}));

// Tạo API cho trang đăng ký
app.post('/Signup', (req, res) => {
    const { username, email, password } = req.body;
    console.log(`Username: ${username}, Email: ${email}, Password: ${password}`);

    if (!username || !email || !password) {
        return res.status(400).send('Vui lòng điền đầy đủ thông tin.');
    }

    fs.readFile(usersFile, (err, data) => {
        if (err) {
            console.error('Error reading user file:', err);
            return res.status(500).send('Lỗi khi đọc dữ liệu người dùng.');
        }

        let users = [];
        if (data.length) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                return res.status(500).send('Lỗi khi phân tích dữ liệu người dùng.');
            }
        }

        const userExists = users.some(user => user.email === email);
        if (userExists) {
            return res.status(400).send('Email này đã được sử dụng.');
        }

        const newUser = { username, email, password };
        users.push(newUser);

        fs.writeFile(usersFile, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Lỗi khi lưu thông tin người dùng.');
            }
            res.status(200).send('Đăng ký thành công!');
        });
    });
});

// Tạo API cho trang đăng nhập
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Email: ${email}, Password: ${password}`);

    // Kiểm tra dữ liệu đầu vào
    if (!email || !password) {
        return res.status(400).send('Vui lòng điền đầy đủ thông tin.');
    }

    fs.readFile(usersFile, (err, data) => {
        if (err) {
            console.error('Error reading user file:', err);
            return res.status(500).send('Lỗi khi đọc dữ liệu người dùng.');
        }

        let users = [];
        if (data.length) {
            try {
                users = JSON.parse(data);
            } catch (parseError) {
                console.error('Error parsing user data:', parseError);
                return res.status(500).send('Lỗi khi phân tích dữ liệu người dùng.');
            }
        }

        // Kiểm tra xem người dùng có tồn tại không và mật khẩu có đúng không
        const user = users.find(user => user.email === email && user.password === password);
        if (!user) {
            return res.status(400).send('Đăng nhập thất bại.');
        }

        // Đăng nhập thành công
        res.status(200).send('Đăng nhập thành công!');
    });
});

// Đường dẫn cho file giao diện HTML và các file tĩnh
app.use(express.static(__dirname));

// Khởi động server
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
