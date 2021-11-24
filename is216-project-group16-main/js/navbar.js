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

// const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs

var main = Vue.createApp( 
    {data() {
        return {
            election_list: [],
            voted_list: [],
            isVoterOverall: false,
            isNomineeOverall: false,
            isLoaded: false,
            current_user: ""
        }
    },

    async created() {

        
        // (A) GET FROM SESSION
        var electionName = localStorage.getItem("electionName");
        // JSON parse to turn stored sting back into array
        
        auth.onAuthStateChanged(user => {
          if (user){
            this.current_user = user.email;
            
          }
       
        })
    
        // (B) IT WORKS!
        // NOTE: Local storage is persistent
        // Will not be deleted unless user clears browser data or manually cleared
        // console.log(electionName); // Foo Bar
        // (EXTRA) TO CLEAR
        // localStorage.removeItem("KEY");
        // localStorage.clear();

        // list of election titles that user has alr voted in
        const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots

          // console.log("printing stuff")
          // console.log(doc.data().nominees);

        var current_user = this.current_user.toLowerCase();
        console.log("this is user: " + current_user)

        let greeting = current_user.split('@')[0]
        console.log(greeting)

        let isNominee = false
        let isVoter = false

        if(doc.data().nominees.includes(current_user)){
            isNominee = true
        }

        else if(doc.data().voterEmails.includes(current_user)){
            isVoter = true
        }
        
        if(isVoter && isNominee || isNominee){
            console.log("you are here !!")
            document.getElementById("app").innerHTML = `
            
                <a href="voter-homepage.html" style="width:15%; padding: 0px" class="nav-button"><img style="width: 100%" src="img/smoovote-logo.png"></a>

                <div style="display: flex; align-items: center">
                    <p id="username" class="user-name">Hi, ${greeting}</p>

                    <div class="dropdown">
                    <div class="drop">
                        <div class="dropbtn"></div>
                        <div class="dropbtn"></div>
                        <div class="dropbtn"></div>
                    </div>
                    <div class="dropdown-content">
                        <a href="election-nominee.html" style="border-bottom: 1px solid gray" class="election-btn">Elections I am running for</a>                    
                        <a href="aboutus.html" style="border-bottom: 1px solid gray;">About Us</a>
                        <a href="contactus.html" style="border-bottom: 1px solid gray;">Contact Us</a>
                        <a href="index.html" id="logout">Log out</a>
                    </div>
                    </div>
                </div>
                
                
                <nav class="navbar navbar-expand-lg navbar-light justify-content-end navMobile sticky-top" style="display:none; " >
                <div class="container-fluid d-flex">
                    <a class="navbar-brand me-auto" href="voter-homepage.html" style="width:15%; padding: 0px"><img style="width: 100%" src="img/smoovote-logo.png"></a>
                    <span class="navbar-text order-lg-2 me-2 user-name">Hi, ${greeting}
                    
                </span>
                    <button class="navbar-toggler dropdown drop" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02">
                    <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse " id="navbarTogglerDemo02">
                    <ul class="navbar-nav me-auto mb-2 mt-2 mb-lg-0 text-end">
                        <li class="election-btn">
                        <a class="nav-link" href="election-nominee.html">Elections I am running for</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="aboutus.html">About Us</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="contactus.html">Contact Us</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="index.html" id="logoutMobile">Log out</a>
                        </li>
                    </div>
                </div>
                </nav>
              `
        }

        else {
            document.getElementById("app").innerHTML = `<div class="navbar navLaptop sticky-top" style = 'z-index: 3'>
                <a href="voter-homepage.html" style="width:15%; padding: 0px" class="nav-button"><img style="width: 100%" src="img/smoovote-logo.png" ></a>
          
                <div style="display: flex; align-items: center">
                  <p id="username" class="user-name">Hi, ${greeting}</p>
          
                  <div class="dropdown">
                    <div class="drop">
                      <div class="dropbtn"></div>
                      <div class="dropbtn"></div>
                      <div class="dropbtn"></div>
                    </div>
                    <div class="dropdown-content">
                      <a href="election-nominee.html" style="border-bottom: 1px solid gray" class="election-btn">Elections I am running for</a>
                      <a href="aboutus.html" style="border-bottom: 1px solid gray;">About Us</a>
                      <a href="contactus.html" style="border-bottom: 1px solid gray;">Contact Us</a>
                      <a href="index.html" id="logout">Log out</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <nav class="navbar navbar-expand-lg navbar-light justify-content-end navMobile sticky-top" style="display:none;z-index: 3;" >
                <div class="container-fluid d-flex">
                  <a class="navbar-brand me-auto" href="voter-homepage.html" style="width:15%; padding: 0px"><img style="width: 100%" src="img/smoovote-logo.png"></a>
                  <span class="navbar-text order-lg-2 me-2 user-name">Hi, ${greeting}
                    
                </span>
                  <button class="navbar-toggler dropdown drop" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo02">
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div class="collapse navbar-collapse " id="navbarTogglerDemo02">
                    <ul class="navbar-nav me-auto mb-2 mt-2 mb-lg-0 text-end">
                      <li class="election-btn">
                        <a class="nav-link" href="election-nominee.html">Elections I am running for</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="aboutus.html">About Us</a>
                      </li>
                      <li class="nav-item">
                        <a class="nav-link" href="contactus.html">Contact Us</a>
                      </li>
                      <li class="nav-item ">
                        <a href="index.html" id="logout">Log out</a>
                      </li>
                  </div>
                </div>
              </nav>`
        }




    // }

        });

        const docRef = doc(db, "ADMINS", "ADMINS");
        const docSnap = await getDoc(docRef);
        let isAdmin = false
        if (docSnap.exists()) {

          const admin_arr = docSnap.data().admins
          // console.log("Document data:", docSnap.data().admins);
          let admin_email = ""
          for (admin_email of admin_arr){
            
            if (admin_email.toLowerCase() == this.current_user.toLowerCase()){
              console.log("admin")
              isAdmin = true
            }

          }


        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }

        if(isAdmin){
          document.getElementById("app").innerHTML = `
          <div class="navbar navLaptop sticky-top" style = 'z-index: 3'>
              <a href="home-admin.html" style="width:15%; padding: 0px" class="nav-button"><img style="width: 100%" src="img/smoovote-logo.png"></a>

              <div style="display:flex; align-items:center;">
                  <a class="nav-button create" href="create.html">Create election</a>

                  <p class="user-name">Hi, ${this.current_user.split("@")[0]}</p>

                  <div class="dropdown">
                      <div class="drop">
                          <div class="dropbtn"></div>
                          <div class="dropbtn"></div>
                          <div class="dropbtn"></div>
                      </div>
                      <div class="dropdown-content">
                          <a href="past-elections.html" style="border-bottom: 1px solid gray;">Past elections</a>
                          <a href="aboutus.html" style="border-bottom: 1px solid gray;">About Us</a>
                          <a href="contactus.html" style="border-bottom: 1px solid gray;">Contact Us</a>
                          <a href="index.html" id="logout">Log out</a>
                      </div>
                  </div>
              </div>
          </div>`
        }

    },
});

main.mount('#app')