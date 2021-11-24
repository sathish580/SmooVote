 // Import the functions you need from the SDKs you need
 import { initializeApp} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-app.js";
 import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-analytics.js";
 import { getAuth, createUserWithEmailAndPassword,signOut, signInWithEmailAndPassword,onAuthStateChanged} from "https://www.gstatic.com/firebasejs/9.1.2/firebase-auth.js";
 import { getFirestore, collection, getDoc,setDoc, doc, query, deleteDoc, deleteField, updateDoc } from "https://www.gstatic.com/firebasejs/9.1.2/firebase-firestore.js";
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


  const user = auth.currentUser;
  window.addEventListener('load',function(){
  
  })

// const auth = getAuth(); //auth
// const db = getFirestore(); //database


//write data 
// const nominee_ref = collection(db,'test_bondue')
// try {

//   // p1 is the doc id 
//   const docRef = await setDoc(doc(nominee_ref,'P1'), {
//     bio: "wdqdwdq",
//     instagram: "Heefefllo._",
//     name: "clayton tan",
//     school_year: "year 2 scis"
//   });

  
// } catch (e) {
//   console.error("Error adding document: ", e);
// }

// try {

//   // p1 is the doc id 
//   const docRef = await setDoc(doc(nominee_ref,'P2'), {
//     bio: "loremipsum",
//     instagram: "Heefefllo._",
//     name: "Sam Ttan",
//     school_year: "year 2 scis"
//   });

  
// } catch (e) {
//   console.error("Error adding document: ", e);
// }




// delete document 

// await deleteDoc(doc(db,"nominee",'P3'))

//delete fields in a document 

// await updateDoc(doc(db,'nominee','P3'),{
//   instagram: deleteField()
// })

 //listen for auth status changes


 if (document.getElementById("loginpage")){
  signOut(auth)
  localStorage.clear();
  console.log(document.getElementById("loginpage"),'LOGINPAGE')
}
 auth.onAuthStateChanged(user => {
   if (user){

    
    console.log("user logged in",user)
     // to change emailId on navbar
    if (!document.getElementById("loginpage")){
      localStorage.setItem("userEmail", user.email);
      document.getElementsByClassName("user-name")[0].innerText = `Hi, ${user.email.split('@')[0]}`
      document.getElementsByClassName("user-name")[1].innerText = `Hi, ${user.email.split('@')[0]}`

      // // dynamically render the href for the logo
      // // if admin in email, set logo href as home-admin.html
      // if (user.email.toLowerCase().includes('admin')){
      //   // document.getElementById("admin_page").children[0].href = "home-admin.html"
      //   // document.getElementsByClassName("navbar-brand")[0].href = "home-admin.html"
      //   document.getElementsByClassName("navLaptop")[0].href = "voter-homepage.html"
      //   document.getElementsByClassName("navbar-brand")[0].href= "voter-homepage.html"
      // }
      // // else set href as voter-homepage.html
      // else{
      //   document.getElementsByClassName("navLaptop")[0].href = "voter-homepage.html"
      //   document.getElementsByClassName("navbar-brand")[0].href= "voter-homepage.html"

      // }
    }
   }

   else {
    console.log("user logged out",user)
    
   }
 })



 //auto logout without sign in and signs out non admin if accessing admin page

 if (document.getElementById('loginform') == null) {
  auth.onAuthStateChanged(user => {

    if(user == null){
      console.log('null')
      location.href='index.html'
    }

    if (document.getElementById('admin_page') != null){
      
      async function adminCheck(){
        console.log('hello admincheck')
        const docRef = doc(db, "ADMINS", "ADMINS");
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
  
          const admin_arr = docSnap.data().admins
          // console.log("Document data:", docSnap.data().admins);
          let admin_email = ""
          let is_admin = false
          for (admin_email of admin_arr){
        
            if (admin_email.toLowerCase() == user.email.toLowerCase()){
              is_admin = true
            }
  
          }
  
          if (!is_admin){

            
            console.log('signout')
            signOut(auth);
            location.href='index.html'
  
          }
  
  
  
  
        } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
        }
      }
  
      adminCheck()
      
    }

  })}

//check if loginpage

let loginpagestatus = document.getElementById('loginpage')

if (loginpagestatus){

 // signups user into firebase
 const signupform = document.getElementById('signupform');
 console.log(signupform)

 signupform.addEventListener('submit', (e) => {
   
       e.preventDefault();

       const email = signupform['SignupEmail'].value;
       const password = signupform['SignupPassword'].value;
       
       // console.log(email,password);
       console.log(auth)
       console.log('runssignupradio')
      


       if (email.toLowerCase().includes("smu")== false){

       
        document.getElementById("invalids").style.color = 'red'

        document.getElementById("invalids").innerText = 'Please signup using your SMU email'

       }

       else{

       //signup user on firebase 
       createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
    // Signed in 
        
        const user = userCredential.user;
        $('#signupmodal').modal('hide')
        signupform.reset()
        console.log('user signed up')
        location.href='voter-homepage.html'
        
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode)

        //weak password check
        if (errorCode == 'auth/weak-password'){
          document.getElementById("invalidsignup").style.color = 'red'

          document.getElementById("invalidsignup").innerText = "Password should be at least 6 characters"

        }
         //email alr in use check
        if (errorCode == 'auth/email-already-in-use'){
          document.getElementById("invalidsignup").style.color = 'red'

          document.getElementById("invalidsignup").innerText = "Email already in use. Please Sign In"

        }
        // ..
    });

 }})


//  login users 

const loginform = document.getElementById('loginform');
console.log(loginform)

loginform.addEventListener('submit', (e) => {
  
      e.preventDefault();

      const email = loginform['loginemail'].value;
      const password = loginform['loginpassword'].value;

      // console.log(email,password);
      console.log(auth)
      //signup user on firebase 
      signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in 
        async function adminCheck(){
          console.log('hello admincheck')
          const docRef = doc(db, "ADMINS", "ADMINS");
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {

            const admin_arr = docSnap.data().admins
            // console.log("Document data:", docSnap.data().admins);
            let admin_email = ""
            let is_admin = false
            for (admin_email of admin_arr){
              console.log(admin_email)
              console.log(email,'EMAIL')
              if (admin_email.toLowerCase() == email.toLowerCase()){
                is_admin = true
              }

            }

            if (is_admin){
              location.href='home-admin.html'

            }

            else{
              location.href='voter-homepage.html'

            }   


          } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
          }
        }

        adminCheck()
        // const user = userCredential.user;
        // if (email.includes('admin')){
         
        // }

        // else {
        // // location.href='voter-homepage.html'}
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
       
        document.getElementById("invalidpass").style.color = 'red'

        document.getElementById("invalidpass").innerText = 'Invalid Email/Password'
       
      });
     
})}


 //logout users 
else {
 const logout = document.getElementById('logout');
 const logoutMobile = document.getElementById('logoutMobile');
 console.log(logout,'LOGOUT');
if (logout != null) {
 
  
 logout.addEventListener('click', (e) => {
    
    e.preventDefault();
    signOut(auth).then(() => {
      // Sign-out successful.
      // clear everything in the local storage
      localStorage.clear();
      console.log('Sign-out successful')
      console.log(auth);
      location.href='index.html'
    }).catch((error) => {
      // An error happened.
    });

 })
}
 if (logoutMobile != null) {
  logoutMobile.addEventListener('click', (e) => {
 
     e.preventDefault();
     signOut(auth).then(() => {
       // Sign-out successful.
       // clear everything in the local storage
       localStorage.clear();
       console.log('Sign-out successful')
       console.log(auth);
       location.href='index.html'
     }).catch((error) => {
       // An error happened.
     });
 
  })
}
}
