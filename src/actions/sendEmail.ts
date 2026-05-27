'use server';

import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = 'mananjaingadiya@gmail.com';

export type SendEmailPayload = {
  name: string;
  email: string;
  message: string;
};

export type SendEmailResult =
  | { status: 'success' }
  | { status: 'error'; message: string };

export async function sendEmail(payload: SendEmailPayload): Promise<SendEmailResult> {
  const { name, email, message } = payload;

  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return { status: 'error', message: 'All fields are required.' };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { status: 'error', message: 'Invalid email address.' };
  }
  if (message.trim().length < 10) {
    return { status: 'error', message: 'Message too short.' };
  }

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>',
      to: TO_EMAIL,
      replyTo: email,
      subject: `[Portfolio] Message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    });

    if (error) {
      return { status: 'error', message: error.message };
    }

    return { status: 'success' };
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Failed to send. Please try again.';
    return { status: 'error', message: msg };
  }
}
