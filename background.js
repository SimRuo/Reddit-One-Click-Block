const CLIENT_ID = "5miTeKy7uOOMH1ut8CjXAQ"; 
const REDIRECT_URI = "http://localhost:8080";  // unsure if this will work with localhost, but it should be fine for testing
const AUTH_URL = `https://www.reddit.com/api/v1/authorize?client_id=${CLIENT_ID}&response_type=code&state=randomstring&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&duration=permanent&scope=identity privatemessages`;

chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
});

chrome.action.onClicked.addListener(() => {
    chrome.tabs.create({ url: AUTH_URL });
});
