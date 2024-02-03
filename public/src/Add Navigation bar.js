$(document).ready(function(){
  $("#Create").click(function() {
    console.log("Button clicked!");
    const name = $('#Name').val();
    const quantity = $('#Quantity').val();
    const category = $('#Category').val();
    const price = $('#Price').val();
    const description = $('#Description').val();
    if (!name || !category || !quantity || !price || !description ) {
      alert('Please fill in all the fields');
      return;
    }
    //const defQuantity = quantity || 1;
    //const defPrice = price || 250;
    //const ProductObj = { name, quantity: defQuantity, category, price: defPrice, description };
    const ProductObj = { name, quantity, category, price, description };
    $.ajax({
      type: "POST",
      url: '/api/v1/product/new',
      data: ProductObj,
      success: function (data) {
        $('#Name').val("");
        $('#Quantity').val("");
        $('#Category').val("");
        $('#Price').val("");
        $('#Description').val("");
        console.log("Created Successfully", data);
        alert(data);
      },
      error: function (data) {
        alert(data.responseText);
      }
    });
  });
});
