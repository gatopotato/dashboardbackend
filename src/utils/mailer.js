import nodemailer from 'nodemailer';

var transport = nodemailer.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 2525,
    auth: {
        user: '72182352ed2aa3',
        pass: '2d5f90f5aa1a98',
    },
});

var message = {
    from: 'samkit@gmail.com',
    to: 'samkitjai09@gmail.com',
    subject: 'Hello',
    text: 'Hello from the other side',
};

const mail = async () => {
    await transport.sendMail(message, function (err, info) {
        if (err) {
            console.log('Error', err);
        } else {
            console.log('Info', info);
        }
    });
};
await mail();
console.log('hello');
