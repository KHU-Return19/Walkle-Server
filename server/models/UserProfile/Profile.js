const mongoose = require("mongoose");
const locationSchema = mongoose.Schema({
  lat: {
    type: Number,
  },
  lon: {
    type: Number,
  },
});
const tagSchema = mongoose.Schema({
  tag: {
    type: String,
  },
});
const profileSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  nickname: {
    type: String,
    unique: true,
    required: true,
  },
  job: {
    type: String,
  },
  snsLink: {
    type: String,
  },
  intro: {
    type: String,
    minlength: 10,
    required: true,
  },
  career: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
  },
  location: [locationSchema],
  tags: [tagSchema],
  fields: [
    {
      fieldId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Field",
      },
    },
  ],
});
profileSchema.statics.getNickname = async function (user_uid) {
  var user = this;
  var res;
  await this.findOne({ user_uid })
    .then((result) => {
      if (result) {
        res = result.nickname;
      } else {
        res = "";
      }
    })
    .catch((err) => {
      res = err;
    });
  return res;
};
profileSchema.statics.getJob = async function (user_uid) {
  var user = this;
  var res;
  await this.findOne({ user_uid })
    .then((result) => {
      if (result) {
        res = result.job;
      } else {
        res = "";
      }
    })
    .catch((err) => {
      res = err;
    });
  return res;
};
profileSchema.statics.getlocation = async function (user_uid) {
  var user = this;
  var res;
  await this.findOne({ user_uid })
    .then((result) => {
      if (result) {
        res = [result.location];
      } else {
        res = "";
      }
    })
    .catch((err) => {
      res = err;
    });
  return res;
};
const Profile = mongoose.model("Profile", profileSchema);
module.exports = { Profile };
