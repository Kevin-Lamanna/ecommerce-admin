import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'kevin-nextjs-ecommerce';

// We install multiparty to deal with the form data
// This function handles the upload request and response
export default async function handle(req, res) {
    const form = new multiparty.Form();
    // grab the fields and files from the promise
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
    console.log('length:', files.file.length);
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    const links = [];
    // For loop to generate file names
    for (const file of files.file) {
        // Split the string and extract the extension from the end
        const ext = file.originalFilename.split('.').pop();
        // Append the Date() with the extension to create a unique filename
        const newFileName = Date.now() + '.' + ext
        console.log({ ext, file });
        // Send the information to the bucket
        await client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: newFileName,
            Body: fs.readFileSync(file.path),
            ACL: 'public-read',
            ContentType: mime.lookup(file.path),
        }));
        const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
        links.push(link);
    }
    // Return a response with the links to the bucket(s)
    return res.json({ links });
}

// Tells next.js to not parse our request as json
export const config = {
    api: { bodyParser: false },
}