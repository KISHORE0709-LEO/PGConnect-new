// Google AI (Gemini) service for intelligent responses
import knowledgeBase from './knowledge-base.txt?raw';

export class GeminiAIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
  private knowledgeBase: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.knowledgeBase = knowledgeBase;
  }

  async generateResponse(userMessage: string): Promise<string> {
    if (!this.apiKey) {
      return this.getKnowledgeBasedResponse(userMessage);
    }

    try {
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `You are a helpful AI assistant for PGConnect. Use this knowledge base to answer questions accurately:

${this.knowledgeBase}

User Question: ${userMessage}

Provide a helpful, accurate response based on the knowledge base above. If the question is not covered in the knowledge base, provide a general helpful response about PGConnect.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (aiText && aiText.trim()) {
          return aiText.trim();
        }
      }
    } catch (error) {
      console.log('Using knowledge-based fallback');
    }

    return this.getKnowledgeBasedResponse(userMessage);
  }

  private getKnowledgeBasedResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();

    // Multiple PGs question
    if (msg.includes('multiple') && (msg.includes('pg') || msg.includes('property'))) {
      return `Yes! PGConnect supports multiple PG management:

✅ Add unlimited properties to your owner account
✅ Manage all properties from single dashboard
✅ Individual analytics for each property
✅ Separate tenant tracking per PG
✅ Bulk operations across properties
✅ Consolidated revenue reporting

Each PG gets its own building visualizer, tenant management, and booking system. Perfect for PG business owners with multiple locations!`;
    }

    // Login questions
    if (msg.includes('login') || msg.includes('sign in') || msg.includes('account')) {
      return `Login to PGConnect:

🎓 Students:
• Click "Student Login" on homepage
• Sign in with Google account
• Access dashboard to search PGs, find roommates

🏢 PG Owners:
• Click "Owner Login" on homepage  
• Sign in with Google account
• Access property management dashboard

🔐 Security Features:
• Firebase Authentication
• Google OAuth integration
• Secure session management
• Separate dashboards for students/owners

First time? Click "Sign Up" to create your account!`;
    }

    // Launch/Start PG
    if (msg.includes('launch') || msg.includes('start') || msg.includes('create') || msg.includes('register')) {
      return `To launch your PG on PGConnect:

1. Sign up as PG Owner on our platform
2. Add property details (location, amenities, pricing)
3. Upload high-quality photos of rooms
4. Configure building layout using our interactive visualizer
5. Set room sharing options and availability
6. Publish your listing to go live
7. Manage tenants and payments through dashboard

Our platform supports flexible building configuration, automated rent reminders, and comprehensive tenant management. Would you like help with any specific step?`;
    }

    // Technical questions
    if (msg.includes('technology') || msg.includes('tech') || msg.includes('built') || msg.includes('framework')) {
      return `PGConnect is built with modern technology:

Frontend:
• React 18 + TypeScript for robust development
• Tailwind CSS for responsive design
• Vite for fast build and development
• Radix UI for accessible components

Backend:
• Node.js + Express server
• PostgreSQL database
• Firebase Firestore for real-time data
• Firebase Auth with Google OAuth

Key Features:
• Google Pay integration for payments
• Real-time data synchronization
• Mobile-responsive design
• Interactive building visualization`;
    }

    // Roommate matching
    if (msg.includes('roommate') || msg.includes('match') || msg.includes('compatible')) {
      return `Our AI Roommate Matching is a 4-step process:

1. Lifestyle Preferences
   • Food habits (veg/non-veg/both)
   • Sleep schedule (early/normal/night owl)
   • Smoking and drinking habits

2. Living Standards
   • Cleanliness level (1-10 scale)
   • Noise tolerance
   • Social preferences

3. Interests & Hobbies
   • Personal interests and hobbies
   • Personality type
   • Study habits

4. Additional Preferences
   • Sharing preference
   • Guest policy
   • Pet-friendly options

Our algorithm analyzes all factors to provide 90%+ compatibility matches. Click "AI Roommate Finder" on Student Dashboard to start!`;
    }

    // Pricing questions
    if (msg.includes('price') || msg.includes('cost') || msg.includes('rent') || msg.includes('budget')) {
      return `PG Pricing in Bangalore:

Budget Categories:
• Budget Range: ₹5,000-8,000/month
• Standard Range: ₹8,000-15,000/month
• Premium Range: ₹15,000-25,000/month

Location-wise Pricing:
• Electronic City: ₹6,000-12,000
• Koramangala: ₹10,000-20,000
• Whitefield: ₹7,000-15,000
• Jayanagar: ₹8,000-16,000
• BTM Layout: ₹7,000-14,000

Pricing varies based on amenities, room sharing, and proximity to colleges. Use our smart filters to find PGs within your budget range!`;
    }

    // Building visualizer
    if (msg.includes('building') || msg.includes('visualizer') || msg.includes('room') || msg.includes('floor')) {
      return `Our Interactive Building Visualizer offers:

Key Features:
• Floor-by-floor visualization
• Room-wise occupancy display (e.g., 2/3 occupied)
• Color-coded payment status:
  - Green: All tenants paid
  - Yellow: Partial payments
  - Red: Rent pending
  - Gray: Room vacant

Management Tools:
• Hover tooltips with tenant information
• Click-to-manage room details
• Add/remove tenants directly
• Mark payments as received
• Send automated rent reminders
• Direct communication (call, email, WhatsApp)

This transforms traditional spreadsheet-based tracking into an intuitive, visual management system!`;
    }

    // Colleges
    if (msg.includes('college') || msg.includes('university') || msg.includes('nmit') || msg.includes('rvce')) {
      return `PGConnect serves students from major Bangalore colleges:

Target Colleges:
• NMIT (Nitte Meenakshi Institute of Technology)
• RVCE (R.V. College of Engineering)
• IISc (Indian Institute of Science)
• BMSIT (BMS Institute of Technology)
• RNSIT (RNS Institute of Technology)
• GITAM University
• Other major Bangalore institutions

Features for Students:
• Smart search with college proximity filters
• PGs located near campus with easy transportation
• Distance-based filtering
• College-specific recommendations

Which college are you looking for PGs near?`;
    }

    // Amenities
    if (msg.includes('amenities') || msg.includes('facilities') || msg.includes('features')) {
      return `PGConnect offers comprehensive amenity filtering:

Common Amenities:
• WiFi & Power Backup
• AC & Attached Bathrooms
• Food & Laundry Services
• Security & CCTV
• Parking & Common Areas

Premium Features:
• Gym & Recreation facilities
• Study Rooms
• Housekeeping services
• 24/7 security
• Modern furnishing

Filter by specific amenities to find PGs that match your lifestyle needs. All amenities are verified and regularly updated!`;
    }

    // Booking process
    if (msg.includes('book') || msg.includes('reserve') || msg.includes('payment')) {
      return `Booking a PG on PGConnect is simple:

1. Browse & Filter
   • Use location, price, amenities filters
   • View detailed property information

2. Connect & Visit
   • Contact PG owner directly (call/email/WhatsApp)
   • Schedule property visit

3. Secure Booking
   • Complete booking with Google Pay integration
   • Submit required documents
   • Receive booking confirmation

4. Move In
   • Get move-in support
   • Access ongoing customer service

Payment Options: Google Pay, UPI, bank transfers
Security Deposit: Typically 1-2 months rent

Need help with any specific step?`;
    }

    // Inappropriate questions
    if (msg.includes('girlfriend') || msg.includes('boyfriend') || msg.includes('personal') || msg.includes('relationship')) {
      return `I'm here to help with PGConnect!

As a modern PG accommodation platform, I can assist you with:

• Student Services: Smart PG search, AI roommate matching, booking process
• Owner Tools: Property management, building visualizer, tenant tracking  
• Platform Info: Pricing, amenities, colleges, technical details
• General Support: Any questions about student housing

PGConnect serves major Bangalore colleges with features like interactive building visualization, Google Pay booking, and real-time availability tracking.

What specific information would you like to know?`;
    }

    // Gemini integration questions
    if (msg.includes('gemini') || msg.includes('ai') || msg.includes('integrate')) {
      return `Yes! PGConnect integrates Google Gemini AI:

🤖 AI Features:
• Intelligent chat responses using Gemini Pro
• Comprehensive knowledge base integration
• Smart roommate compatibility matching
• Automated property recommendations
• Natural language query processing

🔧 Technical Implementation:
• Google Generative AI API
• Fallback to knowledge-based responses
• Real-time response generation
• Context-aware conversations

The AI helps both students find perfect PGs and owners manage properties efficiently!`;
    }

    // General greeting
    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
      return `Hello! I'm Chitti, your AI assistant powered by Google Gemini.

I can help you with:
• Finding perfect PGs near your college
• Understanding our AI roommate matching
• Booking process and payments
• Owner property management tools
• Pricing and amenities information
• Technical details about our platform

PGConnect connects students with quality PG accommodations using smart search, AI matching, and interactive management tools. What would you like to know?`;
    }

    // Default response with knowledge base context
    return `I'm here to help with PGConnect!

As a modern PG accommodation platform, I can assist you with:

• Student Services: Smart PG search, AI roommate matching, booking process
• Owner Tools: Property management, building visualizer, tenant tracking
• Platform Info: Pricing, amenities, colleges, technical details
• General Support: Any questions about student housing

PGConnect serves major Bangalore colleges with features like interactive building visualization, Google Pay booking, and real-time availability tracking.

What specific information would you like to know?`;
  }
}

export const geminiAI = new GeminiAIService();