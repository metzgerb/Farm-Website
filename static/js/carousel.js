//Modified from Source: https://www.w3schools.com/w3css/w3css_slideshow.asp

//initialize to first image
var imgIndex = 0;
carousel();

//
function carousel() {
   //get all images and dots
   var img = document.getElementsByClassName("carousel");
   var dot = document.getElementsByClassName("dot");
   
   //check for active image caused by clicks on dots
   var currentimg = document.getElementsByClassName("dot active");
   if (currentimg.length > 0) {     
      //loop through and check for which dot is active
      for (var h = 0; h < dot.length; h++) {
         if(dot[h].className == "dot active") {
            //set index to currently active dot
            imgIndex = h+1;
         }
      }
   }
   
   //loop through and set images to not display
   for (var i = 0; i < img.length; i++) {
     img[i].style.display = "none"; 
   }
   //loop through and set dots to not active
   for (var j = 0; j < dot.length; j++) {
      dot[j].className="dot";
   }
   
   //change index to next image
   imgIndex++;
   
   //check for last image
   if (imgIndex > img.length) {imgIndex = 1}
   
   //set new image to display
   img[imgIndex-1].style.display = "block"; 
   //set dot to active
   dot[imgIndex-1].className += " active";
   
   setTimeout(carousel, 3000); // Change image every 3 seconds
}