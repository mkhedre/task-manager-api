
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SEND_GRID_KEY)

const welcomeEmail =(email,name)=>{
    sgMail
    .send({
        to: email, // Change to your recipient
        from: 'mkhedre3@gmail.com', // Change to your verified sender
        subject: 'thanks for joining in ',
        text: `welcome ${name} from my task app`,
        // html: '<strong>and easy to do anywhere, even with Node.js</strong>',
      })
    .then(() => {
      console.log('Email sent')
    })
    .catch((error) => {
      console.error(error)
    })
}

const cancelEmail =(email,name)=>{
    sgMail
    .send({
        to:email,
        from:'mkhedre3@gmail.com',
        subject:'we are sad for you end',
        text:`goodby ${name} we want you to come back`
    })
    .then(()=>{
        console.log('Email sent')
    })
    .catch((e)=>{
        console.log(e)
    })
}
module.exports={
    welcomeEmail,
    cancelEmail
}