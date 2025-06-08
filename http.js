var express = require('express');
var serveStatic = require('serve-static');

var staticBasePath = './';

var app = express();

// 添加响应头中间件（放在所有中间件之前）
app.use((req, res, next) => {
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

// 提供静态文件服务
app.use(serveStatic(staticBasePath));

app.listen(8080, () => {
  console.log('Listening on port 8080');
});