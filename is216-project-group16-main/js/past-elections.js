import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
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
  measurementId: "G-QS2DCVDNCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs


let main = Vue.createApp({
    data() {
        return {
            election_list: [],
            test: [],
            current_user: '',
            loadDone: false
        }
    },
    async created() {
        var email = localStorage.getItem("adminEmail");
        document.getElementsByClassName("user-name")[0].innerText = `Hi, ${email.split('@')[0]}`
        document.getElementsByClassName("user-name")[1].innerText = `Hi, ${email.split('@')[0]}`
        const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
        querySnapshot.forEach((doc) => {
            console.log(doc.data());   
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
                docId: doc.data().documentId,
                createdBy: doc.data().createdBy
            };
            // checking if election has ended, if yes, dont display
            var todayDateTime = new Date()
            // console.log(todayDateTime)
            // console.log(Date.parse(todayDateTime))
            // var todayParsed = Date.parse(todayDateTime)
            var todayParsed = todayDateTime.getTime()
            var electionEnd = Date.parse(doc.data().end)

            // if todayParsed > electionEnd, means election has ended
            if (todayParsed > electionEnd){
                console.log("getting info for election:", doc.data().electionTitle)

                // get election poster
                getDownloadURL(ref(storage, doc.data().posterLocation))
                .then((url) => {
                    console.log("Getting poster image for:", doc.data().electionTitle)

                    console.log(url)
    
                    temp.img_src = url;
                    document.getElementById(`${doc.data().electionTitle}poster`).src = url;

                })
                .catch((error) => {
                    // Handle any errors
                    console.log(error.message);
                });

                // get election logo
                getDownloadURL(ref(storage, doc.data().logoLocation))
                .then((url) => {
                    console.log("Getting logo image for:", doc.data().electionTitle)
                    
                    console.log(url)
                    temp.logo_src = url
                    document.getElementById(`${doc.data().electionTitle}logo`).src = url;

                })
                .catch((error) => {
                    // Handle any errors
                    console.log(error.message);
                });

                if (email == temp.createdBy){
                    this.election_list.push(temp)
                }

                console.log("temp:", this.election_list)
                
            }
            else{
                console.log("election hasnt ended: ", doc.data().electionTitle)
            }

        });
        this.loadDone = true
        
    },
    methods: {
        // format
        redirect(docId){
            // (A) VARIABLES TO PASS
           
            // (B) SAVE TO LOCAL STORAGE
            // localStorage.setItem("KEY", "VALUE");
            localStorage.setItem("docId", docId);
            
            // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
            // window.open("2b-local-storage.html");
            location.href = "results.html";
        }
    }
})

main.mount('#app')