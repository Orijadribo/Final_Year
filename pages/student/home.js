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

    elementHome.classList.remove("hidden");
    elementTransactions.classList.add("hidden");
    elementUpload.classList.add("hidden");
    elementNotifications.classList.add("hidden");
    elementSettings.classList.add("hidden");

    document.getElementById("uploadForm").reset();
}

const getElementval = (id) => {
    return document.getElementById(id).value;
}
