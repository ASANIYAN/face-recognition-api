const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission'); 
    } else {
        const saltRounds = 10;
        const hash = bcrypt.hashSync(password, saltRounds);
        // use transactions when you have multiple operations to perform at once
        db.transaction(trx => {
            // Store hash in your password DB.
            trx.insert({
                hash,
                email
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0].email,
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err =>  {
            console.log(err);
            res.status(400).json('unable to register')
        })

    }
}

module.exports = {
    handleRegister: handleRegister
}