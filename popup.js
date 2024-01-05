document.addEventListener("DOMContentLoaded", () => {
  let timeStampInput = document.getElementById("timestampInput");
  let bookmarkButton = document.getElementById("bookmarkBtn");

  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'bookmark', timestamp: timeStampInput.value });
    });
  });
});
