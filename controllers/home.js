const handleHome = (req, res, db, jwt) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // Verify the JWT and extract the email
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const userEmail = decodedToken.email;

    db.select('*').from('users')
        .where({email: userEmail})
        .then(user => {
            res.json({
                data: user[0]
            });
        })
        .catch(err =>{ 
            res.status(400).json('unable to get user');
        })
}

module.exports = {
    handleHome
}