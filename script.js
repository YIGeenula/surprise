document.addEventListener("DOMContentLoaded", () => {
    // Countdown Timer logic
    const targetDate = new Date("2026-03-14T09:32:00").getTime();
    const countdownScreen = document.getElementById("countdown-screen");
    const volumeCheckModal = document.getElementById("volume-check-modal");
    const welcomeScreen = document.getElementById("welcome-screen");

    const timerMusic = new Audio('assets/timer-music.mp3');
    timerMusic.loop = true;
    let isTimerMusicPlaying = false;
    let countdownActive = true;
    let autoplayTried = false;
    let userToggledMusic = false;

    const btnToggleTimerMusic = document.getElementById("btn-toggle-timer-music");
    const musicHint = document.getElementById("music-hint");

    if (btnToggleTimerMusic) {
        btnToggleTimerMusic.addEventListener("click", (e) => {
            e.stopPropagation(); // prevent body click
            if (musicHint) musicHint.classList.add("hidden");

            if (isTimerMusicPlaying) {
                timerMusic.pause();
                isTimerMusicPlaying = false;
                btnToggleTimerMusic.innerHTML = "🔇";
                userToggledMusic = true;
            } else {
                timerMusic.play().then(() => {
                    isTimerMusicPlaying = true;
                    btnToggleTimerMusic.innerHTML = "🔊";
                    userToggledMusic = true;
                }).catch(e => console.error("Audio playback restricted", e));
            }
        });
    }

    // In case browser blocks autoplay, allow first click anywhere to start the timer music
    document.body.addEventListener("click", () => {
        if (countdownActive && !isTimerMusicPlaying && !userToggledMusic) {
            timerMusic.play().then(() => {
                isTimerMusicPlaying = true;
                if (btnToggleTimerMusic) btnToggleTimerMusic.innerHTML = "🔊";
                if (musicHint) musicHint.classList.add("hidden");
            }).catch(e => console.log("Audio playback restricted", e));
        }
    });

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance <= 0) {
            countdownActive = false;
            // Countdown finished
            if (countdownScreen) countdownScreen.classList.remove("active");
            if (volumeCheckModal) volumeCheckModal.style.display = "";
            if (welcomeScreen) welcomeScreen.style.display = "";

            // Stop timer music when countdown is over
            timerMusic.pause();
            timerMusic.currentTime = 0;
            isTimerMusicPlaying = false;

            return true;
        } else {
            countdownActive = true;
            // Update UI
            document.getElementById("cd-days").innerText = Math.floor(distance / (1000 * 60 * 60 * 24)).toString().padStart(2, '0');
            document.getElementById("cd-hours").innerText = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)).toString().padStart(2, '0');
            document.getElementById("cd-minutes").innerText = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)).toString().padStart(2, '0');
            document.getElementById("cd-seconds").innerText = Math.floor((distance % (1000 * 60)) / 1000).toString().padStart(2, '0');

            // Hide normal elements while countdown is active
            if (volumeCheckModal) volumeCheckModal.style.display = "none";
            if (welcomeScreen) welcomeScreen.style.display = "none";
            if (countdownScreen) countdownScreen.classList.add("active");

            // Try playing timer music automatically
            if (!isTimerMusicPlaying && !autoplayTried && !userToggledMusic) {
                autoplayTried = true;
                timerMusic.play().then(() => {
                    isTimerMusicPlaying = true;
                    if (btnToggleTimerMusic) btnToggleTimerMusic.innerHTML = "🔊";
                }).catch(e => {
                    console.error("Countdown music autoplay restricted. Needs user interaction.", e);
                    if (btnToggleTimerMusic) btnToggleTimerMusic.innerHTML = "🔇";
                });
            }

            return false;
        }
    }

    let cdInterval;
    if (!updateCountdown()) {
        cdInterval = setInterval(() => {
            if (updateCountdown()) clearInterval(cdInterval);
        }, 1000);
    }

    // Array of students with mapping to their specific asset names.
    const students = [
        { id: 'dihansa', name: 'ディハンサー<br>さん', voiceFileName: 'dihansa.mp3', message: 'Sensei, thank you for teaching us so patiently! We will never forget you! 💖' },
        { id: 'isuri', name: 'イスリ<br>さん', voiceFileName: 'isuri.mp3', message: 'You made learning Japanese so incredibly easy to understand! Thank you for everything, Sensei! 🌸' },
        { id: 'senuri', name: 'セヌリ<br>さん', voiceFileName: 'senuri.mp3', message: 'Your classes were always the brightest part of my day! Thank you from the bottom of my heart! ✨' },
        { id: 'kaveesha', name: 'カウィーシャ<br>さん', voiceFileName: 'kaveesha.mp3', message: 'Thank you for the wonderful memories, Sensei! You are the best! 💕' },
        { id: 'geenula', name: 'ヤシル<br>さん', voiceFileName: 'geenula.mp3', message: 'Sensei, no words can express how amazing you are as a teacher! I am so deeply grateful! 🥺' },
        { id: 'gesitha', name: 'ゲシタ<br>さん', voiceFileName: 'gesitha.mp3', message: 'Thank you for your endless support, patience, and guidance! We will miss you so much! 🌟' },
        { id: 'nimesh', name: 'ニメシュ<br>さん', voiceFileName: 'nimesh.mp3', message: 'Arigatou gozaimasu, Sensei! Your teachings truly changed my perspective on learning Japanese.🙏' }
    ];

    let messagesRead = new Set();

    let clickedCount = 0;
    const clickedStudents = new Set();
    const charactersArea = document.getElementById("characters-area");

    const bgMusic = new Audio('assets/bgmusic.mp3');
    bgMusic.loop = true;
    bgMusic.volume = 0.4;
    let activeVoices = 0;

    // Volume Check Overlay Logic
    // volumeCheckModal is already declared
    const btnVolumeOk = document.getElementById("btn-volume-ok");

    if (btnVolumeOk && volumeCheckModal) {
        btnVolumeOk.addEventListener("click", () => {
            volumeCheckModal.classList.add("hidden");
        });
    }

    // Welcome Screen -> Main Stage Transition
    const btnHiSensei = document.getElementById("btn-hi-sensei");
    // welcomeScreen is already declared
    const mainScreen = document.getElementById("main-screen");

    btnHiSensei.addEventListener("click", () => {
        bgMusic.play().catch(e => console.error("Audio playback restricted", e));

        // Prepare transition by adding zoom class
        welcomeScreen.classList.add("zoom-in-out");

        // After transition time, swap classes
        setTimeout(() => {
            welcomeScreen.classList.remove("active");
            welcomeScreen.style.pointerEvents = "none";
            mainScreen.classList.add("active");
            mainScreen.classList.add("enter-stage");
        }, 800);
    });

    // Drawer Logic
    const btnToggleDrawer = document.getElementById("btn-toggle-drawer");
    const studentDrawer = document.getElementById("student-drawer");
    const touchHint = document.getElementById("touch-hint");

    function openStudentDrawer() {
        // Show the drawer completely
        studentDrawer.classList.remove("hidden");
        // Hide this button permanently once pressed
        btnToggleDrawer.classList.add("hidden");
        // Hide the touch hint message
        if (touchHint) touchHint.classList.add("hidden");
    }

    btnToggleDrawer.addEventListener("click", openStudentDrawer);
    if (touchHint) touchHint.addEventListener("click", openStudentDrawer);

    // Populate student buttons
    const buttonsContainer = document.getElementById("student-buttons-container");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)(); // Unlocking required on some mobiles? Let's just use Audio element to be simpler, but standard <audio> tag is fine.

    students.forEach(student => {
        const btn = document.createElement("button");
        btn.className = "student-btn";
        btn.id = `btn-${student.id}`;

        // Wrap text in span to maintain structure while adding gloss overlay independently if needed
        const textSpan = document.createElement("span");
        textSpan.innerHTML = student.name;
        textSpan.style.position = "relative";
        textSpan.style.zIndex = "2";
        btn.appendChild(textSpan);

        // Cache audio objects inside map to avoid re-parsing if clicked multiple times
        // We'll let them play again if re-clicked
        btn.addEventListener("click", () => {
            handleStudentClick(student, btn);
        });

        buttonsContainer.appendChild(btn);
    });

    function handleStudentClick(student, btnElement) {
        // Play Audio
        const audio = new Audio(`assets/voice/${student.voiceFileName}`);

        activeVoices++;
        bgMusic.volume = 0.1;

        // To handle mobile autoplay policies, user gesture from click makes this allowed
        audio.play().catch(e => console.error("Audio playback restricted", e));

        audio.addEventListener("ended", () => {
            activeVoices--;
            if (activeVoices <= 0) {
                activeVoices = 0;
                bgMusic.volume = 0.4;
            }
        });

        // Disable button styling slightly to show it was clicked, but allow re-click
        btnElement.classList.add("clicked");

        // Add character if not already added
        if (!clickedStudents.has(student.id)) {
            clickedStudents.add(student.id);
            clickedCount++;

            const charImg = document.createElement("img");
            charImg.src = `assets/students/${student.id}.png`;
            charImg.className = "character-sprite animate-slideup";
            charImg.dataset.id = student.id;

            // Align characters in a staggered V-formation to prevent overlapping
            const studentIdx = students.findIndex(s => s.id === student.id);
            const positions = [
                // Girls (0, 1, 2, 3)
                { left: '15%', bottom: '75%', zIndex: 10, scale: 0.9 },
                { left: '38%', bottom: '75%', zIndex: 10, scale: 0.9 },
                { left: '62%', bottom: '75%', zIndex: 10, scale: 0.9 },
                { left: '85%', bottom: '75%', zIndex: 10, scale: 0.9 },
                // Boys (4, 5, 6)
                { left: '34%', bottom: '22%', zIndex: 20, scale: 1.0 },
                { left: '66%', bottom: '22%', zIndex: 20, scale: 1.0 },
                { left: '50%', bottom: '10%', zIndex: 30, scale: 1.1 }
            ];

            const pos = positions[studentIdx] || { left: '50%', bottom: '15%', zIndex: 15, scale: 1 };

            charImg.style.left = pos.left;
            charImg.style.bottom = pos.bottom;
            charImg.style.zIndex = pos.zIndex;
            charImg.style.setProperty('--target-scale', pos.scale);
            charImg.style.transform = `translateY(0) scale(${pos.scale}) translateX(-50%)`;
            charImg.style.width = '20%'; // Since mobile screens are small, limit width to around 15-20%

            charactersArea.appendChild(charImg);

            // Make character clickable for message
            charImg.classList.add("clickable-character");
            charImg.addEventListener("click", () => {
                const msgModal = document.getElementById("student-message-modal");
                const msgName = document.getElementById("student-message-name");
                const msgText = document.getElementById("student-message-text");
                msgName.innerHTML = student.name.replace('<br>', ' ');
                msgText.textContent = student.message || "Thank you, Sensei!";
                msgModal.classList.remove("hidden");
                messagesRead.add(student.id);
            });

            // Check if all are clicked
            const totalStudents = students.length;
            if (clickedCount === totalStudents) {
                onAllStudentsClicked();
            }
        }
    }

    const btnLetUsThank = document.getElementById("btn-let-us-thank");

    function onAllStudentsClicked() {
        // Delay to let the last character pop in
        setTimeout(() => {
            studentDrawer.classList.add("hidden");
            btnToggleDrawer.classList.add("hidden");
            btnToggleDrawer.classList.remove("open-state");

            btnLetUsThank.classList.remove("hidden");
            // double requestAnimationFrame guarantees the element is rendered as display: block
            // before the animation class is applied, triggering it perfectly.
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    btnLetUsThank.classList.add("animate-popin");
                });
            });

            // Start shaking effect to convince reading
            setInterval(() => {
                const characters = document.querySelectorAll(".character-sprite");
                characters.forEach((char, index) => {
                    // Stagger the shake so they don't all shake at exactly the same time
                    const randomDelay = Math.random() * 500 + (index * 300);
                    setTimeout(() => {
                        if (char.dataset.id && messagesRead.has(char.dataset.id)) {
                            return; // don't shake if already read
                        }
                        char.classList.remove("shake-effect");
                        void char.offsetWidth; // trigger reflow
                        char.classList.add("shake-effect");
                    }, randomDelay);
                });
            }, 4000);
        }, 800);
    }

    const thankYouBanner = document.getElementById("thank-you-banner");
    const cryingCatAudio = new Audio('assets/crying-cat-sound.mp3');

    cryingCatAudio.addEventListener("ended", () => {
        if (activeVoices === 0) bgMusic.volume = 0.4;
    });

    btnLetUsThank.addEventListener("click", () => {
        if (messagesRead.size < students.length) {
            const customAlert = document.getElementById("custom-alert");
            if (customAlert) {
                customAlert.classList.remove("hidden");
                bgMusic.volume = 0.1;
                cryingCatAudio.currentTime = 0;
                cryingCatAudio.play().catch(e => console.error(e));
            }
            return;
        }

        thankYouBanner.classList.remove("hidden");
        thankYouBanner.classList.add("animate-banner");

        // Optionally create some confetti effect
        createConfetti();
    });

    // Modal Close Logic
    const btnAlertOk = document.getElementById("btn-alert-ok");
    if (btnAlertOk) {
        btnAlertOk.addEventListener("click", () => {
            document.getElementById("custom-alert").classList.add("hidden");
            cryingCatAudio.pause();
            if (activeVoices === 0) bgMusic.volume = 0.4;
        });
    }

    const btnCloseMessage = document.getElementById("btn-close-message");
    if (btnCloseMessage) {
        btnCloseMessage.addEventListener("click", () => {
            document.getElementById("student-message-modal").classList.add("hidden");
        });
    }

    const btnReturn = document.getElementById("btn-return");
    if (btnReturn) {
        btnReturn.addEventListener("click", () => {
            window.location.reload();
        });
    }

    function createConfetti() {
        const container = document.querySelector('.confetti-container');
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];

        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = `${Math.random() * 100}vw`;
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 2}s`;
            container.appendChild(confetti);
        }
    }

    // Sakura Generation
    function createSakura() {
        const container = document.getElementById('sakura-container');
        if (!container) return;
        const petalCount = 30; // Mobile friendly amount

        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.className = 'sakura-petal';

            // Randomize size, position, and animation properties
            const size = Math.random() * 8 + 6; // 6px to 14px
            petal.style.width = `${size}px`;
            petal.style.height = `${size * 1.5}px`;

            petal.style.left = `${Math.random() * 100}vw`;
            const duration = Math.random() * 5 + 5; // 5s to 10s
            petal.style.animationDuration = `${duration}s`;
            // Negative delay to start with petals already falling
            petal.style.animationDelay = `-${Math.random() * duration}s`;

            container.appendChild(petal);
        }
    }

    createSakura();
});
