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
  
  // Form details submission
  document.getElementById("uploadForm").addEventListener("submit", submitform);
  
  function submitform(e) {
    e.preventDefault();
  
    var amount = getElementval('amount');
    var date = getElementval('date');
    var regNo = getElementval('regNo');
    var payer = getElementval('payer')
    var bankslipImage = getElementval('dropzone-file')
  
    saveMessages(amount, date, regNo, payer, bankslipImage);
    document.querySelector(".alert").style.display = "block";
  
    setTimeout(() => {
      document.querySelector(".alert").style.display = "none";
    }, 3000);
  
    document.getElementById("uploadForm").reset();
  }
  
  const saveMessages = (amount, date, regNo, payer, bankslipImage) => {
    var newUploadform = bankslipDb.push();
  
    newUploadform.set({
      amount: amount,
      date: date,
      regNo: regNo,
      payer: payer,
      bankslipImage: bankslipImage
    });
  }
  
  // Function to handle cancel button
  function cancelUpload() {
    var elementHome = document.getElementById("home");
    var elementTransactions = document.getElementById("transactions");
    var elementUpload = document.getElementById("upload");
    var elementNotifications = document.getElementById("notifications");
    var elementSettings = document.getElementById("settings");
  
    // To clear all the fields of the upload form 
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
        headerCell1.textContent = "Field";
        headerCell2.textContent = "Value";
  
        addRowToTable(detailsTable, "Transaction ID", key);
        addRowToTable(detailsTable, "Amount", transactionDetails.amount);
        addRowToTable(detailsTable, "Date", transactionDetails.date);
        addRowToTable(detailsTable, "Registration Number", transactionDetails.regNo);
        addRowToTable(detailsTable, "Payer", transactionDetails.payer);
        addRowToTable(detailsTable, "Bank Slip Image", transactionDetails.bankslipImage);
  
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
  
  