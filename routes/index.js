const express = require('express');
const twilio = require('twilio');
const callController = require('../controllers/callController');
// const { catchErrors } = require('../handlers/errorHandlers');

const router = express.Router();

const shouldValidate = process.env.NODE_ENV === 'production';

router.post(
  '/incoming',
  twilio.webhook({ validate: shouldValidate }),
  callController.incoming,
);

router.post('/callme', callController.callme);

router.post('/outbound/:myNumber', callController.connectOutbound);
