import React from 'react';

export interface RiskAnalysis {
  isSafe: boolean;
  riskScore: number; // 0-100 (100 is high risk)
  brandDetected: string | null;
  rejectionReason?: string;
  ebayMarketPriceEstimate?: string;
}

export interface ProfitCalculation {
  sourcePrice: number;
  shippingCost: number;
  ebayFee: number; // ~13.25% + $0.30
  paypalFee: number; // If applicable
  marketingBudget: number;
  netProfit: number;
  listingPrice: number;
  marginPercent: string;
}

export interface ProductData {
  id: string;
  url: string;
  title: string;
  price: string;
  originalPrice?: string;
  rating?: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  category: string;
  riskAnalysis?: RiskAnalysis;
  profitCalculation?: ProfitCalculation;
  // New fields for Library Management
  status?: 'DRAFT' | 'READY' | 'PUBLISHED' | 'ARCHIVED';
  createdAt?: string;
}

export interface GeneratedContent {
  // eBay Structured Data for Templating
  ebayTitle: string;
  ebayPrice: string;
  ebayProductDescription: string; // Plain text description
  ebayFeatures: string[];
  ebayWhyBuy: string[];
  
  // Blogger
  blogTitle: string;
  blogContent: string; // HTML
  seoTags: string[];
  seoMetaDescription: string;
  seoScore: number;

  // Social Media Content
  facebookPost: string;
  instagramCaption: string;
  twitterThread: string[];
  tiktokScript: string;
}

export interface ActivityReport {
  id: string;
  date: string;
  action: 'SCAN' | 'EXPORT' | 'BLOCK' | 'PUBLISH' | 'EMAIL';
  productName: string;
  status: 'SUCCESS' | 'FAILED' | 'WARNING';
  details: string;
}

export interface ProductPerformance {
  id: string;
  title: string;
  image: string;
  listingDate: string;
  price: number;
  views: number;
  clicks: number;
  sales: number;
  revenue: number;
  status: 'ACTIVE' | 'ENDED';
}

export interface AppSettings {
  // Accounts & Credentials
  ebayEmail: string;
  ebayPassword?: string;
  isEbayConnected: boolean;

  bloggerEmail: string;
  bloggerPassword?: string;
  isBloggerConnected: boolean;

  facebookAccount: string;
  facebookPassword?: string;
  isFacebookConnected: boolean;

  instagramAccount: string;
  instagramPassword?: string;
  isInstagramConnected: boolean;
  
  // Automation Rules
  autoModeEnabled: boolean; // General Master Switch
  minProfitMargin: number; // e.g., 20%
  dailyLimit: number; // Max products per day
  
  // Toggles
  autoPublishEbay: boolean;
  autoPublishBlog: boolean;
  autoPostSocial: boolean;
  
  // Filters
  excludeBrands: string; // Comma separated

  // Email Notifications (SendGrid)
  enableEmailNotifications: boolean;
  sendGridApiKey: string;
  notificationEmail: string; // Receiver
  notifyOnHighProfit: boolean;
  notifyOnVero: boolean;
  notifyOnExportSuccess: boolean;
}

export enum AppState {
  DASHBOARD = 'DASHBOARD',
  EXTRACTOR = 'EXTRACTOR',
  LIBRARY = 'LIBRARY', // New State
  EBAY_PREVIEW = 'EBAY_PREVIEW',
  BLOGGER_PREVIEW = 'BLOGGER_PREVIEW',
  SOCIAL_MEDIA = 'SOCIAL_MEDIA',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS',
}

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  color: string;
}