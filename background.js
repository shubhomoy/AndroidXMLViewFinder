chrome.app.runtime.onLaunched.addListener(function() {
	chrome.app.window.create('popup.html', {
    	id: 'main',
    	bounds: { width: 800, height: 640 }
  	});
});

chrome.app.window.current().fullscreen();