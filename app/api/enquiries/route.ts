import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const TARGET_EMAIL = process.env.ENQUIRY_TO_EMAIL || 'devgarg752@gmail.com';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body?.name || !body?.phone || !body?.email) {
      return NextResponse.json(
        { ok: false, message: 'Name, phone and email are required.' },
        { status: 400 }
      );
    }

    const {
      name,
      company = 'N/A',
      phone,
      email,
      eventType = 'N/A',
      eventDate = 'N/A',
      location = 'N/A',
      guests = 'N/A',
      budget = 'N/A',
      services = 'N/A',
      message = 'N/A'
    } = body;

    const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

    console.log('--- NEW CREATIVATORSS ENQUIRY ---');
    console.log(`Time: ${timestamp}`);
    console.log(`From: ${name} <${email}>`);
    console.log(`Phone: ${phone}`);
    console.log(`Event: ${eventType} on ${eventDate}`);
    console.log(`Details:`, body);
    console.log('---------------------------------');

    let emailSent = false;

    // 1. Send via Nodemailer if SMTP / Gmail credentials are configured
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpUser && smtpPass) {
      try {
        const transporter = smtpHost
          ? nodemailer.createTransport({
              host: smtpHost,
              port: Number(process.env.SMTP_PORT) || 465,
              secure: process.env.SMTP_PORT === '465' || !process.env.SMTP_PORT,
              auth: { user: smtpUser, pass: smtpPass }
            })
          : nodemailer.createTransport({
              service: 'gmail',
              auth: { user: smtpUser, pass: smtpPass }
            });

        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px; background: #ffffff;">
            <div style="background: #171a5c; color: #ffffff; padding: 20px; border-radius: 6px; text-align: center;">
              <h2 style="margin: 0; font-size: 22px; color: #c9a45c;">Creativatorss Event & Production</h2>
              <p style="margin: 6px 0 0; font-size: 14px; opacity: 0.9;">New Event Enquiry Received</p>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 24px; font-size: 14px;">
              <tbody>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; width: 35%; color: #4a5568;">Full Name:</td><td style="padding: 10px 8px; color: #1a202c;">${name}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Phone Number:</td><td style="padding: 10px 8px; color: #1a202c;"><a href="tel:${phone}" style="color: #171a5c; font-weight: bold;">${phone}</a></td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Email Address:</td><td style="padding: 10px 8px; color: #1a202c;"><a href="mailto:${email}" style="color: #171a5c;">${email}</a></td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Company:</td><td style="padding: 10px 8px; color: #1a202c;">${company}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Event Type:</td><td style="padding: 10px 8px; color: #1a202c;">${eventType}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Event Date:</td><td style="padding: 10px 8px; color: #1a202c;">${eventDate}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Location / Venue:</td><td style="padding: 10px 8px; color: #1a202c;">${location}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Expected Guests:</td><td style="padding: 10px 8px; color: #1a202c;">${guests}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Budget:</td><td style="padding: 10px 8px; color: #1a202c;">${budget}</td></tr>
                <tr style="border-bottom: 1px solid #edf2f7;"><td style="padding: 10px 8px; font-weight: bold; color: #4a5568;">Services Required:</td><td style="padding: 10px 8px; color: #1a202c;">${services}</td></tr>
                <tr><td style="padding: 10px 8px; font-weight: bold; color: #4a5568; vertical-align: top;">Message:</td><td style="padding: 10px 8px; color: #1a202c; white-space: pre-wrap;">${message}</td></tr>
              </tbody>
            </table>
            
            <div style="margin-top: 24px; padding-top: 14px; border-top: 1px solid #edf2f7; font-size: 12px; color: #a0aec0; text-align: center;">
              Received at ${timestamp} via Creativatorss Website
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: `"Creativatorss Website" <${smtpUser}>`,
          to: TARGET_EMAIL,
          replyTo: email,
          subject: `✨ New Event Enquiry: ${name} (${eventType})`,
          html: htmlContent
        });

        emailSent = true;
      } catch (err: any) {
        console.error('Nodemailer delivery error:', err?.message || err);
      }
    }

    // 2. Gateway delivery to TARGET_EMAIL (works out-of-the-box without server passwords)
    if (!emailSent) {
      try {
        const formSubmitRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: `New Event Enquiry: ${name} (${eventType})`,
            _template: 'table',
            _captcha: 'false',
            _replyto: email,
            Name: name,
            Phone: phone,
            Email: email,
            Company: company,
            'Event Type': eventType,
            'Event Date': eventDate,
            Location: location,
            'Expected Guests': guests,
            Budget: budget,
            'Services Required': services,
            Message: message,
            'Received At': timestamp
          })
        });

        if (formSubmitRes.ok) {
          emailSent = true;
        } else {
          const txt = await formSubmitRes.text();
          console.warn('FormSubmit response:', txt);
        }
      } catch (err: any) {
        console.warn('FormSubmit forward error:', err?.message || err);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      message: 'Thank you! Your enquiry has been received.'
    });
  } catch (error: any) {
    console.error('API enquiry error:', error);
    return NextResponse.json(
      { ok: false, message: 'Server error processing enquiry.' },
      { status: 500 }
    );
  }
}
