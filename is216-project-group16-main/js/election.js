// Import the functions you need from the SDKs you need
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
  measurementId: "G-QS2DCVDNCJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs


// vue for edit-election
let main = Vue.createApp({
  //=========== DATA PROPERTIES ===========
  data() {
    return {
        nominees: [],
        electionTitle: "",
        currElectionTitle: "",
        startDate: "",
        endDate: "",
        desc: "",
        voters: [],
        poster: null,
        poster_url: "",
        posterLocation: "",
        logo: null,
        logo_url: "",
        logoLocation: "",
        voterTableShow: false,
        minVote: 0,
        createdBy: "",
        documentId: "",
        error: false,
        electionExists: false,
        voterButtonShow: false,
        endBeforeStart: false,
        
    }
},
// When page loads, populate data propeties. 
async created() {
    // (A) GET FROM SESSION
    var electionName = localStorage.getItem("documentId");
    // JSON parse to turn stored sting back into array
    

    // (B) IT WORKS!
    // NOTE: Local storage is persistent
    // Will not be deleted unless user clears browser data or manually cleared
    // console.log(electionName); // Foo Bar
    // (EXTRA) TO CLEAR
    // localStorage.removeItem("KEY");
    // localStorage.clear();





  const docRef = doc(db, "ELECTIONS", electionName);

  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    // let users = docSnap.data().emails;
    // console.log(docSnap.data());
    this.electionTitle = docSnap.data().electionTitle
    this.currElectionTitle = docSnap.data().electionTitle
    this.startDate = docSnap.data().start
    this.endDate = docSnap.data().end
    this.minVote = docSnap.data().minimumVotes
    this.logoLocation = docSnap.data().logoLocation
    this.posterLocation = docSnap.data().posterLocation
    this.votedUsers = docSnap.data().votedUsers
    this.createdBy = docSnap.data().createdBy
    this.voters = docSnap.data().voterEmails
    this.documentId = docSnap.data().documentId

    // this.voters = docSnap.data().voterEmails
    
    var nominees_obj = docSnap.data().nominees
    for (var nominee of nominees_obj){
      // console.log([Object.keys(nominee)])
      // console.log(Object.values(nominee)[0][0].position)
      var nominee_email = Object.keys(nominee)[0]
      var nominee_pos = Object.values(nominee)[0][0].position
      var nominee_bio = Object.values(nominee)[0][0].bio
      var nominee_ig = Object.values(nominee)[0][0].igusername
      var nominee_fn = Object.values(nominee)[0][0].firstname
      var nominee_profileImg = Object.values(nominee)[0][0].profileImgLocation
      var nominee_sch = Object.values(nominee)[0][0].school
      var nominee_yr = Object.values(nominee)[0][0].year
      var nominee_ln = Object.values(nominee)[0][0].lastname
      var nominee_votes = Object.values(nominee)[0][0].votes

      

      this.nominees.push([nominee_email, nominee_pos, nominee_bio, nominee_ig, nominee_fn, nominee_profileImg, nominee_sch, nominee_yr, nominee_ln, nominee_votes])
      // console.log([nominee_email, nominee_pos, nominee_bio, nominee_ig, nominee_fn, nominee_profileImg, nominee_sch, nominee_yr, nominee_ln])
    }




    
    getDownloadURL(ref(storage, docSnap.data().posterLocation))
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

        ;
        document.getElementById(`${docSnap.data().electionTitle}poster`).src = url;
    })
    .catch((error) => {
        // Handle any errors
        console.log(error.message);
    });
    
    
    
    // // getting image url from firebase storage 
    getDownloadURL(ref(storage, docSnap.data().logoLocation))
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

        document.getElementById(`${docSnap.data().electionTitle}logo`).src = url;
    })
    .catch((error) => {
        // Handle any errors
        console.log(error.message);
    });
  } else {
    // doc.data() will be undefined in this case
    // console.log("No such document!");
  }
},
//=========== COMPUTED ===========
computed: {
  // previewPoster(event){
  //   // this methods renders the poster once the user uploads the file
  //   this.poster = event.target.files[0];
  //   this.poster_url = URL.createObjectURL(event.target.files[0])
  // },

  // previewLogo(event){
  //   // this methods renders the poster once the user uploads the file
  //   this.logo = event.target.files[0];
  //   this.logo_url = URL.createObjectURL(event.target.files[0])
  // },
  
},  
//=========== METHODS ===========
methods: {
    create_election(){
      var input_validate = true
      var nominee_master = []

      if (!this.electionTitle){
        document.getElementById("title_err").innerHTML = "<p style='color:red'>Missing Title</p>"
        input_validate = false
      } 
      else if (this.electionExists){
        // console.log(this.electionExists)
        document.getElementById("title_err").innerHTML = "<p style='color:red'>Ongoing election has same title</p>"
        input_validate = false 
      }
      else {
        document.getElementById("title_err").innerHTML = ""
      }

      if (!this.startDate){
        document.getElementById("start_err").innerHTML = "<p style='color:red'>Start Date Not Selected</p>"
        input_validate = false
      } else {
        document.getElementById("start_err").innerHTML = ""
      }

     if (!this.endDate){
        document.getElementById("end_err").innerHTML = "<p style='color:red'>End Date Not Selected</p>"
        input_validate = false
      } 
      else if (this.endBeforeStart){
        document.getElementById("end_err").innerHTML = "<p style='color:red'>End Date cannot be earlier than or equal to Start Date</p>"
        input_validate = false
      }
      else {
        document.getElementById("end_err").innerHTML = ""
      }
      

      if(!Number(this.minVote)){
        document.getElementById("vote_err").innerHTML = "<p style='color:red'>Must be a Number</p>"
        input_validate = false
      } 
      
      else if (Number(this.minVote) <= 0) {
        document.getElementById("vote_err").innerHTML = "<p style='color:red'>Number should be greater than 0</p>"
        input_validate = false
      }

      else if (!Number.isInteger(this.minVote)){
        document.getElementById("vote_err").innerHTML = "<p style='color:red'>Number should be a whole number</p>"
        input_validate = false
      } else {
        document.getElementById("vote_err").innerHTML = ""
      }
      
      if (input_validate){
        for (var nominee of this.nominees){
          if (nominee[0] != "" && nominee[1] != ""){
            let nominee_obj = {}
            nominee_obj[nominee[0]] = [{bio:nominee[2], position:nominee[1], firstname:nominee[4], igusername: nominee[3], lastname: nominee[8], school: nominee[6], year: nominee[7], votes: nominee[9],profileImgLocation: nominee[5] }]
             
            nominee_master.push(nominee_obj)
            // console.log(nominee_obj)            
          }
          
        }
      
        // console.log(nominee_master)
        // p1 is the doc id 

        setDoc(doc(db, 'ELECTIONS', this.documentId), {
          electionTitle: this.electionTitle,
          start: this.startDate,
          end: this.endDate,
          posterLocation: this.posterLocation,
          logoLocation: this.logoLocation,
          nominees: nominee_master,
          minimumVotes: this.minVote,
          voterEmails: this.voters,
          votedUsers: this.votedUsers,
          createdBy: this.createdBy,
          documentId: this.documentId,
        });
    
          if (this.poster != null){
            this.upload_poster();
          }
          if (this.logo != null){
            this.upload_logo();
          }
    
          setTimeout(function(){location.href='home-admin.html'}, 3000);  
      } else {
        this.error = true
      }
           
 
    },

    checkError() {
      this.create_election()

      if (this.error == false){
        this.showSuccessMsg()
      } else {
        this.showErrorMsg()
      }
      this.error = false
    },

    previewPoster(event){
      // this methods renders the poster once the user uploads the file
      // console.log(this.posterLocation)
      this.poster = event.target.files[0];
      this.poster_url = URL.createObjectURL(event.target.files[0])
    },

    previewLogo(event){
      // this methods renders the poster once the user uploads the file
      this.logo = event.target.files[0];
      this.logo_url = URL.createObjectURL(event.target.files[0])
    },

    // uploading the poster to the firebase storage
    upload_poster(){

      // removing all spaces
      // console.log(electiontitle)
      // var electiontitle = this.electionTitle.replaceAll(" ", "") 

      // creating a folder for the election and naming the poster as "poster"
      var filename = this.documentId + '/poster'

      // change the metadata to image
      const metadata = {
        contentType: 'image',
      };

      // image reference to the firebase storage and the poster destination
      const imagesRef = ref(storage, filename);

      // uploading the poster to firebase storage
      uploadBytes(imagesRef, this.poster, metadata).then((snapshot) => {
        // console.log('Successfully uploaded poster');
        // console.log(snapshot)
      });
    },

    upload_logo(){

      // // removing all spaces
      // var electiontitle = this.electionTitle.replaceAll(" ", "") 

      // creating a folder for the election and naming the poster as "poster"
      var filename = this.documentId + '/logo'

      // change the metadata to image
      const metadata = {
        contentType: 'image',
      };

      // image reference to the firebase storage and the poster destination
      const imagesRef = ref(storage, filename);

      // uploading the poster to firebase storage
      uploadBytes(imagesRef, this.logo, metadata).then((snapshot) => {
        // console.log('Successfully uploaded logo');
        // console.log(snapshot)
      });
    },

    // retrieve poster from firebase storage
    get_poster(){
      // console.log(ref(storage, "test/poster"))
      // get file location --> election_title/poster
      // var fileLocation = "test/poster";
      // var electiontitle = this.election_title.replaceAll(" ", "") 
      var fileLocation = this.documentId + "/poster";

      
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

    get_logo(){
      // console.log(ref(storage, "test/logo"))

      // var electiontitle = this.election_title.replaceAll(" ", "") 
      var fileLocation = this.documentId + + '/logo';

      
      // getting image url from firebase storage 
      getDownloadURL(ref(storage, fileLocation))
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
          
          this.logo_url = url;
        })
        .catch((error) => {
          // Handle any errors
          console.log(error.message);
        });
      

    },

    processVoterList(){
      const full_emails = [];
      this.voters = []
      var duplicate_emails = false
      let voters_list = this.voters;
        let csvFile = document.getElementById("fileUpload")
        Papa.parse(csvFile.files[0],
          {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results){
              // console.log(results.data)
              let email = ""
              for (email of results.data){

                if (!full_emails.includes(email.Title)){
                  full_emails.push(email.Title);
                  voters_list.push(email.Title)
                }

                else {
                  duplicate_emails = true
                  // console.log('duplicates found')
                }
              }

              if (duplicate_emails) {
                var modal = new bootstrap.Modal(
                  document.getElementById("duplicateModal")
                );
                modal.toggle();
              }

            }       
          })

          this.voterTableShow = true
          this.voterButtonShow = true
        // console.log(voters_list,'voter')
      
    
    },

    viewNewVoters() {
      if (this.voterTableShow == true) {
        this.voterTableShow = false
      } 
      else {
        this.voterTableShow = true
      }
    },

    deleteVoterEmail(removedEmail){

      // console.log(removedEmail)
      // console.log(document.getElementById(removedEmail).removeChild)
      document.getElementById(removedEmail).removeChild

      // console.log(this.voter_emails_raw.indexOf(removedEmail))
    
      this.voters.splice(this.voters.indexOf(removedEmail),1)     

      // console.log(this.voter_emails_raw)

    },
    
    
    delete_nominee(index) {
      if(confirm("Are you sure you want to delete this nominee?")){
        this.nominees.splice(index, 1)
      } else {
        // console.log("nothing was done")
      }
        
      
    },

    add_nominee() {
      // console.log([nominee_email, nominee_pos, nominee_bio, nominee_ig, nominee_fn, nominee_profileImg, nominee_sch, nominee_yr])
      this.nominees.push(["", "", "", "", "", "", "", 0, "", ""])
    },

    showConfirmation() {
      
      var modal = new bootstrap.Modal(
        document.getElementById("confirmationModal")
      );
      modal.toggle();
      
    },

    showSuccessMsg() {
      // update_election

      // hide the confirmation modal and show the success modal
      
      var confirmationModal = new bootstrap.Modal(
        document.getElementById("confirmationModal")
      );
      confirmationModal.hide();

      var successModal = new bootstrap.Modal(
        document.getElementById("successModal")
      );

      successModal.show();

      setTimeout(function () {
        window.location.href = "home-admin.html";
      }, 3000);
    },

    showErrorMsg() {
      // update_election

      // hide the confirmation modal and show the success modal
      
      var confirmationModal = new bootstrap.Modal(
        document.getElementById("confirmationModal")
      );
      confirmationModal.hide();

      var errorModal = new bootstrap.Modal(
        document.getElementById("errorModal")
      );

      errorModal.show();

      
    },


    redirect(documentId){
      // (A) VARIABLES TO PASS
      
     

      // (B) SAVE TO LOCAL STORAGE
      // localStorage.setItem("KEY", "VALUE");
      localStorage.setItem("documentId", documentId);
      
      // (C) REDIRECT OR OPEN NEW WINDOW IF YOU WANT
      // window.open("2b-local-storage.html");
      location.href = "voterbase.html";
    },
    showDelete() {
      
      var modal = new bootstrap.Modal(
        document.getElementById("deleteModal")
      );
      modal.toggle();
      
    },
    async deleteElection() {

      await deleteDoc(doc(db, "ELECTIONS", this.documentId));
      var deleteModal = new bootstrap.Modal(
        document.getElementById("confirmationModal")
      );
      deleteModal.hide();

      var deleteConfirmation = new bootstrap.Modal(
        document.getElementById("deleteConfirmationModal")
      );

      deleteConfirmation.show();

      setTimeout(function () {
        window.location.href = "home-admin.html";
      }, 3000);
    },

    async checkExisting(electionName) {
      this.electionExists = false;
      // console.log("checking")
      const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
      querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());

        if (electionName == doc.data().electionTitle && electionName != this.currElectionTitle) {
          var todayDateTime = new Date().toLocaleString();
          // console.log(todayDateTime)
          // console.log(Date.parse(todayDateTime))
          var todayParsed = Date.parse(todayDateTime)
          var electionEnd = Date.parse(doc.data().end)

          // if todayParsed < electionEnd, means election has not ended
          if (todayParsed < electionEnd){
            this.electionExists = true
          }

        }

      });
      // console.log(this.electionExists)
    },

    checkDates(){
      this.endBeforeStart = false;
      if (this.startDate!= "" && this.endDate != ""){
        var end = Date.parse(this.endDate)
        var start = Date.parse(this.startDate)
        if (end <= start){
          this.endBeforeStart = true
        }
      }
      // console.log(this.endBeforeStart)
    }
}
  
})
main.mount("#edit")