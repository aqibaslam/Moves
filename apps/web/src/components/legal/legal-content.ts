/**
 * Legal copy for /privacy-policy and /terms — transcribed verbatim from the
 * Figma "New Moves Dental 2.0" frames "Privacy Policy – 2026, 24 Sep" and
 * "Terms of Service – 2026, 24 Sep" (node 1824:5838). Keep the wording in
 * sync with the design file; the page component only handles layout.
 */

export type LegalBlock =
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'group'; title: string; items: string[] };

export interface LegalSection {
  heading: string;
  blocks: LegalBlock[];
}

export interface LegalDoc {
  slug: 'privacy-policy' | 'terms';
  title: string;
  intro: string[];
  sections: LegalSection[];
}

export const PRIVACY_POLICY: LegalDoc = {
  slug: 'privacy-policy',
  title: 'Privacy Policy',
  intro: [
    'At MOVES, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website, book a consultation, or receive treatment through MOVES.',
    'By using our website or services, you agree to the practices described in this Privacy Policy',
  ],
  sections: [
    {
      heading: 'Introduction',
      blocks: [
        { type: 'p', text: 'At MOVES, we respect your privacy and are committed to protecting your personal information.' },
        { type: 'p', text: 'This Privacy Policy explains how we collect, use, and protect your information when you visit our website or use our services.' },
      ],
    },
    {
      heading: 'Information We Collect',
      blocks: [
        { type: 'group', title: 'Personal Information', items: ['Name', 'Email address', 'Phone number', 'Address', 'Payment information'] },
        { type: 'group', title: 'Dental Information', items: ['Smile assessment details', 'Dental history', 'Photos, scans, or treatment records'] },
        { type: 'group', title: 'Website Information', items: ['Device information', 'Browser information', 'Cookies and analytics data'] },
      ],
    },
    {
      heading: 'How We Use Your Information',
      blocks: [
        { type: 'p', text: 'We use your information to:' },
        {
          type: 'ul',
          items: [
            'Provide your MOVES treatment journey',
            'Create personalised aligner plans',
            'Communicate treatment updates',
            'Process payments',
            'Improve our services and website experience',
          ],
        },
      ],
    },
    {
      heading: 'Dental Information & Professionals',
      blocks: [
        { type: 'p', text: 'Your dental information may be reviewed by qualified dental professionals involved in your treatment.' },
        { type: 'p', text: 'We only share information where necessary to provide safe and effective care.' },
      ],
    },
    {
      heading: 'Sharing Your Information',
      blocks: [
        { type: 'p', text: 'We may share information with trusted partners, including:' },
        { type: 'ul', items: ['Dental professionals', 'Payment providers', 'Technology providers', 'Service partners'] },
        { type: 'p', text: 'We ensure your information is handled securely.' },
      ],
    },
    {
      heading: 'Cookies',
      blocks: [
        { type: 'p', text: 'MOVES uses cookies to improve website functionality, understand visitor behaviour, and provide a better user experience.' },
      ],
    },
    {
      heading: 'Keeping Your Information Secure',
      blocks: [
        { type: 'p', text: 'We take appropriate steps to protect your personal information from unauthorised access, loss, or misuse.' },
      ],
    },
    {
      heading: 'Your Rights',
      blocks: [
        { type: 'p', text: 'You may request:' },
        {
          type: 'ul',
          items: [
            'Access to your information',
            'Correction of incorrect information',
            'Deletion of your information where applicable',
            'Removal from marketing communications',
          ],
        },
      ],
    },
    {
      heading: 'Contact Us',
      blocks: [
        { type: 'p', text: 'If you have questions about this Privacy Policy or how your information is used, please contact MOVES.' },
      ],
    },
  ],
};

export const TERMS_OF_SERVICE: LegalDoc = {
  slug: 'terms',
  title: 'Terms of Service',
  intro: [
    'Welcome to MOVES',
    'These Terms explain the rules for using the MOVES website and receiving our clear aligner services.',
  ],
  sections: [
    {
      heading: 'Introduction',
      blocks: [
        { type: 'p', text: 'Welcome to MOVES. These Terms & Conditions explain the rules for using our website, booking consultations, and receiving clear aligner treatment through MOVES.' },
        { type: 'p', text: 'By accessing our website or starting treatment, you agree to these terms.' },
      ],
    },
    {
      heading: 'About MOVES',
      blocks: [
        { type: 'p', text: 'MOVES provides personalised clear aligner treatment designed around your smile goals. All treatment plans are reviewed by qualified dental professionals to ensure they are suitable for your needs.' },
      ],
    },
    {
      heading: 'Consultation & Treatment Process',
      blocks: [
        { type: 'p', text: 'Your MOVES journey includes:' },
        {
          type: 'ul',
          items: [
            'Initial consultation',
            'Smile assessment',
            'Personalised treatment planning',
            'Dentist approval',
            'Delivery of your custom aligners',
            'Progress monitoring',
          ],
        },
        { type: 'p', text: 'Treatment suitability will be determined by a qualified dental professional.' },
      ],
    },
    {
      heading: 'Your Responsibilities',
      blocks: [
        { type: 'p', text: 'To achieve the best possible results, you must:' },
        {
          type: 'ul',
          items: [
            'Provide accurate personal and dental information',
            'Follow your treatment instructions',
            'Wear your aligners as recommended',
            'Maintain good oral hygiene',
            'Attend required check-ins',
          ],
        },
      ],
    },
    {
      heading: 'Treatment Results',
      blocks: [
        { type: 'p', text: 'Every smile is unique. Treatment duration and results may vary depending on your individual circumstances and commitment to your treatment plan.' },
        { type: 'p', text: 'MOVES cannot guarantee identical results for every patient.' },
      ],
    },
    {
      heading: 'Payments & Orders',
      blocks: [
        { type: 'p', text: 'All treatment plans and aligners are personalised for each patient.' },
        { type: 'p', text: 'Payment details, pricing, and available options will be provided before treatment begins.' },
      ],
    },
    {
      heading: 'Cancellation & Refunds',
      blocks: [
        { type: 'p', text: 'Due to the personalised nature of clear aligner treatment, cancellation and refund eligibility may depend on the stage of your treatment.' },
        { type: 'p', text: 'Please contact our team if you need assistance.' },
      ],
    },
    {
      heading: 'Website Use',
      blocks: [
        { type: 'p', text: 'You agree not to misuse the MOVES website or copy any content, branding, images, or materials without permission.' },
      ],
    },
    {
      heading: 'Changes To These Terms',
      blocks: [
        { type: 'p', text: 'MOVES may update these Terms & Conditions from time to time. Updated versions will always be available on this page.' },
      ],
    },
    {
      heading: 'Contact Us',
      blocks: [{ type: 'p', text: 'If you have any questions about these Terms, please contact MOVES.' }],
    },
  ],
};
