const db = require('../../connectors/db');
const { getSessionToken , getUser } = require('../../utils/session');


function handlePrivateFrontEndView(app) {

    app.get('/dashboard' , async (req , res) => {           //Dashboard
        let result
        const user = await getUser(req);

        try{
            result = await db.raw(`select * from "projectSE"."Product" where hidden = false AND "quantity">0`)
        }catch(err){
            console.log("error message",err.message);
            result = err.message;
        }

        if(user.role == "admin"){
            return res.render('adminHomepage' , {name : user.name});
        }

        // role of customer
        return res.render('customerHomepage' , {prod : result.rows});
    });

    app.get('/customer/product/view/:productId',async (req,res) =>{           //customer view a specific product 
        try{
            productId = req.params.productId
            details = await db.raw(`select * from "projectSE"."Product" where id = ${productId}`)
            return res.render('CustomerViewProduct' , {prod : details.rows[0]});
        }catch(err){
            console.log("error message",err.message);
            return res.status(400).send(err.message);
        }
    });

    app.get ('/customer/cart/view',async (req,res) =>{          //Customer View Cart               
    
        try{
            const user = await getUser(req);
            CartItems = await db.raw(`Select
            "projectSE"."Product"."name",
            "projectSE"."Product".id,
            "projectSE"."Cart"."quantity",
            "projectSE"."Cart".id AS "cartId",
            "projectSE"."Product"."price",
            "projectSE"."Cart"."quantity" * "projectSE"."Product"."price" AS "total_price",
			
            (
				SELECT SUM("projectSE"."Cart"."quantity" * "projectSE"."Product"."price")
				FROM "projectSE"."Cart"
				INNER JOIN "projectSE"."Product" ON "projectSE"."Cart"."productId" = "projectSE"."Product".id
				WHERE "projectSE"."Cart"."userId" = ${user.id}
			) AS "full_price"

            from "projectSE"."Cart"
            inner join "projectSE"."Product" on "projectSE"."Cart"."productId" = "projectSE"."Product".id
            AND "projectSE"."Cart"."userId" = ${user.id};`)         //full_price is the summation of prices*quantites
            fullPrice = await db.raw(`SELECT
            SUM("quantity") AS total_sum
            FROM  "projectSE"."Cart";`)
        }catch(err){
            console.log("error message",err.message);
            return res.status(400).send(err.message);
        }
        return res.render('CustomerViewCart', {prod : CartItems.rows, pricing : CartItems.rows[0]});    //passing 1 row seperately to be able to access the total price since its repeated across al rows
    
    });

    app.get('/customer/order/view',async (req,res) =>{           //customer view order
        try{
            const user = await getUser(req);
            myOrder = await db.raw(`select
            "projectSE"."Order".id,
            "projectSE"."Product"."name",
            "projectSE"."ProductOrder"."quantity"
            from "projectSE"."Order"
            inner join "projectSE"."ProductOrder" on "projectSE"."ProductOrder"."orderID" = "projectSE"."Order".id
            inner join "projectSE"."Product" on "projectSE"."ProductOrder"."productID" = "projectSE"."Product".id
            WHERE "projectSE"."Order"."userId" = ${user.id};`);
        }catch(err){
            console.log("error message",err.message);
            return res.status(400).send(err.message);
        }
        return res.render('CustomerViewOrder', {order : myOrder.rows});
    });

    app.get('/admin/product/add' , async (req , res) => {       //Admin add product
        return res.render('Add');
    });

     app.get('/admin/product/view',async (req,res) =>{       //Admin view my products
        const user = await getUser(req);
        const adminId = user.id;
        details = await db.raw(` SELECT *
        FROM "projectSE"."Product"
        WHERE "ownerId" = ${adminId} AND "hidden" = false ORDER BY "id" ASC `);
        return res.render('AdminProductPage' , {prod : details.rows});
    });

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };
       
    app.get('/admin/product/view/:productId',async (req,res) =>{        //Admin view a specific product
        const user = await getUser(req);
        const adminId = user.id;
        productId = req.params.productId;
        details = await db.raw(` SELECT *
        FROM "projectSE"."Product"
        WHERE id=${productId} AND "ownerId" = '${adminId}' AND "hidden" = false`);
        const formattedDate = formatDate(details.rows[0].createdAt);
        return res.render('AdminProductbyID', { prod: { ...details.rows[0], createdAt: formattedDate } });
    });

    app.delete('/admin/product/delete/:productId', async (req, res) => {        //Admin delete product ???, To be removed
        const productId = req.params.productId;
        try{
            const user = await getUser(req);
            const adminId = user.id;
            const query = `
            Update  "projectSE"."Product"
            SET "hidden"=true
            WHERE "id" = ${productId} AND "ownerId" = ${adminId} 
            `;
            const result = await db.raw(query);
            return res.render('adminProductDelete', { result });
        } 
        catch(error){
            console.log("error message", err.message);
            return res.status(400).send("Failed to delete product");
        }
    });

    app.get('/admin/product/hide',async (req,res) =>{       //Hidden products page, Bonus
        try{
            user = await getUser(req);
            result = await db.raw(`SELECT *
            FROM "projectSE"."Product"
            WHERE "ownerId" = '${user.id}' AND "hidden" = true`);
            return res.render('AdminViewHidden', {prod: result.rows});
        }catch(err){
            console.log(err.message);
            return res.status(400).send(err.message)
        }
    });


}  

module.exports = {handlePrivateFrontEndView};
  