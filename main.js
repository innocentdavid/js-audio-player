const audioPlayerContainer = document.querySelector('body')
const prev = document.querySelector('.prev')
const next = document.querySelector('.next')
const playpause = document.querySelector('.playpause')
const audio = document.querySelector('audio')
const title = document.querySelector('.title')
const currentTime = document.querySelector('#currentTime')
const duration = document.querySelector('#duration')
const seekSlider = document.getElementById('seek-slider');
const volumeSlider = document.getElementById('volume-slider');
const outputContainer = document.getElementById('volume-output');


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

const showRangeProgress = (rangeInput) => {
    if (rangeInput === seekSlider) audioPlayerContainer.style.setProperty('--seek-before-width', rangeInput.value / rangeInput.max * 100 + '%');
    else audioPlayerContainer.style.setProperty('--volume-before-width', rangeInput.value / rangeInput.max * 100 + '%');
}

seekSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});
volumeSlider.addEventListener('input', (e) => {
    showRangeProgress(e.target);
});

const displayDuration = () => {
    duration.textContent = formatTime(audio.duration);
}

const setSliderMax = () => {
    seekSlider.max = Math.floor(audio.duration);
}

const displayBufferedAmount = () => {
    const bufferedAmount = Math.floor(audio.buffered.end(audio.buffered.length - 1));
    audioPlayerContainer.style.setProperty('--buffered-width', `${(bufferedAmount / seekSlider.max) * 100}%`);
}
audio.addEventListener('progress', displayBufferedAmount);

if (audio.readyState > 0) {
    displayDuration();
    setSliderMax();
    displayBufferedAmount();
} else {
    audio.addEventListener('loadedmetadata', () => {
        displayDuration();
        setSliderMax();
        displayBufferedAmount();
    });
}

audio.addEventListener('timeupdate', ()=>{
    let sec = audio.currentTime
    let total = audio.duration
    let audioPlayed = (sec/total)*100
    // displayBufferedAmount()

    currentTime.textContent = formatTime(sec)
    seekSlider.value = Math.floor(audio.currentTime);
    audioPlayerContainer.style.setProperty('--seek-before-width', `${seekSlider.value / seekSlider.max * 100}%`);

})

volumeSlider.addEventListener('input', (e) => {
    const value = e.target.value;

    outputContainer.textContent = value;
    audio.volume = value / 100;
});