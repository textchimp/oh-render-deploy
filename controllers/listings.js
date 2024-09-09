
const express = require('express');
const router = express.Router();

const Listing = require('../models/listing');

// RESTful CRUD routes for Listing

// C 1: New form - GET /listings/new
router.get('/new', async (req, res) => {
  // res.send('new form');
  res.render('listings/new')
});

// C 2: Form submit - POST /listings
router.post('/', async (req, res) => {
  // res.send('new form SUBMIT');
  console.log( `form data`, req.body );

  const createdListing = await Listing.create({
    streetAddress: req.body.streetAddress,
    city: req.body.city,
    price: req.body.price,
    size: req.body.size,
    owner: req.session.user._id // Set up the User ref
  });

  res.redirect('/listings');

  // TODO: handle validation errors

});


// R 1: Index of all Listings - GET /listings
router.get('/', async (req, res) => {
  // res.send('listings index');
  const listings = await Listing.find( {} ); //.populate('owner');
  res.render('listings/index', { listings }); // { listings: listings }
});

// R 2: Details for one Listing - GET /listings/:id
router.get('/:id', async (req, res) => {
  // res.send(`listings detail for ${ req.params.id }`);
  const listing = await Listing.findById( req.params.id ).populate('owner'); // so we can show owner name

  // For the show template to display the correct button
  // (either 'add to' or 'remove from' favourites ),
  // we need to check if the logged-in User's ID is
  // already in the array of favouritedByUsers for this Listing.
  const userHasFavourited = listing.favouritedByUsers.some( 
    // "Is there any ID in the array which is the same as the
    // logged-in User's ID"
    (user) => user.equals( req.session.user._id )
  );

  res.render('listings/show', { listing, userHasFavourited });
});


// U 1: Edit form - GET /listings/:id/edit 
router.get('/:id/edit', async (req, res) => {
  res.send(`listings EDIT for ${req.params.id}`);
});


// U 2: Edit form submit - PUT /listings/:id
router.put('/:id', async (req, res) => {
  res.send(`listings EDIT SUBMIT for ${req.params.id}`);
});


// D: Delete listing - DELETE /listings/:id
router.delete('/:id', async (req, res) => {
  res.send(`listings DELETE for ${req.params.id}`);
});


// Favourites

// Add Listing as a favourite: POST /listings/:id/favourite
router.post('/:id/favourite', async (req, res) => {

  // res.send(`Listing FAVE ADD for ${ req.params.id }`);

  await Listing.findByIdAndUpdate(
    req.params.id,
    {
      $push: { favouritedByUsers: req.session.user._id }
    }
  );

  res.redirect(`/listings/${ req.params.id }`);


}); // POST /listings/:id/favourite

// Remove existing favourite for Listing: DELETE /listings/:id/favourite 
router.delete('/:id/favourite', async (req, res) =>{
  
  // res.send(`Listing FAVE REMOVE for ${req.params.id}`);

  await Listing.findByIdAndUpdate(
    req.params.id,
    {
      // Wherever this ID is in the array, remove it
      $pull: { favouritedByUsers: req.session.user._id }
    }
  );

  res.redirect(`/listings/${req.params.id}`);

}); // DELETE /listings/:id/favourite



module.exports = router;