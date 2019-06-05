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