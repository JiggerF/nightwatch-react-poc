const SELENIUM_HOST = process.env.SELENIUM_HOST || "127.0.0.1";
const SELENIUM_PORT = process.env.SELENIUM_PORT || "4444";

module.exports = {
  beforeEach: function(browser, done) {
    const seleniumUrl = `http://${SELENIUM_HOST}:${SELENIUM_PORT}`;
    console.log(`Waiting for ${seleniumUrl}...`);
    require('wait-on')({
      resources: [
        seleniumUrl,
      ],
      timeout: 10000,
    }, function(err) {
      if (err) {
        console.error(`${seleniumUrl} didn't start :(`);
        throw err;
      }

      console.log(`${seleniumUrl} is alive!`);

      done();
    });
  },

  afterEach: function(browser, done) {
    done();
  }
};
