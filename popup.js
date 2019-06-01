"use strict";

const getConfiguration = function() {
    chrome.storage.local.get({'noDuplicates': false, 'displayMode': 'all'}, (result) => {
        console.log(result)
    if (result) {
        if (result.noDuplicates) {
        document.getElementsByName('nodupes')[0].checked = true;
        } else {
        document.getElementsByName('nodupes')[0].checked = false;            
        }
        switch(result.displayMode) {
            default: 
                document.getElementsByName('display mode')[0].checked = true;
                break;
            case 'links':
                document.getElementsByName('display mode')[1].checked = true;
                break;
            case 'self':
                document.getElementsByName('display mode')[2].checked = true;
        }
    } else {
        console.log("couldn't load options")
    }})
}

getConfiguration();

const setConfiguration = function() {

    chrome.storage.local.remove(["noDuplicated","displayMode"]);

    chrome.storage.local.set({
        noDuplicates: document.getElementsByName("nodupes")[0].checked,
        displayMode: document.querySelector("input[type=radio]:checked").value
    }, () => 0)
}

document.getElementsByName("nodupes")[0].addEventListener("click", setConfiguration);
document.getElementsByName("display mode")[0].addEventListener("click", setConfiguration);
document.getElementsByName("display mode")[1].addEventListener("click", setConfiguration);
document.getElementsByName("display mode")[2].addEventListener("click", setConfiguration);
