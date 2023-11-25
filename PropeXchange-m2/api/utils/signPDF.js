import multer from 'multer';
import fs from 'fs';
import crypto from 'crypto';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { DefaultAzureCredential } from '@azure/identity';
import { KeyClient } from '@azure/keyvault-keys';

const keyVaultUrl = 'https://propexchcange.vault.azure.net';
const keyName = 'client-key-';

async function getKeyOrCreate(username) {
    const credential = new DefaultAzureCredential();
    const keyClient = new KeyClient(keyVaultUrl, credential);

    try {
        // Attempt to get the key
        const key = await keyClient.getKey(keyName+username);
        return key;
    } catch (error) {
        console.log("erc",error.statusCode);
        if (error.statusCode === 404) {
            // Key doesn't exist, create a new one
            const newKey = await keyClient.createRsaKey(keyName+username, { keySize: 2048 });
            console.log('New key created:', newKey.name);
            return newKey;
        } else {
            throw error;
        }
    }
}
export default (app) => {
app.post('/sign-pdf', upload.single('pdf'), async (req, res) => {
    try {
        //console.log(req.body);
        const key = await getKeyOrCreate(req.body.username);
        const credential = new DefaultAzureCredential();
        const keyClient = new KeyClient(keyVaultUrl, credential);
        console.log("key created/fetched");
        // Sign the uploaded PDF data
        const hash = crypto.createHash('sha256');
        hash.update(req.file.buffer);
        const hashedData = hash.digest();
        const algorithm = 'RS256'; 
        const cryptographyClient = keyClient.getCryptographyClient(key.name);
        const signResult = await cryptographyClient.sign(algorithm, hashedData);
        // Send the signed PDF back to the client
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=signed.pdf');
        const base64Signature = signResult.result.toString('base64');

        // Send the base64-encoded signature back to the client
        res.status(200).json({ base64Signature });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
});

}