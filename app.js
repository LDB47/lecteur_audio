const player = document.querySelector(".player");
const container = document.querySelector(".container");
const imgContainer = document.querySelector(".img_container");
const image = document.querySelector(".img_container img");
const audio = document.querySelector("#audio");
const randomBtn = document.querySelector("#random");
const prevBtn = document.querySelector("#prev");
const playBtn = document.querySelector("#play");
const playBtnIcon = document.querySelector("#play_icon")
const nextBtn = document.querySelector("#next");
const repeatBtn = document.querySelector("#repeat");
const secondContainer = document.querySelector(".second_container");
const title = document.querySelector("#title");
const artist = document.querySelector("#artist");
const album = document.querySelector("#album");
const volume = document.querySelector("#volume_level");
let elapsed = document.querySelector("#current_time");
let duration = document.querySelector("#track_length");
const slider = document.querySelector(".progress_slider");
const test = document.querySelector("#wave");
let currentSong = 0;
let repeat = false;

fetch("json/music.json").then((data) => {
    return data.json();
}).then((data) => {
    // console.log(data);
    playBtn.addEventListener('click', () => {
        if (playBtnIcon.className == "fas fa-play") {
            playOrPause(data, true);
            // console.log("test");
        } else {
            playOrPause(data, false);
            // console.log("test2");
        }
        showInfo(data, currentSong);
    })
    nextBtn.addEventListener('click', () => {
        next(data);
        showInfo(data, currentSong);
    })
    prevBtn.addEventListener('click', () => {
        previous(data);
        showInfo(data, currentSong);
    })
    repeatBtn.addEventListener('click', () => {
        repeat = !repeat;
    })
    volume.addEventListener('change', () => {
        changeVolume(volume);
    })
    randomBtn.addEventListener('click', () => {
        randomTrack(data);
    })
    audio.addEventListener('timeupdate', () => {
        showTime();
        if (audio.ended) {
            if (repeat) {
                audio.play()
            } else {
               nextBtn.click();
               repeatBtn.classList.remove("clicked");
            }  
        }
    })
    slider.addEventListener('input', () => {
        slideUpdate();
    })
});




function playOrPause(data, play) {
    // console.log(currentSong);
    // console.log(audio.src);
    // console.log(data[currentSong].src != audio.src.slice(audio.src.lastIndexOf("/") + 1));
    // console.log("satisfait");
    if (play) { //test si vrai
        // src = currentSong;
        // console.log(audio.src);
        if (data[currentSong].src != audio.src.slice(audio.src.lastIndexOf("/") + 1)) {
            // console.log(data[currentSong].src, audio.src.slice(audio.src.lastIndexOf("/") + 1));
            source(data, currentSong);
            // let song = data[src];
            // audio.src = "music/" + song.src;
        }
        audio.play().then(() => {
            slider.setAttribute('max', audio.duration);
        });
        player.classList.add("play");
        playBtnIcon.className = "fas fa-pause";
        imgContainer.classList.remove("disable-animation");
    } else {
        audio.pause();
        player.classList.remove("play");
        playBtnIcon.className = "fas fa-play";
        imgContainer.classList.add("disable-animation");
    }
    showTime();
}

function source(data, src) {
    let song = data[src];
    audio.src = "music/" + song.src;
    changeImg(song.image)
}

function next(data) {
    currentSong++;
    // console.log(currentSong);
    if (currentSong == data.length) {
        currentSong = 0;
    }
    source(data, currentSong);
    audio.play().then(()=>{
        slider.setAttribute('max', audio.duration);
    });
    changeIcon(audio);
    showTime();
}

function previous(data) {
    currentSong--;
    if (currentSong < 0) {
        currentSong = data.length - 1;
    }
    source(data, currentSong);
    audio.play().then(()=>{
        slider.setAttribute('max', audio.duration);
    });
    changeIcon(audio);
    showTime();
}

function changeIcon(audio) {
    if (audio.play()) {
        player.classList.add("play");
        playBtnIcon.className = "fas fa-pause";
        // console.log(playBtnIcon.className);
    } else if (playBtnIcon.className == "fas fa-pause") {
        // console.log("test");
        audio.pause();
        player.classList.remove("play");
        playBtnIcon.className = "fas fa-play";
    }
}

function changeImg(src) {
    image.setAttribute("src", "images/" + src);
}

function showInfo(jsonObj, currentSong) {
    let info = jsonObj[currentSong];
    // console.log(info);
    artist.textContent = info.artist;
    title.textContent = info.title;
    album.textContent = info.album;
}

function repeatTrack() {
    if (audio.ended) {
        repeatBtn.classList.add("clicked");
        audio.currentTime = 0;
        audio.play();
    }
}

function changeVolume(param) {
    audio.volume = (param.value / 100);
}

function showTime() {
    if (!isNaN(audio.duration)) {
        slider.value = audio.currentTime;
        let currentMinutes = Math.floor(audio.currentTime / 60);
        let currentSeconds = Math.floor(audio.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(audio.duration / 60);
        let durationSeconds = Math.floor(audio.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        elapsed.textContent = currentMinutes + ":" + currentSeconds;
        duration.textContent = durationMinutes + ":" + durationSeconds;
}
}

function slideUpdate() {
    // console.log(slider.value);
    audio.currentTime = slider.value;
}

function randomTrack(obj) {
    let var_random = Math.floor(Math.random() * obj.length);
    // console.log(var_random);
    source(obj, var_random);
    audio.play().then(()=>{
        slider.setAttribute('max', audio.duration);
    });
    changeIcon(audio);
    showInfo(obj, var_random)
}

// let wave = new Wave();
// options = {type: "rings"};
// wave.fromElement("audio", "wave", options);
      