const images = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let currentIndex = 0;
let zoomedIn = false;

// Lightbox handlers
images.forEach((img, index) => {
  img.addEventListener('click', () => {
    openImage(index);
  });
});

closeBtn.addEventListener('click', () => {
  closeImage();
});

prevBtn.addEventListener('click', showPrevImage);
nextBtn.addEventListener('click', showNextImage);

function openImage(index) {
  lightbox.style.display = 'flex';
  lightboxImg.src = images[index].src;
  currentIndex = index;
}

function closeImage() {
  lightbox.style.display = 'none';
  zoomOut(); // Reset zoom when closed
}

function showPrevImage() {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

function showNextImage() {
  currentIndex = (currentIndex + 1) % images.length;
  lightboxImg.src = images[currentIndex].src;
}

// 🎤 Voice Search + Control
let recognition;
let isListening = false;

function startListening() {
  if (isListening) {
    recognition.stop();
    isListening = false;
    updateMicStatus("🎤 Start Listening");
    return;
  }

  recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
  recognition.lang = 'en-US';
  recognition.start();
  isListening = true;
  updateMicStatus("🛑 Stop Listening");

  recognition.onresult = function (event) {
    const spokenText = event.results[0][0].transcript.toLowerCase().trim();
    console.log("You said:", spokenText);
    giveFeedback(`Command heard: "${spokenText}"`);
    processVoiceCommand(spokenText);
  };

  recognition.onend = () => {
    isListening = false;
    updateMicStatus("🎤 Start Listening");
  };

  recognition.onerror = function (event) {
    console.error("Voice recognition error:", event.error);
    giveFeedback("Voice error: " + event.error);
  };
}

function processVoiceCommand(command) {
  if (command.includes("come back")) {
    window.history.back();
  } else if (command.includes("previous image")) {
    showPrevImage();
  } else if (command.includes("close image") || command.includes("close")) {
    closeImage();
  }else if (command.includes("scroll down")) {
    window.scrollBy(0, 300);
  } else if (command.includes("scroll up")) {
    window.scrollBy(0, -300);
  } else if (command.includes("next image")) {
    showNextImage();
  } else if (command.includes("zoom image")) {
    zoomImage();
  }
    else if (command.includes("zoom out")) {
      zoomOut();
  } else if (command.includes("open image")) {
    const number = parseInt(command.replace(/[^0-9]/g, ''));
    if (!isNaN(number) && number >= 1 && number <= images.length) {
      openImage(number - 1);  // Open the image corresponding to the number
    } else {
      giveFeedback("Please say a number between 1 and " + images.length);
    }
  } else {
    giveFeedback("Command not recognized");
  }
}



function zoomImage() {
  if (!zoomedIn) {
    lightboxImg.style.transform = "scale(1.5)";
    lightboxImg.style.transition = "transform 0.3s";
    zoomedIn = true;
    giveFeedback("Zoomed in.");
  } else {
    zoomOut();
  }
}

function zoomOut() {
  lightboxImg.style.transform = "scale(1)";
  zoomedIn = false;
}

function searchAndOpen(text) {
  let found = false;
  images.forEach((img, index) => {
    img.classList.remove('highlight');
    if (img.alt.toLowerCase().includes(text)) {
      img.classList.add('highlight');
      img.scrollIntoView({ behavior: "smooth", block: "center" });
      openImage(index);
      found = true;
    }
  });

  if (!found) {
    alert("No image matched your voice input.");
    giveFeedback("No match found.");
  }
}

function giveFeedback(message) {
  const existing = document.getElementById('voice-feedback');
  if (existing) existing.remove();

  const msgBox = document.createElement('div');
  msgBox.id = 'voice-feedback';
  msgBox.textContent = message;
  msgBox.style.position = 'fixed';
  msgBox.style.bottom = '20px';
  msgBox.style.right = '20px';
  msgBox.style.background = 'black';
  msgBox.style.color = 'white';
  msgBox.style.padding = '10px 20px';
  msgBox.style.borderRadius = '10px';
  msgBox.style.zIndex = 9999;
  msgBox.style.fontSize = '16px';

  document.body.appendChild(msgBox);

  setTimeout(() => {
    msgBox.remove();
  }, 3000);
}

function updateMicStatus(text) {
  const micButton = document.getElementById('mic-btn');
  if (micButton) {
    micButton.textContent = text;
  }
}
