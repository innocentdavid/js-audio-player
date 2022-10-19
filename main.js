const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const playpause = document.querySelector('.playpause')
const audio = document.querySelector('audio')
const title = document.querySelector('.title')
const currentTime = document.querySelector('#currentTime')
const duration = document.querySelector('#duration')
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');

const songList = [
    {
        path: 'audios/Alan_Walker,_Sabrina_Carpenter_&_Farruko_-_On_My_Way_(Lyrics)(128k).mp3',
        title: 'Alan_Walker,_Sabrina_Carpenter_&_Farruko_-_On_My_Way_(Lyrics)(128k)'
    },
    {
        path: 'audios/AViVA_-_Blackout_(Lyrics)(128k).mp3',
        title: 'AViVA_-_Blackout_(Lyrics)(128k)'
    },
    {
        path: 'audios/[www.NETNAIJA.com]_Flo_-_Twale.mp3',
        title: '[www.NETNAIJA.com]_Flo_-_Twale'
    },
];

let songs = false

function formatTime(secs) {
    let min = Math.floor((secs%3600)/60)
    let sec = Math.floor(secs%60)
    if(sec<10){
        sec=`0${sec}`
    }
    return `${min}:${sec}`
}

function playSong() {
    songs = true
    audio.play();
    playpause.classList.add('active')
    playpause.innerHTML = '<i class="fa-solid fa-pause"></i>'
}

function pauseSong() {
    songs = false
    audio.pause();
    playpause.classList.add('active')
    playpause.innerHTML = '<i class="fa-solid fa-play"></i>'
}

playpause.addEventListener('click', () => {
    return songs ? pauseSong() : playSong()
})

function loadSong(songList) {
    if (songList) {
        title.textContent = songList.title;
        audio.src = songList.path;
        return;
    }
    console.log('no songList');
}

let i = 0
loadSong(songList[i]);
// playSong(); // for auto play on-load
audio.addEventListener('loadedmetadata', () => {
    duration.textContent = formatTime(audio.duration)
})

function prevSong() {
    i--;
    if(i<0){
        i = songList.length-1;
    }
    loadSong(songList[i])
    playSong();
}
prev.addEventListener("click", prevSong)

function nextSong() {
    i++;
    if (i > (songList.length-1)){
        i = 0;
    }
    loadSong(songList[i])
    playSong();
}
next.addEventListener("click", nextSong)

const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    document.querySelector('body').style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
}

if (audio.readyState > 0) {
    // displayDuration();
    // setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        // displayDuration();
        // setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('timeupdate', ()=>{
    let sec = audio.currentTime
    let total = audio.duration
    let audioPlayed = (sec/total)*100
    displayBufferedAmount()

    currentTime.textContent = formatTime(sec)

})