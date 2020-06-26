import multer, { Options } from 'multer';
import path from 'path';
import multerS3 from 'multer-s3';
import aws from 'aws-sdk';

const storageTypes = {
    local: multer.diskStorage({
        destination: (req, file, callback) => {
            callback(null, path.resolve(__dirname,'..','..','tmp','uploads'));
        },
        filename: (req, file, callback) => {
            const userName = file.fieldname;
            const datetime = new Date().getTime();
            const suffix = file.originalname.split('.')[file.originalname.split('.').length-1];
            const fileName =String(datetime)+ userName+'.'+suffix;

            callback(null,fileName);
        }
    }),
    s3: multerS3({
        s3: new aws.S3(),
        bucket: String(process.env.AWS_S3_BUCKET),
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, callback) => {
            const userName = file.fieldname;
            console.log(`username: ${userName}`);
            const datetime = new Date().getTime();
            const suffix = file.originalname.split('.')[file.originalname.split('.').length-1];
            const fileName = String(datetime)+userName+'.'+suffix;
            
            callback(null,fileName);
        }
    })
};

const options: Options = {
    dest: path.resolve(__dirname,'..','..','tmp','uploads'),
    storage: storageTypes.s3,
    limits: {
        fileSize: 2 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        console.log(file.mimetype);
            const allowedMimes = ['image/jpeg',
            'image/png','application/pdf',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', //XLSX
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document', //DOCX
            'audio/mpeg'
        ];

            if(allowedMimes.includes(file.mimetype)){
                callback(null, true);
            }

            else {
                callback(new Error('Invalid file type'));
            }
    }
    
};

export default options;