const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = app => {

    //routes
    app.get('/account', async (req, res) => {
        const { username, password } = req.query;

        if (username == null || password == null) {
            res.send("Invalid Credentials")
            return;
        }

        var userAccount = await Account.findOne({ username: username });

        if (userAccount == null) {
            //Create new account
            console.log("Create new Account...")
        
            var newAccount = new Account({
                username: username,
                password: password,
            
                lastAuthentication: Date.now(),
            });
            await newAccount.save();
            res.send(newAccount);
            return;
        }
        else {
            if (password == userAccount.password) {
                userAccount.lastAuthentication = Date.now();
                await userAccount.save();

                console.log("Retrieving Account");
                res.send(userAccount);
                return;
            }
        }
    });
}
