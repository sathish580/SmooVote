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



new Vue({
    el: "#app",
    data(){
        return{
            election_list: [],
            voted_list: [],
            isVoterOverall: false,
            isNomineeOverall: false,
            isLoaded: false,
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
          // console.log("this is user: " + current_user)
          // to check if user is a voter
          let voterView = false;

          // to check if user alr voted
          let alrVoted = false

          // this.isVoter = false
          // this.isNominee = false

          let innerIsVoter = false
          let innerIsNominee = false

          for (var voter of doc.data().voterEmails){
              // console.log("voter = " + voter)
              // console.log(typeof(voter))
            // check that the user is in the voterbase 
            if (voter.toLowerCase() == current_user){
              // console.log("you are a voter")
              // document.getElementById("username").innerHTML = "Hi, Voter"
              this.isVoterOverall = true;
              innerIsVoter = true;
              voterView = true
              
              // check if user has alr voted
              if(doc.data().votedUsers.includes(current_user)){
                alrVoted = true
              }
  
            }
          }

          for (var nominee of doc.data().nominees){
            // console.log("printing in loop")
            // console.log("this is user: " + current_user)
            var nomineeObj = Object.keys(nominee)
            var nomineeEmail = Object.keys(nominee)[0]

            nomineeEmail = nomineeEmail.toLowerCase()
            
            if (nomineeEmail.includes(current_user)){
              // console.log("you're a nominee !!")
              // console.log("this is user: " + current_user)
              this.isNomineeOverall = true;
              innerIsNominee = true;
              voterView = true
              // document.getElementById("username").innerHTML = "Hi, Nominee"
            }

            // else{
            //   document.getElementById("election-btn").style.display = "none"
            // }
          }

          // store email id into localstorage for other pages
          var emailId = this.current_user.split('@')[0]
          localStorage.setItem("emailId", emailId);

          // Show their email id in the nav bar
          document.getElementById("username").innerHTML = `Hi, ${emailId}`


          
          // if user is a voter and is not a nominee for this specific election
          if(voterView && !innerIsNominee){
            var start_time_val = doc.data().start
            var start_time_arr = start_time_val.split("T")
            var end_time_val = doc.data().end
            var end_time_arr = end_time_val.split("T")
            var temp = {
                header: doc.data().electionTitle,
                logo_src: "",
                img_src: "",
                start_date: start_time_arr[0],
                start_time: start_time_arr[1],
                end_date: end_time_arr[0],
                end_time: end_time_arr[1],
                docId: doc.data().documentId
               
            }

            // checking if election has ended, if yes, dont display
            var todayDateTime = new Date()
            // console.log(todayDateTime)
            // console.log(Date.parse(todayDateTime))
            // var todayParsed = Date.parse(todayDateTime)
            var todayParsed = todayDateTime.getTime()
            var electionStart = Date.parse(doc.data().start)
            
            // if todayParsed > electionStart, means election has started, so display, otherwise, dont show yet
            if (todayParsed > electionStart){
              // getting image url from firebase storage 
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
                })
                .catch((error) => {
                  // Handle any errors
                  console.log(error.message);
                });
              
              
              // console.log("temp", temp)
              if (!alrVoted){
                // if user has not voted for the election, add to election_list
                this.election_list.push(temp)
              }
              else{
                // if user has voted for the election, add to voted_list
                this.voted_list.push(temp)
              }
            }
          }
          
        });

        // setInterval(function(){alert("HELLLLLO")},5000)
        if(!this.isNomineeOverall){
          // console.log(document.getElementsByClassName("election-btn"))
          document.getElementsByClassName("election-btn")[0].style.display = "none"
          document.getElementsByClassName("election-btn")[1].style.display = "none"
          // set localStorage item to check if we show the "elections i am running for"
          localStorage.setItem("isNominee", false);
        }
        else{
          localStorage.setItem("isNominee", true);
        }
        
        // send a signal back that the page has loaded
        this.isLoaded = true

    },

    methods: {
        // format
        get_poster(){
          // console.log(ref(storage, "test/poster"))
          // get file location --> election_title/poster
          // var fileLocation = "test/poster";
          var electiontitle = this.election_title.replaceAll(" ", "") 

          var fileLocation = electiontitle + "/poster";
          
          // getting image url from firebase storage 
          getDownloadURL(ref(storage, fileLocation))
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
              
              this.poster_url = url;
            })
            .catch((error) => {
              // Handle any errors
              console.log(error.message);
            });
          
    
        },
        redirect(docId){
          // (A) VARIABLES TO PASS
          
          // (B) SAVE TO LOCAL STORAGE
          // localStorage.setItem("KEY", "VALUE");
          localStorage.setItem("docId", docId);
          
          // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
          // window.open("2b-local-storage.html");
          location.href = "voter-nominees.html";
        }
    }
});

// var app = Vue.createApp( 
//     {data() {
//         return {
//             election_list: [{
//                 header: 'SMUSA election',
//                 logo_src: "img/SMUSA Logo.png",
//                 img_src: "img/smusa.jpg",
//             }, {
//                 header: 'Ellipsis election',
//                 logo_src: "img/ellipsis-logo.png",
//                 img_src: "img/ellipsis.jpg",
//             }, {
//                 header: 'Bondue election',
//                 logo_src: "img/bondue-logo.png",
//                 img_src: "img/bondue.jpg",
//             }],

//             past_list: [{
//                 header: 'SSU election',
//                 logo_src: "img/ssu-logo.jpg.png",
//                 img_src: "img/ssu.jpg",
//             }, {
//                 header: 'ACF election',
//                 logo_src: "img/acf-logo.png",
//                 img_src: "img/acf.jpg",
//             }],
//         }
//     },
//     methods: {
//         // format
//         foo() {
//             return "a JS function";
//         }
//     }
// })

// app.mount('#app')
