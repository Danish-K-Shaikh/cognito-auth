const promisyCallback = function (callback, obj, ...params) {
  let resolve, reject;
  const promise = new Promise((res, rej) => ((resolve = res), (reject = rej)));

  params = params || [];
  params.push(function (err, done) {
    if (err) return reject(err);
    resolve(done);
  });

  if (obj && typeof obj[callback] === "function") {
    obj[callback](...params);
  } else if (typeof callback === "function") {
    callback(...params);
  }

  return promise;
};

exports.promisyCallback = promisyCallback;
