
function isSignedIn( req, res, next ){

  if( req.session.user ){
    next(); // Proceed to next route handler
  } else {
    res.redirect('/auth/sign-in'); // Login!
  }

} // isSignedIn()

module.exports = isSignedIn;