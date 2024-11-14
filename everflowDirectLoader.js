(function loadEFSDK() {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://www.uvt9ntrk.com/scripts/sdk/everflow.js';
  script.async = false;
  document.head.appendChild(script);
})();

// Main tracking functionality
(function() {
  try {
    var urlParams = new URLSearchParams(window.location.search); 

    function argAppend(argName, argValue) {
      var currentUrl = window.location.href;
      var separator = currentUrl.includes('?') ? '&' : '?';
      var newUrl = currentUrl + separator + encodeURIComponent(argName) + '=' + encodeURIComponent(argValue);
      window.history.pushState({ path: newUrl }, '', newUrl);
    }

    // Add debug logging
    console.log('Script started');
    console.log('URL Parameters:', Object.fromEntries(urlParams));
    console.log('EF Object Status:', typeof EF !== 'undefined' ? 'Loaded' : 'Not Loaded');

    // Add retry mechanism for EF click
    function attemptEFClick(retryCount = 0, maxRetries = 5) {
      if (typeof EF === 'undefined') {
        if (retryCount < maxRetries) {
          console.log(`EF not loaded, attempt ${retryCount + 1} of ${maxRetries}`);
          setTimeout(() => attemptEFClick(retryCount + 1, maxRetries), 1000);
          return;
        }
        console.error('Everflow SDK failed to load after all attempts');
        return;
      }

      EF.click({
        offer_id: EF.urlParameter('oid'), 
        affiliate_id: EF.urlParameter('affid'),
        sub1: EF.urlParameter('sub1'),
        sub2: EF.urlParameter('sub2'),
        sub3: EF.urlParameter('sub3'),
        sub4: EF.urlParameter('sub4'),
        sub5: EF.urlParameter('sub5'),
        uid: EF.urlParameter('uid'),
        source_id: EF.urlParameter('source_id'),
        transaction_id: EF.urlParameter('_ef_transaction_id'),
      }).then(function(transactionId) {
        console.log("CID Generated:", transactionId);
        argAppend('cid', transactionId);
        argAppend('ManualFire', 'true');
        window._rgba_tags.push({cid:transactionId});
      }).catch(function(error) {
        console.error('Failed to generate CID:', error);
      });
    }

    if (!urlParams.has("cid") && urlParams.has("oid")) {
      console.log('Conditions met, attempting to generate CID');
      attemptEFClick(); // Start the retry process
    } else {
      console.log('Conditions not met:', {
        hasCid: urlParams.has("cid"),
        hasOid: urlParams.has("oid")
      });
    }
  } catch (error) {
    console.error('Script execution failed:', error);
  }
})();  