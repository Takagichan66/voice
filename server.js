const express = require('express');
const fs = require('fs');
const cors = require('cors');  // Thêm dòng này
const app = express();
const port = 3000;

// Middleware để xử lý JSON và CORS
app.use(express.json());
app.use(cors());  // Thêm dòng này để cho phép CORS

// Route để xử lý yêu cầu POST từ client
app.post('/process-text', (req, res) => {
    const userInput = req.body.text.toLowerCase();

    // Đọc dữ liệu từ file JSON
    fs.readFile('data.json', 'utf8', (err, data) => {
        if (err) {
            console.error('Lỗi đọc file:', err);
            return res.status(500).send('Lỗi máy chủ');
        }

        const responses = JSON.parse(data);
        let response = "Xin lỗi, tôi không hiểu yêu cầu của bạn.";

        // Duyệt qua các từ khóa trong JSON để tìm câu trả lời phù hợp
        for (let entry of responses) {
            for (let keyword of entry.keywords) {
                if (userInput.includes(keyword)) {
                    response = entry.response;
                    break;
                }
            }
        }

        res.json({ response });
    });
});

app.listen(port, () => {
    console.log(`Server đang chạy tại http://localhost:3000`);
});
