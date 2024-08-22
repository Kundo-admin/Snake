const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
let currentLetter = '';

function randomLetter() {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    currentLetter = alphabet[randomIndex];
    document.getElementById('letter').textContent = currentLetter;
    speakLetter(currentLetter);
}

function speakLetter(letter) {
    const msg = new SpeechSynthesisUtterance(letter);
    msg.lang = 'es-ES'; // Configura el idioma
    window.speechSynthesis.speak(msg);
}

function playErrorSound() {
    const errorSound = new Audio('https://www.soundjay.com/button/beep-07.wav');
    errorSound.play();
}

document.addEventListener('keydown', function(event) {
    const pressedKey = event.key.toUpperCase();
    if (pressedKey === currentLetter) {
        document.getElementById('feedback').textContent = '';
        randomLetter(); // Muestra una nueva letra
    } else {
        document.getElementById('feedback').textContent = '¡Intenta de nuevo!';
        playErrorSound(); // Reproduce un sonido de error
    }
});

// Inicia mostrando una letra al cargar la página
randomLetter();
