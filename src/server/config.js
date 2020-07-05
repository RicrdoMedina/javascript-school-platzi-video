require('dotenv').config();

const config = {
  dev: process.env.ENV !== 'production',
  port: process.env.PORT || 8000,
  apiUrl: process.env.API_URL,
  apiKeyToken: process.env.API_KEY_TOKEN,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
  sessionSecret: process.env.SESSION_SECRET,
  twitterComsumerKey: process.env.TWITTER_COMSUMER_KEY,
  twitterComsumerSecret: process.env.TWITTER_COMSUMER_SECRET,
  facebookClientId: process.env.FACEBOOK_CLIENT_ID,
  facebookClientSecret: process.env.FACEBOOK_CLIENT_SECRET,
};

module.exports = { config };
