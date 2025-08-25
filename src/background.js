// background.js (service worker)

chrome.runtime.onInstalled.addListener(() => {
  console.log('ManoRakshak installed')
})

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'PAGE_TEXT') {
    console.log('Background received text length:', message.text?.length || 0)
  }
}) 