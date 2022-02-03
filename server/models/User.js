const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const autoIncrement = require("mongoose-auto-increment");
autoIncrement.initialize(mongoose.connection);

const userSchema = mongoose.Schema({
  loginId: {
    type: String,
    maxlength: 30,
  },
  name:{
    type:String
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  token: {
    type: String,
  },
});

userSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return next(err);
      } else {
        bcrypt.hash(user.password, salt, (err, hash) => {
          if (err) {
            return next(err);
          } else {
            user.password = hash;
            next();
          }
        });
      }
    });
  } else {
    next();
  }
});

userSchema.methods.checkPassword = function (plainPassword, cb) {
  var user = this;
  bcrypt.compare(plainPassword, user.password, (err, isMatch) => {
    if (err) {
      return cb(err);
    } else {
      return cb(null, isMatch);
    }
  });
};

userSchema.methods.createToken = function (cb) {
  var user = this;
  var token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
    expiresIn: "1h",
  });
  user.token = token;
  user.save((err, user) => {
    if (err) {
      return cb(err);
    } else {
      return cb(null, user);
    }
  });
};
userSchema.statics.findByToken = function (token, cb) {
  var user = this;
  jwt.verify(token, process.env.SECRET_KEY, (err, decode) => {
    user.findOne({ _id: decode, token: token }, (err, user) => {
      if (err) {
        return cb(err);
      } else {
        cb(null, user);
      }
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
