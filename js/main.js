document.addEventListener('DOMContentLoaded', () => {
    /* ================= 1. السلايدر السلس للصور المطلوبة ================= */
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 4000);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const index = parseInt(dot.getAttribute('data-index'));
            showSlide(index);
            resetSlider();
        });
    });

    // دعم السحب باللمس للموبايل
    const sliderContainer = document.querySelector('.hero-slider-container');
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        if (touchStartX - touchEndX > 40) {
            showSlide(currentSlide + 1);
            resetSlider();
        } else if (touchEndX - touchStartX > 40) {
            showSlide(currentSlide - 1);
            resetSlider();
        }
    }, { passive: true });

    startSlider();

    /* ================= 2. فلترة التمارين والأقسام ================= */
    const pills = document.querySelectorAll('.pill');
    const workoutCards = document.querySelectorAll('.workout-card');

    pills.forEach(pill => {
        pill.addEventListener('click', () => {
            pills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');

            const filter = pill.getAttribute('data-filter');

            workoutCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ================= 3. تفعيل الروابط أثناء التمرير ================= */
    const sections = document.querySelectorAll('section');
    const desktopLinks = document.querySelectorAll('.desktop-nav .nav-link');
    const mobileLinks = document.querySelectorAll('.mobile-bottom-nav .mobile-nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        desktopLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });

        mobileLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    /* ================= 4. التحقق من الاسم الرباعي والإرسال لواتساب ================= */
    const bookingForm = document.getElementById('bookingForm');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phoneNumber');
    const nameError = document.getElementById('nameError');
    const phoneError = document.getElementById('phoneError');
    const successAlert = document.getElementById('successAlert');

    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();

        nameError.textContent = '';
        phoneError.textContent = '';
        successAlert.classList.add('hidden');

        let isValid = true;

        // التحقق من الاسم الرباعي (4 كلمات على الأقل)
        const rawName = fullNameInput.value.trim();
        const nameWords = rawName.split(/\s+/).filter(word => word.length > 0);

        if (nameWords.length < 4) {
            nameError.textContent = 'عفواً، يجب إدخال الاسم رباعياً بالكامل (4 أسماء على الأقل).';
            fullNameInput.focus();
            isValid = false;
        }

        // التحقق من رقم الهاتف المصري
        const rawPhone = phoneInput.value.trim();
        const phoneRegex = /^01[0125][0-9]{8}$/;

        if (!phoneRegex.test(rawPhone)) {
            phoneError.textContent = 'يرجى إدخال رقم هاتف مصري صحيح مكون من 11 رقماً (يبدأ بـ 010 أو 011 أو 012 أو 015).';
            if (isValid) phoneInput.focus();
            isValid = false;
        }

        if (!isValid) return;

        const selectedPlan = document.querySelector('input[name="plan"]:checked');
        const planName = selectedPlan.value;
        const planPrice = selectedPlan.getAttribute('data-price');

        successAlert.classList.remove('hidden');

        const whatsappNumber = '201205414321';
        const message = `*حجز اشتراك جديد - الكابتن جيم* 🏋️‍♂️
        
*الاسم رباعي:* ${rawName}
*رقم التليفون:* ${rawPhone}
*نوع التمرينة:* ${planName}
*قيمة الاشتراك:* ${planPrice} جنية مصري`;

        const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

        setTimeout(() => {
            window.open(whatsappURL, '_blank');
        }, 1200);
    });
});
