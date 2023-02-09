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


let main = Vue.createApp({
    //=========== DATA PROPERTIES ===========
    data() {
      return {
          electionTitle: "",
          voters: [],
          voter_search: "",
          allVoters: false,
          searched_voters: [],
          voterTableShow: false,
          documentId: "",
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
    //   console.log(docSnap.data());
      this.electionTitle = docSnap.data().electionTitle
      this.voters = docSnap.data().voterEmails
      this.documentId = docSnap.data().documentId
    //   console.log(this.voters)
    }
  },
  //=========== COMPUTED ===========
  computed: {
      
    
  },  
  //=========== METHODS ===========
  methods: {
    showAll() {
        if (this.allVoters == true) {
            this.allVoters = false
        }
        else {
            this.allVoters = true
        }
    },

    searchVoter() {
        var new_voters = []
        var voter_exist = false
            for (var voter of this.voters) {
                if (this.voter_search.toLowerCase() == voter.toLowerCase()) {
                new_voters.push(voter)
                voter_exist = true
                }

            }
            
        if (!voter_exist){
            alert("Voter does not exist")
        } else {
            this.allVoters = false
            this.searched_voters = new_voters
            document.getElementById("showAllId").checked = false
        }

    
    
    },

    clearSearch() {
        this.voter_search = ""
        this.searched_voters = []
    },

    deleteVoter(voter){
        if (confirm("Are you sure you want to delete?")){
            var index = this.voters.indexOf(voter)
            this.voters.splice(index, 1)
            var indexSearch = this.searched_voters.indexOf(voter)
            this.searched_voters.splice(indexSearch, 1)
        } else {
            // console.log("do nothing")
        }
    
    },
    
    updateVoters(){
        // p1 is the doc id 
        updateDoc(doc(db, 'ELECTIONS', this.documentId), {
          voterEmails: this.voters
        });
       
    },

    showConfirmation() {
      
        var modal = new bootstrap.Modal(
          document.getElementById("confirmationModal")
        );
        modal.toggle();
        
    },
  
    showSuccessMsg() {
        // update_election

        this.updateVoters()
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

    processVoterList(){
        const full_emails = [];
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

                  if (!results.data.includes(email.Title) && !full_emails.includes(email.Title) && !voters_list.includes(email.Title)){
                    full_emails.push(email.Title);
                    voters_list.push(email.Title)
                  }
                  else {
                    duplicate_emails = true
                    // console.log('duplicates found')
                  }
                }

                if (duplicate_emails) {
                    var duplicate = new bootstrap.Modal(
                      document.getElementById("duplicateModal")
                    );
                    duplicate.toggle();
                }
  
              }
              
            })
  
            this.voterTableShow = true
        
        //   console.log(voters_list,'voter')
        
      
      },

      deleteVoterEmail(removedEmail){

        // console.log(removedEmail)
        // console.log(document.getElementById(removedEmail).removeChild)
        document.getElementById(removedEmail).removeChild
  
        // console.log(this.voter_emails_raw.indexOf(removedEmail))
      
        this.voters.splice(this.voters.indexOf(removedEmail),1)     
  
        // console.log(this.voter_emails_raw)
  
      },

  }

})
main.mount("#voterbase")