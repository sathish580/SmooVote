import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc, setDoc, doc, query, deleteDoc, deleteField, updateDoc, getDoc, arrayUnion, arrayRemove} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-storage.js";


//Library to convert csv to json



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

auth.onAuthStateChanged(user => {
  if (user){
    console.log("user logged in",user)
    localStorage.setItem("adminEmail", user.email);

  }

  else {
   console.log("user logged out",user)
   
  }
})



// const auth = getAuth(); //auth
const db = getFirestore(); //database
const storage = getStorage(app); // storage for imgs

const main = Vue.createApp({ 

    data(){
  
      return {
  
        election_title: '',
        start_date_time: '',
        end_date_time: '',
        position: '',
        description: '',
        nominee_email: '',
        voter_emails_raw: [],
        poster: null,
        poster_url: "",
        logo: null,
        logo_url: "",
        minVote: 0,
        voterTableShow: false,
        duplicated: false,
        nominee_master: [],
        error: false,
        electionExists: false,
        documentId: "",
        voterButtonShow: false,
        endBeforeStart: false,
      }
    },
  
    methods:{
  
      async create_election(){

        // this.checkExisting(this.election_title)

        document.getElementById("title_err").innerHTML = ""
        document.getElementById("start_err").innerHTML = ""
        document.getElementById("end_err").innerHTML = ""
        document.getElementById("email_err").innerHTML = ""
        document.getElementById("position_err").innerHTML = ""
        document.getElementById("csv_err").innerHTML = ""
        document.getElementById("poster_err").innerHTML = ""
        document.getElementById("logo_err").innerHTML = ""
        document.getElementById("vote_err").innerHTML = ""

        if (this.position != ""){

        let nominee_obj = {}
        nominee_obj[this.nominee_email] = [{bio:this.description, position:this.position, firstname: "", igusername: "", lastname: "", school: "", year: "", votes: "",profileImgLocation:"" }]
        this.nominee_email = ""
        this.description = ""
        this.position = ""

        this.nominee_master.push(nominee_obj)}
        var input_validate = true
        // console.log(document.getElementById("fileUpload").value,'HELLO')
        // const nominee_ref = collection(db,'TESTING_MAIN',this.election_title)
        // var electiontitle = this.election_title.replaceAll(" ", "") 
        var electiontitle_storage = this.election_title.replaceAll(" ", "") 
        // console.log(this.election_title)
        // console.log(this.start_date_time)
        // console.log(this.end_date_time)
        // console.log(document.getElementsByClassName('positiondetails'))
        var adminEmail = localStorage.getItem("adminEmail");
        
        if (!this.election_title){
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


        if (!this.start_date_time){
          document.getElementById("start_err").innerHTML = "<p style='color:red'>Start Date Not Selected</p>"
          input_validate = false
        } else {
          document.getElementById("start_err").innerHTML = ""
        }

        if (!this.end_date_time){
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
        
        if (!this.nominee_email && this.nominee_master.length == 0 ){
          document.getElementById("email_err").innerHTML = "<p style='color:#FF7F7F'>Missing Email</p>"
          input_validate = false
        } else {
          document.getElementById("email_err").innerHTML = ""
        }

        if (!this.positions && this.nominee_master.length == 0 ){
          document.getElementById("position_err").innerHTML = "<p style='color:#FF7F7F'>Missing Position</p>"
          input_validate = false
        } else {
          document.getElementById("position_err").innerHTML = ""
        }
        
        if(!Number(this.minVote)){
          document.getElementById("vote_err").innerHTML = "<p style='color:red'>Must be a Number</p>"
          input_validate = false
        } 
        
        else if (Number(this.minVote) <= 0) {
          document.getElementById("vote_err").innerHTML += "<p style='color:red'>Number should be greater than 0</p>"
          input_validate = false
        }

        else if (!Number.isInteger(this.minVote)){
          document.getElementById("vote_err").innerHTML = "<p style='color:red'>Number should be a whole number</p>"
          input_validate = false
        } 
        
        else {
          document.getElementById("vote_err").innerHTML = ""
        }
        

        if (document.getElementById("fileUpload").value == ""){
          // console.log('MISSING CSV')
          document.getElementById("csv_err").innerHTML = "<p style='color:red'>Missing CSV</p>"
          input_validate = false
        } else {
          document.getElementById("csv_err").innerHTML = ""
        }

        if (document.getElementById("formFile").value == ""){
          // console.log('MISSING Poster')
          document.getElementById("poster_err").innerHTML = "<p style='color:red'>Missing Poster</p>"
          input_validate = false
        } else {
          document.getElementById("poster_err").innerHTML = ""
        }

        if (document.getElementById("logo").value == ""){
          // console.log('MISSING Poster')
          document.getElementById("logo_err").innerHTML = "<p style='color:red'>Missing Logo</p>"
          input_validate = false
        } else {
          document.getElementById("logo_err").innerHTML = ""
        }

        if ( input_validate ){

        const docRef =  await addDoc(collection(db, "ELECTIONS"), {
          electionTitle: this.election_title,
          start: this.start_date_time,
          end: this.end_date_time,
          posterLocation: electiontitle_storage + "/poster",
          logoLocation: electiontitle_storage + "/logo",
          nominees: this.nominee_master,
          minimumVotes: this.minVote,
          voterEmails: this.voter_emails_raw,
          createdBy: adminEmail,
          votedUsers: []
        });

        this.documentId = docRef.id
        console.log("document ID", this.documentId)

        await updateDoc(doc(db, 'ELECTIONS',docRef.id), {
          // bio: "loremipsum",
          // instagram: "Heefefllo._",
          // name: "clayton tan",
          // school_year: "year 2 scis",
          
          documentId: docRef.id,
          posterLocation: docRef.id + "/poster",
          logoLocation: docRef.id + "/logo",
          
          
        });

          
          
      
        
        

     
        
        

        // p1 is the doc id 
        // setDoc(doc(db, 'ELECTIONS'), {
        //   // bio: "loremipsum",
        //   // instagram: "Heefefllo._",
        //   // name: "clayton tan",
        //   // school_year: "year 2 scis",
        //   electionTitle: this.election_title,
        //   start: this.start_date_time,
        //   end: this.end_date_time,
        //   posterLocation: electiontitle_storage + "/poster",
        //   logoLocation: electiontitle_storage + "/logo",
        //   nominees: this.nominee_master,
        //   minimumVotes: this.minVote,
        //   voterEmails: this.voter_emails_raw,
        //   createdBy: adminEmail,
        //   votedUsers: []
        // });

        this.upload_poster();
        this.upload_logo();

        setTimeout(function(){location.href='home-admin.html'}, 3000);
      } else {
        this.error = true
      }
 
      
      },

      processVoterList(){
        const full_emails = [];
        var duplicate_emails = false
        let voters_list = this.voter_emails_raw;
          let csvFile = document.getElementById("fileUpload")
          Papa.parse(csvFile.files[0],
            {
              download: true,
              header: true,
              skipEmptyLines: true,
              complete: function (results){
                console.log(results.data)
                let email = ""
                for (email of results.data){
                  // console.log(email.Title)
                  if (!full_emails.includes(email.Title)){
                  full_emails.push(email.Title);
                  voters_list.push(email.Title)}

                  else {
                    
                    // console.log(document.getElementById("CSV_DUPLI").modal)
                    duplicate_emails = true
                    // alert("Duplicates found and removed")
                    console.log('duplicates found')
                    this.duplicated = true
                  }
                }
                if (duplicate_emails) {
                  var modal = new bootstrap.Modal(
                    document.getElementById("duplicateModal")
                  );
                  modal.toggle();
                }
                // console.log(full_emails);

              }
              
            })

            this.voterTableShow = true
            this.voterButtonShow = true
            
          // console.log(voters_list)
        
      
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
      
        this.voter_emails_raw.splice(this.voter_emails_raw.indexOf(removedEmail),1)     

        // console.log(this.voter_emails_raw)

      },


      nominee_master_adder(){
        var nominee_error = false
        console.log(this.nominee_email,this.description)
        document.getElementById("email_err").innerHTML = ""
        
        document.getElementById("position_err").innerHTML = ""
        if (!this.nominee_email){
          document.getElementById("email_err").innerHTML += "<p style='color:#FF7F7F'>Missing Email</p>"
          nominee_error = true
        }
        if (!this.position){
          document.getElementById("position_err").innerHTML += "<p style='color:#FF7F7F'>Missing Position</p>"
          nominee_error = true
        }


        if (!nominee_error) {
        let nominee_obj = {}
        nominee_obj[this.nominee_email] = [{bio:this.description, position:this.position, firstname: "", igusername: "", lastname: "", school: "", year: "", votes: "",profileImgLocation:"" }]
        this.nominee_email = ""
        this.description = ""
        this.position = ""
        this.nominee_master.push(nominee_obj)

        var modal = new bootstrap.Modal(
          document.getElementById("nomineeSuccessModal")
        );
        modal.toggle();
        }

        else {
          var modal = new bootstrap.Modal(
            document.getElementById("nomineeErrorModal")
          );
          modal.toggle();
        }

      },

      previewPoster(event){
        // this methods renders the poster once the user uploads the file
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
        // var electiontitle = this.election_title.replaceAll(" ", "") 
  
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
          console.log('Successfully uploaded poster');
          console.log(snapshot)
        });
      },

      upload_logo(){
  
        // removing all spaces
        // var electiontitle = this.election_title.replaceAll(" ", "") 
  
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
          console.log('Successfully uploaded logo');
          console.log(snapshot)
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
            console.log("Getting poster image")
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
            console.log("Getting logo image")
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

      checkError() {
        this.create_election()
  
        if (this.error == false){
          this.showSuccessMsg()
        } else {
          this.showErrorMsg()
        }
        this.error = false
      },

      showSuccessMsg() {
        // update_election
  
        // hide the confirmation modal and show the success modal
        
        var confirmationModal = new bootstrap.Modal(
          document.getElementById("confirmation")
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
          document.getElementById("confirmation")
        );
        confirmationModal.hide();
  
        var errorModal = new bootstrap.Modal(
          document.getElementById("errorModal")
        );
  
        errorModal.show();
  
        
      },
      async checkExisting(electionName) {
        this.electionExists = false;
        console.log("checking")
        const querySnapshot = await getDocs(collection(db, "ELECTIONS"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());

          if (electionName == doc.data().electionTitle) {
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

      },
      checkDates(){
        this.endBeforeStart = false;
        if (this.start_date_time != "" && this.end_date_time != ""){
          var end = Date.parse(this.end_date_time)
          var start = Date.parse(this.start_date_time)
          if (end <= start){
            this.endBeforeStart = true
          }
        }
      }
  
    }
    ,
    computed:{
  
    }
   });
  
   main.mount("#create_page")