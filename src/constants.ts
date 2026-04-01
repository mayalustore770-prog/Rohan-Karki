import { GoogleService } from './types';

export const GOOGLE_SERVICES: GoogleService[] = [
  {
    id: 'youtube-premium',
    name: 'YouTube Premium',
    description: 'Everything you love about YouTube, ad-free and uninterrupted.',
    features: [
      'Ad-free videos',
      'Download for offline viewing',
      'Background play',
      'YouTube Music Premium included'
    ],
    icon: 'Youtube',
    color: '#FF0000',
    trialPeriod: '1 month free',
    ctaUrl: 'https://www.youtube.com/premium'
  },
  {
    id: 'google-one',
    name: 'Google One',
    description: 'More storage, expert support, and more — all in one plan.',
    features: [
      'Up to 30TB of storage',
      'Advanced photo editing tools',
      'VPN for multiple devices',
      'Dark web monitoring'
    ],
    icon: 'Cloud',
    color: '#4285F4',
    trialPeriod: '1 month free',
    ctaUrl: 'https://one.google.com/about'
  },
  {
    id: 'google-workspace',
    name: 'Google Workspace',
    description: 'Professional tools to help you do your best work, together.',
    features: [
      'Custom business email',
      'Enhanced security and management',
      'Advanced video conferencing',
      'Shared drives for teams'
    ],
    icon: 'Briefcase',
    color: '#34A853',
    trialPeriod: '14 days free',
    ctaUrl: 'https://workspace.google.com'
  },
  {
    id: 'play-pass',
    name: 'Google Play Pass',
    description: 'Hundreds of games and apps, completely free of ads and in-app purchases.',
    features: [
      'No ads or in-app purchases',
      'New games added monthly',
      'Share with up to 5 family members',
      'Premium titles included'
    ],
    icon: 'Gamepad2',
    color: '#FBBC05',
    trialPeriod: '1 month free',
    ctaUrl: 'https://play.google.com/about/playpass/'
  },
  {
    id: 'fitbit-premium',
    name: 'Fitbit Premium',
    description: 'Personalized health and fitness insights to help you reach your goals.',
    features: [
      'Daily Readiness Score',
      'Advanced sleep analytics',
      'Stress Management Score',
      'Guided workouts and mindfulness'
    ],
    icon: 'Activity',
    color: '#00B0B9',
    trialPeriod: '90 days free',
    ctaUrl: 'https://www.fitbit.com/global/us/products/services/premium'
  }
];
