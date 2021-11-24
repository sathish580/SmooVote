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


auth.onAuthStateChanged(user => {
    if (user){
    //   console.log("user logged in",user)
      localStorage.setItem("adminEmail", user.email);
    }
  
    else {
    //  console.log("user logged out",user)
     
    }
  })
  
var main = Vue.createApp( 
    {data() {
        return {
            election_list: [],
            current_user: '',
            // finished: false,
        }
    },
    async created() {
        // console.log("CREATED")
        // Getting the current user email 
        // auth.onAuthStateChanged(user => {
        //     if (user){
        //       this.current_user = user.email;
        //     }
         
        //   })
        // this.current_user = 'F';
        // (A) GET FROM SESSION
        // var electionName = localStorage.getItem("electionName");
        // JSON parse to turn stored sting back into array
        
    
        // (B) IT WORKS!
        // NOTE: Local storage is persistent
        // Will not be deleted unless user clears browser data or manually cleared
        // console.log(electionName); // Foo Bar
        // (EXTRA) TO CLEAR
        // localStorage.removeItem("KEY");
        // localStorage.clear();
        var adminEmail = localStorage.getItem("adminEmail");
        
        const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
        querySnapshot.forEach((doc) => {
            // console.log(doc.data(),'data');   
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
                created_by: doc.data().createdBy,
                admin_email: adminEmail,
                documentId: doc.data().documentId,


            };
            // getting image url from firebase storage 
            // console.log(temp,'TEMP TEST')
            // checking if election has ended, if yes, dont display
            var todayDateTime = new Date()
            // console.log(todayDateTime)
            // console.log(Date.parse(todayDateTime))
            // var todayParsed = Date.parse(todayDateTime)
            var todayParsed = todayDateTime.getTime()
            var electionEnd = Date.parse(doc.data().end)


            // console.log(todayParsed,electionEnd,'END')
            // if todayParsed < electionEnd, means election has not ended
            if (todayParsed < electionEnd){
                // console.log("PARSED")
                getDownloadURL(ref(storage, doc.data().posterLocation))
                .then((url) => {
                    // console.log("Getting poster image")
                    // This can be downloaded directly:
                    // const xhr = new XMLHttpRequest();
                    // xhr.responseType = 'blob';
                    // xhr.onload = (event) => {
                    //   const blob = xhr.response;
                    // };
                    // xhr.open('GET', url);
                    // xhr.send();
                    
                    // console.log(url)

                    temp.img_src = url;
                    document.getElementById(`${doc.data().electionTitle}poster`).src = url;
                    // console.log(doc.data().electionTitle)
                })
                .catch((error) => {
                    // Handle any errors
                    console.log(error.message);
                });
                
                
                
                // // getting image url from firebase storage 
                getDownloadURL(ref(storage, doc.data().logoLocation))
                .then((url) => {
                    // console.log("Getting logo image")
                    // This can be downloaded directly:
                    // const xhr = new XMLHttpRequest();
                    // xhr.responseType = 'blob';
                    // xhr.onload = (event) => {
                    //   const blob = xhr.response;
                    // };
                    // xhr.open('GET', url);
                    // xhr.send();
                    
                    // console.log(url)
                    temp.logo_src = url
                    document.getElementById(`${doc.data().electionTitle}logo`).src = url;
                })
                .catch((error) => {
                    // Handle any errors
                    console.log(error.message);
                });
                    
                
                // console.log(temp,'temp')
                

                if (temp.created_by == temp.admin_email){
                    this.election_list.push(temp)
                //  console.log(this.election_list,'TEST')
                }
            }
           
                    
            
            
          // doc.data() is never undefined for query doc snapshots
            
          

        });
        // this.finished = true;
    },
    methods: {
        // format
        redirect(documentId){
            // (A) VARIABLES TO PASS
            
           

            // (B) SAVE TO LOCAL STORAGE
            // localStorage.setItem("KEY", "VALUE");
            localStorage.setItem("documentId", documentId);
            
            // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
            // window.open("2b-local-storage.html");
            location.href = "edit-election.html";
        }
    }
})

main.mount('#app')

window.onload = function() {
    setTimeout(function(){
        if(!window.location.hash) {
            window.location = window.location + '#loaded';
            window.location.reload();
        }
        ; }, 500);
	
}
