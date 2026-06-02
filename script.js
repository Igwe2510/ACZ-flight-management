// ============================================================
// ACZ FLIGHT MANAGEMENT SYSTEM - Main Script
// ============================================================

// Storage Keys
const STORAGE_KEYS = {
    BOOKINGS: 'acz_bookings',
    FLIGHTS: 'acz_flights',
    CHECKINS: 'acz_checkins'
};

// Flight data - simulating airline database
const AVAILABLE_FLIGHTS = [
    {
        id: 'ACZ101',
        number: 'ACZ101',
        departure: 'NYC',
        arrival: 'LAX',
        departureTime: '08:00',
        arrivalTime: '11:30',
        duration: '5h 30m',
        aircraft: 'Boeing 777',
        seatsEconomy: 180,
        seatsBusiness: 50,
        seatsFirst: 12,
        priceEconomy: 250,
        priceBusiness: 550,
        priceFirst: 1200,
        date: getDate(0)
    },
    {
        id: 'ACZ102',
        number: 'ACZ102',
        departure: 'NYC',
        arrival: 'LAX',
        departureTime: '14:00',
        arrivalTime: '17:30',
        duration: '5h 30m',
        aircraft: 'Airbus A350',
        seatsEconomy: 200,
        seatsBusiness: 60,
        seatsFirst: 14,
        priceEconomy: 280,
        priceBusiness: 600,
        priceFirst: 1300,
        date: getDate(0)
    },
    {
        id: 'ACZ203',
        number: 'ACZ203',
        departure: 'LAX',
        arrival: 'ORD',
        departureTime: '10:00',
        arrivalTime: '16:45',
        duration: '4h 45m',
        aircraft: 'Boeing 787',
        seatsEconomy: 150,
        seatsBusiness: 40,
        seatsFirst: 10,
        priceEconomy: 320,
        priceBusiness: 700,
        priceFirst: 1500,
        date: getDate(1)
    },
    {
        id: 'ACZ304',
        number: 'ACZ304',
        departure: 'ORD',
        arrival: 'ATL',
        departureTime: '09:15',
        arrivalTime: '12:30',
        duration: '3h 15m',
        aircraft: 'Airbus A380',
        seatsEconomy: 200,
        seatsBusiness: 80,
        seatsFirst: 20,
        priceEconomy: 180,
        priceBusiness: 400,
        priceFirst: 900,
        date: getDate(0)
    },
    {
        id: 'ACZ405',
        number: 'ACZ405',
        departure: 'ATL',
        arrival: 'DFW',
        departureTime: '15:30',
        arrivalTime: '17:45',
        duration: '2h 15m',
        aircraft: 'Boeing 737',
        seatsEconomy: 160,
        seatsBusiness: 35,
        seatsFirst: 8,
        priceEconomy: 150,
        priceBusiness: 320,
        priceFirst: 700,
        date: getDate(2)
    }
];

// City codes mapping
const CITY_NAMES = {
    'NYC': 'New York',
    'LAX': 'Los Angeles',
    'ORD': 'Chicago',
    'ATL': 'Atlanta',
    'DFW': 'Dallas'
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get date string for n days from today
 */
function getDate(daysFromNow) {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split('T')[0];
}

/**
 * Format date string to readable format
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options);
}

/**
 * Format time string
 */
function formatTime(timeString) {
    return timeString;
}

/**
 * Generate booking reference
 */
function generateBookingReference() {
    return 'ACZ' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

/**
 * Generate unique ID
 */
function generateId() {
    return 'ID' + Date.now() + Math.random().toString(36).substr(2, 9);
}

/**
 * Show toast notification
 */
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/**
 * Validate email
 */
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate phone number
 */
function isValidPhone(phone) {
    const re = /^[\d\s\-\+\(\)]{10,}$/;
    return re.test(phone);
}

/**
 * Get localStorage data
 */
function getStorageData(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
}

/**
 * Save to localStorage
 */
function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// ============================================================
// BOOKING FUNCTIONALITY
// ============================================================

/**
 * Initialize booking form
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');
    const departureDate = document.getElementById('departureDate');
    
    // Set minimum date to today
    departureDate.min = getDate(0);
    departureDate.value = getDate(0);
    
    form.addEventListener('submit', handleBookingSubmit);
}

/**
 * Handle booking form submission
 */
function handleBookingSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const departure = document.getElementById('departure').value;
    const arrival = document.getElementById('arrival').value;
    const departureDate = document.getElementById('departureDate').value;
    const passengers = parseInt(document.getElementById('passengers').value);
    const passengerName = document.getElementById('passengerName').value;
    const passengerEmail = document.getElementById('passengerEmail').value;
    const passengerPhone = document.getElementById('passengerPhone').value;
    const classType = document.getElementById('classType').value;
    
    // Validation
    if (departure === arrival) {
        showToast('Departure and arrival cities must be different', 'error');
        return;
    }
    
    if (!isValidEmail(passengerEmail)) {
        showToast('Please enter a valid email address', 'error');
        return;
    }
    
    if (!isValidPhone(passengerPhone)) {
        showToast('Please enter a valid phone number', 'error');
        return;
    }
    
    // Find available flights
    const availableFlights = AVAILABLE_FLIGHTS.filter(flight => 
        flight.departure === departure && 
        flight.arrival === arrival &&
        flight.date === departureDate
    );
    
    if (availableFlights.length === 0) {
        showToast('No flights available for the selected route and date', 'warning');
        return;
    }
    
    // Display available flights
    displayAvailableFlights(availableFlights, passengers, classType, passengerName, passengerEmail, passengerPhone);
}

/**
 * Display available flights for booking
 */
function displayAvailableFlights(flights, passengers, classType, name, email, phone) {
    const display = document.getElementById('flightsDisplay');
    const list = document.getElementById('flightsList');
    
    list.innerHTML = '';
    
    flights.forEach(flight => {
        const availableSeats = flight[
            classType === 'Economy' ? 'seatsEconomy' : 
            classType === 'Business' ? 'seatsBusiness' : 
            'seatsFirst'
        ];
        
        const price = flight[
            classType === 'Economy' ? 'priceEconomy' : 
            classType === 'Business' ? 'priceBusiness' : 
            'priceFirst'
        ];
        
        const totalPrice = price * passengers;
        
        const card = document.createElement('div');
        card.className = 'flight-card';
        card.innerHTML = `
            <div class="flight-header">
                <div class="flight-number">Flight ${flight.number}</div>
                <div class="flight-price">$${totalPrice}</div>
            </div>
            <div class="flight-details">
                <div class="flight-from">
                    <div class="flight-airport">${flight.departure}</div>
                    <div class="flight-city">${CITY_NAMES[flight.departure]}</div>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">${flight.departureTime}</div>
                </div>
                <div class="flight-duration">
                    <div style="margin-bottom: 4px;">✈️</div>
                    <div>${flight.duration}</div>
                </div>
                <div class="flight-to">
                    <div class="flight-airport">${flight.arrival}</div>
                    <div class="flight-city">${CITY_NAMES[flight.arrival]}</div>
                    <div style="font-size: 0.85rem; color: #666; margin-top: 4px;">${flight.arrivalTime}</div>
                </div>
            </div>
            <div class="flight-info">
                <div class="flight-info-item">
                    <span class="flight-info-label">Aircraft:</span>
                    <span class="flight-info-value">${flight.aircraft}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Class:</span>
                    <span class="flight-info-value">${classType}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Date:</span>
                    <span class="flight-info-value">${formatDate(flight.date)}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Passengers:</span>
                    <span class="flight-info-value">${passengers}</span>
                </div>
            </div>
            <div class="flight-seats">
                <span class="${availableSeats > 20 ? 'seats-available' : 'seats-limited'}">
                    ${availableSeats > 20 ? '✓ ' : '⚠ '}${availableSeats} seats available
                </span>
            </div>
        `;
        
        card.addEventListener('click', () => bookFlight(flight, passengers, classType, name, email, phone, price, totalPrice));
        list.appendChild(card);
    });
    
    display.classList.remove('hidden');
    display.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Book flight and show confirmation
 */
function bookFlight(flight, passengers, classType, name, email, phone, pricePerSeat, totalPrice) {
    const bookingRef = generateBookingReference();
    
    const booking = {
        id: generateId(),
        bookingReference: bookingRef,
        flightNumber: flight.number,
        departure: flight.departure,
        arrival: flight.arrival,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        date: flight.date,
        passengers: passengers,
        passengerName: name,
        passengerEmail: email,
        passengerPhone: phone,
        classType: classType,
        pricePerSeat: pricePerSeat,
        totalPrice: totalPrice,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        boardingGroup: Math.floor(Math.random() * 4) + 1,
        seatNumber: 'TBA'
    };
    
    // Save booking
    const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
    bookings.push(booking);
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    
    // Show confirmation modal
    showBookingConfirmation(booking);
    
    // Reset form
    document.getElementById('bookingForm').reset();
    document.getElementById('flightsDisplay').classList.add('hidden');
    
    // Show toast
    showToast('Flight booked successfully!', 'success');
    
    // Update my flights
    loadMyFlights();
}

/**
 * Show booking confirmation modal
 */
function showBookingConfirmation(booking) {
    const modal = document.getElementById('confirmationModal');
    const modalBody = document.getElementById('modalBody');
    
    modalBody.innerHTML = `
        <div style="text-align: center;">
            <h2 style="color: #27ae60; margin-bottom: 20px;">✓ Booking Confirmed!</h2>
            <p style="font-size: 1.1rem; margin-bottom: 30px;">Thank you for booking with ACZ Airways</p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px; text-align: left;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <strong style="color: #1a3a52;">Booking Reference</strong>
                        <div style="font-size: 1.3rem; color: #0084d1; font-weight: bold; margin-top: 5px;">${booking.bookingReference}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Flight Number</strong>
                        <div style="font-size: 1.3rem; color: #0084d1; font-weight: bold; margin-top: 5px;">${booking.flightNumber}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Passenger Name</strong>
                        <div style="margin-top: 5px;">${booking.passengerName}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Class</strong>
                        <div style="margin-top: 5px;">${booking.classType}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Departure</strong>
                        <div style="margin-top: 5px;">${booking.departure} → ${booking.arrival}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Date & Time</strong>
                        <div style="margin-top: 5px;">${formatDate(booking.date)} at ${booking.departureTime}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Passengers</strong>
                        <div style="margin-top: 5px;">${booking.passengers}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Total Price</strong>
                        <div style="font-size: 1.2rem; color: #27ae60; font-weight: bold; margin-top: 5px;">$${booking.totalPrice}</div>
                    </div>
                </div>
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
                    <strong style="color: #1a3a52;">Confirmation Email</strong>
                    <div style="margin-top: 5px; color: #666;">A confirmation email has been sent to ${booking.passengerEmail}</div>
                </div>
            </div>
            
            <p style="font-size: 0.95rem; color: #666; margin-bottom: 20px;">Please save your booking reference for check-in</p>
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// ============================================================
// CHECK-IN FUNCTIONALITY
// ============================================================

/**
 * Initialize check-in form
 */
function initCheckinForm() {
    const form = document.getElementById('checkinForm');
    form.addEventListener('submit', handleCheckinSubmit);
}

/**
 * Handle check-in form submission
 */
function handleCheckinSubmit(event) {
    event.preventDefault();
    
    const bookingRef = document.getElementById('bookingReference').value.toUpperCase();
    const email = document.getElementById('checkinEmail').value;
    
    // Find booking
    const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
    const booking = bookings.find(b => 
        b.bookingReference === bookingRef && 
        b.passengerEmail === email
    );
    
    if (!booking) {
        showCheckinStatus('error', 'Booking not found', 'Please check your booking reference and email address');
        return;
    }
    
    if (booking.status === 'checkedin') {
        showCheckinStatus('info', 'Already Checked-in', `Seat: ${booking.seatNumber}`);
        return;
    }
    
    if (booking.status === 'completed') {
        showCheckinStatus('error', 'Flight Completed', 'Check-in is not available for completed flights');
        return;
    }
    
    // Generate seat number
    const seatNumber = generateSeatNumber(booking.classType);
    booking.seatNumber = seatNumber;
    booking.status = 'checkedin';
    booking.checkedInAt = new Date().toISOString();
    
    // Update booking in storage
    const index = bookings.findIndex(b => b.id === booking.id);
    bookings[index] = booking;
    saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
    
    showCheckinStatus('success', 'Check-in Successful!', 
        `Seat: ${seatNumber} | Boarding Group: ${booking.boardingGroup} | Gate: TBA`);
    
    document.getElementById('checkinForm').reset();
    showToast('Check-in successful!', 'success');
    loadMyFlights();
}

/**
 * Generate seat number based on class
 */
function generateSeatNumber(classType) {
    const row = Math.floor(Math.random() * 50) + 1;
    let seat;
    
    if (classType === 'First') {
        seat = String.fromCharCode(65 + Math.floor(Math.random() * 2)); // A or B
    } else if (classType === 'Business') {
        seat = String.fromCharCode(65 + Math.floor(Math.random() * 4)); // A-D
    } else {
        seat = String.fromCharCode(65 + Math.floor(Math.random() * 6)); // A-F
    }
    
    return `${row}${seat}`;
}

/**
 * Show check-in status
 */
function showCheckinStatus(type, title, message) {
    const statusDiv = document.getElementById('checkinStatus');
    const statusClass = type === 'error' ? 'error' : type === 'info' ? 'info' : 'success';
    const icon = type === 'error' ? '✗' : type === 'info' ? 'ℹ' : '✓';
    
    statusDiv.innerHTML = `
        <div class="status-item ${statusClass}">
            <div class="status-icon">${icon}</div>
            <div class="status-content">
                <h3>${title}</h3>
                <p>${message}</p>
            </div>
        </div>
    `;
    
    statusDiv.classList.remove('hidden');
}

// ============================================================
// BOARDING FUNCTIONALITY
// ============================================================

/**
 * Load boarding status
 */
function loadBoardingStatus() {
    const flightNumber = document.getElementById('boardingFlightNumber').value.toUpperCase();
    
    if (!flightNumber) {
        showToast('Please enter a flight number', 'warning');
        return;
    }
    
    // Find flight
    const flight = AVAILABLE_FLIGHTS.find(f => f.number === flightNumber);
    
    if (!flight) {
        showToast('Flight not found', 'error');
        return;
    }
    
    // Get checked-in passengers for this flight
    const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
    const flightBookings = bookings.filter(b => 
        b.flightNumber === flightNumber && 
        b.status === 'checkedin'
    );
    
    displayBoardingStatus(flight, flightBookings);
}

/**
 * Display boarding status
 */
function displayBoardingStatus(flight, checkedInPassengers) {
    const display = document.getElementById('boardingDisplay');
    const content = document.getElementById('boardingContent');
    
    const gate = Math.floor(Math.random() * 50) + 1;
    const boardingTime = flight.departureTime;
    
    let groupsHTML = '';
    for (let i = 1; i <= 4; i++) {
        const groupPassengers = checkedInPassengers.filter(p => p.boardingGroup === i);
        const boardTime = new Date();
        boardTime.setHours(parseInt(boardingTime.split(':')[0]));
        boardTime.setMinutes(parseInt(boardingTime.split(':')[1]) + (i - 1) * 15);
        
        const timeStr = boardTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        
        groupsHTML += `
            <div class="group-item">
                <div>
                    <div class="group-name">Boarding Group ${i}</div>
                    <div style="font-size: 0.9rem; color: #666; margin-top: 3px;">${groupPassengers.length} passenger(s)</div>
                </div>
                <div class="group-time">${timeStr}</div>
            </div>
        `;
    }
    
    content.innerHTML = `
        <h3>${flight.number} - ${flight.departure} to ${flight.arrival}</h3>
        <div style="margin-bottom: 30px;">
            <div class="flight-info" style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                <div class="flight-info-item">
                    <span class="flight-info-label">Date:</span>
                    <span class="flight-info-value">${formatDate(flight.date)}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Departure:</span>
                    <span class="flight-info-value">${flight.departureTime}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Aircraft:</span>
                    <span class="flight-info-value">${flight.aircraft}</span>
                </div>
                <div class="flight-info-item">
                    <span class="flight-info-label">Checked-in:</span>
                    <span class="flight-info-value">${checkedInPassengers.length}</span>
                </div>
            </div>
        </div>
        
        <div class="gate-info">
            <div class="gate-number">${gate}</div>
            <div class="gate-label">BOARDING GATE</div>
        </div>
        
        <div style="margin-top: 30px;">
            <h3 style="margin-bottom: 15px;">Boarding Schedule</h3>
            <div class="boarding-groups">
                ${groupsHTML}
            </div>
        </div>
        
        <div style="margin-top: 30px; padding: 15px; background: #e3f2fd; border-radius: 8px; border-left: 4px solid #0084d1;">
            <strong>⚠️ Important:</strong>
            <p style="margin-top: 8px; color: #666;">Please arrive at the gate 15 minutes before boarding begins. Have your boarding pass and ID ready.</p>
        </div>
    `;
    
    display.classList.remove('hidden');
    display.scrollIntoView({ behavior: 'smooth' });
}

// ============================================================
// MY FLIGHTS FUNCTIONALITY
// ============================================================

/**
 * Load my flights
 */
function loadMyFlights() {
    const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
    const list = document.getElementById('myFlightsList');
    const noFlights = document.getElementById('noFlights');
    
    if (bookings.length === 0) {
        list.innerHTML = '';
        noFlights.classList.remove('hidden');
        return;
    }
    
    noFlights.classList.add('hidden');
    
    // Filter by active filter
    const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
    const filtered = activeFilter === 'all' ? bookings : bookings.filter(b => b.status === activeFilter);
    
    list.innerHTML = '';
    
    filtered.forEach(booking => {
        const card = createFlightCard(booking);
        list.appendChild(card);
    });
}

/**
 * Create flight card element
 */
function createFlightCard(booking) {
    const card = document.createElement('div');
    card.className = 'my-flight-card';
    
    const statusBadge = document.createElement('div');
    statusBadge.style.position = 'absolute';
    statusBadge.style.top = '15px';
    statusBadge.style.right = '15px';
    statusBadge.className = `flight-status-badge status-${booking.status}`;
    statusBadge.textContent = booking.status.replace('checkedin', 'Checked-in').toUpperCase();
    
    const statusText = {
        'confirmed': 'Confirmed',
        'checkedin': 'Checked-in',
        'completed': 'Completed'
    }[booking.status];
    
    const actions = document.createElement('div');
    actions.className = 'my-flight-actions';
    
    if (booking.status === 'confirmed') {
        actions.innerHTML = `
            <button class="btn btn-success" onclick="jumpToCheckIn('${booking.bookingReference}')">Check-in</button>
            <button class="btn btn-danger" onclick="cancelBooking('${booking.id}')">Cancel</button>
        `;
    } else if (booking.status === 'checkedin') {
        actions.innerHTML = `
            <button class="btn btn-success" onclick="jumpToBoarding('${booking.flightNumber}')">Boarding Info</button>
        `;
    } else {
        actions.innerHTML = `
            <button class="btn btn-secondary" onclick="viewBookingDetails('${booking.id}')" style="width: 100%;">View Details</button>
        `;
    }
    
    card.innerHTML = `
        <div class="my-flight-header">
            <div class="my-flight-route">
                <div class="my-flight-airport">${booking.departure}</div>
                <div class="my-flight-arrow">→</div>
                <div class="my-flight-airport">${booking.arrival}</div>
            </div>
            <div style="margin-top: 10px; font-size: 0.95rem; opacity: 0.9;">${booking.flightNumber}</div>
        </div>
        <div class="my-flight-body">
            <div class="my-flight-detail">
                <span class="my-flight-label">Date</span>
                <span class="my-flight-value">${formatDate(booking.date)}</span>
            </div>
            <div class="my-flight-detail">
                <span class="my-flight-label">Time</span>
                <span class="my-flight-value">${booking.departureTime}</span>
            </div>
            <div class="my-flight-detail">
                <span class="my-flight-label">Class</span>
                <span class="my-flight-value">${booking.classType}</span>
            </div>
            <div class="my-flight-detail">
                <span class="my-flight-label">Passengers</span>
                <span class="my-flight-value">${booking.passengers}</span>
            </div>
            <div class="my-flight-detail">
                <span class="my-flight-label">Booking Ref</span>
                <span class="my-flight-value">${booking.bookingReference}</span>
            </div>
            ${booking.status === 'checkedin' ? `
            <div class="my-flight-detail">
                <span class="my-flight-label">Seat</span>
                <span class="my-flight-value">${booking.seatNumber}</span>
            </div>
            <div class="my-flight-detail">
                <span class="my-flight-label">Boarding Group</span>
                <span class="my-flight-value">${booking.boardingGroup}</span>
            </div>
            ` : ''}
            <div class="my-flight-detail">
                <span class="my-flight-label">Total Amount</span>
                <span class="my-flight-value" style="color: #27ae60;">$${booking.totalPrice}</span>
            </div>
        </div>
    `;
    
    card.appendChild(actions);
    card.style.position = 'relative';
    
    // Add status badge
    const badgeDiv = document.createElement('div');
    badgeDiv.style.position = 'absolute';
    badgeDiv.style.top = '15px';
    badgeDiv.style.right = '15px';
    badgeDiv.className = `flight-status-badge status-${booking.status}`;
    badgeDiv.textContent = statusText;
    card.appendChild(badgeDiv);
    
    return card;
}

/**
 * Jump to check-in section
 */
function jumpToCheckIn(bookingRef) {
    document.getElementById('bookingReference').value = bookingRef;
    document.getElementById('checkin').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Jump to boarding section
 */
function jumpToBoarding(flightNumber) {
    document.getElementById('boardingFlightNumber').value = flightNumber;
    document.getElementById('boarding').scrollIntoView({ behavior: 'smooth' });
}

/**
 * Cancel booking
 */
function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
        const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
        const index = bookings.findIndex(b => b.id === bookingId);
        
        if (index > -1) {
            bookings[index].status = 'cancelled';
            saveToStorage(STORAGE_KEYS.BOOKINGS, bookings);
            loadMyFlights();
            showToast('Booking cancelled successfully', 'success');
        }
    }
}

/**
 * View booking details
 */
function viewBookingDetails(bookingId) {
    const bookings = getStorageData(STORAGE_KEYS.BOOKINGS);
    const booking = bookings.find(b => b.id === bookingId);
    
    if (booking) {
        const modal = document.getElementById('confirmationModal');
        const modalBody = document.getElementById('modalBody');
        
        modalBody.innerHTML = `
            <h2 style="color: #1a3a52; margin-bottom: 20px;">Booking Details</h2>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                    <div>
                        <strong style="color: #1a3a52;">Booking Reference</strong>
                        <div style="margin-top: 5px; font-weight: 600;">${booking.bookingReference}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Flight Number</strong>
                        <div style="margin-top: 5px; font-weight: 600;">${booking.flightNumber}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Passenger Name</strong>
                        <div style="margin-top: 5px;">${booking.passengerName}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Email</strong>
                        <div style="margin-top: 5px;">${booking.passengerEmail}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Route</strong>
                        <div style="margin-top: 5px;">${booking.departure} → ${booking.arrival}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Date</strong>
                        <div style="margin-top: 5px;">${formatDate(booking.date)}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Time</strong>
                        <div style="margin-top: 5px;">${booking.departureTime} - ${booking.arrivalTime}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Class</strong>
                        <div style="margin-top: 5px;">${booking.classType}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Passengers</strong>
                        <div style="margin-top: 5px;">${booking.passengers}</div>
                    </div>
                    <div>
                        <strong style="color: #1a3a52;">Total Price</strong>
                        <div style="margin-top: 5px; font-weight: 600; color: #27ae60;">$${booking.totalPrice}</div>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
    }
}

// ============================================================
// FILTER FUNCTIONALITY
// ============================================================

/**
 * Initialize filter buttons
 */
function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Reload flights
            loadMyFlights();
        });
    });
}

// ============================================================
// NAVIGATION
// ============================================================

/**
 * Initialize navigation
 */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            link.classList.add('active');
            
            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Hamburger menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// ============================================================
// MODAL
// ============================================================

/**
 * Initialize modal
 */
function initModal() {
    const modal = document.getElementById('confirmationModal');
    const closeBtn = document.querySelector('.close-modal');
    
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize all components
 */
function init() {
    initBookingForm();
    initCheckinForm();
    initNavigation();
    initModal();
    initFilters();
    loadMyFlights();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}