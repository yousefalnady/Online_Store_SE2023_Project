$(document).ready(function(){
  $('#Updating').on('click', '.Update', function () {      
    let id = $(this).attr("id");
    const name = $('#Name').val();
    const quantity = $('#Quantity').val();
    const price = $('#Price').val();        
    const category = $('#Category').val();
    const description = $('#Description').val();
    if (!name || !category || !quantity || !price || !description ) {
      alert('Please fill in all the fields');
      return;
    }
    

    const ProductObj = { name, quantity, category, price, description };

    $.ajax({
      type: "PUT",
      url: '/api/v1/product/edit/'+`${id}`,
      data: ProductObj,
      success: function (data) {
        alert('Successfully added');
        window.location = '/admin/product/view';
      },
      error: function (data) {
        alert(data.responseText);
      }
    });
  });
});

