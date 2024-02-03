$(document).ready(function(){                   
    $('#tbody').on('click', '.View', function () {      
        let id = $(this).attr("id");
        $(this).parent().parent().remove();
        $.ajax({
        type: "PUT",
        data : {productID : id},
        url: `/api/v1/product/display/${id}`,
        success: function(data){
            alert(`Product Is now Available for customers`);
        },
        error: function(data){
            console.log("error message" , data.responseText)
            alert(data.responseText);
        }
      });
    });
});