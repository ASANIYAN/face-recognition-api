// Middleware to check if a token is blacklisted
const checkBlacklist = (db) => {
    // Get the JWT from the request headers
    return function(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({message: "token not found"});
      
        // Check if the token is blacklisted
        db.select('token').from('blacklist')
          .where({token: token})
          .then(rows => {
            if (rows.length > 0) {
              return res.status(401).json({ message: 'Token has been revoked' });
            } else {
                next();
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
          });
    }
  }
  

module.exports = {
    checkBlacklist
}
  