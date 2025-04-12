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
  incrementLocalUserCount: function () {
    db.collection("basicData")
      .doc("data")
      .update({ localUserCount: firebase.firestore.FieldValue.increment(1) })
      .then(() => {
        console.log("User count incremented");
      })
      .catch((err) => {
        interface.printAlert("Error", err);
        console.log("Error", err);
      });
  },

  getBasicData: function () {
    return new Promise((resolve) => {
      db.collection("basicData")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            data = doc.data();
          });
          localData.putBasicData(data);
          resolve(data);
        })
        .catch((err) => {
          interface.printAlert(
            "Network disconnected or some other error occurred! Check ypur network connection and try again later. If the error persists contact support."
          );
        });
    });
  },

  putBasicData: function (data) {
    db.collection("basicData")
      .doc("data")
      .set(data)
      .then(() => {
        console.log("Basic Data written successfully");
      })
      .catch((err) => {
        interface.printAlert(err);
      });
  },

  updatePropertyOfBasicData: function (property, value) {
    console.log(
      "Updating",
      property,
      "with",
      value,
      "as",
      {
        property: value,
      },
      "in cloud"
    );
    return new Promise((resolve, reject) => {
      let dataRef = db.collection("basicData").doc("data");
      dataRef
        .update({ [property]: value })
        .then(() => {
          console.log(
            "Updated",
            property,
            "with",
            value,
            "as",
            {
              property: value,
            },
            "in cloud"
          );
          resolve(1);
        })
        .catch((err) => {
          interface.printAlert(err);
          reject(err);
        });
    });
  },

  pushPropertyToBasicData: function (property) {
    this.updatePropertyOfBasicData(property);
  },

  saveTaskToDB: async function (task) {
    console.log("Saving task to cloud", task);
    return new Promise((resolve) => {
      db.collection("tasks")
        .add(task)
        .then(() => {
          console.log("Data Written succesfully");
        })
        .catch((err) => {
          interface.printAlert(
            "Cannot Update Task! Check your network connection and try again later."
          );
          console.log("Error", err);
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
          if (tasks.length > 0) {
            localData.putTasks(tasks);
          } else {
            interface.printAlert(
              "Fetch latest Tasks Failed. Trying to initialize with old Task Data..."
            );
          }
          resolve(1);
        })
        .catch((err) => {
          interface.printAlert(`Unexpected Error Occurred ${err}`);
          console.log(`Unexpected Error Occurred ${err}`);
        });
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
        .doc(task.hashtag)
        .set(task)
        .then(() => {
          console.log("Task updated and saved to DB");
          this.getAllTasksFromDB();
          resolve(1);
        })
        .catch((err) => {
          interface.printAlert(
            "Some error occured while saving Task! Check your network connection and try again. If the error persists contact support."
          );
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
      })
      .catch((err) => {
        interface.printAlert(`Error crating channel ${err}`);
      });
  },

  getAllChannels: async function () {
    let basicData = await this.getBasicData();
    return new Promise((resolve) => {
      resolve(basicData.channels);
    }).catch((err) => {
      interface.printAlert("Error", `Unexpected Error Occurred ${err}`);
      console.log(`Unexpected Error Occurred ${err}`);
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

/* trasnferData function*/
async function transferData() {
  let dbTasks = new Array();
  await db
    .collection("tempTasks")
    .get()
    .then((snapshot) => {
      snapshot.forEach((doc) => {
        let task = doc.data();
        task.id = task.hashtag;
        dbTasks.push(task);
      });
    });
  for (x in dbTasks) {
    await db
      .collection("tasks")
      .doc(`${dbTasks[x].hashtag}`)
      .set(dbTasks[x])
      .then(() => {
        console.log(
          `Data written successfully with hash ${dbTasks[x].hashtag}`
        );
      });
  }
}
