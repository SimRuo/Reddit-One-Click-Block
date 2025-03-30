// Ensure you store the access token somewhere (e.g., localStorage, or chrome storage)
const ACCESS_TOKEN = "your_access_token"; // Replace this with the actual access token

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

async function blockUser(username) {
    console.log(`Blocking user: ${username}`);

    try {
        const response = await fetch('https://oauth.reddit.com/api/block', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${ACCESS_TOKEN}`, // Use your OAuth access token
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                name: username // Reddit username to block
            })
        });

        if (response.ok) {
            console.log(`Successfully blocked user: ${username}`);
        } else {
            const errorData = await response.json();
            console.error('Error blocking user:', errorData);
        }
    } catch (error) {
        console.error('Failed to block user:', error);
    }
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
