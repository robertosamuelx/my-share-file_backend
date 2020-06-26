import express, { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';
import Post from './models/Post';
import aws from 'aws-sdk';
const s3 = new aws.S3();

const routes = express.Router();


routes.post('/posts', multer(multerConfig).single('file'),async (req, res) => {

    const file:any = req.file

    const post =  await Post.create({
        name : file['originalname'],
        size: file['size'],
        key: file['key'],
        url: file['location']
    });
    return res.json(post);
});

routes.get('/posts', async(req,res) => {
    const posts = await Post.find({});

    return res.json(posts);
});

routes.delete('/posts/:id', async(req, res) => {
    const post = await Post.findById(req.params.id);

    await s3.deleteObject({
        Bucket: String(process.env.AWS_S3_BUCKET),
        Key: `${post?.toObject().key}`
    }).promise();
    await post?.deleteOne();

    return res.json({message: 'Done!'});
});

export default routes;