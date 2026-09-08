const express = require('express');
const axios = require('axios');
const app = express();

 app.set('view engine', 'pug');
 app.use(express.static(__dirname + '/public'));
 app.use(express.urlencoded({ extended: true }));
 app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = process.env.TOKEN;

// Custom Object "favorite dish" - objectTypeId waere alternativ 2-253053850
const DISH_OBJECT = 'p149282636_favorite_dishs';

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

app.get('/', async (req, res) => {
    const dishes = `https://api.hubapi.com/crm/v3/objects/${DISH_OBJECT}`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(dishes, {
        headers,
        params: { properties: 'name,calories,healthy' }
    });
        const data = resp.data.results;
        res.render('dishes', { title: 'Favorite Dish | HubSpot APIs', data }); 
        //res.json(data)     
    } catch (error) {
        console.error(error);
    }
});




// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.


app.get('/update', async (req, res) => {
    // http://localhost:3040/update?id=449660537018
    const id = req.query.id;

    const allDishes = `https://api.hubapi.com/crm/v3/objects/${DISH_OBJECT}?properties=name`;
    const oneDish = `https://api.hubapi.com/crm/v3/objects/${DISH_OBJECT}/${id}?properties=name,calories,healthy`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        // alle Dishes fuer das Dropdown
        const listResponse = await axios.get(allDishes, { headers });
        const dishes = listResponse.data.results;

        // ohne id: leeres Formular fuer einen neuen Dish
        if (!id) {
            return res.render('update', { dishes, id, name: '', calories: '' });
        }

        const response = await axios.get(oneDish, { headers });
        const data = response.data;

        res.render('update', { dishes, id, name: data.properties.name, calories: data.properties.calories });

    } catch(err) {
        console.error(err);
    }
});

// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.



//* * This is sample code to give you a reference for how you should structure your calls.

//* * App.get sample


/** 
* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/


// * Localhost
app.listen(3040, () => console.log('Listening on http://localhost:3040'));