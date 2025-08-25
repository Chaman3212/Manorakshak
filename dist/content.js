// content.js

(function(){
  const text = document.body?.innerText || ''
  try {
    chrome.runtime.sendMessage({ type: 'PAGE_TEXT', text })
  } catch (e) {
    // ignore
  }
})(); 