// Listen for messages from the extension
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // If the action is to bookmark the current timestamp
  if (request.action == "bookmark") {
    // Get the current timestamp from the video player
    let timestamp = getCurrentTimestampFromPlayer();
    
    // If a valid timestamp is retrieved
    if (timestamp) {
      // Get the video ID from the URL
      let videoId = getVideoIdFromUrl(window.location.href);

      // Get existing bookmarks or initialize an empty array
      let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];

      // Add the timestamp to the bookmarks array
      bookmarks.push(timestamp);

      // Update localStorage with the new bookmarks
      localStorage.setItem(videoId, JSON.stringify(bookmarks));

      // Send response back to the extension with updated bookmarks
      sendResponse({ bookmarks: bookmarks });
    }

    // If the action is to get bookmark for the current video
  } else if (request.action == "getBookmarks") {
    // Get the video ID from the URL
    let videoId = getVideoIdFromUrl(window.location.href);

    // Retrieve bookmarks from localStorage
    let bookmarks = JSON.parse(localStorage.getItem(videoId));

    //Send response back to the extension with bookmarks
    sendResponse({ bookmarks: bookmarks });
    
    // If the action is to delete a bookmark
  } else if (request.action == 'deleteBookmark') {
    // Get the video ID from the URL
    let videoId = getVideoIdFromUrl(window.location.href);

    // Get the timestamp to delete it from the request
    let timestamp = request.timestamp;

    // Retrieve existing bookmarks or initialize an empty array
    let bookmarks = JSON.parse(localStorage.getItem(videoId)) || [];

    // Filter out the specified timestamp from bookmarks
    bookmarks = bookmarks.filter((bookmark) => bookmark !== timestamp);

    // Update localStorage with the modified bookmarks
    localStorage.setItem(videoId, JSON.stringify(bookmarks));

    // Send response back to the extension with updated bookmarks
    sendResponse({ bookmarks: bookmarks });

    //If the action is to go to a specific timestamp in the video
  } else if (request.action == 'goToTimestamp') {
    // Get the timestamp from the request and navigate to it
    let timestamp = request.timestamp;
    goToTimestamp(timestamp);
  }
});

// Function to extract the video ID from the URL
function getVideoIdFromUrl(url) {
  // Split the URL by '&' to find the part containing the video ID
  let urlParts = url.split("&");

  // Iterate through the parts of the URL to find the video ID
  for (let i = 0; i < urlParts.length; i += 1) {
    if (urlParts[i].startsWith("v=")) {
      //Return the video ID if it's found
      return urlParts[i].substring(2);
    }
  }

  // If the video ID is not found, try using regex to extract it
  let videoIdMatches = url.match(/[?&]v=([^&#]+)/);
  return videoIdMatches ? videoIdMatches[1] : null;
}

// Function to get the current timmestamp from the video player
function getCurrentTimestampFromPlayer() {
  // Get the video player element
  let player = document.getElementsByClassName('video-stream')[0];

  // If player element exists, return its current timestamp
  if (player) {
    return player.currentTime;
  } else {
    // If player element does not exist, return null
    return null;
  }
}

// Function to navigate to a specific timestamp in the video player
function goToTimestamp(timestamp) {
  // Get the video player element
  let player = document.getElementsByClassName('video-stream')[0];

  // If the player element exits, set its current timestamp
  if (player) {
    player.currentTime = timestamp;
  }
}