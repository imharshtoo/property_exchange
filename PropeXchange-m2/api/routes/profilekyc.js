/* eslint-disable no-console */
/* eslint-disable max-len */
import Sequelize from 'sequelize';
import {User} from '../sequelize.js';
import multer from 'multer';
import fs from 'fs';
import axios from 'axios';
import https from 'https';
import crypto from 'crypto';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

import { DefaultAzureCredential } from '@azure/identity';
import { KeyClient } from '@azure/keyvault-keys';

const keyVaultUrl = 'https://propexchcange.vault.azure.net';
const keyName = 'client-key-';
// eslint-disable-next-line prefer-destructuring
const Op = Sequelize.Op;



export default (app) => {
  app.post('/user-kyc', upload.single('pdf'), async (req, res) => {
    try {
    User.findOne({
      where: {
        verifyProfileToken: req.body.verifyProfileToken,
        verificationTokenExpires: {
          [Op.gt]: Date.now(),
        },
      },
    }).then(async (user) => {
      if (user == null || req.body.username != user.username) {
        console.error('verification link is invalid or has expired');
        res.status(403).send('verification link is invalid or has expired');
      } else {
        const credential = new DefaultAzureCredential();
          const keyClient = new KeyClient(keyVaultUrl, credential);

          // Get the key
          const key = await keyClient.getKey(keyName + user.username);

          // Create a hash of the PDF content
          const pdfHash = crypto.createHash('sha256').update(req.file.buffer).digest();

          // Verify the signature
          const algorithm = 'RS256'; // You should use the correct signing algorithm based on your key type
          const cryptographyClient = keyClient.getCryptographyClient(key.name);
          const base64Signature = req.body.signature;
          const decodedSignature = Buffer.from(base64Signature, 'base64');
          const isVerified = await cryptographyClient.verifyData(
            algorithm,
            pdfHash,
            decodedSignature // The signature to verify
          );

          if (isVerified) {
            console.log('Signature verified');
            // Handle the case where the signature is valid
            const credentials = {
                email: req.body.email,
                password: req.body.password,
              };
              const agent = new https.Agent({
                rejectUnauthorized: false,
              });
            axios.post('https://192.168.3.39:5000/kyc',credentials, { httpsAgent: agent })
            .then(response => {
                console.log(response.data);
                if(response.data.status == "success"){
                    //console.log("b84",base64Signature);
                    user.update({
                        status: 'verified',
                        proofid: req.file.buffer,
                        signature: base64Signature,
                        verifyProfileToken: null,
                        verificationTokenExpires: null,
                      }).then(() => {
                        console.log('User updated');
                        res.status(200).send('KYC Verified');
                      }).catch((error) => {
                        console.error('Error updating user:', error);
                        res.status(500).send('Internal Server Error');
                      });
            }
                else{
                    res.status(403).send('KYC Verification Failed');
                }
            })
            .catch(error => {
                console.error(error);
                res.status(500).send('Internal Server Error');
            });
            
          } else {
            console.error('Signature verification failed');
            // Handle the case where the signature is not valid
            res.status(403).send('PDF signature verification failed');
          }
      }
    });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
    }
  });
};
