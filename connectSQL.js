const mysql = require('mysql2');

// Tạo kết nối tới MySQL
const connection = mysql.createConnection({
    host: 'localhost',    // Địa chỉ server MySQL (thường là localhost)
    user: 'root',         // Tên người dùng MySQL
    password: 'your-password', // Mật khẩu của bạn
    database: 'your-database'  // Tên database
});

// Kết nối tới MySQL
connection.connect((err) => {
    if (err) {
        console.error('Lỗi kết nối tới MySQL:', err);
        return;
    }
    console.log('Kết nối tới MySQL thành công!');
});
