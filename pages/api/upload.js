import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import mime from 'mime-types';
import { mongooseConnect } from "@/lib/mongoose";
import { getServerSession } from "next-auth";
import { authOptions, isAdminRequest } from "@/pages/api/auth/[...nextauth]";

// Bucket name on AWS
const bucketName = 'kevin-nextjs-ecommerce';

// We install multiparty to deal with the form data
// This function handles the upload request and response
export default async function handle(req, res) {
    await mongooseConnect();
    await isAdminRequest(req, res);

    const form = new multiparty.Form();
    // grab the fields and files from the promise
    const { fields, files } = await new Promise((resolve, reject) => {
        form.parse(req, async (err, fields, files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
    console.log('length:', files.file.length);
    // Open a new AWS S3 Client Object using our credentials
    const client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
        }
    });
    // Array of links to the files in the bucket
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
            // Read the file synchronously
            Body: fs.readFileSync(file.path),
            // File is publicly available
            ACL: 'public-read',
            // We don't know whether the file is a jpeg or a png
            // We can check the filetype with mime types
            ContentType: mime.lookup(file.path),
        }));
        // Link to the bucket with the new file
        const link = `https://${bucketName}.s3.amazonaws.com/${newFileName}`;
        links.push(link);
    }
    // Return a response with the links to files in the bucket
    return res.json({ links });
}

// Tells next.js to not parse our request as json
export const config = {
    api: { bodyParser: false },
}