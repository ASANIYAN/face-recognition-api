const handleSignin = ( db, bcrypt, jwt) => (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('Incorrect form submission'); 
    }
    
    db.select('email', 'hash').from('login')
        .where({email: email})
        .then(data => {
            const isValid = bcrypt.compareSync(password, data[0].hash);
            if (isValid) {
                return db.select('*').from('users')
                    .where({email: email})
                    .then(user => {
                        const info  = { email };
                        const accessToken = jwt.sign(info, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
                        res.json({
                            accessToken: accessToken,
                            data: user[0]
                        });
                    })
                    .catch(err => { 
                        res.status(400).json('unable to get user')
                    })
            } else {
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => { 
            res.status(400).json('wrong credentials');
        })
}

module.exports = {
    handleSignin
}