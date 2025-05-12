import express from 'express';

const router = express.Router();

router.post('/testEmail', async (req, res) => {
  const { to, subject, html, text } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ message: 'to & subject are required' });
  }

  try {
    const info = await sendEmail({ to, subject, html, text });
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    res.status(500).json({ message: 'Failed to send email', error });
  }
});

export default router;
