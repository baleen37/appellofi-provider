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

    console.log("fetcing...");
    getLikeTrack(offset).then(function (tracks) {
        _tracks.push.apply(_tracks, tracks);
        console.log("getLikes " + _tracks.length);
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

    console.log("tracks" + _tracks);
    shuffle(_tracks);
    var track = _tracks[0];

    console.log("track" + track.id);
    console.log("track" + track.title);

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


fetchTracks();

setTimeout(function () {
    location = ''
}, 3600 * 12);