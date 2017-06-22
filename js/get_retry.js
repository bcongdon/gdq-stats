const $ = require('jquery');

module.exports = function getRetry(url, cb) {
  $.ajax({
    url: url,
    async: true,
    // retryCount and retryLimit will let you retry a determined number of times
    retryCount: 0,
    retryLimit: 5,
    // retryTimeout limits the total time retrying (in milliseconds)
    retryTimeout: 15000,
    // timeout for each request
    timeout: 2000,
    // created tells when this request was created
    created : Date.now(),
    error : function(xhr, textStatus, errorThrown ) {
      this.retryCount++;
      if (this.retryCount <= this.retryLimit && Date.now() - this.created < this.retryTimeout) {
        console.log("Retrying " + url);
        $.ajax(this);
        return;
      }
    },
    success: cb
  });
}
