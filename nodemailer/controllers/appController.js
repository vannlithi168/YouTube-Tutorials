const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const { EMAIL, PASSWORD } = require("../env");

const signup = async (req, res) => {
  try {
    let testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    let message = {
      from: '"Fred Foo 👻" <foo@example.com>',
      to: "bar@example.com, baz@example.com",
      subject: "Hello ✔",
      text: "Hello world?",
      html: "<b>Hello world?</b>",
    };

    const info = await transporter.sendMail(message);

    res.status(201).json({
      msg: "You should receive an email",
      info: info.messageId,
      preview: nodemailer.getTestMessageUrl(info),
    });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//send mail from real gmail account
const getBill = async (req, res) => {
  try {
    const { userEmail } = req.body;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: PASSWORD,
      },
    });

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Mailgen",
        link: "https://mailgen.js/",
      },
    });

    let response = {
      body: {
        name: "TEST",
        intro: "Your bill has arrived!",
        table: {
          data: [
            {
              item: "Nodemailer Stack Book",
              description: "A Backend application",
              price: "$10.99",
            },
          ],
        },
        outro: "Looking forward to your payment!",
      },
    };

    let mail = MailGenerator.generate(response);

    let message = {
      from: EMAIL,
      to: userEmail,
      subject: "Place order",
      html: mail,
    };

    await transporter.sendMail(message);

    return res.status(201).json({
      msg: "You should receive an email",
    });
  } catch (error) {
    console.error("Error sending email:", error);
    console.error("Transporter Error:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  signup,
  getBill,
};
