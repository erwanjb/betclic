import dynamo from 'dynamodb';
import Joi from 'joi';
import { config } from 'dotenv';

config();

dynamo.AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID, 
    secretAccessKey: process.env.SECRET_ACCESS_KEY, 
    region: "eu-central-1"
});

export const Player = dynamo.define('Player', {
    hashKey: 'pseudo',
    schema: {
      pseudo: Joi.string(),
      points: Joi.number().integer().optional()
    }
});

export default dynamo;