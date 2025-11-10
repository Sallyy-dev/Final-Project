const forgetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({ message: "Reset link sent (if email exists)" });
    }
    const resetToken = generateResetToken(user._id);
    const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
    const subject = "Reset your password";
    await sendEmail(user.email, subject, html);
    res.status(200).json({ message: "Reset link sent (if email exists)" });
  };

  async function sendEmail(to, subject, html) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      const mailOptions = {
        from: `"MyApp Support" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
      };
      await transporter.sendMail(mailOptions);
      console.log("Email sent to:", to);
    } catch (err) {
      console.error("Email sending failed:", err.message);
      throw new Error("Failed to send email");
    }
  }
  
  const resetPassword = async (req, res) => {
    const token = req.params.token;
    const { newPassword } = req.body;
    if (!token) return res.status(400).json({ message: "Token is missing" });
    if (!newPassword)
      return res.status(400).json({ message: "New password is required" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(404).json({ message: "User not found" });
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(200).send("<h3>Password updated successfully</h3>");
    } catch (error) {
      console.error("Reset password error:", error);
      res.status(403).send("<h3>Invalid or expired token</h3>");
    }
  };