const aws = require('aws-sdk');
const path = require('path')
const multer = require('multer');
const multerS3 = require('multer-s3');
const createError = require('http-errors');

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: "us-east-1"
});

exports.s3UploadMulter = multer({
    storage: multerS3({
        s3,
        bucket: "urban-eatery",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: (req, file, cb) => {
            console.log(file);
            cb(null, Date.now().toString() + "-" + file.originalname);
        },
    }),
});

const getSignedUrl = (Key, ContentType) => {
    return new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', {
            Bucket: "urban-eatery",
            ContentType: 'multipart/form-data',
            Key
        }, (err, url) => {
            if (err) {
                reject(err);
            }
            console.log(url);
            resolve(url);
        });
    });
};


// Get sign url::
exports.getSignUrl = async (data) => {
    try {
        const { folder, key, ContentType, userId } = data;
        const Key = (userId ? `${folder}/${userId}-${new Date().getTime()}${path.extname(key)}` : `${folder}/${new Date().getTime()}${path.extname(key)}`);
        return { Key, url: await getSignedUrl(Key, ContentType) };
    } catch (e) {
        throw new createError(400, "This url has already been used");
    }
};


