const firebaseConfig = {
  apiKey: "AIzaSyBnXDgN_232yusg2fkwzExU6otohAwB1E8",
  authDomain: "mulearn-companion.firebaseapp.com",
  projectId: "mulearn-companion",
  storageBucket: "mulearn-companion.appspot.com",
  messagingSenderId: "596495539708",
  appId: "1:596495539708:web:b36f127a9067ee5a306679",
  measurementId: "G-H4LCXMW3J7",
};

var app, db;

// firebase is initialized in the main function of script.js
function initializeFirebase() {
  return new Promise((resolve) => {
    app = firebase.initializeApp(firebaseConfig);
    // Initialize Cloud Firestore and get a reference to firestore service
    db = firebase.firestore();
    console.log("firebse initialized sucessfully");
    resolve(1);
  });
}

var cloud = {
  getBasicData: function () {
    return new Promise((resolve) => {
      db.collection("basicData")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            data = doc.data();
          });
          resolve(data);
        });
    });
  },

  putBasicData: function (data) {
    db.collection("basicData")
      .doc("data")
      .set(data)
      .then(() => {
        console.log("Basic Data written successfully");
      });
  },

  updatePropertyOfBasicData: function (property) {
    let dataRef = db.collection("basicData").doc("data");
    dataRef.update({ channels: property }).then(() => {
      console.log("Update success");
    });
  },

  pushPropertyToBasicData: function (property) {
    this.updatePropertyOfBasicData(property);
  },

  saveTaskToDB: async function (task) {
    console.log(task);
    let context = new Promise((resolve) => {
      db.collection("tasks")
        .doc(task.id)
        .set(task)
        .then(() => {
          console.log("Data Written succesfully");
        });
      resolve(1);
    });
  },

  getAllTasksFromDB: function () {
    // Takes all tasks from the firestore and save as tasks in the localStorage
    let tasks = [];
    return new Promise((resolve, reject) => {
      db.collection("tasks")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            tasks.push(doc.data());
          });
          localData.putTasks(tasks);
          resolve(1);
        })
        .catch(reject);
    });
  },

  deleteTask: async function (id) {
    let ctx = new Promise((resolve) => {
      db.collection("tasks")
        .doc(id)
        .delete()
        .then(() => {
          console.log("Task deleted successfully");
          resolve(1);
        });
    });
    await this.getAllTasksFromDB();
    return ctx;
  },

  updateTaskInDB: async function (task) {
    return new Promise((resolve) => {
      db.collection("tasks")
        .doc(task.id)
        .set(task)
        .then(() => {
          console.log("Task updated and saved to DB");
          resolve(1);
        });
    });
  },

  createChannel(cName, cID) {
    console.log(cName, cID);
    let channelref = db
      .collection("basicData")
      .doc("data")
      .update({
        channels: firebase.firestore.FieldValue.arrayUnion({
          name: cName,
          id: cID,
        }),
      });
  },

  getAllChannels: async function () {
    let basicData = await this.getBasicData();
    return new Promise((resolve) => {
      resolve(basicData.channels);
    });
  },

  deleteChannel: async function (cID) {
    db.collection("basicData")
      .doc("data")
      .update({
        channels: firebase.firestore.FieldValue.arrayRemove({ id: `${cID}` }),
      })
      .then(() => {
        console.log("Delte Success", cID);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
