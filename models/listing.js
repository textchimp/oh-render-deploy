
const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({

  streetAddress: {
    type: String, 
    required: true
  },

  city: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  size: {
    type: Number,
    required: true,
    min: 0
  },

  // owner: embed or reference?
  // This is a "one-to-many" relationship:
  // - "a User has many listings", because any one user
  //    can have their ID as the 'owner' field of many 
  //    listings
  // - "a Listing belongs to one User (owner)"
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },

  // Favourites:
  // "Many-to-many" relationship:
  // - a User can favourite many Listings
  // - a Listing can be favourited by many Users

  favouritedByUsers: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  } ],

}, { timestamps: true });

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;