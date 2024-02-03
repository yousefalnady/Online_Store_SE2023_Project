$(document).ready(function(){                   
    // #tbody means id = "tbody"
    // .remove means class = "remove"

    $('.quantity').change(function() {              //Edit cart button
        var id = $(this).attr("id");
        var quantity = $(this).val();
     
        $.ajax({
          type: "PUT",
          data: { quantity: quantity },
          url: '/api/v1/cart/edit/' + id,
          success: function(data) {
            console.log(data);
            window.location = '/customer/cart/view';        //refresh page to see updated price values
          },
          error: function(data) {
            console.log("error message", data.responseText);
            alert(data.responseText);
          }
        });
    });

    $('#makeOrderBtn').click(function () {       // To Order Button

        $.ajax({            //Post method for making an order
        type: "POST",
        url: '/api/v1/order/new',
        success: function(data){
            console.log("Order succesfully confirmed",data);
            alert(data)
            window.location = '/customer/cart/view';
        },
        error: function(data){
            console.log("Error Can't Order, Try Again" , data.responseText)
            alert(data.responseText);
        }
    })
    })
    

    $('#tbody').on('click', '.remove', function () {       //remove from cart Button

        var id = $(this).attr("id");
        $(this).parent().parent().remove();

        $.ajax({
        type: "DELETE",
        data : { productId : `${id}`},
        url: '/api/v1/cart/remove',
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
});      
