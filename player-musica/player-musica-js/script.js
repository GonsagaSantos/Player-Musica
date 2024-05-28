const songName = document.getElementById("song-name"); //o valor da const é imutável
const bandName = document.getElementById("artist-name"); //getElementById é autoexplicativo, pega o elemento do HTML pela ID que está na tag
const song = document.getElementById("audio");
const cover = document.getElementById("cover");
const play = document.getElementById("play");
const next = document.getElementById("next");
const previous = document.getElementById("previous");
const currentProgress = document.getElementById("current-progress");
const progressContainer = document.getElementById("progress-container");
const shuffle = document.getElementById("shuffle");

const Nirvana = {
    songName : "Come As You Are",
    artist : "Nirvana",
    file : "nevermind"
}

const ArthurVerocai = {
    songName : "Dedicada a Ela",
    artist : "Arthur Verocai",
    file : "arthurverocai"
}

const Deftones = {
    songName : "Changes",
    artist : "Deftones",
    file : "whitepony"
}

let isPlaying = false; //a let é mutável
let isShuffled = false;
const originalPlaylist = [Nirvana, ArthurVerocai, Deftones]; //uma array
let sortedPlaylist = [...originalPlaylist]; //as reticências são "spread"
let index = 0;

function playsong(){ //declarou uma função
    play.querySelector(".bi").classList.remove("bi-play-circle-fill"); //querySelector pesquisou a classe .bi 
    play.querySelector(".bi").classList.add("bi-pause-circle-fill"); //classlist.add procura um elemento dentro da classe, add e remove estão substituindo os iconss
    song.play();
    isPlaying = true; //agora ela está como true, porque a função é da música tocando
}
function pausesong(){
    play.querySelector(".bi").classList.remove("bi-pause-circle-fill");
    play.querySelector(".bi").classList.add("bi-play-circle-fill");
    song.pause();
    isPlaying = false; //enquanto aqui ela está como falsa, porque está na função song.pause()
}

function PlayDecider() { //declarei uma função que decide se pausa ou não, dependendo da situação das funções acima
    if (isPlaying === true) { //if e else básico
        pausesong();
    } else {
        playsong();
    }
}

function initializeSong(){
    cover.src = `images/${originalPlaylist[index].file}.jpg`; //uma função que atualiza dinamicamente
    song.src = `songs/${originalPlaylist[index].file}.mp3` //cada um dos elementos do site
    songName.innerText = originalPlaylist[index].songName; //de acordo com a array que você citou
    bandName .innerText = originalPlaylist[index].artist;
}

function previousSong() {
    if(index === 0){
        index = originalPlaylist.length - 1;
    }  else {
        index -= 1;
    }
    initializeSong();
    playsong();
}

function nextSong() {
    if(index === originalPlaylist.length - 1){
        index = 0;
    }  else {
        index += 1;
    }
    initializeSong();
    playsong();
}

function updateProgressBar(){
    const barWidth = (song.currentTime/song.duration)*100;
    currentProgress.style.setProperty("--progress", `${barWidth}%`)

}

function jumpTo(event){
    const width = progressContainer.clientWidth;
    const clickPosition = event.offsetX;
    const jumpToTime = (clickPosition/width)*song.duration;
    song.currentTime = jumpToTime;
}

function shuffleArray(preShuffleArray) {
    const size = preShuffleArray.length;
    let currentIndex = size - 1;
    while (currentIndex > 0) {
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
        shuffleArray(sortedPlaylist);
        shuffle.querySelector(".bi").classList.add("bi-shuffle");
    } else {
        isShuffled = false;
        sortedPlaylist = [...originalPlaylist];
        shuffle.querySelector(".bi").classList.remove("bi-shuffle");
    }
}

initializeSong();

play.addEventListener("click", PlayDecider); //um evento de click, que chama e exerce a função playdecider
previous.addEventListener("click", previousSong); //a mesma coisa com a respectiva função
next.addEventListener("click", nextSong);
song.addEventListener("timeupdate", updateProgressBar);
progressContainer.addEventListener("click", jumpTo);
shuffle.addEventListener("click", shuffleClicked);
