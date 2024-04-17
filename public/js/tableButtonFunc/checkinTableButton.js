function Redirect(object){
    try{
        let jsonObject = JSON.parse(object);

        const{reservationID} = jsonObject;

        if(reservationID){
            window.location.href = `/dashboard/staff/reservation/${reservationID}`;
        } else {
            launchSwalError();
        }

    } catch (err){
        launchSwalError();
    }
}

function Checkin(object) {
    try {
        let jsonObject = JSON.parse(object);
        const { reservationID, status } = jsonObject;

        if (reservationID && status != null) {
            // Updated room data with guestName property
            const rooms = [
                { id: '102', name: 'Room 102', guest: '24832794', guestName: 'John Doe' },
                { id: '101', name: 'Room 101', guest: null, guestName: null },
                { id: '103', name: 'Room 103', guest: '83746283', guestName: 'Jane Smith' },
                { id: '101', name: 'Room 101', guest: null, guestName: null },
                { id: '101', name: 'Room 101', guest: null, guestName: null },
                // Add more rooms as needed
            ];

            const roomList = document.getElementById('roomList');
            roomList.innerHTML = ''; // Clear previous entries

            // Populate the modal with rooms, conditional display for occupied status
            rooms.forEach(room => {
                const roomElement = document.createElement('a');
                roomElement.classList.add('list-group-item', 'list-group-item-action');
                let occupancyStatus = room.guest ? ` - ${room.guestName} (Occupied)` : '';

                let buttonHTML = room.guest === null
                    ? `<button type="button" class="btn btn-success float-end" onclick="checkinRoom('${room.id}', '${reservationID}')">Check-in</button>`
                    : `<span class="text-danger float-end">${occupancyStatus}</span>`;

                roomElement.innerHTML = `${room.name} ${buttonHTML}`;
                roomList.appendChild(roomElement);
            });

            // Show the modal
            var checkInModal = new bootstrap.Modal(document.getElementById('checkInModal'));
            checkInModal.show();
        } else {
            launchSwalError();
        }
    } catch (err) {
        launchSwalError();
    }
}



function checkinRoom(roomId, reservationId) {
    console.log(`Checking in Room ID: ${roomId} for Reservation ID: ${reservationId}`);
    // Implement AJAX request to your server to update room status
    // On success, you might want to close the modal and refresh the page or display a success message

    // Example of closing the modal after action
    var checkInModal = bootstrap.Modal.getInstance(document.getElementById('checkInModal'));
    checkInModal.hide();

    // Optionally, show a success message or update the page content
    alert('Room checked in successfully!'); // Consider replacing this with a more user-friendly notification
}

function transferRoom(roomId, guestId) {
    console.log(`Transferring Guest ID: ${guestId} from Room ID: ${roomId}`);
    // Implement the logic or AJAX request for transferring the guest to another room
    alert('Guest transferred successfully!'); // Replace with a more user-friendly notification
}

function checkoutRoom(roomId, guestId) {
    console.log(`Checking out Guest ID: ${guestId} from Room ID: ${roomId}`);
    // Implement the logic or AJAX request for checking out the guest
    alert('Guest checked out successfully!'); // Replace with a more user-friendly notification
}


function DisplayCheckoutTransfer(object) {
    try {
        let jsonObject = JSON.parse(object);
        const { reservationID } = jsonObject;

        if (reservationID) {
            const rooms = [
                { id: '102', name: 'Room 102', guest: '24832794', guestName: 'John Doe', isCurrentRoom: true }, // The guest is currently checked into this room
                { id: '101', name: 'Room 101', guest: null, guestName: null, isCurrentRoom: false }, 
                { id: '103', name: 'Room 103', guest: '83746283', guestName: 'Jane Smith', isCurrentRoom: false },
                { id: '101', name: 'Room 101', guest: null, guestName: null, isCurrentRoom: false },
                { id: '101', name: 'Room 101', guest: null, guestName: null, isCurrentRoom: false },
                { id: '101', name: 'Room 101', guest: null, guestName: null, isCurrentRoom: false },
                // Add more rooms as needed
            ];
            
            const roomList = document.getElementById('checkoutTransferRoomList');
            roomList.innerHTML = ''; // Clear previous entries

            rooms.forEach(room => {
                const roomElement = document.createElement('a');
                roomElement.classList.add('list-group-item', 'list-group-item-action');

                let actionHTML;

                if (room.isCurrentRoom) {
                    // For the current room, show Checkout button
                    actionHTML = `<button type="button" class="btn btn-danger float-end" onclick="checkoutRoom('${room.id}', '${room.guest}')">Checkout</button>`;
                } else if (room.guest === null) {
                    // For unoccupied rooms, show Transfer button
                    actionHTML = `<button type="button" class="btn btn-primary float-end" onclick="transferRoom('${room.id}', '${reservationID}')">Transfer</button>`;
                } else {
                    // For occupied rooms, display "Occupied"
                    actionHTML = `<span class="text-danger float-end">Occupied</span>`;
                }

                roomElement.innerHTML = `${room.name} ${actionHTML}`;
                roomList.appendChild(roomElement);
            });

            var modal = new bootstrap.Modal(document.getElementById('checkoutTransferModal'));
            modal.show();
        } else {
            launchSwalError();
        }
    } catch (err) {
        launchSwalError();
    }
}


function DisplayStatus(object) {
    try {
        let jsonObject = JSON.parse(object);
        const { reservationID } = jsonObject;

        if (reservationID) {
            // Fetch reservation details from your server using reservationID and update the modal content
            // For demonstration, static data is shown
            const statusInfo = `Room Number: 102, Guest Name: John Doe, Check-in Date: March 16, 2024, Check-out Date: Sep 17, 2024`;
            
            document.getElementById('statusInfo').textContent = statusInfo;

            var modal = new bootstrap.Modal(document.getElementById('statusModal'));
            modal.show();
        } else {
            launchSwalError();
        }
    } catch (err) {
        launchSwalError();
    }
}
