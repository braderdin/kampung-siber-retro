"use client";

import { useState } from 'react';

interface NewsletterSubscriptionProps {
  className?: string;
  triggerText?: string;
  showTrigger?: boolean;
}

export default function NewsletterSubscription({
  className = '',
  triggerText = 'Subscribe',
  showTrigger = true,
}: NewsletterSubscriptionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate subscription
    setTimeout(() => {
      setIsSubscribed(true);
      setIsSubmitting(false);
      setTimeout(() => {
        setIsModalOpen(false);
        setEmail('');
        setIsSubscribed(false);
      }, 2000);
    }, 1000);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEmail('');
    setIsSubscribed(false);
  };

  return (
    <>
      {/* Start: Subscription Trigger */}
      {showTrigger && (
        <button
          onClick={() => setIsModalOpen(true)}
          className={`retro-btn-secondary ${className}`}
        >
          {triggerText}
        </button>
      )}
      {/* End: Subscription Trigger */}

      {/* Start: Modal Overlay */}
      {isModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div 
            className="relative retro-card border-2 border-cyan-500 bg-white dark:bg-gray-900 rounded-none w-full max-w-md mx-4 p-6 animate-scale-in"
            style={{ boxShadow: '10px 10px 0 0 rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Start: Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              title="Close"
            >
              ✕
            </button>
            {/* End: Close Button */}

            {/* Start: Modal Content */}
            {!isSubscribed ? (
              <>
                <h2 className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 pixel-font mb-4 text-center">
                  📧 Subscribe to Site Updates
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
                  Get notified about new features, resident spotlights, and retro news.
                </p>
                
                <form onSubmit={handleSubscribe}>
                  <div className="mb-4">
                    <label htmlFor="newsletter-email" className="block text-sm font-bold text-gray-700 dark:text-gray-300 pixel-font mb-2">
                      Email Address
                    </label>
                    {/* Start: Email Input - Fixed multiline className */}
                    <input
                      type="email"
                      id="newsletter-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full px-3 py-2 border-2 border-cyan-400 rounded-none font-mono text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {/* End: Email Input */}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting || !email}
                    className={`
                      w-full py-2 px-4 font-bold pixel-font text-sm
                      border-2 border-pink-400 rounded-none
                      ${isSubmitting || !email 
                        ? 'bg-pink-300/50 cursor-not-allowed' 
                        : 'bg-pink-500 hover:bg-pink-600 text-white'
                      }
                      transition-all duration-200
                    `}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="animate-spin">⏳</span>
                        Subscribing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2 flash-animation">
                        ✨ Sign Up Now ✨
                      </span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold text-green-600 dark:text-green-400 pixel-font mb-2">
                  Successfully Subscribed!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 pixel-font text-sm">
                  Check your email for confirmation. Thanks for joining us!
                </p>
              </div>
            )}
            {/* End: Modal Content */}
          </div>
        </div>
      )}
      {/* End: Modal Overlay */}

      {/* Start: Custom Styles */}
      <style jsx>{`
        @keyframes flash {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .flash-animation {
          animation: flash 1.5s ease-in-out infinite;
        }
        @keyframes scale-in {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
      {/* End: Custom Styles */}
    </>
  );
}