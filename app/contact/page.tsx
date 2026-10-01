'use client';

import { FormEvent, useRef, useState } from 'react';
import { ArrowUpRight, Phone, Mail, MapPin, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { site } from '../../data/site';
import { pageMedia } from '../../data/media';
import Link from 'next/link';
import { PageHero } from '../../components/PageHero';

export default function Contact() {
  const [success, setSuccess] = useState(false);
  const [needsActivation, setNeedsActivation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setErrorMsg('');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.ok) {
        // Clear all form entries immediately ("jo entry thi wo gayab")
        form.reset();
        if (formRef.current) formRef.current.reset();

        setSuccess(true);
        setNeedsActivation(Boolean(data.needsActivation));

        // Smooth scroll to top of form section
        setTimeout(() => {
          successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 60);
      } else {
        setErrorMsg(data.message || 'Something went wrong. Please try again or reach us via WhatsApp.');
      }
    } catch {
      setErrorMsg('Network error. Please check your connection or contact us directly on WhatsApp.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main>
      <PageHero
        eyebrow="START A CONVERSATION"
        title={
          <>
            Let's create<br />
            <em>something extraordinary.</em>
          </>
        }
        image={pageMedia.contact.image}
        videoBackground
        videoSrc={pageMedia.contact.video}
        fallbackImages={[
          pageMedia.contact.image,
          'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=85'
        ]}
      />

      <section className="contact-grid">
        <div className="contact-info">
          <p className="eyebrow">CREATIVATORSS EVENT & PRODUCTION</p>
          <h2 className="display">
            Tell us about<br />
            <em>your event.</em>
          </h2>
          <p className="muted">
            A few details are all we need to begin. Our team will get back to you shortly.
          </p>

          <div className="contact-details">
            <strong><MapPin size={15} /> Find us</strong>
            <a
              href={site.addressMapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link-hover"
              style={{ color: 'inherit', display: 'flex', flexDirection: 'column' }}
              title="Open location in Google Maps"
            >
              {site.address.map(a => (
                <span key={a}>{a}</span>
              ))}
            </a>

            <strong><Phone size={15} /> Call us</strong>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <a href={`tel:${site.phone.replace(/[^0-9+]/g, '')}`} style={{ color: 'inherit' }}>
                {site.phone}
              </a>
              <a href={`tel:${site.alternatePhone.replace(/[^0-9+]/g, '')}`} style={{ color: 'inherit' }}>
                {site.alternatePhone}
              </a>
            </div>

            <strong><Mail size={15} /> Email</strong>
            <a href={`mailto:${site.email}`} style={{ color: 'inherit' }}>
              {site.email}
            </a>
          </div>
        </div>

        <div>
          {/* Success Banner */}
          {success && (
            <div className="enquiry-success-banner" ref={successRef}>
              <div className="enquiry-success-head">
                <CheckCircle2 size={26} className="enquiry-success-icon" />
                <div style={{ flex: '1 1 auto' }}>
                  <h4>Enquiry Sent Successfully!</h4>
                  <p>
                    Thank you! Your event enquiry has been received and sent to our team (<strong>{site.email}</strong>).
                    Form entries have been cleared and the form is refreshed for new submissions.
                  </p>

                  {needsActivation && (
                    <div style={{
                      marginTop: 12,
                      padding: '10px 14px',
                      background: 'rgba(201, 164, 92, 0.12)',
                      border: '1px solid var(--gold)',
                      borderRadius: 6,
                      fontSize: 12.5,
                      color: 'var(--navy)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8
                    }}>
                      <Info size={16} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                      <span>
                        <strong>Check Your Email:</strong> An activation link has been sent to <strong>{site.email}</strong> by FormSubmit. Click &quot;Activate Form&quot; in that email to enable instant inbox delivery for all future enquiries.
                      </span>
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="enquiry-banner-close"
                  aria-label="Dismiss notification"
                >
                  ✕
                </button>
              </div>

              <div className="enquiry-success-cta-row">
                <Link
                  className="btn btn-gold"
                  style={{ padding: '9px 16px', fontSize: '11px' }}
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us for Instant Quote <ArrowUpRight size={14} />
                </Link>
                <button
                  type="button"
                  className="btn btn-dark"
                  style={{ padding: '9px 16px', fontSize: '11px' }}
                  onClick={() => setSuccess(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="enquiry-error-banner">
              <AlertCircle size={18} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form ref={formRef} onSubmit={submit} className="form-grid">
            <label>
              Full Name *
              <input required name="name" placeholder="Your name" />
            </label>

            <label>
              Company
              <input name="company" placeholder="Company name" />
            </label>

            <label>
              Phone *
              <input required name="phone" type="tel" placeholder="+91" />
            </label>

            <label>
              Email *
              <input required name="email" type="email" placeholder="you@company.com" />
            </label>

            <label>
              Event Type
              <select name="eventType" defaultValue="">
                <option value="" disabled>Select one</option>
                <option>Corporate Event</option>
                <option>Fashion Show</option>
                <option>Brand Shoot</option>
                <option>Wedding Planning</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Event Date
              <input name="eventDate" type="date" />
            </label>

            <label>
              Event Location
              <input name="location" placeholder="City / venue" />
            </label>

            <label>
              Expected Guests
              <input name="guests" placeholder="Approx. number" />
            </label>

            <label>
              Budget
              <input name="budget" placeholder="Optional" />
            </label>

            <label>
              Services Required
              <input name="services" placeholder="What can we help with?" />
            </label>

            <label className="full">
              Message
              <textarea name="message" placeholder="Tell us a little about your vision..." />
            </label>

            <div className="full">
              <p className="form-note">
                By submitting, you agree that our team may contact you about this enquiry.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                <button className="btn btn-dark" type="submit" disabled={busy}>
                  {busy ? 'Sending Enquiry...' : 'Send Enquiry'} <ArrowUpRight size={16} />
                </button>
                <Link
                  className="btn btn-gold"
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp Us <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
