const config = {
  server: '127.0.0.1',
  port: 9080
};
const file = document.getElementById('file');
const upload = document.getElementById('upload');

// 点击上传
const handleUpload = async () => {
  let fileData = file.files && file.files[0];
  if (fileData) {
    let formData = new FormData();
    formData.append('file', fileData);
    const result = await request({
      method: 'post',
      url: '/file',
      data: formData,
    });

    console.log(result);
  } else {
    throw Error('上传文件为空');
  }
}

// Promise 封装 XMLHttpRequest 请求
const request = ({
  method = 'get',
  url = '/',
  data
} = {}) => {
  return new Promise((res, rej) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, `http://${config.server}:${config.port}${url}`);
    xhr.send(data);
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status <= 400) {
        res(xhr.responseText);
      } else {
        rej(xhr.statusText);
      }
    }
  }).catch(err => {
    throw Error(err);
  })

}

upload.addEventListener('click', handleUpload);