const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();


const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(cors());
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb" }));




const sentEmail = ({userame ,email, subject , message })=>{
    return new Promise((resolve,reject)=>{
        var transporter = nodemailer.createTransport({
            service:process.env.EMAIL_SERVICE,
            auth:{
                user:process.env.AUTH_EMAIL,
                pass:process.env.AUTH_PASS
            }
        });

        const mailConfig = {
            from: process.env.FROM_EMAIL,
            to: process.env.TO_EMAIL,
            subject: subject,
            text: `Message from: ${email}\nUsername : ${userame}\n${message}`, // Include the user’s email in the message body
            replyTo: email // Set replyTo to the user's email
        };
        

        transporter.sendMail(mailConfig, (error, info)=>{
            if(error){
                console.log(error);
                return reject({message:`an error occured`});
            }

            return resolve({message:`email sended sucessfully`});
        })
    });
};

app.get("/", (req, res)=>{
    res.send("Perfect");
})

app.post("/sendEmail", (req, res) => {
    const { userame, email, subject, message } = req.body;
    sentEmail({userame, email, subject, message })  // Assuming sendEmail sends the email
        .then((response) => res.json({ message: response.message }))
        .catch((error) => res.status(500).json({ message: error.message }));
});




// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

