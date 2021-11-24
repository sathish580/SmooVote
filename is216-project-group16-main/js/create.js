
const add_btns = document.getElementsByClassName("add");

// for (add of add_btns) {
//     add.addEventListener("click", addDetails);
//     function addDetails() { // Make sure the function is in the for loop
//         console.log("hi")
//         let details = document.getElementById("details")
//         let positions = document.getElementById("positions")
//         let detailsClone = details.cloneNode(true);
//         console.log(detailsClone.childNodes[1].childNodes)
//         detailsClone.style.display = "block"
//         detailsClone.childNodes[1].childNodes[12].addEventListener("click", addDetails);
//         detailsClone.childNodes[1].childNodes[9].addEventListener("click", delDetails);
//         positions.appendChild(detailsClone)
        
//     }

// }

const del_btns = document.getElementsByClassName("del");

// const del_btns = document.getElementsByClassName("del");

// for (const del of del_btns) {
//     del.addEventListener("click", delDetails);
//     function delDetails() { // Make sure the function is in the for loop
//         this.parentNode.parentNode.remove()
//     }

    
// }

function addDetails() { // Make sure the function is in the for loop
    console.log("hi")
    let details = document.getElementById("details")
    let positions = document.getElementById("positions")
    let detailsClone = details.cloneNode(true);
    console.log("function details", detailsClone);
    detailsClone.style.display = "block";
    // remove the id from the cloned element
    detailsClone.id = "";
    // detailsClone.childNodes[1].childNodes[12].addEventListener("click", addDetails);
    // detailsClone.childNodes[1].childNodes[9].addEventListener("click", delDetails);
    positions.appendChild(detailsClone)
    
}

function delDetails(element) { // Make sure the function is in the for loop
    // console.log("element div",element.parentNode.parentNode);
    element.parentNode.parentNode.remove()
}






