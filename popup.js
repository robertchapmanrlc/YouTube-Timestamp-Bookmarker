document.addEventListener("DOMContentLoaded", () => {
  let timeStampInput = document.getElementById("timestampInput");
  let bookmarkButton = document.getElementById("bookmarkBtn");
  let bookmarkList = document.getElementById('bookmarkList');
  let messageContainer = document.getElementById('messageContainer');

  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) => {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'bookmark', timestamp: timeStampInput.value }, (response) => {
        if (response && response.bookmarks) {
          loadBookmarks(response.bookmarks);
        } else {
          messageContainer.textContent = "This is not a YouTube video";
        }
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
      if (response && response.bookmarks) {
        loadBookmarks(response.bookmarks);
      } else {
          messageContainer.textContent = "This is not a YouTube video";
      }
    });    
  });
});
