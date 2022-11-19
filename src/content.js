import keyword_extractor from "keyword-extractor";
// import * as cheerio from 'cheerio';

// const SEARCH_STRING = (keyword) => `/search?lang=en&q=(${keyword})%20(from%3Acranny_boy)&src=typed_query`;

// tag to track which tweets have already had a button added
const customTag = `tag-${Date.now()}`;

function appendCustomNode(){
    const tweets = document.getElementsByTagName('article');
    for (let n = 0; n < tweets.length; n++) {
        const card = tweets[n];
        // if the tag is missing, this tweet hasn't been seen yet
        if (!card.hasAttribute(customTag)) {
            const info = getInfo(card);
            addButton({card, info});
            // mark the card as "processed" by adding the tag
            card.setAttribute(customTag, 'true');
        }
    }
}

function getInfo(card) {
    const tweetTextEl = card.querySelector('[data-testid="tweetText"]');
    const text = tweetTextEl?.innerText;
    return {
        text
    };
}

async function clickFunc(info) {
    const keywords = keyword_extractor.extract(info.text, { remove_duplicates: true, remove_digits: false });
    const keyword = keywords[Math.floor(Math.random() * keywords.length)];
    console.log({keywords, keyword})
    // const fuckl = await fetch(SEARCH_STRING(keyword));
    // const res = await fuckl.text();
    // console.log(res.length);
    // const $ = cheerio.load(`${res}`);
    // $('article').each((idx, ref) => {
    //     const elem = $(ref);
    //     console.info(elem.text());
    // });
    // console.log(`${res}`);
    // // article,[data-testid="tweet"]
}

function createCrannyButton(info) {
    const crannyButton = document.createElement('div');
    crannyButton.innerHTML = `
        <div class="crannyButton" aria-label="The Cranny Button" role="button" tabindex="4">
            <img alt="Cranny Button" src="${chrome.runtime.getURL('images/cranny.png')}">
        </div>`;

    crannyButton.addEventListener("click", () => {
        clickFunc(info).then();
    });
    return crannyButton;
}

function addButton({card, info}) {
    const crannyButton = createCrannyButton(info);
    // this can select the single-tweet view tweet, but it's buggy
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
    transition: all 1s ease-in-out;
}

.crannyButton:hover > img {
    /* transform: rotate(-360deg) transform: scale(1.1); */
    animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  50% { transform: scale(1.15); }
  100% { transform: scale(1); }
}
`;
document.body.appendChild(styleTag);

// Mutation observer setup
const observer = new MutationObserver(appendCustomNode);
observer.observe(document.body, {subtree: true, childList: true});