document.addEventListener("DOMContentLoaded", () => {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: Stop observing once animated
                // observer.unobserve(entry.target); 
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    // Quote rotation logic
    const quotes = document.querySelectorAll('.quote');
    let currentQuote = 0;
    
    if (quotes.length > 0) {
        setInterval(() => {
            quotes[currentQuote].classList.remove('active');
            currentQuote = (currentQuote + 1) % quotes.length;
            quotes[currentQuote].classList.add('active');
        }, 3500);
    }

    const slideLeftElements = document.querySelectorAll('.slide-in-left');
    const slideRightElements = document.querySelectorAll('.slide-in-right');

    slideLeftElements.forEach(el => observer.observe(el));
    slideRightElements.forEach(el => observer.observe(el));

    // Birthday calculations
    const birthDate = new Date('2000-07-18');
    const today = new Date();
    
    // Calculate Age
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    
    // Calculate Days
    const diffTime = Math.abs(today - birthDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // Animate numbers
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            // using easeOut effect
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            obj.innerHTML = Math.floor(easeOutProgress * (end - start) + start).toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'age-counter' && !entry.target.classList.contains('counted')) {
                    animateValue(entry.target, 0, age, 2000);
                    entry.target.classList.add('counted');
                }
                if (entry.target.id === 'days-counter' && !entry.target.classList.contains('counted')) {
                    animateValue(entry.target, 0, diffDays, 2500);
                    entry.target.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });

    const ageElement = document.getElementById('age-counter');
    const daysElement = document.getElementById('days-counter');
    
    if (ageElement) statsObserver.observe(ageElement);
    if (daysElement) statsObserver.observe(daysElement);

    // Interactive Cake and Letter Modal
    const cakeElement = document.getElementById('interactive-cake');
    const letterModal = document.getElementById('letter-modal');
    const closeModal = document.getElementById('close-modal');
    const petalsContainer = document.getElementById('petals-container');
    let petalsInterval;

    function createPetal() {
        const petal = document.createElement('div');
        petal.classList.add('rose-petal');
        // Alternating petal icons for variety
        const petals = ['🌹', '🌸', '💖'];
        petal.innerHTML = petals[Math.floor(Math.random() * petals.length)]; 
        petal.style.left = Math.random() * 100 + 'vw';
        petal.style.animationDuration = Math.random() * 3 + 4 + 's'; // 4-7 seconds fall duration
        petal.style.fontSize = Math.random() * 15 + 20 + 'px'; // 20-35px size
        petalsContainer.appendChild(petal);

        // Remove petal after it falls to prevent memory leak
        setTimeout(() => {
            petal.remove();
        }, 8000);
    }

    if (cakeElement) {
        cakeElement.addEventListener('click', () => {
            letterModal.classList.remove('hidden');
            
            // Start dropping petals
            for (let i=0; i<20; i++) {
                setTimeout(createPetal, Math.random() * 1000); // Initial burst
            }
            petalsInterval = setInterval(createPetal, 200); // Continuous falling
        });
    }

    if (closeModal) {
        closeModal.addEventListener('click', () => {
            letterModal.classList.add('hidden');
            clearInterval(petalsInterval);
            petalsContainer.innerHTML = ''; // Clear existing petals
        });
    }

    // Yes / No Button Logic
    const btnYes = document.getElementById('btn-yes');
    const btnNo = document.getElementById('btn-no');
    const floatingMsg = document.getElementById('floating-msg');

    if (btnNo) {
        btnNo.addEventListener('mouseover', () => {
            // Move the button to a random position
            const x = Math.random() * (window.innerWidth - btnNo.offsetWidth - 100);
            const y = Math.random() * (window.innerHeight - btnNo.offsetHeight - 100);
            
            btnNo.style.position = 'fixed';
            btnNo.style.left = `${Math.abs(x)}px`;
            btnNo.style.top = `${Math.abs(y)}px`;

            // Show floating message
            floatingMsg.classList.remove('hidden');
        });
    }

    if (btnYes) {
        btnYes.addEventListener('click', () => {
            // Open letter in new tab
            window.open('letter.html', '_blank');
            // Hide modal and cleanup
            letterModal.classList.add('hidden');
            clearInterval(petalsInterval);
            petalsContainer.innerHTML = ''; 
            floatingMsg.classList.add('hidden');
        });
    }
});
