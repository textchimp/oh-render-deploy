
function passUserToView( req, res, next ){

  res.locals.user = req.session.user ? req.session.user : null;
  next(); // Next middleware handler

} // passUserToViev

module.exports = passUserToView;