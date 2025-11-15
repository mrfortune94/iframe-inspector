// Query all iframes and collect data to send to popup
function getIframeData() {
  const iframes = Array.from(document.querySelectorAll('iframe'));
  return iframes.map(frame => {
    return {
      src: frame.src,
      attributes: Array.from(frame.attributes).reduce((acc, attr) => {
        acc[attr.name] = attr.value;
        return acc;
      }, {})
    };
  });
}

// Listen for popup requests
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getIframes") {
    sendResponse({ iframes: getIframeData() });
  }
});
