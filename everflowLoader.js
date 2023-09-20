// Load the pym library dynamically
(function() {
    var pymScript = document.createElement('script');
    pymScript.src = 'https://pym.nprapps.org/pym.v1.min.js';
    pymScript.onload = function() {
        if (window.everflowURL) {
            loadIframe(window.everflowURL);
        }
    };
    document.head.appendChild(pymScript);

    window.loadIframe = function(everflowURL) {
        // Check if everflowURL already has parameters
        if (everflowURL.indexOf('?') !== -1) {
            // If it does, replace the '?' in window.location.search with '&'
            everflowURL += window.location.search.replace('?', '&');
        } else {
            everflowURL += window.location.search;
        }

        // Load the iframe with the modified URL
        var pymParent = new pym.Parent('pym-container', everflowURL, {});
    };
})();
