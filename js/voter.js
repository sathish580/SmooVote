// Import the functions you need from the SDKs you need
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
      db_name: "ELECTIONS",
      election_title: "",
      nominees_list: [],
      instagramPics: [],
      long_access_token:
        "IGQVJXdk9teWs0ZAnZAnMkNYWFE4QjF0Ynd3TnpRWF9oSlBLTFlMR3BBMXNGdGQydG43dXc1cUYzMTJILTZA6bmxoQTRFV2xsX3V2enZAobXNCclNkZAGZA3NUdmeEhKbnZAPR3RlWGxzSEdB",
      user_id: "17841449870545540",
      instagramLoaded: false,
      selectedNominees: [],
      displaySelectedNominees: [],
      current_user: "",
      isVoter: true,
    };
  },
  async created(){
    // get the emailId so that we can display the Hi, emailId
    var emailId = localStorage.getItem("emailId");
    document.getElementsByClassName("user-name")[0].innerText = `Hi, ${emailId}`

    // check if we display the "Elections I am running for"
    var isNominee = localStorage.getItem("isNominee");
    console.log("isNominee", isNominee)
    if(isNominee == 'false'){
      console.log("hiding")
      document.getElementsByClassName("election-btn")[0].style.display = "none"
      document.getElementsByClassName("election-btn")[1].style.display = "none"
    }

    // CHANGE THE ELECTION NAME
    // var electionName = "EYE Investment Club"
    let docId = localStorage.getItem("docId");
    console.log(docId);
    const docRef = doc(db, this.db_name, docId,);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      console.log(docSnap.data());
      this.election_title = docSnap.data().electionTitle
      var nomObj = {}
      var nomineesDb = docSnap.data().nominees
      console.log(nomineesDb.length)
      for ( var key of Object.keys(nomineesDb) ){
        console.log("\n\noneNom", nomineesDb[key])
        for ( var email of Object.keys(nomineesDb[key]) ){
          console.log("detail", nomineesDb[key][email][0])
          nomObj = nomineesDb[key][email][0]
          // set the firstname as the email if the firstname has not been filled out
          if(nomObj.firstname == null || nomObj.firstname == ""){
            nomObj.firstname = email
            
          }
          nomObj.email = email
          nomObj.emailId = nomObj.email.split('@')[0].replace('.', '_')
          var profilePicLocation = nomineesDb[key][email][0].profileImgLocation
          if (profilePicLocation == ""){
            profilePicLocation = "placeholder.jpg"
          }
          console.log("profilePicLocation", profilePicLocation)
          // var profilePicLocation =""
          // if (profilePicLocation != ""){
            await getDownloadURL(ref(storage, profilePicLocation))
            .then((url) => {
              console.log("Getting image from storage")          
              // nomObj.imgURL = url
              console.log(url)
              nomObj.photo_url = url
              
              console.log(nomObj.firstname)

              document.getElementById(`${nomObj.emailId}photo`).src = url;
              document.getElementById(`${nomObj.emailId}ModalPhoto`).src = url;
              // this.nominees_list.push(nomObj)
            })
            .catch((error) => {
              // Handle any errors
              console.log(error.message);
            });
            
          // }
          // else{
            
            this.nominees_list.push(nomObj);
          // }
          
          console.log("this.nominees_list:",this.nominees_list)

        }
      }

    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }

  },
  mounted(){
    var user = document.referrer
    if (user.includes("nominee")){
      this.isVoter = false;
    }
    
  },
  methods: {
    async updateVoteInDb(){
      console.log("\n\nin updateVoteInDb")
      console.log("displaySelectedNominees", this.displaySelectedNominees)
      var emailsToUpdate= [];
      for (var one of this.displaySelectedNominees){
        emailsToUpdate.push(one.email)
      }
      // console.log("emailstoupdate: ", emailsToUpdate)

      // get current user to update db later
      auth.onAuthStateChanged(user => {
        if (user){
          this.current_user = user.email;
        }
      })
      
      // console.log("current user:",this.current_user)

      // CHANGE THE ELECTION NAME
      // var electionName = "EYE Investment Club"
      let docId = localStorage.getItem("docId");

      const docRef = doc(db, this.db_name, docId,);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log(docSnap.data());
        this.election_title = docSnap.data().electionTitle;

        // assign nomineesDb the entire nominees object from db, 
        // so that the format does not change when we insert back into db
        var nomineesDb = docSnap.data().nominees
        var votedUsers = docSnap.data().votedUsers
        // update votedUsers with user's email to show that they have alr voted
        votedUsers.push(this.current_user)

        for ( var key of Object.keys(nomineesDb) ){
          // key is the INDEX of the nominees list 
          for (var email of Object.keys(nomineesDb[key]))
          // email is the KEY, value will be an ARRAY of 1 object
          // to access nominee information, must get the first index
          if (emailsToUpdate.includes(email)){
            // update the num_votes of selected nominee in nomineeDb
            var nomVotes = Number(nomineesDb[key][email][0].votes)
            // console.log("curr vote count", nomVotes)
            nomVotes += 1
            // console.log("new vote count", nomVotes)
            nomineesDb[key][email][0].votes = String(nomVotes)
            console.log("\n\n adding 1 vote to email:", email)
          }
        }
        console.log("final nominees to insert into db: ", nomineesDb)
        // update nominee and voter in firebase by passing in entire UPDATED nomineeDb and votedUsers
        updateDoc(doc(db, this.db_name,docId), {
          nominees: nomineesDb,
          votedUsers: votedUsers
        });



        console.log("UPDATED DATABASE")
  
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    },
    // START OF GETTING IMGS FROM INSTAGRAM API FUNCTIONS 
    getUserID() {
      console.log("--getUserID() run--");
      let fields = "account_type,username,media_count";
      let get_user_info = `https://graph.instagram.com/${this.user_id}?access_token=${this.long_access_token}&fields=${fields}`;
      // console.log("instagramPics", this.instagramPics);
      axios
        .get(get_user_info)
        .then((response) => {
          // a) Inspect the response.data
          //   console.log("---GETTING USER INFO---");
          var userid = response.data.id;
          var username = response.data.username;
          //   console.log("User ID:", userid);
          //   console.log("Username: ", username);
          this.username = username;
          fields = "id,timestamp";
          // get all photos from userid
          let get_photo_arr = `https://graph.instagram.com/${this.user_id}/media?access_token=${this.long_access_token}&fields=${fields}`;
          this.getUserPics(get_photo_arr);
        })
        .catch((error) => {
          console.log(error.message);
          if (error.message.includes("expired")) {
            // if the error is that the long time token as expired, refresh for a new one
          }
        });
    },
    getUserPics(api_link) {
      var photoIdArr = [];
      axios
        .get(api_link)
        .then((response) => {
          // a) Inspect the response.data
          //   console.log("---GETTING PICS IDS---");
          //   console.log(response.data);
          var photosArr = response.data.data;
          for (var onePhotoObj of photosArr) {
            // console.log("id arr:", onePhotoObj)
            photoIdArr.push(onePhotoObj.id);
          }
          //   console.log("id arr:", photoIdArr);
          this.displayUserPics(photoIdArr);
        })
        .catch((error) => {
          console.log(error.message);
        });
    },
    displayUserPics: async function (photoIdArr) {
      this.instagramLoaded = true;
      var imageLimit = 3;
      //   console.log("---DISPLAYING PICS, GETTING URLS ETC---");
      for (var i = 0; i < imageLimit; i++) {
        var fields = "media_url,permalink,media_type";
        var oneId = photoIdArr[i];
        let api_link = `https://graph.instagram.com/${oneId}?access_token=${this.long_access_token}&fields=${fields}`;
        try {
          await axios
            .get(api_link)
            .then((response) => {
              //   console.log("==== GETTING PHOTO ====");
              //   console.log("Current photoid:", oneId);
              //   console.log("photo url:", response.data.media_url);
              //   console.log("photo permalink:", response.data.permalink);
              //   console.log("photo mediaType:", response.data.media_type);
              var media_url = response.data.media_url;
              var permalink = response.data.permalink;

              this.instagramPics.push(`
                <a href="${permalink}" target="_blank" class="text-decoration-none text-dark">
                    <img src="${media_url}" class="d-block w-100" >
                </a>
                `);
            })
            .catch((error) => {
              console.log(error.message);
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    // END OF GETTING IMGS FROM INSTAGRAM API FUNCTIONS
    showConfirmation() {
      this.displaySelectedNominees = [];
      if (this.selectedNominees.length <= 4 && this.selectedNominees.length > 0) {
        for (var nomid in this.selectedNominees) {
          var id = this.selectedNominees[nomid];
          this.displaySelectedNominees.push(this.nominees_list[id]);
        }
        console.log("this.displaySelectedNominees",this.displaySelectedNominees)
        var modal = new bootstrap.Modal(
          document.getElementById("confirmationModal")
        );
        modal.toggle();
        // var confirmationModal = this.$slots["confirmationModal"][0].elm;
        // var theModal = new Modal(confirmationModal, {});
        // theModal.show();
      } else if(this.selectedNominees.length > 4) {
        document.getElementById("error").innerText = "Please choose a maximum of 4 nominees only."
        document.getElementById("error").style.display = "block"
      }
      else if(this.selectedNominees.length == 0) {
        document.getElementById("error").innerText = "Please select at least 1 nominee."
        document.getElementById("error").style.display = "block"

      }
    },
    showSuccessMsg() {
      // update vote count in the db
      this.updateVoteInDb();

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
        window.location.href = "voter-homepage.html";
      }, 3000);
    },
    
    
  },
  computed: {
    picsHTML: function () {
      if (this.instagramLoaded && this.instagramPics != []) {
        console.log("===== PICS ALREADY LOADED =====");
        return this.instagramPics;
      } else {
        console.log("===== PICS NOT LOADED PREVIOUSLY ======");
        this.getUserID();
      }

      // return this.getUserID();
    },
  },
});


main.mount("#nominees");
