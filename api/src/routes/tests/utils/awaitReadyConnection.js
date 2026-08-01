// @ll-compat-audit: ok 2026-08-01
export default connection =>
  new Promise((resolve) => {
    if (connection.readyState !== 1) {
      connection.on('connected', () => {
        resolve();
      });
    } else {
      resolve();
    }
  });
