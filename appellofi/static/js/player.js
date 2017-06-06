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


function fetchTracks(offset) {
    offset = offset || 0;

    log("fetcing...");
    getLikeTrack(offset).then(function (tracks) {
        tracks.forEach(function (value, idx, array) {
            _tracks.push(value);
        });
        log("getLikes " + _tracks.length);
        if (tracks.length < 1) {
            next();
            return;
        }

        offset += tracks.length;
        fetchTracks(offset);
    });
}

function next() {
    log("tracks" + _tracks);
    shuffle(_tracks);
    var track = _tracks[0];

    log("track" + track.id);
    log("track" + track.title);

    currentStream = SC.stream("/tracks/" + track.id).catch(function (err) {
        log("err : " + err.message);
        setTimeout(function () {
            next();
        }, 1000);
    }).then(function (player) {
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

log("first start");
fetchTracks();

setTimeout(function () {
    location = ''
}, 1000 * 3600);
