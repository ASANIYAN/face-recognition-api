const handleLogout = (db) => (req, res) => {

    // Gets the JWT from the request headers
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({message: "token not found"});

    // inserts token into blacklist table 
    db('blacklist').insert({token: token})
    .then(data => {
        res.status(200).json('logout successful');
    })
    .catch(err => {
        res.status(400).json({message: "unable to logout"})
    })
}

module.exports = {
    handleLogout
}