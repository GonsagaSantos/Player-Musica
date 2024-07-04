const songName = document.getElementById("song-name");
const bandName = document.getElementById("artist-name");
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffle = document.getElementById("shuffle");
const repeat = document.getElementById("repeat");
const like = document.getElementById("like");
const totalTime = document.getElementById("total-time");
const playingTime = document.getElementById("playing-time");
const displayNextSong = document.getElementById("display-next-song");

const Nirvana = {
        songName : "Come As You Are",
        artist : "Nirvana",
        file : "nevermind",
        backgroundColor: "nirvanaBackground",
        liked: false
    }

const ArthurVerocai = {
        songName : "Dedicada a Ela",
        artist : "Arthur Verocai",
        file : "arthurverocai",
        backgroundColor: "verocaiBackground",
        liked: false
    }

const Deftones = {
        songName : "Changes",
        artist : "Deftones",
        file : "whitepony",
        backgroundColor: "deftonesBackground",
        liked: false
    }

let isPlaying = false;
let isShuffled = false; 
const originalPlaylist = JSON.parse(localStorage.getItem('playlist')) ?? [Nirvana, ArthurVerocai, Deftones];
let sortedPlaylist = [...originalPlaylist];
let index = 0;
let isFinish = false;
let buttonRepeat_clicked = false;

function playsong(){ 
    play.querySelector(".bi").classList.remove("bi-play-circle-fill");
    play.querySelector(".bi").classList.add("bi-pause-circle-fill");
    song.play();
    isPlaying = true;
}
function pausesong(){
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    song.pause();
    isPlaying = false;
}

function PlayDecider() {
    if (isPlaying) {
        pausesong();
    } else {
        playsong();
    }
}

function likeButtonRender(){
    if(sortedPlaylist[index].liked === false){ 
        like.querySelector(".bi").classList.remove("bi-heart");
        like.querySelector(".bi").classList.add("bi-heart-fill");
        like.style.color = 'white';
    } 
    else {
        like.querySelector(".bi").classList.remove("bi-heart-fill");
        like.querySelector(".bi").classList.add("bi-heart");
    }

}

function initializeSong(){
    document.body.className = sortedPlaylist[index].backgroundColor;
    cover.src = `../../images/${sortedPlaylist[index].file}.jpg`;
    song.src = `../../songs/${sortedPlaylist[index].file}.mp3`;
    songName.innerText = sortedPlaylist[index].songName;
    bandName.innerText = sortedPlaylist[index].artist;
    likeButtonRender();
}

function previousSong() {
    if(index === 0){
        index = sortedPlaylist.length - 1;
    } else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong() {
    if(index === sortedPlaylist.length - 1){
        index = 0;
    } else {
        index += 1;
    }
    initializeSong();
    playsong();
}

function updateDisplayNextSong() {
    if(index === 2){
       displayNextSong.innerText = `Próxima: ${sortedPlaylist[0].songName} - ${sortedPlaylist[0].artist}.`;
    }
    else {
        displayNextSong.innerText = `Próxima: ${sortedPlaylist[index + 1].songName} - ${sortedPlaylist[index + 1].artist}.`;
    }
}

function updateProgressBar(){
    const barWidth = (song.currentTime / song.duration) * 100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`);
}

function jumpTo(event){
    const width = progressContainer.clientWidth;        
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition / width) * song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex >= 0) {
        let randomIndex = Math.floor(Math.random() * size);
        let aux = preShuffleArray[currentIndex];
        preShuffleArray[currentIndex] = preShuffleArray[randomIndex];
        preShuffleArray[randomIndex] = aux;
        currentIndex -= 1;
    }
    return preShuffleArray;
}

function shuffleClicked() {
    if (isShuffled === false) {
        isShuffled = true;
        sortedPlaylist = shuffleArray([...originalPlaylist]);
        this.style.color = '#133955';
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        this.style.color = 'white';
    }
}

function repeatButtonClicked() {
    if(buttonRepeat_clicked === false){
        buttonRepeat_clicked = true;  
        this.style.color = '#133955';
    }
    else {
        buttonRepeat_clicked = false;
        this.style.color = 'white';
    }
}

function nextOrRepeat() { 
    if(buttonRepeat_clicked === false){
        nextSong();
    }
    else {
        playsong();
    }
}

function timeFormated(originalNumber) {  
    let hours = Math.floor(originalNumber / 3600);
    let minutes = Math.floor((originalNumber - hours * 3600) / 60);
    let seconds = Math.floor((originalNumber - hours * 3600 - minutes * 60));

    if(originalNumber >= 3600){
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    else {
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateCurrentTime() {
    playingTime.innerText = timeFormated(song.currentTime);
}

function updateTotalTime() {
    totalTime.innerText = timeFormated(song.duration);
}

function likeButtonClicked() {
    if(sortedPlaylist[index].liked === true) {
        sortedPlaylist[index].liked = false;
    }
    else {
        sortedPlaylist[index].liked = true;
    }
    likeButtonRender();
    localStorage.setItem(
        'playlist',
        JSON.stringify(originalPlaylist));
}

initializeSong();

play.addEventListener("click", PlayDecider);
previous.addEventListener("click", previousSong);
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgressBar);
song.addEventListener("timeupdate", updateCurrentTime);
song.addEventListener("ended", nextOrRepeat);
song.addEventListener("loadedmetadata", updateTotalTime);
song.addEventListener("loadedmetadata", updateDisplayNextSong);
progressContainer.addEventListener("click", jumpTo);
shuffle.addEventListener("click", shuffleClicked);
repeat.addEventListener("click", repeatButtonClicked);
like.addEventListener("click", likeButtonClicked);
playingTime.addEventListener("timeupdate", updateCurrentTime);