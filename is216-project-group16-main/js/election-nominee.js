import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  deleteDoc,
  deleteField,
  updateDoc,
  getDoc,
  arrayUnion,
  arrayRemove,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytes,
  listAll,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCkVzuQ-jp0h_r6sSndH4IyhRjnTMGg0N0",
  authDomain: "smoovote.firebaseapp.com",
  projectId: "smoovote",
  storageBucket: "smoovote.appspot.com",
  messagingSenderId: "822420765956",
  appId: "1:822420765956:web:8f5ca235ac8b570bc3a451",
  measurementId: "G-QS2DCVDNCJ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs

var main = Vue.createApp({
  data() {
    return {
      election_list: [],
      current_user: "",
      electionKey: "",
    };
  },

  async created() {
    // Getting the current user email
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.current_user = user.email;
      }
    });
    // TESTING CODE
    // this.current_user = 'kelvin@smu.edu.sg';
    // END OF TESTING CODE

    const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
    querySnapshot.forEach((doc) => {
      //   console.log(doc.data());
      //   console.log(doc.data().nominees);
      //   console.log(this.current_user);
      for (var nominee of doc.data().nominees) {
        // console.log(Object.keys(nominee));
        if (Object.keys(nominee).includes(this.current_user)) {
          this.electionKey = doc.data().documentId;
          var start_time_val = doc.data().start;
          var start_time_arr = start_time_val.split("T");
          var end_time_val = doc.data().end;
          var end_time_arr = end_time_val.split("T");
          var temp = {
            header: doc.data().electionTitle,
            logo_src: "",
            img_src: "",
            start_date: start_time_arr[0],
            start_time: start_time_arr[1],
            end_date: end_time_arr[0],
            end_time: end_time_arr[1],
            electionKey: doc.data().documentId,
          };
          // getting image url from firebase storage

          getDownloadURL(ref(storage, doc.data().posterLocation))
            .then((url) => {
              //   console.log("Getting poster image");
              // This can be downloaded directly:
              // const xhr = new XMLHttpRequest();
              // xhr.responseType = 'blob';
              // xhr.onload = (event) => {
              //   const blob = xhr.response;
              // };
              // xhr.open('GET', url);
              // xhr.send();

              //   console.log(url);

              temp.img_src = url;
              document.getElementById(`${doc.data().electionTitle}poster`).src =
                url;
            })
            .catch((error) => {
              // Handle any errors
              console.log(error.message);
            });

          // // getting image url from firebase storage
          getDownloadURL(ref(storage, doc.data().logoLocation))
            .then((url) => {
              //   console.log("Getting logo image");

              //   console.log(url);
              temp.logo_src = url;
              document.getElementById(`${doc.data().electionTitle}logo`).src =
                url;
            })
            .catch((error) => {
              // Handle any errors
              console.log(error.message);
            });

          //   console.log(temp);

          this.election_list.push(temp);
        }
      }
      // doc.data() is never undefined for query doc snapshots
    });
  },

  methods: {
    // format
    get_img(file) {
      // getting image url from firebase storage
      getDownloadURL(ref(storage, file))
        .then((url) => {
          //   console.log("Getting poster image");

          return url;
        })
        .catch((error) => {
          // Handle any errors
          console.log(error.message);
        });
    },
    redirect(key) {
      // (A) VARIABLES TO PASS
      // var electName = electionName.split(' ')[0];

      localStorage.removeItem("elecNomineeChosen");
      // (B) SAVE TO LOCAL STORAGE
      // localStorage.setItem("KEY", "VALUE");
      localStorage.setItem("elecNomineeChosen", key);

      // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
      // window.open("2b-local-storage.html");
      location.href = "nominee-edit-profile.html";

      // (EXTRA) TO CLEAR
      // localStorage.removeItem("KEY");
      // localStorage.clear();
    },
    redirectToVoterNominee(key){
      localStorage.removeItem("docId");
      localStorage.setItem("docId", key);
      localStorage.setItem('isNominee', 'true');
      location.href = "voter-nominees.html"

    }
  },
});

main.mount("#electionCards");
