document.addEventListener("DOMContentLoaded", () => {
    // Array of students with mapping to their specific asset names.
    const students = [
        { id: 'dihansa', name: 'ディハンサ<br>さん', voiceFileName: 'dihansa.mp3' },
        { id: 'isuri', name: 'イースリ<br>さん', voiceFileName: 'isuri.mp3' },
        { id: 'noname', name: 'Noname', voiceFileName: 'noname.mp3' },
        { id: 'senuri', name: 'セヌリ<br>さん', voiceFileName: 'senuri.mp3' },
        { id: 'geenula', name: 'ヤシル<br>さん', voiceFileName: 'geenula.mp3' }, // Note filename exception based on dir
        { id: 'gesitha', name: 'ゲシタ<br>さん', voiceFileName: 'gesitha.mp3' },
        { id: 'nimesh', name: 'ニメシュ<br>さん', voiceFileName: 'nimesh.mp3' }
    ];

    let clickedCount = 0;
    const clickedStudents = new Set();
    const charactersArea = document.getElementById("characters-area");

    // Welcome Screen -> Main Stage Transition
    const btnHiSensei = document.getElementById("btn-hi-sensei");
    const welcomeScreen = document.getElementById("welcome-screen");
    const mainScreen = document.getElementById("main-screen");

    btnHiSensei.addEventListener("click", () => {
        // Prepare transition by adding zoom class
        welcomeScreen.classList.add("zoom-in-out");

        // After transition time, swap classes
        setTimeout(() => {
            welcomeScreen.classList.remove("active");
            mainScreen.classList.add("active");
            mainScreen.classList.add("enter-stage");
        }, 800);
    });

    // Drawer Logic
    const btnToggleDrawer = document.getElementById("btn-toggle-drawer");
    const studentDrawer = document.getElementById("student-drawer");

    btnToggleDrawer.addEventListener("click", () => {
        // Show the drawer completely
        studentDrawer.classList.remove("hidden");
        // Hide this button permanently once pressed
        btnToggleDrawer.classList.add("hidden");
    });

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
        // To handle mobile autoplay policies, user gesture from click makes this allowed
        audio.play().catch(e => console.error("Audio playback restricted", e));

        // Disable button styling slightly to show it was clicked, but allow re-click
        btnElement.classList.add("clicked");

        // Add character if not already added
        if (!clickedStudents.has(student.id)) {
            clickedStudents.add(student.id);
            clickedCount++;

            const charImg = document.createElement("img");
            charImg.src = `assets/students/${student.id}.png`;
            charImg.className = "character-sprite animate-slideup";

            // Align characters based on a 4-3 formation (back row girls, front row boys)
            const studentIdx = students.findIndex(s => s.id === student.id);
            const positions = [
                // Back row (Girls: 0, 1, 2, 3)
                { left: '15%', bottom: '25%', zIndex: 10, scale: 0.9 },
                { left: '38%', bottom: '25%', zIndex: 10, scale: 0.9 },
                { left: '62%', bottom: '25%', zIndex: 10, scale: 0.9 },
                { left: '85%', bottom: '25%', zIndex: 10, scale: 0.9 },
                // Front row (Boys: 4, 5, 6)
                { left: '26.5%', bottom: '10%', zIndex: 20, scale: 1.05 },
                { left: '50%', bottom: '10%', zIndex: 20, scale: 1.05 },
                { left: '73.5%', bottom: '10%', zIndex: 20, scale: 1.05 }
            ];

            const pos = positions[studentIdx] || { left: '50%', bottom: '15%', zIndex: 15, scale: 1 };

            charImg.style.left = pos.left;
            charImg.style.bottom = pos.bottom;
            charImg.style.zIndex = pos.zIndex;
            charImg.style.transform = `translateX(-50%) scale(${pos.scale})`;
            charImg.style.width = '20%'; // Since mobile screens are small, limit width to around 15-20%

            charactersArea.appendChild(charImg);

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
        }, 800);
    }

    const thankYouBanner = document.getElementById("thank-you-banner");

    btnLetUsThank.addEventListener("click", () => {
        thankYouBanner.classList.remove("hidden");
        thankYouBanner.classList.add("animate-banner");

        // Optionally create some confetti effect
        createConfetti();
    });

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
