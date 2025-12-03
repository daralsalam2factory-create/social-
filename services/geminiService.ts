import { GoogleGenAI, Type } from "@google/genai";
import { ProductData, GeneratedContent, RiskAnalysis, ProfitCalculation } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = 'gemini-2.5-flash';

// Helper to clean JSON string if Markdown code blocks are present
const cleanJsonString = (str: string) => {
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const parseProductInfo = async (rawText: string): Promise<Partial<ProductData>> => {
  try {
    const prompt = `
      You are an expert e-commerce data extractor and risk analyst. 
      Analyze the following raw text from an e-commerce site (AliExpress, Amazon, etc.).
      
      Task 1: Extract structured data.
      Task 2: Perform a strict 'eBay VeRO' (Verified Rights Owner) check.
      - DETECT if this is a branded item (Nike, Apple, Samsung, Gucci, Disney, Marvel, Sony, etc.).
      - DETECT if it is a knock-off or replica.
      - DETECT Chinese brands known to enforce IP on eBay.
      
      Task 3: Estimate market value.
      - Estimate what this item typically sells for on eBay US.

      Raw Text:
      ${rawText.substring(0, 5000)}

      Return JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            price: { type: Type.STRING },
            originalPrice: { type: Type.STRING },
            description: { type: Type.STRING },
            specs: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  key: { type: Type.STRING },
                  value: { type: Type.STRING }
                }
              }
            },
            category: { type: Type.STRING },
            riskAnalysis: {
                type: Type.OBJECT,
                properties: {
                    isSafe: { type: Type.BOOLEAN },
                    riskScore: { type: Type.NUMBER },
                    brandDetected: { type: Type.STRING },
                    rejectionReason: { type: Type.STRING },
                    ebayMarketPriceEstimate: { type: Type.STRING }
                }
            }
          }
        }
      }
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(cleanJsonString(text));
    
    // Transform specs array to Record<string, string>
    if (parsed.specs && Array.isArray(parsed.specs)) {
      const specsRecord: Record<string, string> = {};
      parsed.specs.forEach((item: any) => {
        if (item.key && item.value) {
          specsRecord[item.key] = item.value;
        }
      });
      parsed.specs = specsRecord;
    }

    return parsed;
  } catch (error) {
    console.error("Error parsing product info:", error);
    throw new Error("فشل في استخراج بيانات المنتج. يرجى المحاولة مرة أخرى.");
  }
};

export const calculateSmartPricing = (sourcePriceStr: string, marketPriceEstimateStr?: string): ProfitCalculation => {
    // Remove currency symbols and convert to number
    const cleanPrice = (p: string) => parseFloat(p.replace(/[^0-9.]/g, '')) || 0;
    
    const sourcePrice = cleanPrice(sourcePriceStr);
    const estimatedMarketPrice = marketPriceEstimateStr ? cleanPrice(marketPriceEstimateStr) : sourcePrice * 2;
    
    // Configurable Constants
    const SHIPPING_BUFFER = 5.00; // Extra buffer for shipping fluctuation
    const EBAY_FEE_RATE = 0.135; // 13.5%
    const FIXED_FEE = 0.30;
    const MIN_PROFIT_MARGIN = 0.20; // 20% Net Profit target

    // Logic: Try to undercut market price by 5%, but maintain min profit margin
    let targetListingPrice = estimatedMarketPrice * 0.95;
    
    // Calculate costs at this target price
    let ebayFee = (targetListingPrice * EBAY_FEE_RATE) + FIXED_FEE;
    let netProfit = targetListingPrice - sourcePrice - SHIPPING_BUFFER - ebayFee;

    // Check if profit is too low
    if (netProfit / sourcePrice < MIN_PROFIT_MARGIN) {
        // Enforce Minimum Price based on Cost + Margin
        // Formula: Sale = (Cost + Ship + 0.30) / (1 - FeeRate - MarginRate)
        const totalFixedCost = sourcePrice + SHIPPING_BUFFER + FIXED_FEE;
        const divisor = 1 - EBAY_FEE_RATE - MIN_PROFIT_MARGIN;
        targetListingPrice = totalFixedCost / divisor;
        
        // Recalculate
        ebayFee = (targetListingPrice * EBAY_FEE_RATE) + FIXED_FEE;
        netProfit = targetListingPrice - sourcePrice - SHIPPING_BUFFER - ebayFee;
    }

    return {
        sourcePrice: parseFloat(sourcePrice.toFixed(2)),
        shippingCost: parseFloat(SHIPPING_BUFFER.toFixed(2)),
        ebayFee: parseFloat(ebayFee.toFixed(2)),
        paypalFee: 0,
        marketingBudget: parseFloat((targetListingPrice * 0.05).toFixed(2)), // 5% for Promoted Listings
        listingPrice: parseFloat(targetListingPrice.toFixed(2)),
        netProfit: parseFloat(netProfit.toFixed(2)),
        marginPercent: ((netProfit / targetListingPrice) * 100).toFixed(1) + '%'
    };
};

export const generateMarketingContent = async (product: ProductData): Promise<GeneratedContent> => {
  try {
    const prompt = `
      Act as a world-class marketing strategist and senior copywriter.
      I have a product that I want to sell on eBay, write a blog post about, and launch a full social media campaign for.
      The target audience speaks Arabic. Use persuasive, emotional, and high-converting language.
      
      Product Details:
      Title: ${product.title}
      Price: ${product.profitCalculation?.listingPrice || product.price}
      Specs: ${JSON.stringify(product.specs)}
      Description: ${product.description}
      
      Task 1: eBay Listing (High Conversion - Structured Data for Templates)
      - Title: Max 80 chars, keyword-stuffed, attention-grabbing. English Language for eBay US.
      - Price: Use the calculated listing price: ${product.profitCalculation?.listingPrice || product.price}.
      - Product Description: A persuasive paragraph describing the product's value (English).
      - Features: List of 5 key selling points (English).
      - Why Buy: List of 3 reasons to buy from us (English).
      
      Task 2: Blogger Post (SEO Optimized) - IN ARABIC
      - Title: Viral clickbait-style title.
      - Content: HTML format (approx 600 words). Use H2, H3 tags. Focus on solving a problem.
      - SEO Tags: 10 high-traffic keywords.
      - Meta Description: SEO optimized summary (160 chars).
      - SEO Score: Estimated score out of 100 based on keyword potential.
      
      Task 3: Social Media Campaign (Viral Strategy) - IN ARABIC
      - Facebook Post: Engaging, asks a question, uses emojis, focuses on social proof/value. Includes call to action.
      - Instagram Caption: Aesthetic, lifestyle-focused, uses bullet points for benefits. Include 20 trending hashtags.
      - Twitter Thread: A list of 3 tweets. Tweet 1: Hook. Tweet 2: Value/Proof. Tweet 3: CTA link.
      - TikTok Script: A short 30-second script. [Scene]: Visual direction. [Audio]: Voiceover text. Hook -> Problem -> Solution -> CTA.
      
      Return the result as JSON.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ebayTitle: { type: Type.STRING },
            ebayPrice: { type: Type.STRING },
            ebayProductDescription: { type: Type.STRING },
            ebayFeatures: { type: Type.ARRAY, items: { type: Type.STRING } },
            ebayWhyBuy: { type: Type.ARRAY, items: { type: Type.STRING } },
            
            blogTitle: { type: Type.STRING },
            blogContent: { type: Type.STRING },
            seoTags: { type: Type.ARRAY, items: { type: Type.STRING } },
            seoMetaDescription: { type: Type.STRING },
            seoScore: { type: Type.NUMBER },
            
            facebookPost: { type: Type.STRING },
            instagramCaption: { type: Type.STRING },
            twitterThread: { type: Type.ARRAY, items: { type: Type.STRING } },
            tiktokScript: { type: Type.STRING },
          }
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(cleanJsonString(text));
  } catch (error) {
    console.error("Error generating content:", error);
    throw new Error("فشل في توليد المحتوى التسويقي.");
  }
};