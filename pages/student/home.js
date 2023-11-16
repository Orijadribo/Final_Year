const firebaseConfig = {
  apiKey: "AIzaSyAPcuSwsWJgjbVCI2uaj9x3Fg7buTvgMsM",
  authDomain: "bankslipverificationsystem.firebaseapp.com",
  databaseURL: "https://bankslipverificationsystem-default-rtdb.firebaseio.com",
  projectId: "bankslipverificationsystem",
  storageBucket: "bankslipverificationsystem.appspot.com",
  messagingSenderId: "276466073371",
  appId: "1:276466073371:web:ca099b87323bfeefa25dbe"
};

// Initialize Firebase with your config
firebase.initializeApp(firebaseConfig);

// Reference your database
var bankslipDb = firebase.database().ref("uploadForm");
var bankDetailsRef = firebase.database().ref("bankDetails");

// Form details submission
document.getElementById("uploadForm").addEventListener("submit", submitform);

function submitform(e) {
  e.preventDefault();

  var amount = getElementval('amount');
  var date = getElementval('date');
  var regNo = getElementval('regNo');
  var payer = getElementval('payer');
  var bankslipImage = getElementval('dropzone-file');

  // Check for verification
  checkVerification(amount, date, regNo, payer);

  document.getElementById("uploadForm").reset();
}

// Reference to the verified list in the database
var verifiedListRef = firebase.database().ref("verifiedList");

// Reference to the denied list in the database
var deniedListRef = firebase.database().ref("deniedList");

// Function to check verification
function checkVerification(amount, date, regNo, payer) {
  bankDetailsRef.once("value", function(snapshot) {
    var bankDetails = snapshot.val();

    for (var key in bankDetails) {
      if (bankDetails.hasOwnProperty(key)) {
        var bankDetail = bankDetails[key];

        // Compare uploaded details with bank details
        if (compareDetails(amount, date, regNo, payer, bankDetail)) {
          // If details match, add to verified list and display a verified message
          addToVerifiedList(amount, date, regNo, payer);
          displayNotification("Verified");
          return;
        }
      }
    }

    // If no match is found, add to denied list and display a denied message
    addToDeniedList(amount, date, regNo, payer);
    displayNotification("Denied");
  });
}

// Function to add details to the verified list
function addToVerifiedList(amount, date, regNo, payer) {
  var newVerifiedItem = verifiedListRef.push();

  newVerifiedItem.set({
    amount: amount,
    date: date,
    regNo: regNo,
    payer: payer
  });

  // Reference to the "notifications" node in the Firebase Realtime Database
const notificationsRef = firebase.database().ref("notifications");

// Function to send a notification
function sendNotification(message) {
    // Get the current time
    const currentTime = new Date().toISOString();

    // Create a new notification object
    const newNotification = {
        message: message,
        time: currentTime
    };

    // Push the new notification to the "notifications" node in the database
    notificationsRef.push(newNotification);
}

// Example: Send a notification when a transaction is verified
// Replace "Transaction 123 verified!" with your actual notification message
sendNotification("Transaction details verified. Thank you for your prompt submission.!");
}

// Function to add details to the denied list
function addToDeniedList(amount, date, regNo, payer) {
  var newDeniedItem = deniedListRef.push();

  newDeniedItem.set({
    amount: amount,
    date: date,
    regNo: regNo,
    payer: payer
  });
  // Reference to the "notifications" node in the Firebase Realtime Database
const notificationsRef = firebase.database().ref("notifications");

// Function to send a notification
function sendNotification(message) {
    // Get the current time
    const currentTime = new Date().toISOString();

    // Create a new notification object
    const newNotification = {
        message: message,
        time: currentTime
    };

    // Push the new notification to the "notifications" node in the database
    notificationsRef.push(newNotification);
}

// Example: Send a notification when a transaction is verified
// Replace "Transaction 123 verified!" with your actual notification message
sendNotification("Transaction details denied. For inquiries, please contact us.");
}

// Function to compare details
function compareDetails(amount1, date1, regNo1, payer1, details2) {
  return (
    Number(amount1) === details2.amount &&
    date1 === details2.date &&
    regNo1 === details2.regNo &&
    payer1 === details2.payer
  );
}




// Function to display notification
function displayNotification(message) {
  // Replace this with your actual notification mechanism (e.g., alert, toast, etc.)
  alert("Verification Result: " + message);
  document.querySelector(".alert").innerHTML = ("Verification Result: " + message);
  document.querySelector(".alert").style.display = "block";

  setTimeout(() => {
    document.querySelector(".alert").style.display = "none";
  }, 3000);
  document.getElementById("myform").reset();
}

// Function to handle cancel button
function cancelUpload() {
  // Clear all the fields of the upload form 
  document.getElementById("uploadForm").reset();
}

const getElementval = (id) => {
  return document.getElementById(id).value;
}

let ref = firebase.database().ref("uploadForm");
console.log("Listener registering...");
ref.on("value", getData);

function getData(data) {
  console.log("Data received:", data.val());

  let info = data.val();
  if (!info) {
    console.log("No data found");
    return;
  }

  let keys = Object.keys(info);

  // Create an unordered list for the transactions
  let ul = document.getElementById("transactionsList");

  // Clear existing content before adding new items
  ul.innerHTML = "";

  for (let i = 0; i < keys.length; i++) {
    let key = keys[i];
    let listItem = document.createElement("li");
    listItem.textContent = `Transaction ${i + 1}`;
    listItem.addEventListener("click", () => toggleTransactionDetails(key));
    listItem.style.cursor = "pointer"; // Set cursor to pointer
    ul.appendChild(listItem);

    // Create a dropdown for each transaction
    let dropdown = document.createElement("div");
    dropdown.className = "transactionDropdown";
    dropdown.id = `dropdown-${key}`;
    listItem.appendChild(dropdown);
  }
}

function toggleTransactionDetails(key) {
  // Retrieve the details for the selected transaction using the key
  let ref = firebase.database().ref(`uploadForm/${key}`);
  ref.once("value").then((snapshot) => {
    let transactionDetails = snapshot.val();

    // Display the details in the dropdown (modify this part based on your UI)
    let dropdown = document.getElementById(`dropdown-${key}`);
    let isDetailsVisible = dropdown.style.display === "block";

    if (isDetailsVisible) {
      dropdown.style.display = "none";
    } else {
      dropdown.style.display = "block";

      let detailsTable = document.createElement("table");
      detailsTable.className = "transactionDetails";
      detailsTable.innerHTML = ""; // Clear existing content

      let headerRow = detailsTable.insertRow();
      let headerCell1 = headerRow.insertCell(0);
      let headerCell2 = headerRow.insertCell(1);
      let headerCell3 = headerRow.insertCell(2); // New cell for the image
      headerCell1.textContent = "Field";
      headerCell2.textContent = "Value";
      headerCell3.textContent = "Image";

      addRowToTable(detailsTable, "Transaction ID", key);
      addRowToTable(detailsTable, "Amount", transactionDetails.amount);
      addRowToTable(detailsTable, "Date", transactionDetails.date);
      addRowToTable(detailsTable, "Registration Number", transactionDetails.regNo);
      addRowToTable(detailsTable, "Payer", transactionDetails.payer);

      // Add a row for the image
      let imageRow = detailsTable.insertRow();
      let imageCell1 = imageRow.insertCell(0);
      let imageCell2 = imageRow.insertCell(1);
      let imageCell3 = imageRow.insertCell(2);
      imageCell1.textContent = "Bank Slip Image";
      imageCell2.textContent = ""; // Leave the second cell empty for text values

      // Create an image element
      let imageElement = document.createElement("img");

      // Add logging for image source
      console.log("Image Source:", transactionDetails.bankslipImage);

      imageElement.src = transactionDetails.bankslipImage;
      imageElement.style.maxWidth = "100px"; // Adjust the max width as needed

      // Attach an event listener to handle image loading errors
      imageElement.addEventListener("error", function () {
        console.error("Error loading image:", transactionDetails.bankslipImage);
      });

      // Append the image element to the third cell
      imageCell3.appendChild(imageElement);

      // Clear existing content and append the table
      dropdown.innerHTML = "";
      dropdown.appendChild(detailsTable);
    }
  });
}


function addRowToTable(table, field, value) {
  let row = table.insertRow();
  let cell1 = row.insertCell(0);
  let cell2 = row.insertCell(1);
  cell1.textContent = field;
  cell2.textContent = value;
}

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  // Make sure to include your Firebase configuration here

  // Reference to the "deniedList" node in the Firebase Realtime Database
  const deniedListRef = firebase.database().ref("deniedList");

  // Reference to the "verifiedList" node in the Firebase Realtime Database
  const verifiedListRef = firebase.database().ref("verifiedList");

  // Reference to the "notifications" node in the Firebase Realtime Database
  const notificationsRef = firebase.database().ref("notifications");

  // Buttons to toggle visibility of tables
  const deniedListBtn = document.getElementById("deniedListBtn");
  const verifiedListBtn = document.getElementById("verifiedListBtn");

  // Container for tables
  const deniedListTableContainer = document.getElementById("deniedListTableContainer");
  const verifiedListTableContainer = document.getElementById("verifiedListTableContainer");

  // Notification container
  const notificationsContainer = document.getElementById("notifications");

  // Listen for changes in the deniedList in real-time
  registerListListeners(deniedListRef, deniedListTableContainer);

  // Listen for changes in the verifiedList in real-time
  registerListListeners(verifiedListRef, verifiedListTableContainer);

  // Listen for changes in the notifications in real-time
  registerNotificationsListener(notificationsRef, notificationsContainer);

  // Show the corresponding table when the button is clicked
  deniedListBtn.addEventListener("click", function () {
      showTable("deniedList");
  });

  verifiedListBtn.addEventListener("click", function () {
      showTable("verifiedList");
  });

  // Function to toggle visibility of tables
  function showTable(tableId) {
      const deniedList = document.getElementById("deniedList");
      const verifiedList = document.getElementById("verifiedList");

      if (tableId === "deniedList") {
          deniedList.classList.remove("hidden");
          verifiedList.classList.add("hidden");
      } else if (tableId === "verifiedList") {
          deniedList.classList.add("hidden");
          verifiedList.classList.remove("hidden");
      }
  }

  // Function to register listeners for tables
  function registerListListeners(listRef, tableContainer) {
      // Listen for changes in the list in real-time
      listRef.on("value", function (snapshot) {
          const data = snapshot.val();

          // Clear existing content in the table container
          tableContainer.innerHTML = "";

          if (data) {
              // Create a table element
              const table = document.createElement("table");

              // Create table header
              const thead = document.createElement("thead");
              const headerRow = document.createElement("tr");
              const headers = ["Transaction Date", "Amount", "Payer", "Registration Number"];

              headers.forEach(headerText => {
                  const th = document.createElement("th");
                  th.textContent = headerText;
                  headerRow.appendChild(th);
              });

              thead.appendChild(headerRow);
              table.appendChild(thead);

              // Create table body
              const tbody = document.createElement("tbody");

              // Get keys of transactions and sort them in descending order (latest first)
              const sortedTransactionKeys = Object.keys(data).sort((a, b) => {
                  return new Date(data[b].currentTime) - new Date(data[a].currentTime);
              });

              // Iterate over each transaction
              sortedTransactionKeys.forEach(transactionId => {
                  const transactionData = data[transactionId];

                  // Create a row for each transaction
                  const tr = document.createElement("tr");

                  // Add transaction data to the row
                  const tdDate = document.createElement("td");
                  tdDate.textContent = transactionData.date;

                  const tdAmount = document.createElement("td");
                  tdAmount.textContent = transactionData.amount;

                  const tdPayer = document.createElement("td");
                  tdPayer.textContent = transactionData.payer;

                  const tdRegNo = document.createElement("td");
                  tdRegNo.textContent = transactionData.regNo;

                  tr.appendChild(tdDate);
                  tr.appendChild(tdAmount);
                  tr.appendChild(tdPayer);
                  tr.appendChild(tdRegNo);

                  // Append the row to the table body
                  tbody.appendChild(tr);
              });

              // Append the table body to the table
              table.appendChild(tbody);

              // Append the table to the table container
              tableContainer.appendChild(table);
          }
      });
  }

  // Function to register listener for notifications
  function registerNotificationsListener(notificationsRef, notificationsContainer) {
      // Listen for changes in the notifications in real-time
      notificationsRef.on("value", function (snapshot) {
          const notifications = snapshot.val();

          // Clear existing content in the notifications container
          notificationsContainer.innerHTML = "";

          if (notifications) {
              // Create a div element to hold notifications
              const notificationsDiv = document.createElement("div");

              // Iterate over each notification
              Object.values(notifications).forEach(notification => {
                  // Create a p element for each notification
                  const p = document.createElement("p");
                  p.textContent = notification.message;

                  // Append the p element to the notificationsDiv
                  notificationsDiv.appendChild(p);
              });

              // Append the notificationsDiv to the notifications container
              notificationsContainer.appendChild(notificationsDiv);
          }
      });
  }
});

document.addEventListener("DOMContentLoaded", function () {
  // Initialize Firebase
  // Make sure to include your Firebase configuration here

  // Reference to the "notifications" node in the Firebase Realtime Database
  const notificationsRef = firebase.database().ref("notifications");

  // Container for notifications
  const notificationsContainer = document.getElementById("notifications");

  // Listen for changes in the notifications in real-time
  notificationsRef.on("value", function (snapshot) {
      const notifications = snapshot.val();

      // Clear existing content in the notifications container
      notificationsContainer.innerHTML = "";

      if (notifications) {
          // Create a div element to hold notifications
          const notificationsDiv = document.createElement("div");

          // Get keys of notifications and sort them in descending order (latest first)
          const sortedNotificationKeys = Object.keys(notifications).sort((a, b) => {
              return new Date(notifications[b].time) - new Date(notifications[a].time);
          });

          // Iterate over each notification
          sortedNotificationKeys.forEach(notificationId => {
              const notificationData = notifications[notificationId];

              // Create a p element for each notification
              const p = document.createElement("p");
              p.textContent = `${notificationData.message} - ${new Date(notificationData.time).toLocaleString()}`;

              // Append the p element to the notificationsDiv
              notificationsDiv.appendChild(p);
          });

          // Append the notificationsDiv to the notifications container
          notificationsContainer.appendChild(notificationsDiv);
      }
  });
});
