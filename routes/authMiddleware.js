module.exports.isAdmin = (req, res, next) => {
    if (res.locals.currentUser && res.locals.currentUser.isAdmin) {
        next(); // User is admin, proceed to the next middleware/route handler
    } else {
        req.flash('error', `You are not authorized to view this resource`);
        res.send(req.flash("error"));

    }
};