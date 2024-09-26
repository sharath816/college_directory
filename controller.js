const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./connection');

exports.loginUser = async (req, res) => {
    const {username, password, role} = req.body;
    try{
        const user = await pool.query('SELECT * from "User" where username = $1 AND role = $2', [username, role]);
        if(user.rows.length > 0){
            const validPassword = await bcrypt.compare(password, user.rows[0].password);
            if(!validPassword) return res.status(400).json({message: "Invalid credentails"});

            const token = jwt.sign({ id: user.rows[0].id, role: user.rows[0].role}, 'secret_key', {expiresIn: 'lh'});
            return res.status(200).json({token, role: user.rows[0].role});
        }else{
            res.status(400).json({message: 'User not found'});
        }
    }catch(err){
        res.status(500).json({message: err.message});
    }
};