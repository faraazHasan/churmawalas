/////////////////// toggle right-side-bar back after change quantity /////////////////
if(localStorage.getItem("clicked") == 1){
  document.querySelector("body").classList.add("active-cart");
  localStorage.removeItem("clicked")
}

///////////// go back to previous scroll position after adding item in cart /////////////////
window.scrollTo(0,localStorage.getItem("position"))
localStorage.removeItem("position")


///////////////////////// get the scroll positon of product ////////////////////////////////
let sd = document.querySelectorAll("button")
for(let i = 0; i < sd.length; i++){
sd[i].addEventListener("click",function(){
localStorage.setItem("position",window.pageYOffset)
})
}

///////////////////////// show left-side-bar when click on hamburger icon ////////////////////////////////
var hamburger = document.querySelector(".hamburger");
hamburger.addEventListener("click", function(e){
  e.preventDefault();
    document.querySelector("body").classList.toggle("active");
})

///////////////////////// show left-side-bar when click on cart icon ////////////////////////////////
var bag = document.querySelector(".cart");
bag.addEventListener("click", function(e){
  e.preventDefault();
    document.querySelector("body").classList.toggle("active-cart");
})

///////////////////////// hide side bars when click outside the bar ////////////////////////////////
var body = document.querySelector("#body");
body.addEventListener("click", function(){
    document.querySelector("body").classList.remove("active");
    document.querySelector("body").classList.remove("active-cart");
})

///////////////////////// change products quantity ////////////////////////////////
$('.qtybox .btnqty').on('click', function(){
    var qty = parseInt($(this).parent('.qtybox').find('.quantity-input').val());
    if($(this).hasClass('qtyplus')) {
      if(qty < 20){
        qty++;
      }
    }else {
      if(qty > 1) {
        qty--;
      }
    }
    qty = (isNaN(qty))?1:qty;
    $(this).parent('.qtybox').find('.quantity-input').val(qty);
  }); 


  ///////////////////////////////// get value when click on "-" & "+" buttons in cart ////////////////////////////////
  function togle(){
    localStorage.setItem("clicked",1)
  }

function togleRight(){
  document.querySelector("body").classList.remove("active-cart")
}


////////////////////////////////// footer copyright dynamic year /////////////////////////////////// 
var date = new Date()
const year = date.getFullYear()

document.getElementsByClassName("copyright")[0].innerHTML = "Ⓒ " + year + " Churmawals."



