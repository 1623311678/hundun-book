const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// 设置静态文件目录
app.use(express.static(path.join(__dirname, '../')));

// 处理所有其他请求，返回 index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// 启动服务器
app.listen(PORT, () => {
    console.log(
`服务器正在运行在 http://localhost:${PORT}`);
});