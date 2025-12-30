document.addEventListener('DOMContentLoaded', () => {
    // --- GLOBAL: LANGUAGE SWITCHER ---
    const langBtn = document.getElementById('langSwitchBtn');
    const body = document.body;

    // Load saved language
    const currentLang = localStorage.getItem('selectedLang') || 'en';
    if (currentLang === 'ta') {
        body.classList.add('lang-tamil');
        if (langBtn) langBtn.textContent = 'English';
    }

    const updateAttributes = () => {
        const isTa = body.classList.contains('lang-tamil');

        // Update Placeholders
        const translations = {
            'name': { en: 'Enter your full name', ta: 'உங்கள் முழுப் பெயரை உள்ளிடவும்' },
            'mobile': { en: 'Enter 10-digit mobile number', ta: '10 இலக்க மொபைல் எண்ணை உள்ளிடவும்' },
            'location': { en: 'Event venue/address', ta: 'நிகழ்ச்சி நடைபெறும் இடம்/முகவரி' },
            'paymentAmount': { en: 'Min ₹10', ta: 'குறைந்தது ₹10' },
            'timeHour': { en: 'HH', ta: 'மணி' },
            'timeMinute': { en: 'MM', ta: 'நிமிடம்' },
            'timeMinute': { en: 'MM', ta: 'நிமிடம்' },
            'transactionId': { en: 'Enter 12-digit transaction ID', ta: '12 இலக்க பரிவர்த்தனை ஐடியை உள்ளிடவும்' },
            'totalAmount': { en: 'e.g. 10000', ta: 'உதாரணம்: 10000' },
            'personCount': { en: 'e.g. 10', ta: 'உதாரணம்: 10' }
        };

        for (const [id, langs] of Object.entries(translations)) {
            const el = document.getElementById(id);
            if (el) el.placeholder = isTa ? langs.ta : langs.en;
        }

        // Update Dropdown Options (since HTML spans don't work well in <option>)
        const dropdownTranslations = {
            'functionType': [
                { val: '', en: 'Select Function', ta: 'நிகழ்ச்சியைத் தேர்ந்தெடுக்கவும்' },
                { val: 'wedding', en: 'Wedding / Marriage', ta: 'திருமணம்' },
                { val: 'conception', en: 'Reception', ta: 'வரவேற்பு' },
                { val: 'temple', en: 'Temple Function', ta: 'கோயில் திருவிழா' },
                { val: 'cultural', en: 'Cultural Event', ta: 'கலாச்சார நிகழ்வு' },
                { val: 'other', en: 'Other', ta: 'மற்றவை' }
            ],
            'serviceType': [
                { val: '', en: 'Select Service', ta: 'சேவையைத் தேர்ந்தெடுக்கவும்' },
                { val: 'isaikuzhu', en: 'Isaikuzhu Performance', ta: 'இசைக்குழு நிகழ்ச்சி' },
                { val: 'drums', en: 'Drums Performance', ta: 'மேளக் கச்சேரி' },
                { val: 'combo', en: 'Isaikuzhu + Drums Combo', ta: 'இசைக்குழு + மேளம் காம்போ' }
            ]
        };

        for (const [id, options] of Object.entries(dropdownTranslations)) {
            const select = document.getElementById(id);
            if (select) {
                Array.from(select.options).forEach(opt => {
                    const trans = options.find(t => t.val === opt.value);
                    if (trans) opt.textContent = isTa ? trans.ta : trans.en;
                });
            }
        }

        // Update Logo text and image
        const logo = document.querySelector('.logo');
        if (logo) {
            const logoIcon = '<img src="assets/img/logo.png" alt="Logo" class="nav-logo-img" id="viewLogoBtn">';
            logo.innerHTML = logoIcon + (isTa ? 'ஆதவன் இசைக்குழு' : 'Aadhavan Isaikuzhu');

            // Add Lightbox if it doesn't exist
            if (!document.getElementById('logoLightbox')) {
                const lightbox = document.createElement('div');
                lightbox.id = 'logoLightbox';
                lightbox.className = 'logo-lightbox';
                lightbox.innerHTML = '<img src="assets/img/logo.png" alt="Large Logo">';
                document.body.appendChild(lightbox);

                lightbox.onclick = () => lightbox.classList.remove('active');
            }

            // Click listener for the logo image
            const viewBtn = document.getElementById('viewLogoBtn');
            if (viewBtn) {
                viewBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document.getElementById('logoLightbox').classList.add('active');
                };
            }
        }
    };

    updateAttributes();

    if (langBtn) {
        langBtn.addEventListener('click', () => {
            const isTamil = body.classList.toggle('lang-tamil');
            const newLang = isTamil ? 'ta' : 'en';
            localStorage.setItem('selectedLang', newLang);
            langBtn.textContent = isTamil ? 'English' : 'தமிழ்';

            updateAttributes();

            // Refresh dynamic elements if needed
            if (typeof validateAndToggle === 'function') {
                validateAndToggle();
            }
        });
    }

    // --- GLOBAL: MOBILE MENU ---
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // --- PAGE DETECTION ---
    const path = window.location.pathname;
    const isPaymentPage = path.endsWith('payment.html');
    const isSuccessPage = path.endsWith('success.html');

    // --- BOOKING PAGE LOGIC ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        // Pre-select service from URL
        const urlParams = new URLSearchParams(window.location.search);
        const service = urlParams.get('service');
        if (service) {
            const select = document.getElementById('serviceType');
            if (select) select.value = service;
        }

        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                mobile: document.getElementById('mobile').value,
                date: document.getElementById('date').value,
                functionType: document.getElementById('functionType').value,
                location: document.getElementById('location').value,
                serviceType: document.getElementById('serviceType').value,
                personCount: document.getElementById('personCount').value,
                vehicleArrangement: document.querySelector('input[name="vehicleArrangement"]:checked')?.value || 'N/A',
                timeHour: document.getElementById('timeHour').value,
                timeMinute: document.getElementById('timeMinute').value,
                timeAmPm: document.getElementById('timeAmPm').value
            };

            if (formData.mobile.length !== 10) {
                const isTa = body.classList.contains('lang-tamil');
                alert(isTa ? 'தயவுசெய்து சரியான 10 இலக்க மொபைல் எண்ணை உள்ளிடவும்.' : 'Please enter a valid 10-digit mobile number.');
                return;
            }

            // Save to localStorage
            localStorage.setItem('pendingBooking', JSON.stringify(formData));

            // Redirect to Payment Page
            window.location.href = 'payment.html';
        });
    }

    // --- PAYMENT PAGE LOGIC ---
    if (isPaymentPage) {
        const bookingDataStr = localStorage.getItem('pendingBooking');
        if (!bookingDataStr) {
            const isTa = body.classList.contains('lang-tamil');
            alert(isTa ? 'பதிவு விவரங்கள் எதுவும் கிடைக்கவில்லை. முன்பதிவு பக்கத்திற்கு மாற்றப்படுகிறது.' : 'No booking details found. Redirecting to booking page.');
            window.location.href = 'booking.html';
            return;
        }

        const bookingData = JSON.parse(bookingDataStr);

        const amountInput = document.getElementById('paymentAmount');
        const totalAmountInput = document.getElementById('totalAmount');
        const displayAdvance = document.getElementById('displayAdvance');
        const screenshotInput = document.getElementById('paymentScreenshot');
        const uploadZone = document.getElementById('screenshotUploadZone');
        const previewContainer = document.getElementById('screenshotPreviewContainer');
        const previewImage = document.getElementById('screenshotPreview');
        const placeholder = document.getElementById('uploadPlaceholder');
        const removeBtn = document.getElementById('removeScreenshot');
        const transactionIdInput = document.getElementById('transactionId');
        const confirmBtn = document.getElementById('confirmPaymentBtn');

        const calculateAdvance = () => {
            const total = parseFloat(totalAmountInput.value) || 0;
            if (total > 0) {
                const advance = Math.round(total * 0.3);
                amountInput.value = advance;
            } else {
                amountInput.value = '';
            }
            validateAndToggle();
        };

        if (totalAmountInput) {
            totalAmountInput.addEventListener('input', calculateAdvance);
        }

        window.validateAndToggle = () => {
            const amount = parseFloat(amountInput.value) || 0;
            const isScreenshotUploaded = screenshotInput.files && screenshotInput.files.length > 0;
            const transactionId = transactionIdInput ? transactionIdInput.value.trim() : '';
            const isTa = body.classList.contains('lang-tamil');

            if (amount >= 10 && isScreenshotUploaded && transactionId.length > 0) {
                confirmBtn.disabled = false;
                confirmBtn.style.backgroundColor = '#25D366';
                confirmBtn.style.cursor = 'pointer';
                confirmBtn.textContent = isTa ? 'சமர்ப்பித்து வாட்ஸ்அப்பில் அறிவிக்கவும்' : 'Submit & Notify WhatsApp';
            } else {
                confirmBtn.disabled = true;
                confirmBtn.style.backgroundColor = '#ccc';
                confirmBtn.style.cursor = 'not-allowed';

                if (amount < 10) {
                    confirmBtn.textContent = isTa ? 'சரியான தொகையை உள்ளிடவும் (குறைந்தது ₹10)' : 'Enter Valid Amount (Min ₹10)';
                } else if (!isScreenshotUploaded) {
                    confirmBtn.textContent = isTa ? 'ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்' : 'Upload Screenshot';
                } else if (transactionId.length === 0) {
                    confirmBtn.textContent = isTa ? 'பரிவர்த்தனை ஐடியை உள்ளிடவும்' : 'Enter Transaction ID';
                }
            }

            if (displayAdvance) {
                displayAdvance.textContent = amount > 0 ? amount : '...';
            }
        };

        if (amountInput) {
            amountInput.addEventListener('input', validateAndToggle);
        }

        if (transactionIdInput) {
            transactionIdInput.addEventListener('input', validateAndToggle);
        }

        if (uploadZone) {
            uploadZone.onclick = () => screenshotInput.click();
            screenshotInput.onchange = (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        previewImage.src = event.target.result;
                        previewContainer.style.display = 'block';
                        placeholder.style.display = 'none';
                        validateAndToggle();
                    };
                    reader.readAsDataURL(file);
                }
            };

            removeBtn.onclick = (e) => {
                e.stopPropagation();
                screenshotInput.value = '';
                previewImage.src = '';
                previewContainer.style.display = 'none';
                placeholder.style.display = 'block';
                validateAndToggle();
            };

            // Drag and Drop
            uploadZone.ondragover = (e) => { e.preventDefault(); uploadZone.classList.add('dragover'); };
            uploadZone.ondragleave = () => uploadZone.classList.remove('dragover');
            uploadZone.ondrop = (e) => {
                e.preventDefault();
                uploadZone.classList.remove('dragover');
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    screenshotInput.files = e.dataTransfer.files;
                    screenshotInput.dispatchEvent(new Event('change'));
                }
            };
        }

        if (confirmBtn) {
            confirmBtn.onclick = async () => {
                const amount = parseFloat(amountInput.value) || 0;
                const isTa = body.classList.contains('lang-tamil');

                if (amount < 10 || screenshotInput.files.length === 0) {
                    alert(isTa ? 'தயவுசெய்து சரியான தொகையை (குறைந்தது ₹10) உள்ளிட்டு ஸ்கிரீன்ஷாட்டைப் பதிவேற்றவும்.' : 'Please enter a valid amount (Min ₹10) and upload a screenshot.');
                    return;
                }

                // Try to copy screenshot to clipboard for easy pasting in WhatsApp
                try {
                    const file = screenshotInput.files[0];
                    if (file && isSecureContext && navigator.clipboard && navigator.clipboard.write) {
                        const item = new ClipboardItem({ [file.type]: file });
                        await navigator.clipboard.write([item]);
                        alert(isTa ? 'பேமெண்ட் ஸ்கிரீன்ஷாட் கிளிப்போர்டில் நகலெடுக்கப்பட்டது! வாட்ஸ்அப் திறந்தவுடன், அதை சாட்டில் ஒட்டவும் (Ctrl+V).' : 'Payment screenshot copied to clipboard! Once WhatsApp opens, just paste (Ctrl+V) it into the chat.');
                    }
                } catch (err) {
                    console.error('Clipboard copy failed:', err);
                }

                const timeString = `${bookingData.timeHour.padStart(2, '0')}:${bookingData.timeMinute.padStart(2, '0')} ${bookingData.timeAmPm}`;
                const totalAmount = totalAmountInput ? totalAmountInput.value : 'N/A';

                const waMessageEn = `New Booking (Pending Verification)%0A%0AName: ${bookingData.name}%0AContact: ${bookingData.mobile}%0AService: ${bookingData.serviceType}%0APersons: ${bookingData.personCount}%0AVehicle Arrange (By Us): ${bookingData.vehicleArrangement}%0AFunction: ${bookingData.functionType}%0ADate: ${bookingData.date}%0ATime: ${encodeURIComponent(timeString)}%0AVenue: ${encodeURIComponent(bookingData.location)}%0ATotal Amount: ₹${totalAmount}%0AAdvance Paid: ₹${amount}%0A%0A---PAYMENT PROOF---%0ANote: I have copied the payment screenshot to my clipboard and will paste it now (please paste it now).%0A%0AThe customer has reported payment. Please verify the screenshot in your bank statement before confirming.`;

                const waMessageTa = `புதிய முன்பதிவு (சரிபார்ப்பு நிலுவையில் உள்ளது)%0A%0Aபெயர்: ${bookingData.name}%0Aதொடர்பு: ${bookingData.mobile}%0Aசேவை: ${bookingData.serviceType}%0Aநபர்கள்: ${bookingData.personCount}%0Aவாகனம் (எங்களால்): ${bookingData.vehicleArrangement === 'Yes' ? 'ஆம்' : 'இல்லை'}%0Aநிகழ்ச்சி வகை: ${bookingData.functionType}%0Aதேதி: ${bookingData.date}%0Aநேரம்: ${encodeURIComponent(timeString)}%0Aஇடம்: ${encodeURIComponent(bookingData.location)}%0Aமொத்த தொகை: ₹${totalAmount}%0Aமுன்பணம்: ₹${amount}%0A%0A---பேமெண்ட் ஆதாரம்---%0Aகுறிப்பு: நான் பேமெண்ட் ஸ்கிரீன்ஷாட்டை எனது கிளிப்போர்டில் நகலெடுத்துள்ளேன், இப்போது அதை ஒட்டுவேன்.%0A%0Aவாடிக்கையாளர் பணம் செலுத்தியதாகத் தெரிவித்துள்ளார். உறுதிப்படுத்தும் முன் உங்கள் வங்கி அறிக்கையில் ஸ்கிரீன்ஷாட்டைச் சரிபார்க்கவும்.`;

                const finalMessage = isTa ? waMessageTa : waMessageEn;
                const txId = transactionIdInput ? transactionIdInput.value.trim() : 'N/A';

                const confirmMsgEn = "Booking%20Confirmed!%0A%0AThank%20you%20for%20booking%20with%20Aadhavan%20Athiradi%20Isaikuzhu.%20Your%20booking%20has%20been%20successfully%20confirmed.%20We%20look%20forward%20to%20being%20part%20of%20your%20special%20event.";
                const confirmMsgTa = "%E0%AE%AE%E0%AF%81%E0%AE%A9%E0%AF%8D%E0%AE%AA%E0%AE%A4%E0%AE%BF%E0%AE%B5%E0%AF%81%20%E0%AE%81%E0%AE%B1%E0%AF%81%E0%AE%A4%E0%AE%BF%20%E0%AE%9A%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AF%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AE%A4%E0%AF%81!%0A%0A%E0%AE%86%E0%AE%A4%E0%AE%B5%E0%AE%A9%E0%AF%8D%20%E0%AE%85%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AE%9F%E0%AE%BF%20%E0%AE%87%E0%AE%9A%E0%AF%88%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AF%81%E0%AE%B4%E0%AF%81%E0%AE%B5%E0%AE%BF%E0%AE%B2%E0%AF%8D%20%E0%AE%AE%E0%AF%81%E0%AE%A9%E0%AF%8D%E0%AE%AA%E0%AE%A4%E0%AE%BF%E0%AE%B2%E0%AF%81%20%E0%AE%9A%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%A4%E0%AE%A4%E0%AF%81%E0%AE%B1%E0%AF%8D%E0%AE%95%E0%AF%81%20%E0%AE%A8%E0%AE%A9%E0%AF%8D%E0%AE%B1%E0%AE%BF.%20%E0%AE%81%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D%20%E0%AE%AE%E0%AF%81%E0%AE%A9%E0%AF%8D%E0%AE%AA%E0%AE%A4%E0%AE%BF%E0%AE%B5%E0%AF%81%20%E0%AE%B5%E0%AF%86%E0%AE%B1%E0%AF%8D%E0%AE%B1%E0%AE%BF%E0%AE%95%E0%AE%B0%E0%AE%AE%E0%AE%BE%E0%AE%95%20%E0%AE%81%E0%AE%B1%E0%AF%81%E0%AE%A4%E0%AE%BF%20%E0%AE%9A%E0%AF%86%E0%AE%AF%E0%AF%8D%E0%AE%AF%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AE%9F%E0%AF%8D%E0%AE%9F%E0%AF%81%E0%AE%B3%E0%AF%8D%E0%AE%B3%E0%AE%A4%E0%AF%81.%20%E0%AE%81%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AE%B3%E0%AF%8D%20%E0%AE%9A%E0%AE%BF%E0%AE%B1%E0%AE%AA%E0%AF%8D%E0%AE%AA%E0%AF%81%20%E0%AE%A8%E0%AE%BF%E0%AE%95%E0%AE%B4%E0%AF%8D%E0%AE%B5%E0%AE%BF%E0%AE%B2%E0%AF%8D%20%E0%AE%AA%E0%AE%94%E0%AF%8D%E0%AE%95%E0%AF%87%E0%AE%B1%E0%AF%8D%E0%AE%95%20%E0%AE%A8%E0%AE%BE%E0%AE%99%E0%AF%8D%E0%AE%95%E0%AF%83%E0%AE%B3%E0%AF%8D%20%E0%AE%81%E0%AE%B5%E0%AE%B2%E0%AF%81%E0%AE%9F%E0%AE%A9%E0%AF%8D%20%E0%AE%95%E0%AE%BE%E0%AE%A4%E0%AF%8D%E0%AE%A4%E0%AE%BF%E0%AE%B0%E0%AF%81%E0%AE%95%E0%AF%8D%E0%AE%95%E0%AE%BF%E0%AE%B1%E0%AF%8B%E0%AE%AE%E0%AF%8D.";

                const quickConfirmLink = `https://wa.me/91${bookingData.mobile}?text=${isTa ? confirmMsgTa : confirmMsgEn}`;
                const finalMessageWithId = `${finalMessage}%0A%0ATransaction ID: ${txId}%0A%0A---QUICK ACTION---%0AConfirm Booking to Customer:%0A${encodeURIComponent(quickConfirmLink)}`;

                window.open(`https://wa.me/917810068278?text=${finalMessageWithId}`, '_blank');

                // Store mobile for success page confirmation
                localStorage.setItem('lastBookingMobile', bookingData.mobile);

                localStorage.removeItem('pendingBooking');
                window.location.href = 'success.html';
            };
        }
    }

    // --- SUCCESS PAGE LOGIC ---
    if (isSuccessPage) {
        const confirmBtn = document.getElementById('sendWaConfirm');
        const countdownEl = document.getElementById('countdown');
        const mobile = localStorage.getItem('lastBookingMobile');

        if (confirmBtn && mobile) {
            const sendConfirmation = () => {
                const isTa = body.classList.contains('lang-tamil');
                const msgEn = "Booking Confirmed!%0A%0AThank you for booking with Aadhavan Athiradi Isaikuzhu. Your booking has been successfully confirmed. We look forward to being part of your special event.";
                const msgTa = "முன்பதிவு உறுதி செய்யப்பட்டது!%0A%0Aஆதவன் அதிரடி இசைக்குழுவில் முன்பதிவு செய்ததற்கு நன்றி. உங்கள் முன்பதிவு வெற்றிகரமாக உறுதி செய்யப்பட்டுள்ளது. உங்கள் சிறப்பு நிகழ்வில் பங்கேற்க நாங்கள் ஆவலுடன் காத்திருக்கிறோம்.";

                const finalMsg = isTa ? msgTa : msgEn;
                window.open(`https://wa.me/91${mobile}?text=${finalMsg}`, '_blank');
            };

            confirmBtn.onclick = sendConfirmation;

            // Automatic Trigger with Countdown
            let count = 3;
            if (countdownEl) {
                const timer = setInterval(() => {
                    count--;
                    countdownEl.textContent = count;
                    if (count <= 0) {
                        clearInterval(timer);
                        sendConfirmation();
                    }
                }, 1000);
            }
        }
    }
});
