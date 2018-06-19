/**
 * 请求层，对返回数据格式化、捕获处理http请求的http异常、errorCode非0逻辑异常
 */

var app = getApp();

function parse (key) {
  var value = parse[ key ];

  if (value == null) {
    throw new Error('数据格式化错误，请提供正确key');  
  }

  return value;
}

function request (options, parseKey) {
  var appGlobal = app.globalData;
  var url = appGlobal.host + ':' + appGlobal.port + appGlobal.prefixPath + options.pathname;
  var method = options.method;
  var data = options.data;
  var header = appGlobal.header;

  parseKey || (parseKey = 'data');

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header, 
      success: function (resp) {
        // 检测errCode是否为0，0代表逻辑正常，非0代表逻辑错误
        if (resp.errCode) {
          reject(resp.errMessage);
        } else {
          try {
            var value = resp[parseKey];
            resolve(value);
          } catch (error) {
            reject('数据格式化错误，请提供有效的数据转换key');
          }
        }
      },
      fail: function (error) {
        reject(error);
      }
    })  
  });
}

exports.get = function (pathname, data) {
  return request({
    pathname: pathname,
    method: 'get',
    data: data
  }).then(function (resp) {
    return resp;      
  });
};

exports.post = function () {
  return request({
    pathname: pathname,
    method: 'post',
    data: data
  }).then(function (resp) {
    return resp;
  });
};

exports.fail = function (errorMessage, cb) {
  console.log(errorMessage);
  cb && cb();
}