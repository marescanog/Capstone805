document.addEventListener('DOMContentLoaded', function() {
    const totalQuantityInput = document.getElementById('totalQuantity');
    const roomNumberAssignmentSection = document.getElementById('roomNumberAssignmentSection');
    const addRoomNumberButton = document.getElementById('addRoomNumber');
    const roomNumberInput = document.getElementById('roomNumberInput');
    const roomNumbersHiddenInput = document.getElementById('roomNumbers');
    const assignedRoomNumbersContainer = document.getElementById('assignedRoomNumbersContainer');

    let totalQuantity = 0;
    let assignedRoomNumbersCount = 0;

    function updateButtonStatus() {
        const roomsLeft = totalQuantity - assignedRoomNumbersCount;
        addRoomNumberButton.textContent = `Assign ${roomsLeft} more room number${roomsLeft === 1 ? '' : 's'}`;
        addRoomNumberButton.disabled = roomsLeft <= 0;
    }

    totalQuantityInput.addEventListener('input', function() {
        totalQuantity = parseInt(this.value) || 0;
        updateButtonStatus();
        roomNumberAssignmentSection.style.display = totalQuantity > 0 ? 'block' : 'none';
    });

    addRoomNumberButton.addEventListener('click', function() {
        const roomNumber = roomNumberInput.value.trim();
        if (!roomNumber) return;

        // Update the hidden input
        const currentValues = roomNumbersHiddenInput.value ? roomNumbersHiddenInput.value.split(',') : [];
        if (!currentValues.includes(roomNumber)) { // Prevent duplicate room number entries
            currentValues.push(roomNumber);
            roomNumbersHiddenInput.value = currentValues.join(',');

            // Display the room number visually
            const roomNumberBox = document.createElement('div');
            roomNumberBox.textContent = roomNumber;
            roomNumberBox.classList.add('room-number-box', 'badge', 'badge-secondary', 'mr-2');

            // Add a delete button
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'X';
            deleteButton.classList.add('btn', 'btn-danger', 'btn-sm', 'ml-2');
            deleteButton.onclick = function() {
                roomNumberBox.remove();
                // Update the hidden input to reflect the deletion
                const index = currentValues.indexOf(roomNumber);
                if (index > -1) {
                    currentValues.splice(index, 1);
                    roomNumbersHiddenInput.value = currentValues.join(',');
                    assignedRoomNumbersCount--;
                    updateButtonStatus();
                }
            };

            roomNumberBox.appendChild(deleteButton);
            assignedRoomNumbersContainer.appendChild(roomNumberBox);

            // Update count and button status
            assignedRoomNumbersCount++;
            updateButtonStatus();
        }

        // Clear the input for the next entry
        roomNumberInput.value = '';
    });

    // Initialize button status on load
    updateButtonStatus();
});