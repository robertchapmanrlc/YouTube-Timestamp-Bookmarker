chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action == "bookmark") {
    let videoId = window.location.search.split("v=")[1];
    let timestamp = request.timestamp;

    if (videoId && timestamp) {
      let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];
      bookmarks.push(timestamp);
      localStorage.setItem(videoId, JSON.stringify(bookmarks));
      sendResponse({ bookmarks: bookmarks });
      alert("Timestamp bookmarked successfully!");
    }
  } else if (request.action == 'getBookmarks') {
    let videoId = window.location.search.split("v=")[1];
    let bookmarks = JSON.parse(localStorage.getItem(videoId));
    console.log(bookmarks);
    sendResponse({ bookmarks: bookmarks });
  }
});
