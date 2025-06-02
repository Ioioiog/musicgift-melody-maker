
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LegalModalsProps {
  t: (key: string) => string;
}

const LegalModals = ({ t }: LegalModalsProps) => {
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [refundOpen, setRefundOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);

  return (
    <>
      {/* Terms & Conditions Modal */}
      <Dialog open={termsOpen} onOpenChange={setTermsOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('termsConditions')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">1. Agreement to Terms</h3>
              <p>By accessing and using MusicGift services, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>
            
            <section>
              <h3 className="text-lg font-semibold mb-3">2. Service Description</h3>
              <p>MusicGift provides personalized musical gifts creation services. We create custom songs based on your specifications and deliver them digitally.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">3. User Responsibilities</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information for song creation</li>
                <li>Respect intellectual property rights</li>
                <li>Use the service for lawful purposes only</li>
                <li>Not share login credentials with others</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">4. Payment Terms</h3>
              <p>Payment is required in full before service delivery. All prices are in Romanian Lei (RON) and include applicable taxes.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">5. Intellectual Property</h3>
              <p>The final musical creation becomes your property upon full payment. However, we retain the right to use anonymized examples for promotional purposes.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">6. Limitation of Liability</h3>
              <p>MusicGift's liability is limited to the amount paid for the service. We are not responsible for indirect or consequential damages.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Modal */}
      <Dialog open={privacyOpen} onOpenChange={setPrivacyOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('privacyPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">Data Collection</h3>
              <p>We collect information you provide when creating your musical gift, including personal details, preferences, and payment information.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">How We Use Your Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Create personalized musical content</li>
                <li>Process payments and deliver services</li>
                <li>Communicate about your order</li>
                <li>Improve our services</li>
                <li>Send marketing communications (with consent)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
              <p>We implement appropriate security measures to protect your personal information. Data is encrypted in transit and at rest.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Third-Party Services</h3>
              <p>We may use third-party services for payment processing, analytics, and email communications. These services have their own privacy policies.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal data</li>
                <li>Correct inaccurate information</li>
                <li>Request data deletion</li>
                <li>Withdraw consent for marketing</li>
                <li>Data portability</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Contact</h3>
              <p>For privacy-related questions, contact us at mihai.gruia@mangorecords.net</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Refund Policy Modal */}
      <Dialog open={refundOpen} onOpenChange={setRefundOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('refundPolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">Refund Eligibility</h3>
              <p>Refunds are available under specific circumstances due to the personalized nature of our services.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">When Refunds Apply</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical issues preventing delivery</li>
                <li>Significant deviation from specified requirements</li>
                <li>Service not delivered within promised timeframe</li>
                <li>Cancellation within 24 hours of order placement (before work begins)</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Refund Process</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact our support team within 7 days of delivery</li>
                <li>Provide detailed explanation of the issue</li>
                <li>Allow up to 48 hours for review</li>
                <li>Approved refunds processed within 5-10 business days</li>
              </ol>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Non-Refundable Situations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Change of mind after delivery</li>
                <li>Dissatisfaction with artistic style (within specifications)</li>
                <li>Orders already completed and delivered</li>
                <li>Custom requests that were accurately fulfilled</li>
              </ul>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Partial Refunds</h3>
              <p>In some cases, partial refunds may be offered for services that partially meet requirements but have minor issues.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Cookie Policy Modal */}
      <Dialog open={cookieOpen} onOpenChange={setCookieOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border border-gray-200">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-4">
              {t('cookiePolicy')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <section>
              <h3 className="text-lg font-semibold mb-3">What Are Cookies</h3>
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better user experience.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Types of Cookies We Use</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Essential Cookies</h4>
                  <p className="text-sm">Required for basic website functionality, including authentication and security.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Analytics Cookies</h4>
                  <p className="text-sm">Help us understand how visitors interact with our website to improve user experience.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Preference Cookies</h4>
                  <p className="text-sm">Remember your language preferences and other settings.</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Marketing Cookies</h4>
                  <p className="text-sm">Used to deliver relevant advertisements and track campaign effectiveness.</p>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Managing Cookies</h3>
              <p>You can control cookies through your browser settings. However, disabling certain cookies may affect website functionality.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Third-Party Cookies</h3>
              <p>We may use third-party services that set their own cookies, including payment processors and analytics providers.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold mb-3">Updates</h3>
              <p>This cookie policy may be updated periodically. Changes will be posted on this page with the effective date.</p>
            </section>
          </div>
        </DialogContent>
      </Dialog>

      {/* Trigger Functions - exposed for Footer to use */}
      <div className="hidden">
        <button onClick={() => setTermsOpen(true)} id="terms-trigger" />
        <button onClick={() => setPrivacyOpen(true)} id="privacy-trigger" />
        <button onClick={() => setRefundOpen(true)} id="refund-trigger" />
        <button onClick={() => setCookieOpen(true)} id="cookie-trigger" />
      </div>
    </>
  );
};

// Export the trigger functions for Footer to use
export const useLegalModals = () => {
  return {
    openTerms: () => document.getElementById('terms-trigger')?.click(),
    openPrivacy: () => document.getElementById('privacy-trigger')?.click(),
    openRefund: () => document.getElementById('refund-trigger')?.click(),
    openCookie: () => document.getElementById('cookie-trigger')?.click(),
  };
};

export default LegalModals;
