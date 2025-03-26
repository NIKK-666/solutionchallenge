function openDoor() {
    const door = document.querySelector('.door-container');
   // const doorSound = document.getElementById('doorSound');

    // Play sound
   // doorSound.play();

    // Apply zoom-in effect
    door.classList.add('zoom');

    // Redirect after animation
    setTimeout(() => {
       window.location.href = 'index.html';
    }, 1200);
}

function redirectTo(page) {
    window.location.href = page;
}


