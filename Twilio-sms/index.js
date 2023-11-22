// Download the helper library from https://www.twilio.com/docs/node/install
// Set environment variables for your credentials
// Read more at http://twil.io/secure
const accountSid = "AC1ed5cf6f028256304981e5e2e22f812f";
const authToken = "263bca86eed662877a8ec9da4c623ccf";
const verifySid = "VAb9be425aa42762895b07b17b189998fa";
const client = require("twilio")(accountSid, authToken);

client.verify.v2
  .services(verifySid)
  .verifications.create({ to: "+85592988821", channel: "sms" })
  .then((verification) => console.log(verification.status))
  .then(() => {
    const readline = require("readline").createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    readline.question("Please enter the OTP:", (otpCode) => {
      client.verify.v2
        .services(verifySid)
        .verificationChecks.create({ to: "+85592988821", code: otpCode })
        .then((verification_check) => console.log(verification_check.status))
        .then(() => readline.close());
    });
  });
