document.addEventListener("DOMContentLoaded", function () {
  const songs = [
    { src: "songs/animal.mp3", title: "ANIMAL", artist: "Manan Bharadwaj, Vishal Mishra, Jaani" },
    { src: "songs/peelings.mp3", title: "PEELINGS", artist: "Shankarr Babu Kandukoori, Laxmi Dasa" },
    { src: "songs/hyraanaa.mp3", title: "GAMECHANGER", artist: "Avinash Kolla, Rama Krishna, Monika" },
    { src: "songs/audio4.mp3", title: "SWEETY", artist: "Siddharth Mahadevan, rabbit M C" },
    { src: "songs/og.mp3", title: "OG", artist: "Thaman K" },
    { src: "songs/okey oka.mp3", title: "OKEY OKA LOKAM", artist: "Sid Sriram" },
    { src: "songs/jathara.mp3", title: "JATHARA", artist: " Mahalingam" },
    { src: "songs/chuttamalle.mp3", title: "CHUTTAMALLE", artist: "Shilpa rao" },
    { src: "songs/arere.mp3", title: "ARERE YEKKADA", artist: "Naresh Iyer, Manisha" },
    { src: "songs/dilse.mp3", title: "Dilse", artist: "Karthik,Shwetha Mohan,DSP" },
    // Add more songs here if needed
  ];

  let currentSongIndex = 0;
  let currentSongTime = {}; 
  const audio = new Audio();
  const playPauseBtn = document.getElementById("play-pause");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");
  const currentTitle = document.getElementById("current-title");
  const playlistItems = document.querySelectorAll(".spotify-playlist .item");

    // Format time helper function
    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.floor(seconds % 60);
      return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
  
   // Create and initialize trackers
   playlistItems.forEach((item, index) => {
    const tracker = document.createElement("div");
    tracker.className = "tracker";
    tracker.innerHTML = `
      <span class="current-time">0:00</span> / <span class="duration">0:00</span>
      <div class="progress-bar-container">
        <div class="progress-bar"></div>
      </div>`;
    item.appendChild(tracker);
    tracker.querySelector(".progress-bar-container").addEventListener("click", event => {
      handleProgressBarClick(event, item);
    });
  
    const tempAudio = new Audio(songs[index].src);
    tempAudio.addEventListener("loadedmetadata", () => {
      const duration = formatTime(tempAudio.duration);
      tracker.querySelector(".duration").textContent = duration;
    });
  });


  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  document.addEventListener("DOMContentLoaded", function () {
    const audio = document.getElementById("audio-player");
    const volumeSlider = document.querySelector(".volume-slider");
  
    // Set the initial volume based on the slider value
    audio.volume = volumeSlider.value;
  
    // Add event listener to the volume slider
    volumeSlider.addEventListener("input", function () {
      audio.volume = volumeSlider.value;
    });
  });
  

  // Load a song
  function loadSong(index) {
    const song = songs[index];
    audio.src = song.src;
    currentTitle.textContent = `${song.title} - ${song.artist}`;
    audio.load();
    audio.addEventListener("loadedmetadata", () => {
      console.log("Audio loaded"); // Debugging line
      const duration = formatTime(audio.duration);
      const currentTracker = playlistItems[index].querySelector(".tracker");
      currentTracker.querySelector(".duration").textContent = duration;
       // Set the current time to the previously saved time for this song (if any)
       if (currentSongTime[index]) {
        audio.currentTime = currentSongTime[index];
      }
      else {
        audio.currentTime = 0; // If not, start from 0
      }
      console.log("Current time set to:", audio.currentTime); // Debugging line
      // Ensure the current time starts from 0.00 when the song is loaded
       if (currentSongTime[index] === undefined || currentSongTime[index] === 0) {
        audio.currentTime = 0; // Reset to the start if no saved time
      } else {
        audio.currentTime = currentSongTime[index]; // Load saved time
      }
    });
  }
  function updateTracker() {
    const currentTracker = playlistItems[currentSongIndex].querySelector(".tracker");
    const currentTime = audio.currentTime;
    const duration = audio.duration;

    currentTracker.querySelector(".current-time").textContent = formatTime(currentTime);

    const progressBar = currentTracker.querySelector(".progress-bar");
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
  }


  // Handle clicks on the progress bar
  function handleProgressBarClick(event,item) {
    const progressBarContainer = event.currentTarget;
    const rect = progressBarContainer.getBoundingClientRect();
    const offsetX = event.clientX - rect.left;
    const width = rect.width;

    const seekTime = (offsetX / width) * audio.duration;
    console.log("Seek time:", seekTime); // Debugging line
    // if (playlistItems[currentSongIndex] === item) {
      // Update the current time of the active song

    
    audio.currentTime = seekTime; // Update the current time of the active song
    
     // **Change Here: Ensure playback resumes if the song was playing**
  if (audio.paused) {
    audio.play(); // Start playing immediately after seeking
    playPauseBtn.textContent = "⏸️"; // Update play/pause button
  // }
}
    updateTracker(); // Update the tracker UI immediately
      
}

// Attach click event to progress bars
  playlistItems.forEach((item, index) => {
    const progressBarContainer = item.querySelector(".progress-bar-container");
    progressBarContainer.addEventListener("click", handleProgressBarClick);
  });

  // Play or Pause functionality
  function togglePlayPause() {
    if (audio.paused) {
      audio.play();
      playPauseBtn.textContent = "⏸️"; // Change to Pause Icon
    } else {
      audio.pause();
      playPauseBtn.textContent = "▶️"; // Change to Play Icon
    }
  }

  // Skip to the next song
  function nextSong() {
    currentSongIndex = (currentSongIndex + 1) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playPauseBtn.textContent = "⏸️";
    updatePlaylistUI();
  }

  // Go to the previous song
  function prevSong() {
    currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
    loadSong(currentSongIndex);
    audio.play();
    playPauseBtn.textContent = "⏸️";
    updatePlaylistUI();
  }
   
  // Update the playlist UI
   function updatePlaylistUI() {
    playlistItems.forEach((item, index) => {
      item.classList.toggle("playing", index === currentSongIndex);
      const tracker = item.querySelector(".tracker");
      if (index !== currentSongIndex) {
        tracker.querySelector(".current-time").textContent = "0:00";
        tracker.querySelector(".progress-bar").style.width = "0%";
      }
    });
  }

  // Playlist click event
  playlistItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      if (currentSongIndex === index && !audio.paused) {
        // Pause the song if it is already playing
        audio.pause();
        item.classList.remove("playing");
        playPauseBtn.textContent = "▶️";
      } else {
        playlistItems.forEach(i => i.classList.remove("playing"));
        // Play the selected song
        console.log(`Item clicked: ${index}`);
        currentSongIndex = index;
        loadSong(currentSongIndex);
        audio.play();
        playPauseBtn.textContent = "⏸️";
        item.classList.add("playing");
        updatePlaylistUI();
      }
    });
  });

  // Store current time of the song when paused
  audio.addEventListener("pause", () => {
    currentSongTime[currentSongIndex] = audio.currentTime;
  });
    
  // Update tracker as the song plays
  audio.addEventListener("timeupdate", updateTracker);

  playPauseBtn.addEventListener("click", () => {
    if (audio.paused) {
      audio.play();
      playlistItems[currentSongIndex].classList.add("playing");
      playPauseBtn.textContent = "⏸️";
    } else {
      audio.pause();
      playlistItems[currentSongIndex].classList.remove("playing");
      playPauseBtn.textContent = "▶️";
    }
  });

   // Update tracker as the song plays
   audio.addEventListener("timeupdate", updateTracker);
   playPauseBtn.addEventListener("click", togglePlayPause);
   // Play/Pause button event listener
   playPauseBtn.addEventListener("click", () => {
     if (audio.paused) {
       audio.play();
       playlistItems[currentSongIndex].classList.add("playing");
       playPauseBtn.textContent = "⏸️";
     } else {
       audio.pause();
       playlistItems[currentSongIndex].classList.remove("playing");
       playPauseBtn.textContent = "▶️";
     }
   });

  // Event Listeners for control buttons
  playPauseBtn.addEventListener("click", togglePlayPause);
  prevBtn.addEventListener("click", prevSong);
  nextBtn.addEventListener("click", nextSong);

  // Load the first song by default
  loadSong(currentSongIndex);
});






// stopped at playing songs,todo-skip button and move duration in tracker 
