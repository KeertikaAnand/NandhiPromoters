// contact.js
document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const formStatus = document.getElementById('formStatus');

    if (contactForm) {
        contactForm.addEventListener('submit', async function (e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                inquiryType: document.getElementById('inquiryType').value,
                message: document.getElementById('message').value.trim(),
                date: new Date()
            };

            // Validate basic required fields
            if (!formData.name || !formData.email || !formData.phone || !formData.inquiryType || !formData.message) {
                formStatus.innerHTML = 'Please fill in all required fields.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
                return;
            }

            // Show loading status
            formStatus.innerHTML = 'Sending your message...';
            formStatus.className = 'form-status loading';
            formStatus.style.display = 'block';

            try {
                const response = await fetch('/api/contact', { // Ensure this path is correct relative to your contact.html
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    formStatus.innerHTML = 'Thank you! Your message has been sent successfully.';
                    formStatus.className = 'form-status success';
                    contactForm.reset();
                } else {
                    formStatus.innerHTML = result.message || 'Something went wrong. Please try again later.';
                    formStatus.className = 'form-status error';
                }
            } catch (error) {
                console.error('Form submission error:', error);
                formStatus.innerHTML = 'There was an error sending your message. Please try again later.';
                formStatus.className = 'form-status error';
            }

            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }

    // Phone number validation
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = this.value.replace(/[^0-9+\-\s()]/g, '');
        });
    }
});

// Initialize Google Map (This part seems unrelated to the form submission error, but keeping it here)
function initMap() {
    const officeLocation = { lat: 11.2343, lng: 77.1087 };

    const map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: officeLocation,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "weight": "2.00"
                    }
                ]
            },
            {
                "featureType": "administrative",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#fefefe"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#e67e22"
                    },
                    {
                        "visibility": "simplified"
                    }
                ]
            }
        ]
    });

    const marker = new google.maps.Marker({
        position: officeLocation,
        map: map,
        title: 'Nandhi Promoters Office',
        animation: google.maps.Animation.DROP
    });

    const infoWindow = new google.maps.InfoWindow({
        content: `
                <div style="padding: 10px; max-width: 200px;">
                    <h3 style="margin: 0 0 5px; color: #2c3e50;">Nandhi Promoters</h3>
                    <p style="margin: 0; font-size: 14px;">123 Real Estate Avenue, Coimbatore, Tamil Nadu</p>
                </div>
            `
    });

    marker.addListener('click', () => {
        infoWindow.open(map, marker);
    });
}