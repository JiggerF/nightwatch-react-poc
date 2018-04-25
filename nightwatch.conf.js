const TEST_REPORT_PATH = './test/reports';
const SELENIUM_HOST = process.env.SELENIUM_HOST || "127.0.0.1";
const SELENIUM_PORT = process.env.SELENIUM_PORT || "4444";
const PAGE_OBJECT_PATH = './test/pages';
const BINPATH = './node_modules/nightwatch/bin/';
const SCREENSHOT_PATH = "./test/screenshots/"

const config = { // we use a nightwatch.conf.js file so we can include comments and helper functions
  src_folders: [
    "test/component"     // we use '/test' as the name of our test directory by default. So 'test/e2e' for 'e2e'.
  ],
  output_folder: TEST_REPORT_PATH, // reports (test outcome) output by Nightwatch
  page_objects_path: PAGE_OBJECT_PATH,
  test_workers : {
    "enabled" : true,
    "workers" : "auto",
  },// perform tests in parallel where possible
  globals_path: "nightwatch.globals.js",
  test_settings: {
    default: {
      selenium_port: SELENIUM_PORT,
      selenium_host: SELENIUM_HOST,
      silent: true,
      screenshots: {
        enabled: true, // save screenshots to this directory (excluded by .gitignore)
        on_failure: true,
        on_error: true,
        path: SCREENSHOT_PATH,
      },
      globals: {
        waitForConditionTimeout: 10000  ,  // wait for content on the page before continuing
      },
      desiredCapabilities: {
        browserName: "chrome",
        chromeOptions: {
          args: [
            `Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46
            (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3`,
          ],
          // disable image rendering for a faster smoke test
          prefs: {
            profile: {
              default_content_settings_values: {
                images: 2,
              },
            },
          },
        },
        javascriptEnabled: true,
        acceptSslCerts: true,
      },
    },
  },
};

if (!process.env.SELENIUM_HOST) {
  config["selenium"] = {
    start_process: true,
    server_path: BINPATH + "selenium.jar",
    log_path: "",
    host: SELENIUM_HOST,
    port: SELENIUM_PORT,
    cli_args: {
      "webdriver.chrome.driver": BINPATH + "chromedriver",
    },
  };
}

module.exports = config;

function padLeft (count) { // theregister.co.uk/2016/03/23/npm_left_pad_chaos/
  return count < 10 ? '0' + count : count.toString();
}

var FILECOUNT = 0; // "global" screenshot file count
/**
 * The default is to save screenshots to the root of your project even though
 * there is a screenshots path in the config object above! ... so we need a
 * function that returns the correct path for storing our screenshots.
 * While we're at it, we are adding some meta-data to the filename, specifically
 * the Platform/Browser where the test was run and the test (file) name.
 */
function imgpath (browser) {
  var a = browser.options.desiredCapabilities;
  var meta = [a.platform];
  meta.push(a.browserName ? a.browserName : 'any');
  meta.push(a.version ? a.version : 'any');
  meta.push(a.name); // this is the test filename so always exists.
  var metadata = meta.join('~').toLowerCase().replace(/ /g, '');
  return SCREENSHOT_PATH + metadata + '_' + padLeft(FILECOUNT++) + '_';
}

module.exports.imgpath = imgpath;
module.exports.SCREENSHOT_PATH = SCREENSHOT_PATH;
