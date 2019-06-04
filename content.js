"use strict";

const isLink = (submission) => {
    for (let i = 0; i < submission.classList.length; i++) {
        if (submission.classList[i] === "self") {
            return false;
        }
    };
    return true;
}

const ensureHTTPS = (link) => {
    let prefix = link.split('').slice(0, 5).join('');
    if (prefix === "https") {
        return link;
    } else {
        return "https" + link.split('').slice(4).join('');
    }
}

const isPicture = (link) => {

    let httpsURL = ensureHTTPS(link);
    let result = fetch(httpsURL, {
        method: 'HEAD'
    }).then(res => {
        if (res.headers.get('content-type')) {
            let contentPrefix = res.headers.get('content-type').split('').slice(0,5).join('');
            if (contentPrefix === "image") {
                return true;
            } else {
                return false;
            }
        } else {
            return false;   
        }
    });

    return result;
}

//below function needs to be moved to a background script to avoid CORS restrictions on content scripts
const imageToBase64 = (src) => {
    
    return new Promise((resolve, reject) => {

    let returnString;
    let image = new Image();
    image.crossOrigin = 'Anonymous';
    image.onload = () => {
        let canvas = document.createElement('CANVAS');
        let context = canvas.getContext('2d');

        canvas.height = this.naturalHeight;
        canvas.width = this.naturalWidth;

        context.drawImage(this, 0, 0);

        returnString = canvas.toDataURL(/* default output format is base64 */);

        canvas = null;

        resolve(returnString);
    };

    image.src = src;
    //load event would not fire for cached images, so we manually flush the cache
    if (image.complete || image.complete === undefined) {
        image.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==' //encode of a 1x1px transparent gif
        image.src = src;
    }
})
};

//we wrap the main logic in an async function so that we can await the resolution of each isPicture promise
const filterPage = async () => {
    
let submissions = document.querySelectorAll("div.sitetable div.thing.link");

if (submissions[0]) {

let links = new Set();
let images = new Set();

for (let i = 0; i < submissions.length; i++){


    if (!isLink(submissions[i])){
        if (settings.displayMode === 'links') {
            submissions[i].style.display = 'none';
        } 
    } else if (settings.displayMode === 'self') {
        submissions[i].style.display = 'none';
    } else if (settings.noDuplicates) {

        let contentURL = submissions[i].dataset.url;
        let linkIsImage = await isPicture(contentURL);

        if (links.has(contentURL)) {
            submissions[i].style.display = 'none';
        } else {
            links.add(contentURL);

            if (/*linkIsImage*/ false) { //image matching is disabled until encoding can be handled by a background script

                let encodedImage = await imageToBase64(contentURL);

                if (images.has(encodedImage)) {
                    submissions[i].style.display = 'none';
                } else {
                    images.add(encodedImage);
                }
            }
        };

    };
}
}};

let settings = {};

chrome.storage.local.get({'noDuplicates': false, 'displayMode': 'all'}, (result) => {
    settings.noDuplicates = result.noDuplicates;
    settings.displayMode = result.displayMode;

    filterPage();
});
