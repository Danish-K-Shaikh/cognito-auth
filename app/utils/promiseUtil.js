const promisifyCallback = function (callback, ...params) {
  let resolve, reject;
  const promise = new Promise((res, rej) => ((resolve = res), (reject = rej)));

  params = params || [];
  params.push(function (err, done) {
    if (err) return reject(err);
    resolve(done);
  });

  if (typeof callback === 'function') {
    callback(...params);
  }

  return promise;
};

exports.promisifyCallback = promisifyCallback;
