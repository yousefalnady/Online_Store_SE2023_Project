$(document).ready(function(){                   
  $('#tbody').on('click', '.View', function () {      
      let id = $(this).attr("id");
      $.ajax({
      type: "GET",
      data : {productID : id},
      url: '/admin/product/view/'+`${id}`,
      success: function(data){
          window.location = '/admin/product/view/'+`${id}`;
      },
      error: function(data){
          console.log("error message" , data.responseText)
          alert(data.responseText);
      }
    });
  });

    $('#tbody').on('click', '.Delete', function () {        //Delete product button
        console.log("removed");
        var productId = $(this).attr("id");
        $(this).parent().parent().remove();
        $.ajax({
          type: "DELETE",
          url: `/api/v1/product/delete/${productId}`,
          success: function(data){
            console.log(data);
            alert(`Product Deleted Successfully`)
          },
          error: function(data){Z
            console.log("error message" , data.responseText)
            alert(data.responseText);
          }
      });
      });
});