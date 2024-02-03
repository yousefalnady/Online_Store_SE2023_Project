$(document).ready(function(){                   
    // #tbody means id = "tbody"
    // .remove means class = "remove"
    $('#tbody').on('click', '.add', function () {       //Add to cart Button
      console.log("Adding product to cart");
      var id = $(this).attr("id");
      $.ajax({
      type: "POST",
      data : { productId : `${id}`, quantity : '1'},
      url: 'api/v1/cart/new',
      success: function(data){
          console.log(data);
          alert(data)
      },
      error: function(data){
          console.log("error message" , data.responseText)
          alert(data.responseText);
      }
    });
    });

    $('#tbody').on('click', '.view', function () {       //Item View button
        var id = $(this).attr("id");
        $.ajax({
        type: "GET",
        data : { productId : `${id}`},
        url: 'customer/product/view/'+`${id}`,
        success: function(data){
            window.location = 'customer/product/view/'+`${id}`;
        },
        error: function(data){
            console.log("error message" , data.responseText)
            alert(data.responseText);
        }
      });
      });

});      