const customTag = `tag-${Date.now()}` // your choice of a valid & unique value

function appendCustomNode(){

    // find all timeline cards, their tag name is article
    const cards = document.getElementsByTagName('article');

    // check each card
    for (let n = 0; n < cards.length; n++) {

        const card = cards[n];

        // check that cards is new / has not been seen before
        if (!card.hasAttribute(customTag)) {

            addButton(card);

            // mark the card as "processed" by adding the custom tag
            card.setAttribute(customTag, true);
        }
    }
}

function addButton(card){

    const crannyButton = document.createElement('div');
    crannyButton.innerHTML = `
        <div class="crannyButton" aria-label="The Cranny Button" role="button" tabindex="4">
            <img alt="Cranny Button" src="${chrome.runtime.getURL('images/cranny.png')}">
        </div>`;

    const buttonRow = card.querySelector('[role=group]');
    const shareButton = buttonRow.querySelector('[aria-label="Share Tweet"]')?.parentNode?.parentNode;

    buttonRow.insertBefore(crannyButton, shareButton);
}

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