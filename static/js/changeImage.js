//Modified from Source: https://www.w3schools.com/w3css/w3css_slideshow.asp
function changeImage(index) {
   //get all images and dots
   var img = document.getElementsByClassName("carousel");
   var dot = document.getElementsByClassName("dot");
   
   //loop through and set images to not display
   for (var i = 0; i < img.length; i++) {
     img[i].style.display = "none"; 
   }
   //loop through and set dots to not active
   for (var j = 0; j < dot.length; j++) {
      dot[j].className="dot";
   }
   
   //set new image to display
   img[index-1].style.display = "block"; 
   //set dot to active
   dot[index-1].className += " active";
}