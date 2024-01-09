document.addEventListener("DOMContentLoaded", () => {
  let timeStampInput = document.getElementById("timestampInput");
  let bookmarkButton = document.getElementById("bookmarkBtn");
  let bookmarkList = document.getElementById('bookmarkList');
  let messageContainer = document.getElementById('messageContainer');

  bookmarkButton.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      let activeTab = tabs[0];
      chrome.tabs.sendMessage(activeTab.id, { action: 'bookmark' }, (response) => {
        if (response && response.bookmarks) {
          loadBookmarks(response.bookmarks);
        } else {
          messageContainer.textContent = "This is not a YouTube video page.";
        }
      });
    });
  });

  function loadBookmarks(bookmarks) {
    bookmarkList.innerHTML = '';

    bookmarks.forEach((timestamp) => {
      let listItem = document.createElement("li");
      let timestampText = document.createElement('p');
      let deleteBookmarkBtn = document.createElement('button');
      let hours = Math.floor(timestamp / 3600);
      let minutes = Math.floor((timestamp % 3600) / 60);
      let seconds = Math.floor(timestamp % 60);

      let formattedTimestamp = '';

      if (hours > 0) {
        formattedTimestamp += hours + ':';
      }

      formattedTimestamp += (minutes < 10 ? '0' : '') + minutes + ':' + (seconds < 10 ? '0' : '') + seconds;

      timestampText.textContent = formattedTimestamp;
      timestampText.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          let activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, { action: 'goToTimestamp', timestamp: timestamp });
        });
      });

      deleteBookmarkBtn.textContent = "D";
      deleteBookmarkBtn.addEventListener('click', () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          let activeTab = tabs[0];
          chrome.tabs.sendMessage(activeTab.id, { action: 'deleteBookmark', timestamp: timestamp }, (response) => {
            if (response && response.bookmarks) {
              loadBookmarks(response.bookmarks);
            }
          });
        });
      });
      
      listItem.appendChild(timestampText);
      listItem.appendChild(deleteBookmarkBtn);
      bookmarkList.appendChild(listItem);
    });
  }

  function isYouTubeVideoPage(url) {
    return (
      url.includes("youtube.com") &&
      url.startsWith("https://www.youtube.com/watch")
    );
  }

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let activeTab = tabs[0];
    if (!isYouTubeVideoPage(activeTab.url)) {
      messageContainer.textContent = 'This is not a YouTube video page.';
    } else {
      chrome.tabs.sendMessage(activeTab.id, { action: 'getBookmarks' }, (response) => {
        if (response && response.bookmarks) {
          loadBookmarks(response.bookmarks);
        }
        messageContainer.textContent = '';
      });
    }
  });
});
