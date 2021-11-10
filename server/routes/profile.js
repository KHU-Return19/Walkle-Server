const express = require('express');
const router = express.Router();


const { Field } = require('../models/UserProfile/Field');
const { FieldList } = require('../models/UserProfile/FieldList');
const { Location } = require('../models/UserProfile/Location');
const { Profile } = require('../models/UserProfile/Profile');
const { Tag } = require('../models/UserProfile/Tag');
const { auth } = require('../middleware/auth'); //인증

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
        picture: req.body.picture
    };
    const location_data = {
        user_uid: req.user._id,
        lat: req.body.lat,
        lon: req.body.lon
    };
    const field_data = {
        user_uid: req.user._id
    };
    const tag_data = {
        user_uid: req.user._id,
        tag: req.body.tag
    };
    return { profile_data, location_data, field_data, tag_data }

}
//프로필 등록
router.post('/',auth, (req, res) => {
    const { profile_data, location_data, field_data, tag_data } = getData(req);
    const profile = new Profile(profile_data);
    const location = new Location(location_data);
    const field = new Field(field_data);
    //DB에 프로필이 등록되어 있는지 확인.
    Profile.findOne({ user_uid: req.user._id }, (err, result) => {
        if (err) {
            res.status(400).json({ success: false, err });
        } else if (result) {
            res.json({ success: false, msg: "이미 프로필이 등록 되어 있습니다." });
        } else {
            profile.save((err) => {
                if (err) {
                    return res.status(400).json({ success: false, err });
                } else {
                    location.save((err) => {
                        if (err) {
                            return res.status(400).json({ success: false, msg: "위치 저장 실패" })
                        } else {
                            tag_data.tag.forEach((item) => {
                                var tag = new Tag({ user_uid: tag_data.user_uid, tag: item })
                                tag.save((err) => {
                                    if (err) {
                                        return res.status(400).json({ success: false, msg: "태그 저장실패" });
                                    }
                                })
                            })
                            field.save((err,result) => {
                                if (err) {
                                    return res.status(400).json({ success: false, msg: "분야 저장 실패" });
                                } else if(result){
                                    req.body.field.forEach((item) => {
                                        var field_list = new FieldList({
                                            field_uid: result._id,
                                            field: item
                                        })
                                        field_list.save((err) => {
                                            if (err) {
                                                return res.status(400).json({ success: false, msg: "분야 명칭 저장 실패" });
                                            }
                                        })
                                    })
                                    res.json({ success: true, msg: "프로필 등록 완료" })
                                }
                            })

                        }
                    })
                }
            })
        }
    })
})
//프로필 수정
router.post('/:nickname', auth,(req, res) => {
    const { profile_data, location_data, field_data, tag_data } = getData(req);
    Profile.findOneAndReplace({ nickname: req.params.nickname }, profile_data, { returnDocument: true }, (err, result) => {
        if (err) {
            res.status(400).json({ success: false, err });
        } else if (result) {
            Location.findOneAndReplace({ user_uid: location_data.user_uid }, location_data, { returnDocument: true }, (err, result) => {
                if (err) {
                    res.status(400).json({ succcess: false, err });
                } else if (result) {
                    Tag.deleteMany({ user_uid: tag_data.user_uid }, (err, result) => {
                        if (err) {
                            res.status(400).json({ success: false, err });
                        } else {
                            if (tag_data.tag) {
                                tag_data.tag.forEach((item) => {
                                    var tag = new Tag({ user_uid: req.user._id, tag: item })
                                    tag.save((err) => {
                                        if (err) {
                                            return res.status(400).json({ success: false, msg: "태그 저장실패" });
                                        }
                                    })
                                })
                            }
                            Field.findOne({ user_uid: field_data.user_uid }, (err, result) => {
                                if (err) {
                                    res.status(400).json({ success: false, err });
                                } else if (result) {
                                    FieldList.deleteMany({ field_uid: result._id }, (err, doc) => {
                                        if (err) {
                                            res.status(400).json({ success: false, err });
                                        } else {
                                            if (req.body.field) {
                                                req.body.field.forEach((item) => {
                                                    var field_list = new FieldList({
                                                        field_uid: result._id,
                                                        field: item
                                                    })
                                                    field_list.save((err) => {
                                                        if (err) {
                                                            return res.status(400).json({ success: false, msg: "분야 명칭 저장 실패" });
                                                        }
                                                    })
                                                })
                                            }
                                            res.json({ success: true, msg: "프로필 수정 완료" })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    res.status(400).json({ success: false, msg: "location 수정 실패" });
                }
            })
        } else {
            res.status(400).json({ success: false, msg: "프로필이 존재하지않음" });
        }
    })
})


//프로필 불러오기

module.exports = router;