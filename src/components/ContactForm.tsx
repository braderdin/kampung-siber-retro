"use client";

import { useState } from 'react';
import { z } from 'zod';

// Start: ZOD Validation Schema
const contactFormSchema = z.object({
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(100, 'Subject must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-_!?.,:;'\"()]+$/, 'Subject contains invalid characters'),
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters'),
  email: z.string()
    .email('Please enter a valid email address')
    .optional()
    .or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  className?: string;
}

export default function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    subject: '',
    message: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<keyof ContactFormData, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateField = (field: keyof ContactFormData, value: string) => {
    try {
      const schema = contactFormSchema.pick({ [field]: true });
      schema.parse({ [field]: value });
      setErrors((prev) => ({ ...prev, [field]: '' }));
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors((prev) => ({ ...prev, [field]: error.errors[0].message }));
      }
      return false;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const isValid = Object.keys(formData).every((field) =>
      validateField(field as keyof ContactFormData, formData[field as keyof ContactFormData])
    );

    if (!isValid) {
      return;
    }

    setIsSubmitting(true);

    // Create mailto link
    const mailtoLink = `mailto:admin@kampungsiber.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(formData.message)}${
      formData.email ? `\n\nFrom: ${formData.email}` : ''
    }`;

    // Open mailto link
    window.location.href = mailtoLink;

    setSubmitStatus('success');
    setFormData({ subject: '', message: '', email: '' });

    setTimeout(() => {
      setSubmitStatus('idle');
    }, 3000);

    setIsSubmitting(false);
  };

  return (
    <div className={`contact-form ${className}`}>
      {/* Start: Success Message */}
      {submitStatus === 'success' && (
        <div className="retro-toast-item bg-green-500/90 border-green-600 animate-slide-in mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">✅</span>
            <span className="pixel-font text-sm text-white">
              Email client opened! Your message has been sent to the admin.
            </span>
          </div>
        </div>
      )}
      {/* End: Success Message */}

      {/* Start: Error Message */}
      {submitStatus === 'error' && (
        <div className="retro-toast-item bg-red-500/90 border-red-600 animate-slide-in mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">❌</span>
            <span className="pixel-font text-sm text-white">
              Failed to send. Please try again.
            </span>
          </div>
        </div>
      )}
      {/* End: Error Message */}

      {/* Start: Form */}
      <form onSubmit={handleSubmit} className="retro-card border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 rounded-none p-4">
        {/* Start: Email Field (Optional) */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
            📧 Email Address (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={`
              w-full px-3 py-2 border-2 rounded-none font-mono text-sm
              ${errors.email ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-cyan-400 bg-white dark:bg-gray-900'}
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-pink-500
            `}
          />
          {errors.email && (
            <p className="mt-1 text-xs text-red-500 pixel-font">{errors.email}</p>
          )}
        </div>
        {/* End: Email Field */}

        {/* Start: Subject Field */}
        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
            📝 Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Enter your subject"
            maxLength={100}
            className={`
              w-full px-3 py-2 border-2 rounded-none font-mono text-sm
              ${errors.subject ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-cyan-400 bg-white dark:bg-gray-900'}
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-pink-500
            `}
          />
          {errors.subject && (
            <p className="mt-1 text-xs text-red-500 pixel-font">{errors.subject}</p>
          )}
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formData.subject.length}/100 characters
          </div>
        </div>
        {/* End: Subject Field */}

        {/* Start: Message Field */}
        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
            💬 Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Enter your message..."
            rows={6}
            maxLength={1000}
            className={`
              w-full px-3 py-2 border-2 rounded-none font-mono text-sm resize-y
              ${errors.message ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-cyan-400 bg-white dark:bg-gray-900'}
              text-gray-900 dark:text-gray-100
              focus:outline-none focus:ring-2 focus:ring-pink-500
            `}
          />
          {errors.message && (
            <p className="mt-1 text-xs text-red-500 pixel-font">{errors.message}</p>
          )}
          <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 font-mono">
            {formData.message.length}/1000 characters
          </div>
        </div>
        {/* End: Message Field */}

        {/* Start: Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`
            w-full py-2 px-4 font-bold pixel-font text-sm
            border-2 border-pink-400 rounded-none
            ${isSubmitting 
              ? 'bg-pink-300/50 cursor-not-allowed' 
              : 'bg-pink-500 hover:bg-pink-600 text-white'
            }
            transition-all duration-200
          `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span>
              Sending...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              ✉️ Email the Admin
            </span>
          )}
        </button>
        {/* End: Submit Button */}
      </form>
      {/* End: Form */}
    </div>
  );
}