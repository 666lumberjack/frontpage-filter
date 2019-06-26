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



//we wrap the main logic in an async function so that we can await the resolution of each isPicture promise
const filterPage = async () => {
    
let submissions = document.querySelectorAll("div.sitetable div.thing.link");

let notDuplicatesPage = !(window.location.pathname.split('/')[3] == 'duplicates')
console.log(window.location.pathname.split('/')[3])

if (submissions[0] && notDuplicatesPage) {

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

        console.log(`Link: ${contentURL}\n Image Status: ${linkIsImage}`)
        
        if (links.has(contentURL)) {
            submissions[i].style.display = 'none';
        } else {
            links.add(contentURL);

            if (/*linkIsImage*/ false) { //image matching is disabled until encoding can be handled by a background script

                //let encodedImage = await imageToBase64(contentURL);

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
