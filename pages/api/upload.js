import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';

const bucketName = 'kevin-next-ecommerce';

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
    clientPromise.send(new PutObjectCommand({
        Bucket: 'Kevin-next-ecommerce'
    }));

    return res.json('ok');
}

// Tells next.js to not parse our request as json
export const config = {
    api: { bodyParser: false },
}