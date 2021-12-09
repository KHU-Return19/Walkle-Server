const express = require("express");
const router = express.Router();

const { Field } = require("../models/UserProfile/Field");
const { FieldList } = require("../models/UserProfile/FieldList");
const { Location } = require("../models/UserProfile/Location");
const { Profile } = require("../models/UserProfile/Profile");
const { Tag } = require("../models/UserProfile/Tag");
const { auth } = require("../middleware/auth"); //인증
const getData = (req) => {
  const profile_data = {
    user_uid: req.user._id,
    nickname: req.body.nickname,
    job: req.body.job,
    sns_link: req.body.sns_link,
    intro: req.body.intro,
    career: req.body.career,
    age: req.body.age,
    gender: req.body.gender,
    picture: req.body.picture,
  };
  const location_data = {
    user_uid: req.user._id,
    lat: req.body.lat,
    lon: req.body.lon,
  };
  const field_data = {
    user_uid: req.user._id,
    field: req.body.field,
  };
  const tag_data = {
    user_uid: req.user._id,
    tag: req.body.tag,
  };
  return { profile_data, location_data, field_data, tag_data };
};
// getnickanme,getlocation 테스트코드
// router.get('/',auth,async (req,res)=>{
//     var user=req.user;
//     console.log(await Profile.getnickname(user._id));
//     console.log(await Location.getlocation(user._id));
// })

//프로필 등록
router.post("/", auth, (req, res) => {
  const { profile_data, location_data, field_data, tag_data } = getData(req);
  const profile = new Profile(profile_data);
  const location = new Location(location_data);

  //DB에 프로필이 등록되어 있는지 확인.
  Profile.findOne({ user_uid: req.user._id }, (err, result) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else if (result) {
      res.status(400).json({ msg: "이미 프로필이 등록 되어 있습니다." });
    } else {
      profile.save((err) => {
        if (err) {
          return res.status(400).json({ msg: err });
        } else {
          location.save(async (err) => {
            if (err) {
              return res.status(400).json({ msg: err });
            } else {
              await tag_data.tag.forEach((item) => {
                var tag = new Tag({ user_uid: tag_data.user_uid, tag: item });
                tag.save((err) => {
                  if (err) {
                    return res.status(400).json({ msg: err });
                  }
                });
              });
              //분야 등록
              await field_data.field.forEach((item) => {
                FieldList.findOne({ field: item }, (err, result) => {
                  if (err) {
                    return res.status(400).json({ msg: err });
                  } else if (result) {
                    var field = new Field({
                      user_uid: req.user._id,
                      field: result._id,
                    });
                    field.save((err, result) => {
                      if (err) {
                        return res.status(400).json({ msg: err });
                      }
                    });
                  } else {
                    res.json({ msg: "DB상에 존재하지 않는 분야" });
                  }
                });
              });
              res.status(201).json();
            }
          });
        }
      });
    }
  });
});
//프로필 조회
router.get("/:nickname", auth, (req, res) => {
  var user_data = {};
  Profile.findOne({ nickname: req.params.nickname }, (err, profile) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else if (profile) {
      user_data = {
        profile: {
          nickname: profile.nickname,
          job: profile.job,
          intro: profile.intro,
          career: profile.career,
          age: profile.age,
          gender: profile.gender,
          picture: profile.picture,
        },
      };
      Location.findOne({ user_uid: profile.user_uid }, (err, location) => {
        if (err) {
          res.status(400).json({ msg: err });
        } else {
          user_data = {
            ...user_data,
            location: { lat: location.lat, lon: location.lon },
          };
          Tag.find({ user_uid: profile.user_uid }, (err, tag_data) => {
            if (err) {
              res.status(400).json({ msg: err });
            } else {
              var tag = new Array();
              tag_data.forEach((item) => {
                tag.push(item.tag);
              });
              user_data = { ...user_data, tag };
              Field.find(
                { user_uid: profile.user_uid },
                async (err, result) => {
                  // console.log(result);
                  var field_data = new Array();
                  if (err) {
                    return res.status(400).json({ msg: err });
                  } else if (result) {
                    for (const item of result) {
                      await FieldList.findOne({ _id: item.field }).then(
                        (result) => {
                          field_data.push(result.field);
                        }
                      );
                    }
                  }
                  user_data = { ...user_data, field_data };
                  res.status(200).json(user_data);
                }
              );
            }
          });
        }
      });
    }
  });
});
//프로필 수정
router.put("/:nickname", auth, (req, res) => {
  var user = req.user;
  Profile.findOne({ nickname: req.params.nickname }, (err, profile) => {
    if (err) {
      res.status(400).json({ msg: err });
    } else if (user._id.equals(profile.user_uid)) {
      const { profile_data, location_data, field_data, tag_data } =
        getData(req);
      Profile.findOneAndReplace(
        { nickname: req.params.nickname },
        profile_data,
        { returnDocument: true },
        (err, result) => {
          if (err) {
            res.status(400).json({ msg: err });
          } else if (result) {
            Location.findOneAndReplace(
              { user_uid: location_data.user_uid },
              location_data,
              { returnDocument: true },
              (err, result) => {
                if (err) {
                  res.status(400).json({ msg: err });
                } else if (result) {
                  Tag.deleteMany(
                    { user_uid: tag_data.user_uid },
                    async (err, result) => {
                      if (err) {
                        res.status(400).json({ msg: err });
                      } else {
                        if (tag_data.tag) {
                          tag_data.tag.forEach((item) => {
                            var tag = new Tag({
                              user_uid: req.user._id,
                              tag: item,
                            });
                            tag.save((err) => {
                              if (err) {
                                return res.status(400).json({ msg: err });
                              }
                            });
                          });
                        }
                        await Field.deleteMany({
                          user_uid: field_data.user_uid,
                        }).then((result) => {
                          if (field_data.field) {
                            field_data.field.forEach((item) => {
                              FieldList.findOne(
                                { field: item },
                                (err, result) => {
                                  if (err) {
                                    return res.status(400).json({ msg: err });
                                  } else if (result) {
                                    var field = new Field({
                                      user_uid: req.user._id,
                                      field: result._id,
                                    });
                                    field.save((err, result) => {
                                      if (err) {
                                        return res
                                          .status(400)
                                          .json({ msg: err });
                                      }
                                    });
                                  } else {
                                    res.json({
                                      msg: "DB상에 존재하지 않는 분야",
                                    });
                                  }
                                }
                              );
                            });
                          }
                        });
                        res.status(200).json();
                      }
                    }
                  );
                } else {
                  res.status(400).json({ msg: err });
                }
              }
            );
          } else {
            res.status(400).json({ msg: err });
          }
        }
      );
    } else {
      res.json({ msg: "본인 프로필만 수정가능" });
    }
  });
});

//프로필 불러오기

module.exports = router;