function addBlockButton(userElement) {
    // Ensure we don't add multiple buttons to the same user
    if (userElement.parentNode.querySelector('.reddit-block-btn')) return;

    const blockButton = document.createElement('button');
    blockButton.textContent = 'Block';
    blockButton.className = 'reddit-block-btn';
    blockButton.style.marginLeft = '5px';
    blockButton.style.padding = '3px 6px';
    blockButton.style.fontSize = '12px';
    blockButton.style.backgroundColor = '#FF4500';
    blockButton.style.color = 'white';
    blockButton.style.border = 'none';
    blockButton.style.cursor = 'pointer';
    blockButton.style.borderRadius = '4px';

    blockButton.onclick = function () {
        const username = userElement.textContent.trim();
        blockUser(username);
    };

    userElement.parentNode.appendChild(blockButton);
}

function blockUser(username) {
    console.log(`Blocking user: ${username}`);

    // Open the user's Reddit profile where the block option is available
    const blockUrl = `https://www.reddit.com/user/${username}/about/`;
    window.open(blockUrl, '_blank');
}

// Selectors for both post and comment authors
const usernameSelectors = 'a.author-name[href^="/user/"], a[href^="/user/"].font-bold';

// Function to process new usernames efficiently
function processNewUsers(mutationsList) {
    for (const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.target.querySelectorAll(usernameSelectors).forEach(addBlockButton);
        }
    }
}

// Observe new elements without slowing down Reddit
const observer = new MutationObserver((mutationsList) => {
    requestIdleCallback(() => processNewUsers(mutationsList), { timeout: 100 });
});

// Start observing only the main Reddit content area
const targetNode = document.body;
observer.observe(targetNode, { childList: true, subtree: true });

// Run once on page load
document.querySelectorAll(usernameSelectors).forEach(addBlockButton);
