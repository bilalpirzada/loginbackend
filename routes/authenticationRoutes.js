const mongoose = require('mongoose');
const Account = mongoose.model('accounts');

module.exports = app => {

    //login route
    app.post('/account/login', async (req, res) => {
        console.log(req.body);
        const { username, password } = req.body;

        if (username == null || password == null) {
            res.send("Invalid Credentials");
            return;
        }

        var userAccount = await Account.findOne({ username: username });
      if(userAccount!=null){
            if (password == userAccount.password) {
                userAccount.lastAuthentication = Date.now();
                await userAccount.save();

                console.log("Retrieving Account");
                res.send(userAccount);
                return;
            }
        }
        res.send("Invalid Credentials");
    });


//
     app.post('/account/create', async (req, res) => {
        console.log(req.body);
        const { username, password } = req.body;

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
            res.send("username is already taken");
        }
    });
}
