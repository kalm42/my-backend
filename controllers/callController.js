const twilio = require('twilio');
const mail = require('../handlers/mail');

const getIdahoTime = () => {
  // Taken from https://www.techrepublic.com/article/convert-the-local-time-to-another-time-zone-with-this-javascript/
  // Current date/time of server location
  const d = new Date();

  // convert to miliseconds
  const localTime = d.getTime();

  // Get local timezone offset in milliseconds
  // getTimezoneOffset returns the offset in minutes so it must be multiplied
  const localOffset = d.getTimezoneOffset() * 60000;

  // Convert to UTC in miliseconds.
  const utc = localTime + localOffset;
  // Durring Daylight savings Idaho is -6, otherwise it's -7
  const IdahoOffset = -6;
  const idaho = utc + 3600000 * IdahoOffset;
  return new Date(idaho);
};

exports.incoming = (req, res) => {
  const callTime = getIdahoTime();
  const response = new twilio.twiml.VoiceResponse();

  // I only want to receive phone calls during business hours.
  // 9am MDT/MST - 5pm MDT/MST, also except for vacation days
  const hour = callTime.getHours();
  const day = callTime.getDay();
  if (hour >= 9 && hour <= 17 && day >= 1 && day <= 6) {
    // Is business hours and a weekday.
    response.say(
      'Thank you for calling calm fourty two. I will connect you to Kyle now.',
    );
    response.dial(process.env.MY_PHONE);
    res.set('Content-Type', 'text/xml');
    return res.send(response.toString());
  }
  response.say(
    'Thank you for calling calm fourty two. I am currently closed. Please leave a message and I will call you back.',
  );
  response.record({ maxLength: 30 });
  response.hangup();

  mail.send({
    message: 'You have a new voicemail.',
  });

  res.set('Content-Type', 'text/xml');
  return res.send(response.toString());
};
