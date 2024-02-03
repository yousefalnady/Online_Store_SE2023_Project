$(document).ready(function(){                   
    // #tbody means id = "tbody"
    // .remove means class = "remove"
    $('#AddToCart').on('click', '.add',function () {       //Add to cart Button
      console.log("Adding product to cart");
      var myquantity = $('#PreferredQuantity').val();
      var id = $(this).attr("id");
      //alert(`quantity: ${myquantity} and id ${id}`);        //for debugging

      $.ajax({
      type: "POST",
      data : { productId : `${id}`, quantity : `${myquantity}`},
      url: '/api/v1/cart/new',
      success: function(data){
          console.log(data);
          alert(data)
          window.location = '/dashboard';
      },
      error: function(data){
          console.log("error message" , data.responseText)
          alert(data.responseText);
      }
    });
    });

});      