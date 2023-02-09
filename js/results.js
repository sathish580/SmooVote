import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
// import { getAuth, createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, collection, getDocs, setDoc, doc, query, deleteDoc, deleteField, updateDoc, getDoc, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js";

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

// const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs

let main = Vue.createApp({
  data() {
    return {
      db_name: "ELECTIONS",
      electionTitle: "",
      // for nominees who met minimum
      resultsList: [],
      // for nominees who did not meet minimum
      resultsList2: [],
      totalVotes: 0,
      loadDone: false,
    };
  },
  async created(){
    // CHANGE THE ELECTION NAME
    let docId = localStorage.getItem("docId");
    console.log(docId)
    // var electionName = "RUGBY1"
    const docRef = doc(db, this.db_name, docId,);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(docSnap.data());
      this.electionTitle = docSnap.data().electionTitle;
      var nomObj = {
        // minimumMet: ""
      }
      var minVoteCount = Number(docSnap.data().minimumVotes);
      var nomineesDb = docSnap.data().nominees
      
      for ( var key of Object.keys(nomineesDb) ){
        // console.log("\n\noneNom", nomineesDb[key])
        for ( var email of Object.keys(nomineesDb[key]) ){
          // console.log("detail", nomineesDb[key][detail][0])
          nomObj = nomineesDb[key][email][0]
          // nomObj.positions = nomineesDb[key][email][0].position
          nomObj.votes = Number(nomineesDb[key][email][0].votes)
          this.totalVotes += nomObj.votes
          if(nomObj.votes >= minVoteCount){
            // nomObj.minimumMet = "Yes"
            this.resultsList.push(nomObj)
          }
          else{
            // nomObj.minimumMet = "No"
            this.resultsList2.push(nomObj)
          }
          

          
          
          
        }
      }
      this.loadDone = true
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
    console.log(this.resultsList)

  },
  methods: {

  },
});

main.mount("#app");
