// script.js
const tableBody = document.getElementById('tableBody');

let borrowedItems = JSON.parse(localStorage.getItem('borrowedItems')) || [];
renderTable();

function addItem() {
    const item = document.getElementById('item').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const borrower = document.getElementById('borrower').value;
    const dueDate = document.getElementById('dueDate').value;

    if (item.trim() === "" || isNaN(amount) || borrower.trim() === "" || dueDate === "") {
        alert("Please fill in all fields.");
        return;
    }

    const newItem = {
        item,
        amount,
        borrower,
        dueDate
    };

    borrowedItems.push(newItem);
    saveToLocalStorage();
    renderTable();
    clearInputFields();

    
    const dueDateTime = new Date(dueDate).getTime();
    const now = Date.now();
    const timeUntilDue = dueDateTime - now;

    if (timeUntilDue > 0) {
        setTimeout(() => {
            showNotification(borrower, item);
        }, timeUntilDue);
    }
}

function showNotification(borrower, item) {
    if (Notification.permission === "granted") {
        new Notification("Borrow Reminder", {
            body: `${borrower}, you need to return the ${item}!`,
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                new Notification("Borrow Reminder", {
                    body: `${borrower}, you need to return the ${item}!`,
                });
            }
        });
    } else {
        alert(`${borrower}, reminder: You need to return the ${item}!`); // Fallback alert
    }

}

function renderTable() {
    tableBody.innerHTML = ''; // Clear existing rows
    borrowedItems.forEach((item, index) => {
        const row = tableBody.insertRow();
        const itemCell = row.insertCell();
        const amountCell = row.insertCell();
        const borrowerCell = row.insertCell();
        const dueDateCell = row.insertCell();
        const actionsCell = row.insertCell();

        itemCell.textContent = item.item;
        amountCell.textContent = item.amount;
        borrowerCell.textContent = item.borrower;
        dueDateCell.textContent = item.dueDate;


        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.onclick = () => editItem(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteItem(index);

        actionsCell.appendChild(editButton);
        actionsCell.appendChild(deleteButton);

    });
}

function editItem(index) {
    const item = borrowedItems[index];
    document.getElementById('item').value = item.item;
    document.getElementById('amount').value = item.amount;
    document.getElementById('borrower').value = item.borrower;
    document.getElementById('dueDate').value = item.dueDate;

    // Change the "Add Item" button to "Update Item"
    const addButton = document.querySelector('.input-area button');
    addButton.textContent = "Update Item";
    addButton.onclick = () => updateItem(index); // Set the update function
}

function updateItem(index) {
    const item = document.getElementById('item').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const borrower = document.getElementById('borrower').value;
    const dueDate = document.getElementById('dueDate').value;


    if (item.trim() === "" || isNaN(amount) || borrower.trim() === "" || dueDate === "") {
        alert("Please fill in all fields.");
        return;
    }

    borrowedItems[index] = { item, amount, borrower, dueDate };
    saveToLocalStorage();
    renderTable();
    clearInputFields();

    // Reset the "Add Item"/"Update Item" button
    const addButton = document.querySelector('.input-area button');
    addButton.textContent = "Add Item";
    addButton.onclick = addItem; // Set the add function
}

function deleteItem(index) {
    borrowedItems.splice(index, 1);
    saveToLocalStorage();
    renderTable();
}

function saveToLocalStorage() {
    localStorage.setItem('borrowedItems', JSON.stringify(borrowedItems));
}

function clearInputFields() {
    document.getElementById('item').value = '';
    document.getElementById('amount').value = '';
    document.getElementById('borrower').value = '';
    document.getElementById('dueDate').value = '';
}