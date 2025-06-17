const authorizeRoles = (...roles) => {
    return (req, res, next) => {
       
        if (!req.user || !req.user.role) {
            res.status(403); 
            throw new Error('Access denied. User role not found.');
        }

        if (!roles.includes(req.user.role)) {
            res.status(403); 
            throw new Error(`Access denied. Role '${req.user.role}' is not authorized for this action.`);
        }
        next(); 
    };
};

module.exports = { authorizeRoles };
