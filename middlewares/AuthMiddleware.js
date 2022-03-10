const {verify} = require('jsonwebtoken');

const validateAccessToken = (req, res, next) => {
    const accessToken = req.header("accessToken");

    if(!accessToken){
        return res.json("User not logged in!!!");
    }

    try {
        const validToken = verify(accessToken, 'signingKeyForJsonWebToken');
        if(validToken){
            return next();
        }
    } catch (error) {
        return res.json({error: error});
    }
}

module.exports = { validateAccessToken };