const fs = require('fs');

// 响应普通请求
const setResponse = (req, res, {
  header = {
    'Content-Type': 'text/plain'
  },
  data = {
    code: '1',
    url: req.url,
  }
} = {}) => {
  // 设置响应头
  res.writeHead(200, header);
  // 响应数据
  if (header['Content-Type'] === 'text/plain') {
    res.end(JSON.stringify(data));
  } else {
    res.end(data);
  }
}

// 响应静态文件请求
const staticSource = (res, filename) => {
  fs.readFile(filename, 'binary', function (err, fileContent) {
    if (err) { //文件名不存在
      console.log('404')
      res.writeHead(404, 'not Found')
      res.end('<h1>Not Found!</h1>')
    } else { //文件名存在
      console.log('okay')
      res.writeHead(200, 'okay')
      res.write(fileContent, 'binary')
      res.end()
    }
  })
}

// 接收文件
const receiveFile = (req, res) => {
  let chunks = [];
  let size = 0;
  req.on('data', chunk => {
    chunks.push(chunk);
    size += chunk.length;
  })

  req.on('end', () => {
    let buffer = Buffer.concat(chunks, size);

    let rems = [];

    // //根据\r\n分离数据和报头
    for (let i = 0; i < buffer.length; i++) {
      let v = buffer[i];
      let v2 = buffer[i + 1];
      if (v == 13 && v2 == 10) {
        rems.push(i);
      }
    }

    //图片信息
    var picmsg_1 = buffer.slice(rems[0] + 2, rems[1]).toString();
    var filename = picmsg_1.match(/filename=".*"/g)[0].split('"')[1];

    //图片数据
    var nbuf = buffer.slice(rems[3] + 2, rems[rems.length - 2]);

    var path = './' + filename;
    fs.writeFileSync(path, nbuf);
    console.log("保存" + filename + "成功");

    res.writeHead(200, {
      'Content-Type': 'text/html;charset=utf-8'
    });
    res.end('<div id="path">' + path + '</div>');
  })
}

module.exports = {
  setResponse,
  staticSource,
  receiveFile,
}