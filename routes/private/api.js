const db = require('../../connectors/db');
// check function getUser in milestone 2 description and session.js
const {getUser} = require('../../utils/session');


function handlePrivateBackendApi(app) {
  
  // insert all your private server side end points here

  app.post('/api/v1/product/new', async (req,res) =>{  //Create a Product User Story   1
		try{
			const {name, quantity, category, description, price} = req.body;
			const owner = await getUser(req);
			let newProduct = await db.raw(`INSERT INTO "projectSE"."Product"("name","quantity","category","description","ownerId", "price")
			VALUES('${name}',${quantity},'${category}','${description}',${owner.id},'${price}');`);

      return res.status(200).send(`Product Created Successfully`);
		}catch(err){
			console.log("error message",err.message);
			res.status(400).send(`An error has occured while creating the Product: ${err.message}`);
		}
	});

  app.get('/api/v1/product/view', async (req, res) => {   //View my Admin's Products    2
    try {
      const user = await getUser(req);
      const adminId = user.id;
      const query = ` SELECT *
        FROM "projectSE"."Product"
        WHERE "ownerId" = ${adminId} AND "hidden" = false
        ORDER BY "id" ASC `;
      const result = await db.raw(query);
      return res.status(200).send(result.rows);
    } catch (err) {
      console.log("error message", err.message);
      return res.status(400).send("Failed to get the products");
    }
  });
  
  app.get('/api/v1/product/view/:productId', async (req, res) => {       //View a product by ID     3
    try{
        const productID = req.params.productId;
        const selectQuery = `
          SELECT *
          FROM "projectSE"."Product"
          WHERE id = ${productID};`;
        const result = await db.raw(selectQuery)
        //we firstly check if the product exists in the table: 
        if(!result){
          return res.status(400).send("The product has not been found!");
        }
        //finally, return the product onto the page: 
        return res.status(200).send(result.rows);
    }
    catch(err){
      console.log(err.message);
      return res.status(400).send('An error has occured while viewing product!')
    }
  });

  app.put('/api/v1/product/edit/:productId', async (req, res) => {    //edit a product user story   4
    try {
      const user = await getUser(req);
      const adminId = user.id;
      const { name, quantity, category, description, price } = req.body;
      const query = `UPDATE "projectSE"."Product"
        SET "name" = '${name}', "quantity" = ${quantity}, "category" = '${category}',"price"=${price}, "description" = '${description}'
        WHERE "id" = ${req.params.productId} AND "ownerId" = ${adminId} AND "hidden" = false`;
        const result = await db.raw(query);
        if (result.rowCount > 0) {
          return(res.status(200).send("Product updated successfully"));
        } else {
          return(res.status(200).send("Not found or Unauthorized"));
        }
      } catch (err) {
        console.log("error message", err.message);
        return res.status(400).send("Failed to get the products");
      }
  });

  app.delete('/api/v1/product/delete/:productId', async (req, res) => {   //delete a product User story 5
    try {
      const user = await getUser(req);
      const adminId = user.id;
        const query = `
        Update  "projectSE"."Product"
        SET "hidden"=true
        WHERE "id" = ${req.params.productId} AND "ownerId" = ${adminId} AND "hidden" = false
      `;
      const result = await db.raw(query);
        if (result.rowCount > 0) {
        return(res.status(200).send("Product deleted successfully"));
      } else {
        return(res.status(200).send("Product not found or unauthorized delete" ));
      }
    } catch (error) {
      console.error(error);
      return res.status(400).send("Failed to get the products");
    }
  });

  app.get('/api/v1/product/customer/view', async (req,res) =>{      //view all products user story  6
    try{
      const result = await db.raw(`select * from "projectSE"."Product" where hidden = FALSE`);
      console.log(`result here`,result.rows);
      return res.status(200).send(result.rows);
    }catch(err){
      console.log("error message",err.message);
      return(res.status(400).send(err.message));
    }
  });
  
  app.post('/api/v1/cart/new', async (req, res) => {      // Add product to cart user story 7
    try {
      const user = await getUser(req);
      const { productId, quantity } = req.body;

      let check = await db.raw(`Select * 
      from "projectSE"."Cart" where "productId" = ${productId} AND "userId" = ${user.id};`);

      if(check.rows.length > 0){        //For handling adding the same product to cart multiple times
      
        let result = await db.raw(`UPDATE "projectSE"."Cart" set quantity = quantity+${quantity} WHERE "productId" = ${productId} AND "userId" = ${user.id};`);
      }else{
      
        let result = await db.raw(`INSERT INTO
        "projectSE"."Cart" ("userId", "productId", "quantity")
        VALUES (${user.id}, ${productId}, ${quantity})`);        
      }

      return res.status(200).send('Product added to cart successfully.');
    } catch (err) {
      console.log("error message", err.message);
      return res.status(400).send(err.message);
    }
  });

  app.get('/api/v1/cart/view', async (req, res) => {     //view an order user story  8
    try {
      const user = await getUser(req);
  
      const query = `SELECT * from "projectSE"."Cart" WHERE "userId" = ${user.id};`;
      const data = await db.raw(query);
  
      if (!data.rows.length) {
        return res.status(400).send('No products in the cart.');
      }
      return res.status(200).json(data.rows);
    } catch (err) {
      console.log("error message", err.message);
      return res.status(400).send(err.message);
    }
  });

  app.delete('/api/v1/cart/remove', async (req, res) => {     //delete a product from cart user story 9
    try {
      const user = await getUser(req);
      const { productId } = req.body;

      const query = `DELETE FROM "projectSE"."Cart" WHERE "userId" = ${user.id} AND "productId" = ${productId};`;
      await db.raw(query);

      return res.status(200).send('Product deleted from cart successfully.');
    } catch (err) {
      console.log("error message", err.message);
      return res.status(400).send(err.message);
    }
  });

  app.put('/api/v1/cart/edit/:cartId', async (req,res) =>{     //edit a product to cart user story 10
    try{
      const result = await db.raw(`UPDATE "projectSE"."Cart"
      SET "quantity" = ${req.body.quantity}
      WHERE "id" = ${req.params.cartId} `);
      return res.status(200).send(`successfully Updated`);
    }catch(err){
      console.log("error message",err.message);
      return(res.status(400).send(err.message));
    }
  });

  app.post('/api/v1/order/new', async (req,res) =>{    //make an order user story     11
    try{

      let currentUser = await getUser(req);       //get current user object
      myCart = await db.raw(`SELECT id, "userId", "productId", "quantity" FROM "projectSE"."Cart" where "userId" = ${currentUser.id};`);

      if(myCart.rowCount<=0){   //handling the empty cart case
        return res.status(400).send(`Cart is empty`);
      }

      for(let myProduct of myCart.rows){    //iterating over the cart

        //thisProduct is the db entry in table products corresponding to the current product in the cart
        let thisProduct = await db.raw(`select * FROM "projectSE"."Product" WHERE id=${myProduct.productId} ;`);

        if(myProduct.quantity <= thisProduct.rows[0].quantity){               //Checking enough inventory
          console.log(`product ${thisProduct.rows[0].name} can be ordered`)
        }else{
          console.log(`product ${thisProduct.rows[0].name} CANNOT be ordered`);
          //exit with error code 400 if there isn't sufficient inventory to make an order
          return(res.status(400).send(`unsuccessfully purchased ${thisProduct.rows[0].name}`));
        }

      }

      //creatin an Order in orders table
      let isnertOrder = await db.raw(`INSERT INTO "projectSE"."Order"("userId")
      VALUES (${currentUser.id});`);
      //next line just to get order ID
      let newOrder = await db.raw(`select "id" from "projectSE"."Order" where "userId" = ${currentUser.id}`);
      
      for(let myProduct of myCart.rows){    //iterating over cart again
          
        let thisProduct = await db.raw(`select * FROM "projectSE"."Product" WHERE id=${myProduct.productId};`);
    
        //Creating entries in ProductOrder table
        thisProductOrder = await db.raw(`INSERT INTO "projectSE"."ProductOrder"
        VALUES(${newOrder.rows[newOrder.rows.length -1].id},${myProduct.productId},${myProduct.quantity});
        SELECT *
          FROM "projectSE"."ProductOrder";`);
        removed = await db.raw(`update "projectSE"."Product" SET quantity = ${thisProduct.rows[0].quantity - myProduct.quantity}
        where id =${myProduct.productId} ;`);
      }

      deleteCart = await db.raw(`delete from "projectSE"."Cart" where "userId" = ${currentUser.id};`);
      console.log(`Cart deleted`);

      return(res.status(200).send(`Successfully order`));

    }catch(err){
      console.log("error message",err.message);
      return(res.status(400).send(err.message));
    }
  });

  app.put('/api/v1/product/display/:productId', async (req, res) => {    //Display a product, Bonus API
    try {
      const user = await getUser(req);
      const adminId = user.id;
      const query = `UPDATE "projectSE"."Product"
        SET "hidden" = false
        WHERE "id" = ${req.params.productId} AND "ownerId" = ${adminId}`;
        const result = await db.raw(query);
        if (result.rowCount > 0) {
          return(res.status(200).send("Product updated successfully"));
        } else {
          return(res.status(200).send("Not found or Unauthorized"));
        }
      } catch (err) {
        console.log("error message", err.message);
        return res.status(400).send("Failed to get the products");
      }
  });

};



module.exports = {handlePrivateBackendApi};
