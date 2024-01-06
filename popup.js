document.addEventListener("DOMContentLoaded", () => {
  let timeStampInput = document.getElementById("timestampInput");
  let bookmarkButton = document.getElementById("bookmarkBtn");
  let bookmarkList = document.getElementById('bookmarkList');

  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'bookmark', timestamp: timeStampInput.value }, (response) => {
        loadBookmarks(response.bookmarks);
      });
    });
  });

  function loadBookmarks(bookmarks) {
    bookmarkList.innerHTML = '';

    bookmarks.forEach((timestamp) => {
      let listItem = document.createElement('li');
      listItem.textContent = timestamp;
      bookmarkList.appendChild(listItem);
    });
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    chrome.tabs.sendMessage(activeTab.id, { action: 'getBookmarks' }, (response) => {
      loadBookmarks(response.bookmarks);
    });
  });
});
