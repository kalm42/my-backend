const express = require('express');
const cors = require('cors');
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

router.post('/api/callme', cors(), callController.callme);

router.get('/api/outbound/:myNumber', callController.connectOutbound);

module.exports = router;
