import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface PrivacySection {
  id: string;
  title: string;
  content: string[];
}

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.html',
  styleUrls: ['./privacy-policy.scss']
})
export class PrivacyPolicyComponent {
  lastUpdated = 'June 28, 2025';
  
  // Table of contents for quick navigation
  sections: PrivacySection[] = [
    {
      id: 'introduction',
      title: '1. Introduction',
      content: [
        'Welcome to JSON Formatter. We respect your privacy and are committed to protecting your personal data. This privacy policy will inform you about how we handle your data when you use our website and tell you about your privacy rights and how the law protects you.'
      ]
    },
    {
      id: 'data-collection',
      title: '2. Data We Collect',
      content: [
        'We want to be completely transparent about the data we collect:',
        '• No personal data is collected when you use JSON Formatter.',
        '• All JSON data you process is handled entirely in your browser and never sent to our servers.',
        '• We do not use cookies or any other tracking technologies.'
      ]
    },
    {
      id: 'data-usage',
      title: '3. How We Use Your Data',
      content: [
        'Since we do not collect or store your data, there is no usage of your personal information. All processing happens locally in your browser.',
        '• Your JSON data is never transmitted to our servers.',
        '• We do not track your usage patterns or behaviors on our site.',
        '• No analytics or performance data is collected.'
      ]
    },
    {
      id: 'data-protection',
      title: '4. Data Protection',
      content: [
        'We implement appropriate technical measures to ensure a level of security appropriate to the risk:',
        '• All data processing happens locally in your browser.',
        '• We use HTTPS to secure data in transit if any data were to be transmitted (though none is).',
        '• Since we do not store any data, there is no risk of data breaches from our servers.'
      ]
    },
    {
      id: 'third-party-services',
      title: '5. Third-Party Services',
      content: [
        'Our website may contain links to third-party websites, plug-ins, and applications. Clicking on those links may allow third parties to collect or share data about you. We do not control these third-party websites and are not responsible for their privacy statements.',
        'The only third-party services we use are:',
        '• Cloudflare (for DDoS protection and CDN services)',
        '• Google Fonts (for typography)'
      ]
    },
    {
      id: 'your-rights',
      title: '6. Your Legal Rights',
      content: [
        'Under certain circumstances, you have rights under data protection laws in relation to your personal data:',
        '• Request access to your personal data.',
        '• Request correction of your personal data.',
        '• Request erasure of your personal data.',
        '• Object to processing of your personal data.',
        '• Request restriction of processing your personal data.',
        '• Request transfer of your personal data.',
        '• Right to withdraw consent.',
        'Since we do not collect or store any personal data, these rights are inherently protected.'
      ]
    },
    {
      id: 'changes',
      title: '7. Changes to This Privacy Policy',
      content: [
        'We may update this privacy policy from time to time. The updated version will be indicated by an updated "Last updated" date at the top of this privacy policy. We encourage you to review this privacy policy frequently to be informed of how we are protecting your information.'
      ]
    },
    {
      id: 'contact',
      title: '8. Contact Us',
      content: [
        'If you have any questions about this privacy policy or our privacy practices, please contact us at:',
        'Email: privacy@jsonformatter.example.com',
        'Mailing Address: [Your Company Address]',
        'We aim to respond to all legitimate requests within 30 days.'
      ]
    }
  ];

  // Scroll to section when clicking on table of contents
  scrollTo(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
