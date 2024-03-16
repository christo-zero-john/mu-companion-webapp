const firebaseConfig = {
  apiKey: "AIzaSyBnXDgN_232yusg2fkwzExU6otohAwB1E8",
  authDomain: "mulearn-companion.firebaseapp.com",
  projectId: "mulearn-companion",
  storageBucket: "mulearn-companion.appspot.com",
  messagingSenderId: "596495539708",
  appId: "1:596495539708:web:b36f127a9067ee5a306679",
  measurementId: "G-H4LCXMW3J7",
};

var basicData = {
  totalUsers: 0,
  totalTasks: 0,
  lastTaskId: 0x1f4dc2a0b8fe54,
  admins: [],
  moderators: [],
};

var app, db;

// firebase is initialized in the main function of script.js
function initializeFirebase() {
  app = firebase.initializeApp(firebaseConfig);
  // Initialize Cloud Firestore and get a reference to firestore service
  db = firebase.firestore();
  console.log("firebse initialized sucessfully");
}

var cloud = {
  addTaskToCollection: function (task) {
    db.collection("tasks")
      .doc(task.id)
      .set(task)
      .then(() => {
        console.log("Data Written succesfully");
      });
  },

  getAllTasksFromDB: function () {
    let tasks = [];
    return new Promise((resolve, reject) => {
      db.collection("tasks")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            tasks.push(doc.data());
          });
          localData.putTasks(tasks);
        });
    });
  },
};
