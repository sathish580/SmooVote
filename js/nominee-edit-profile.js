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

let newNominees = [];
var profile = Vue.createApp({
  data() {
    return {
      current_user: "",
      firstName: "",
      lastName: "",
      school: "",
      yearOfStudy: "",
      posRunning: "",
      bio: "",
      profileImg: "",
      igLink: "",
      votes: "",
      ppFile: null,
      electionKey: "",
      electionTitle: "",
    };
  },

  async created() {
    this.electionKey = localStorage.getItem("elecNomineeChosen");
    // console.log(this.electionKey);
    // Getting the current user email
    auth.onAuthStateChanged((user) => {
      if (user) {
        this.current_user = user.email;
      }
    });
    // TESTING CODE
    // this.current_user = 'kelvin@smu.edu.sg';

    const querySnapshot = await getDocs(collection(db, "ELECTIONS"));

    querySnapshot.forEach((doc) => {
      // console.log(doc.data());
      // console.log(doc.data().nominees);
      // console.log(this.current_user);
      if (this.electionKey == doc.data().documentId) {
        this.electionTitle = doc.data().electionTitle
        for (var nominee of doc.data().nominees) {
          // console.log(nominee);
          // console.log(Object.keys(nominee));
          if (Object.keys(nominee).includes(this.current_user)) {
            let userInfo = Object.values(nominee)[0][0];
            // console.log(userInfo);

            this.bio = userInfo.bio;
            this.firstName = userInfo.firstname;
            this.lastName = userInfo.lastname;
            this.posRunning = userInfo.position;
            this.profileImg = userInfo.profileImgLocation;

            this.school = userInfo.school;
            this.yearOfStudy = userInfo.year;
            this.igLink = userInfo.igusername;
            this.votes = userInfo.votes;
            // console.log(this.profileImg);

            if (this.profileImg == "") {
              this.profileImg = "placeholder.jpg";
            }

            getDownloadURL(ref(storage, this.profileImg))
              .then((url) => {
                // console.log("Getting profile image");

                // console.log(url);

                document.getElementById(`profilePic`).src = url;
              })
              .catch((error) => {
                // Handle any errors
                console.log(error.message);
              });
          } else {
            console.log("nooooo");
          }
        }
      }

      // doc.data() is never undefined for query doc snapshots
    });
  },

  methods: {
    async updateDetails() {
      const query = await getDocs(collection(db, "ELECTIONS"));
      newNominees = [];
      query.forEach((doc) => {
        // console.log(doc.data());
        let allNominees = doc.data().nominees;

        // console.log(doc.data().nominees);
        // console.log(this.current_user);
        if (this.electionKey == doc.data().documentId) {
          for (var nominee of allNominees) {
            // console.log(nominee);
            // console.log(Object.keys(nominee));
            if (Object.keys(nominee).includes(this.current_user)) {
              let userInfo = Object.values(nominee)[0][0];
              // console.log(userInfo);

              let nominee_obj = {};
              nominee_obj[this.current_user] = [
                {
                  bio: this.bio,
                  position: this.posRunning,
                  firstname: this.firstName,
                  igusername: this.igLink,
                  lastname: this.lastName,
                  school: this.school,
                  year: this.yearOfStudy,
                  profileImgLocation: this.profileImg,
                  votes: this.votes,
                },
              ];
              newNominees.push(nominee_obj);
            } else {
              newNominees.push(nominee);
            }
          }
        }
        // console.log(newNominees);

        // doc.data() is never undefined for query doc snapshots
      });

      await updateDoc(doc(db, "ELECTIONS", this.electionKey), {
        // bio: "loremipsum",
        // instagram: "Heefefllo._",
        // name: "clayton tan",
        // school_year: "year 2 scis",

        nominees: newNominees,
      });
    },
    processNewImage() {
      let newImage = document.getElementById("imgUpload");
      let fileItem = newImage.files[0];
      this.ppFile = fileItem;
      // console.log(this.ppFile);
      this.uploadNewPP();

      // console.log(voters_list)
      this.showUploadAlertModal();
    },

    uploadNewPP() {
      // let electionName = localStorage.getItem("electName");
      // removing all spaces
      // var electiontitle = electionName.replaceAll(" ", "")

      // creating a folder for the election and naming the poster as "poster"
      var filename = this.electionKey + `/${this.current_user}PP`;

      // change the metadata to image
      const metadata = {
        contentType: "image",
      };

      // image reference to the firebase storage and the poster destination
      const imagesRef = ref(storage, filename);

      // uploading the poster to firebase storage
      uploadBytes(imagesRef, this.ppFile, metadata).then((snapshot) => {
        // console.log("Successfully uploaded poster");
        // console.log(snapshot);
        this.profileImg = snapshot.metadata.fullPath;
      });
    },
    showPicModal() {
      var picModal = new bootstrap.Modal(
        document.getElementById("uploadPicModal")
      );
      picModal.show();

      // var successModal = new bootstrap.Modal(
      //   document.getElementById("successModal")
      // );

      // successModal.show();
    },
    showUploadAlertModal() {
      var picModal = new bootstrap.Modal(
        document.getElementById("uploadedAlertModal")
      );
      picModal.show();
    },
    reloadPage() {
      location.reload();
    },
  },
});

profile.mount("#profile");
