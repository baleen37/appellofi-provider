SC.initialize({
    client_id: 'THGmkxKSNGqO5hYOwMBbbAM5t3hCn91E'
});
var _tracks = [];
var currentStream;
var currentTrackIdx = -1;
var debug = false;

var getLikeTrack = function (offset) {
    offset = offset || 0;
    return SC.get('/users/appellofi/favorites', {limit: 1000, offset: offset})
};

var shuffle = function (arr) {
    return arr.sort(function () {
        return 1 - Math.floor(Math.random() * 3);
    });
};

var log = function (msg) {
    if (!debug) return;
    console.log(msg);
    $(".debug").append("<div>" + msg + "</div>");
};


var fetchTracks = function (offset, callback) {
    log("fetcing...");
    offset = offset || 0;

    getLikeTrack(offset).then(function (tracks) {
        callback(tracks);
    });
};

var nextTrack = function () {
    currentTrackIdx += 1;
    if (_tracks.length <= currentTrackIdx)
        currentTrackIdx = 0;

    return _tracks[currentTrackIdx];
};

var play = function (track) {
    log("track" + track.id);
    log("track" + track.title);
    var retry = function () {
        setTimeout(function () {
            this(track);
        }, 1000);
    };

    currentStream = SC.stream("/tracks/" + track.id)
        .then(function (player) {
            setTitle(track.user.permalink + ' - ' + track.title);
            player.play();
            player.on('finish', function () {
                var newTrack = nextTrack();
                play(newTrack);
            });
        }).catch(function (error) {
            log('Error ' + error.message);
            retry();
        });
};

var setTitle = function (title) {
    $(".title").text(title);
};

fetchTracks(0, function (tracks) {
    log('fetching done.. ' + tracks.length);
    _tracks = shuffle(tracks);

    var track = nextTrack();
    log('start track');

    play(track);
});

setTimeout(function(){
  window.location.reload(true);
}, 24 * 60 * 60 * 1000)
