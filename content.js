// tag to track which tweets have already had a button added
const customTag = `tag-${Date.now()}`;

function appendCustomNode(){
    const tweets = document.getElementsByTagName('article');
    for (let n = 0; n < tweets.length; n++) {
        const card = tweets[n];
        // if the tag is missing, this tweet hasn't been seen yet
        if (!card.hasAttribute(customTag)) {
            addButton(card);
            // mark the card as "processed" by adding the tag
            card.setAttribute(customTag, true);
        }
    }
}

function createCrannyButton() {
    const crannyButton = document.createElement('div');
    crannyButton.innerHTML = `
        <div class="crannyButton" aria-label="The Cranny Button" role="button" tabindex="4">
            <img alt="Cranny Button" src="${chrome.runtime.getURL('images/cranny.png')}">
        </div>`;
    return crannyButton;
}

function addButton(card) {
    const crannyButton = createCrannyButton();
    // this can select the single-tweet view tweet but it's buggy
    // const buttonRow = card.querySelector('[role=group]:has(div > [aria-label="Reply"])');
    const buttonRow = card.querySelector('[role=group]');
    if (buttonRow) {
        const shareButton = buttonRow.querySelector('[aria-label="Share Tweet"]')?.parentNode?.parentNode;

        if (shareButton) {
            buttonRow.insertBefore(crannyButton, shareButton);
        }
    }
}

// add the style tag for the button
const styleTag = document.createElement('style');
styleTag.innerHTML = `
.crannyButton {
    max-height: 32px !important;
    margin-left: -10px;
}

.crannyButton > img {
    height: 32px;
    width: 32px;
    transition: all 1.5s ease-out;
}

.crannyButton:hover > img {
    transform: rotate(-360deg);
}`;
document.body.appendChild(styleTag);

// Mutation observer setup
const observer = new MutationObserver(appendCustomNode);
observer.observe(document.body, {subtree: true, childList: true});