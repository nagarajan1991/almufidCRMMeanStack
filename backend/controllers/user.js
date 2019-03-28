const bcrypt =  require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require('../models/user');

exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
  .then(hash => {
    const user = new User  ({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hash,
      userrolevalue: req.body.userrolevalue,
      mobile: req.body.mobile
    });
    user.save()
      .then(result => {
        res.status(201).json({
          message: 'User Created!',
          result: result
        });
      })
      .catch(err => {
        res.status(500).json({
            message: "Invalid authentication credentials!"
        });
      });
    });
};

exports.userLogin = (req, res, next) => {
  let fetchedUser;
  User.findOne({ email:req.body.email })
  .then(user => {
    if(!user) {
      return res.status(404).json({
        message: "Auth Failed!"
      });
    }
    fetchedUser = user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result) {
      return res.status(401).json({
      message: "Auth Failed!"
    });
  }
  const token = jwt.sign(
    {email: fetchedUser.email, userId: fetchedUser._id},
    process.env.JWT_KEY,
    {expiresIn: "1h"}
    );
    res.status(200).json({
      token: token,
      expiresIn: 3600,
      userId: fetchedUser._id,
      userrolevalue: fetchedUser.userrolevalue
    })
  })
  .catch (err => {
    return res.status(401).json({
      message: "Invalid authentication credentials!"
    });
  });
  };

  exports.getUsers = (req, res, next) => {
    const searchValue = req.query.searchValue;
    let postQuery=null;

    if(searchValue){
      postQuery = User.find({customer: new RegExp(searchValue, 'i')});
    }else{
       postQuery = User.find();
    }

    let fetchedUsers;

    postQuery
    .then(documents => {
      fetchedUsers = documents;
      return User.count();
    }).then(count => {
        res.status(200).json({
          message: "Users fetched successfully",
          users: fetchedUsers,
          maxUsers: count
        });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching Users Failed!"
      });
    });
  };

  exports.resetpwd = (req, res, next) => {
  };

  exports.chngpwd = (req, res, next) => {
  };
