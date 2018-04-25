


module.exports = {
  tags: ['compare-product'],
  'User selects and compare products': function(browser) {

    browser.url(process.env.TEST_APP);
    browser.assert.urlEquals(process.env.TEST_APP);
    
  }
}
