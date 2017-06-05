SC.initialize({
    client_id: 'THGmkxKSNGqO5hYOwMBbbAM5t3hCn91E'
});

var _tracks = [];
var currentStream;

function getLikeTrack(offset) {
    offset = offset || 0;
    return SC.get('/users/appellofi/favorites', {limit: 100, offset: offset})
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


function fetchTracks(offset, total_limit) {
    offset = offset || 0;
    total_limit = total_limit || 100;

    log("fetcing...");
    getLikeTrack(offset).then(function (tracks) {
        _tracks.push.apply(_tracks, tracks);
        log("getLikes " + _tracks.length);
        if (_tracks.length > total_limit || tracks.length < 1) {
            next();
            return;
        }
        offset = offset + tracks.length;

        fetchTracks(offset);
    });
}

function next() {
    close();

    log("tracks" + _tracks);
    shuffle(_tracks);
    var track = _tracks[0];

    log("track" + track.id);
    log("track" + track.title);

    currentStream = SC.stream("/tracks/" + track.id).then(function (player) {
        setUserText(track.user.permalink);
        setTitle(track.title);
        player.play();
        player.on('finish', function () {
            next();
        });
    });

}

function setUserText(userText) {
    $(".user-text").text(userText);
}

function setTitle(title) {
    $(".title").text(title);
}


function log(str) {
    $(".debug").append("<div>" + str + "</div>");
}

fetchTracks();

setTimeout(function () {
    location = ''
}, 3600 * 12);

window.onerror = function (msg, url, line, col, error) {
    // Note that col & error are new to the HTML 5 spec and may not be
    // supported in every browser.  It worked for me in Chrome.
    var extra = !col ? '' : '\ncolumn: ' + col;
    extra += !error ? '' : '\nerror: ' + error;

    // You can view the information in an alert to see things working like this:
    log("Error: " + msg + "\nurl: " + url + "\nline: " + line + extra);

    // TODO: Report this error via ajax so you can keep track
    //       of what pages have JS issues

    var suppressErrorAlert = true;
    return suppressErrorAlert;
};