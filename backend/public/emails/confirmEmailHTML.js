import dotenv from "dotenv";
dotenv.config();

export const confirmEmailHTML = (recipient, emailCode) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet">
    <title>📧 Email Confirmation 📧</title>
    <style>
      * {
        font-family: "Montserrat", sans-serif;
      }
  
      body {
        margin: 0;
        padding: 0;
      }
  
      .container {
        max-width: 600px;
        margin: 0 auto;
        background-color: #fff;
        border-radius: 8px;
        overflow: hidden;
        margin-top: 20px;
      }
  
      .content {
        padding: 20px;
        text-align: center;
        /* border: 2px solid #334c72; */
        border: #334c72 20px solid;
        border-radius: 30px;
      }
  
      p {
        color: #555;
        line-height: 1.6;
        font-size: 20px;
      }
  
      .cta-button {
        display: inline-block;
        background-color: #4267B2;
        color: white;
        padding: 10px 20px;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 10px;
        margin-bottom: 20px;
      }
      
      a, a:hover, a:active {
        color: white;
      }
  
      .footer {
        color: white;
        padding: 10px;
        text-align: center;
      }
      
      .reminder {
        font-size: 16px;
      }
    </style>
  </head>
  
  <body>
    <div class="container">
      <div class="content">
        <h1>📧 Email Confirmation 📧</h1>
        <p>Hello ${recipient},</p>
        <p>To ensure the security of your account and protect your data, we have implemented Two-Factor Authentication (2FA) as an additional layer of security.</p>
        <p>Enter code below to confirm your email.</p>
        <h2>${emailCode}</h2>
        <hr>
      </div>
      <div class="footer">
        <p>Best regards,<br> ${process.env.PROJECT_NAME} </p>
      </div>
    </div>
  </body>
  
  </html>
  `;
};
