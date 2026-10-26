import { site } from './site';
import { services } from './services';

export interface ActionButton {
  label: string;
  type: 'link' | 'whatsapp' | 'call' | 'query';
  href?: string;
  query?: string;
  icon?: 'whatsapp' | 'phone' | 'external' | 'calendar' | 'mail';
}

export interface ChatResponse {
  text: string;
  actions?: ActionButton[];
  suggestions?: string[];
}

export interface QuickSuggestion {
  label: string;
  query: string;
}

export const INITIAL_SUGGESTIONS: QuickSuggestion[] = [
  { label: '✨ Our Services', query: 'What services do you provide?' },
  { label: '💍 Wedding Planning', query: 'Tell me about wedding planning' },
  { label: '🏢 Corporate Events', query: 'Corporate events and conferences' },
  { label: '🌟 Celebrity & Artist', query: 'Celebrity and artist booking' },
  { label: '💰 Pricing & Quotation', query: 'How much does an event cost?' },
  { label: '📍 Office Location', query: 'Where is your office located?' },
  { label: '📞 Contact Team', query: 'How can I contact Creativatorss?' },
];

export const FALLBACK_ACTIONS: ActionButton[] = [
  {
    label: '💬 Chat on WhatsApp',
    type: 'whatsapp',
    href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hello Creativatorss! I have an event inquiry and would like to talk to your team.')}`,
    icon: 'whatsapp'
  },
  {
    label: `📞 Call Us (${site.phone})`,
    type: 'call',
    href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`,
    icon: 'phone'
  },
  {
    label: '📋 Submit Event Enquiry Form',
    type: 'link',
    href: '/contact',
    icon: 'external'
  }
];

// Helper to normalize user string for comparison
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Intent matchers
export function getChatbotResponse(userMessage: string): ChatResponse {
  const norm = normalize(userMessage);

  if (!norm) {
    return {
      text: 'Namaste! Aap Creativatorss se related koi bhi sawaal pooch sakte hain. How can I help you today?',
      suggestions: INITIAL_SUGGESTIONS.map(s => s.query)
    };
  }

  // Check for phone number detection (User submitting their number for callback)
  const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{9}/;
  const phoneMatch = userMessage.match(phoneRegex);
  if (phoneMatch && (norm.includes('call') || norm.includes('contact') || norm.includes('number') || norm.includes('callback') || norm.includes('mera') || norm.includes('phone') || norm.length < 25)) {
    const detectedPhone = phoneMatch[0];
    return {
      text: `Bahut badhiya! Humne aapka contact number (${detectedPhone}) note kar liya hai. Hamari event management team jald hi aapse contact karegi.\n\nAap chahein toh turant WhatsApp par bhi connect kar sakte hain:`,
      actions: [
        {
          label: '💬 Connect on WhatsApp Now',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi, I left my contact number ${detectedPhone} on your website. Please connect with me regarding event planning.`)}`,
          icon: 'whatsapp'
        },
        {
          label: '📞 Call Directly Now',
          type: 'call',
          href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`,
          icon: 'phone'
        }
      ]
    };
  }

  // 1. GREETINGS
  if (/^(hi|hello|hey|namaste|hlo|helo|hy|hola|good\s*(morning|afternoon|evening)|kya\s*haal|kem\s*cho|sat\s*sri\s*akal|ss|salam)/i.test(norm)) {
    return {
      text: `Hello! Welcome to **Creativatorss Event & Production**! ✨\n\nMain aapka personal event assistant hoon. Aap Creativatorss ki services, wedding planning, corporate events, celebrity booking, pricing ya booking process ke baare me kuch bhi pooch sakte hain.\n\nAap kis tarah ke event ke baare mein jaanna chahte hain?`,
      suggestions: [
        'What services do you offer?',
        'Tell me about Wedding Planning',
        'Corporate Events & Conferences',
        'How can I get a quote?'
      ],
      actions: [
        { label: 'View All Services', type: 'link', href: '/services', icon: 'external' },
        { label: '💬 Chat on WhatsApp', type: 'whatsapp', href: `https://wa.me/${site.whatsapp}`, icon: 'whatsapp' }
      ]
    };
  }

  // 2. CONTACT DETAILS / PHONE / EMAIL / WHATSAPP
  if (
    norm.includes('contact') ||
    norm.includes('phone') ||
    norm.includes('mobile') ||
    norm.includes('number') ||
    norm.includes('email') ||
    norm.includes('mail') ||
    norm.includes('whatsapp') ||
    norm.includes('call') ||
    norm.includes('baat karni') ||
    norm.includes('kaise contact') ||
    norm.includes('reach out') ||
    norm.includes('talk to')
  ) {
    return {
      text: `Aap Creativatorss team se direct in madhyamon se jud sakte hain:\n\n` +
        `📞 **Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')}) / [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n` +
        `💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})\n` +
        `✉️ **Email**: [${site.email}](mailto:${site.email})\n` +
        `📍 **Office**: ${site.address.join(', ')}\n\n` +
        `Hamari team aam taur par turant reply karti hai!`,
      actions: [
        {
          label: '💬 Chat on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I would like to discuss an event.')}`,
          icon: 'whatsapp'
        },
        {
          label: `📞 Call Now (${site.phone})`,
          type: 'call',
          href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`,
          icon: 'phone'
        },
        {
          label: '📋 Open Contact Form',
          type: 'link',
          href: '/contact',
          icon: 'calendar'
        }
      ]
    };
  }

  // 3. OFFICE LOCATION / ADDRESS / CITY / WHERE ARE YOU LOCATED
  if (
    norm.includes('address') ||
    norm.includes('location') ||
    norm.includes('where are you') ||
    norm.includes('office') ||
    norm.includes('kahan hai') ||
    norm.includes('kaha hai') ||
    norm.includes('kahan pe') ||
    norm.includes('city') ||
    norm.includes('sector 34') ||
    norm.includes('chandigarh') ||
    norm.includes('map')
  ) {
    return {
      text: `📍 **Creativatorss Head Office Address:**\n\n` +
        `**Creativatorss Event & Production**\n` +
        `${site.address[0]},\n` +
        `${site.address[1]}.\n\n` +
        `✦ **Coverage**: Hum Chandigarh ke alawa **Pan-India (25+ cities)** jaise Delhi NCR, Mumbai, Jaipur, Rajasthan, Punjab aur Himachal me events organize karte hain!`,
      actions: [
        {
          label: '🗺️ Open in Google Maps',
          type: 'link',
          href: site.addressMapUrl,
          icon: 'external'
        },
        {
          label: '💬 Contact for Event at Your City',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi, I want to inquire about organizing an event in my city.')}`,
          icon: 'whatsapp'
        }
      ],
      suggestions: [
        'Do you organize events outside Chandigarh?',
        'How early should I book?',
        'Plan Your Event'
      ]
    };
  }

  // 4. OUTSIDE CHANDIGARH / OTHER CITIES
  if (
    norm.includes('outside') ||
    norm.includes('other cities') ||
    norm.includes('delhi') ||
    norm.includes('mumbai') ||
    norm.includes('jaipur') ||
    norm.includes('pan india') ||
    norm.includes('punjab') ||
    norm.includes('destination') ||
    norm.includes('kisi aur shahar') ||
    norm.includes('bahar')
  ) {
    return {
      text: `Haan, bilkul! **Creativatorss pan-India level par kaam karta hai.** 🇮🇳\n\n` +
        `Humne ab tak **25+ cities** (Delhi NCR, Mumbai, Chandigarh, Ludhiana, Amritsar, Jaipur, Udaipur, Goa, etc.) me 500+ events successfully execute kiye hain.\n\n` +
        `Chahe destination wedding ho, corporate conference ho, ya brand tour ho — hamari full production team aapke sheher mein pahunch kar seamless execution karti hai.`,
      actions: [
        {
          label: '💬 Discuss Event in Your City',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hello Creativatorss, I need an event organized in my city.')}`,
          icon: 'whatsapp'
        },
        { label: 'View Our Portfolio', type: 'link', href: '/events', icon: 'external' }
      ]
    };
  }

  // 5. WEDDING PLANNING / SHAADI / DESTINATION WEDDING
  if (
    norm.includes('wedding') ||
    norm.includes('shaadi') ||
    norm.includes('shadi') ||
    norm.includes('marriage') ||
    norm.includes('sangeet') ||
    norm.includes('haldi') ||
    norm.includes('reception') ||
    norm.includes('destination wedding')
  ) {
    const weddingService = services.find(s => s.slug === 'wedding-planning');
    return {
      text: `💍 **Complete Luxury Wedding Planning by Creativatorss:**\n\n` +
        `Hum aapki shaadi ko ek royal aur unforgettable experience banate hain! Hamari services me shamil hain:\n` +
        `• **Theme & Decor**: Regal stage setups, floral designs, modern entry concepts\n` +
        `• **Entertainment**: Celebrity singers, live Sufi bands, DJ & sound-light stage\n` +
        `• **Hospitality & Logistics**: Guest RSVP, VIP management, venue coordination\n` +
        `• **Pre-Wedding Functions**: Haldi, Mehendi, Cocktail, Sangeet & Reception\n` +
        `• **Destination Weddings**: Udaipur, Jaipur, Chandigarh, Goa & Himachal setups`,
      actions: [
        { label: 'View Wedding Details', type: 'link', href: '/services/wedding-planning', icon: 'external' },
        {
          label: '💬 Get Wedding Quote on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I would like to get a quote and details for Wedding Planning.')}`,
          icon: 'whatsapp'
        },
        { label: '📋 Fill Wedding Inquiry', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      suggestions: [
        'How early should I book for a wedding?',
        'Celebrity and artist booking for wedding',
        'Get a custom quote'
      ]
    };
  }

  // 6. CORPORATE EVENTS / CONFERENCES / ANNUAL MEETS
  if (
    norm.includes('corporate') ||
    norm.includes('conference') ||
    norm.includes('seminar') ||
    norm.includes('annual meet') ||
    norm.includes('award') ||
    norm.includes('dealer meet') ||
    norm.includes('company event') ||
    norm.includes('business event')
  ) {
    return {
      text: `🏢 **Corporate Events & Production Solutions:**\n\n` +
        `Creativatorss 100+ national & multinational brands ke liye corporate events manage kar chuka hai.\n\n` +
        `• **Conferences & Summits**: High-tech LED walls, synchronized audio-visuals, stage trussing\n` +
        `• **Annual Meets & Award Galas**: Premium stage setup, award distribution choreography, gala dinners\n` +
        `• **Brand Summits & Dealer Meets**: End-to-end event conceptualization, keynote presentation tech\n` +
        `• **Corporate Entertainment**: Standup comedians, emcees, live artists`,
      actions: [
        { label: 'View Corporate Services', type: 'link', href: '/services/corporate-events', icon: 'external' },
        {
          label: '💬 Corporate Event Consultation',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to discuss a Corporate Event / Conference requirement.')}`,
          icon: 'whatsapp'
        },
        { label: '📋 Request Corporate Proposal', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      suggestions: [
        'Product Launches',
        'How early should we book?',
        'Contact Our Corporate Team'
      ]
    };
  }

  // 7. CELEBRITY & ARTIST MANAGEMENT
  if (
    norm.includes('celebrity') ||
    norm.includes('celeb') ||
    norm.includes('artist') ||
    norm.includes('singer') ||
    norm.includes('dj') ||
    norm.includes('band') ||
    norm.includes('actor') ||
    norm.includes('kalaakar') ||
    norm.includes('performer') ||
    norm.includes('comedian')
  ) {
    return {
      text: `🌟 **Celebrity & Artist Management:**\n\n` +
        `Creativatorss ka industry ke top celebrities aur performing artists ke sath direct network hai:\n\n` +
        `• **Bollywood Celebrities & TV Stars**: Ribbon cutting, brand endorsement, chief guest appearances\n` +
        `• **Live Singers & Bands**: Bollywood, Punjabi singers, Sufi musicians, rock bands\n` +
        `• **DJs & Emcees**: Top club DJs, energetic anchors for weddings & corporate summits\n` +
        `• **VIP Security & Protocols**: Green room management, vanity vans, backstage security & rider management`,
      actions: [
        { label: 'Artist Management', type: 'link', href: '/services/artist-management', icon: 'external' },
        { label: 'Celebrity Management', type: 'link', href: '/services/celebrity-management', icon: 'external' },
        {
          label: '💬 Inquire Artist Availability',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to inquire about booking an artist / celebrity for my event.')}`,
          icon: 'whatsapp'
        }
      ],
      suggestions: [
        'Fashion Show Production',
        'Wedding Planning',
        'Get a Quote'
      ]
    };
  }

  // 8. FASHION SHOW & MODEL MANAGEMENT
  if (
    norm.includes('fashion') ||
    norm.includes('fashion show') ||
    norm.includes('runway') ||
    norm.includes('ramp') ||
    norm.includes('model') ||
    norm.includes('modelling') ||
    norm.includes('models')
  ) {
    return {
      text: `👠 **Fashion Show Production & Model Management:**\n\n` +
        `Fashion shows are one of our flagship expertise!\n\n` +
        `• **Runway & Stage Architecture**: Custom ramp design, runway lighting, LED backdrops\n` +
        `• **Model Casting & Coordination**: Professional male & female runway models\n` +
        `• **Backstage Management**: Makeup artists, stylists, quick-change choreography\n` +
        `• **Show Direction**: Music scoring, choreography, show direction & media coverage`,
      actions: [
        { label: 'Fashion Show Service', type: 'link', href: '/services/fashion-show', icon: 'external' },
        { label: 'Model Management', type: 'link', href: '/services/model-management', icon: 'external' },
        {
          label: '💬 Discuss Fashion Production',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I am looking for Fashion Show production / Model management.')}`,
          icon: 'whatsapp'
        }
      ]
    };
  }

  // 9. INFLUENCER SHOOT & BRAND SHOOT & PRODUCT LAUNCHES
  if (
    norm.includes('influencer') ||
    norm.includes('brand shoot') ||
    norm.includes('product launch') ||
    norm.includes('launch') ||
    norm.includes('photoshoot') ||
    norm.includes('shoot') ||
    norm.includes('promotional') ||
    norm.includes('activation')
  ) {
    return {
      text: `📸 **Brand Shoots, Influencer Campaigns & Product Launches:**\n\n` +
        `Creativatorss brands ko visual storytelling ke zariye amplify karta hai:\n\n` +
        `• **Influencer Shoots**: High-engagement branded content, creator collaborations, studio & outdoor sets\n` +
        `• **Brand Shoots**: Product photography, campaign lookbooks, commercial ad films\n` +
        `• **Product Launches**: Dramatic stage unveilings, 3D AV projections, influencer presence, media buzz\n` +
        `• **Promotional Activations**: Mall activations, on-ground BTL experiences, live kiosks`,
      actions: [
        { label: 'Influencer Shoots', type: 'link', href: '/services/influencer-shoot', icon: 'external' },
        { label: 'Product Launches', type: 'link', href: '/services/product-launches', icon: 'external' },
        {
          label: '💬 Plan a Shoot or Launch',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to discuss a Brand Shoot / Influencer Shoot / Product Launch.')}`,
          icon: 'whatsapp'
        }
      ]
    };
  }

  // 10. ALL SERVICES SUMMARY
  if (
    norm.includes('services') ||
    norm.includes('service') ||
    norm.includes('kya karte ho') ||
    norm.includes('kya service') ||
    norm.includes('what do you do') ||
    norm.includes('offer') ||
    norm.includes('capabilities') ||
    norm.includes('kaam')
  ) {
    return {
      text: `Creativatorss ek **Full-Service Event & Production Company** hai. Hamari 10 pramukh services hain:\n\n` +
        `1. 📸 **Influencer Shoot** - Branded content & influencer shoots\n` +
        `2. 👠 **Fashion Show** - Complete runway & concept production\n` +
        `3. 🎬 **Brand Shoot** - High-impact commercial brand photography\n` +
        `4. 🚀 **Product Launches** - Unveilings & stage experiences\n` +
        `5. 🎯 **Promotional Activities** - Mall activations & BTL campaigns\n` +
        `6. 🏢 **Corporate Events** - Conferences, annual meets & galas\n` +
        `7. 💃 **Model Management** - Professional casting & coordination\n` +
        `8. 🎤 **Artist Management** - Live singers, bands & DJs\n` +
        `9. 🌟 **Celebrity Management** - Star appearances & VIP handling\n` +
        `10. 💍 **Wedding Planning** - Luxury destination & theme weddings`,
      actions: [
        { label: 'View All Services Page', type: 'link', href: '/services', icon: 'external' },
        {
          label: '💬 Chat on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to learn more about your services.')}`,
          icon: 'whatsapp'
        }
      ],
      suggestions: [
        'Wedding Planning',
        'Corporate Events',
        'Celebrity Booking',
        'How to get a quote?'
      ]
    };
  }

  // 11. PRICING / COST / CHARGES / BUDGET / QUOTATION
  if (
    norm.includes('price') ||
    norm.includes('pricing') ||
    norm.includes('cost') ||
    norm.includes('charge') ||
    norm.includes('rate') ||
    norm.includes('budget') ||
    norm.includes('kitna kharcha') ||
    norm.includes('package') ||
    norm.includes('quote') ||
    norm.includes('quotation') ||
    norm.includes('fees')
  ) {
    return {
      text: `💰 **Event Pricing & Quotation:**\n\n` +
        `Creativatorss har event ko client ke specific vision, scale, location aur guest count ke anusaar customize karta hai. Isiliye koi fixed ek package nahi hota, balki hum **aapke budget ke hisaab se best customized proposal** tayyar karte hain.\n\n` +
        `Quotation tayyar karne ke liye hume yeh jankari chahiye hoti hai:\n` +
        `1. Event Type (Wedding, Corporate, Shoot, Fashion Show, etc.)\n` +
        `2. Tentative Date & Location\n` +
        `3. Expected Guest Count ya Scale\n\n` +
        `Aap 2 minute me WhatsApp par direct baat karke instant estimate le sakte hain!`,
      actions: [
        {
          label: '💬 Get Free Instant Quote on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I would like to get a customized quote for my event.')}`,
          icon: 'whatsapp'
        },
        { label: '📋 Fill Event Enquiry Form', type: 'link', href: '/contact', icon: 'calendar' },
        { label: `📞 Call Us Directly (${site.phone})`, type: 'call', href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`, icon: 'phone' }
      ],
      suggestions: [
        'How early should I book?',
        'Tell me about Corporate Events',
        'Tell me about Wedding Planning'
      ]
    };
  }

  // 12. HOW TO BOOK / PROCESS / TIMELINE / HOW EARLY
  if (
    norm.includes('how to book') ||
    norm.includes('book kaise') ||
    norm.includes('booking') ||
    norm.includes('process') ||
    norm.includes('how early') ||
    norm.includes('advance') ||
    norm.includes('kitne din pehle') ||
    norm.includes('steps') ||
    norm.includes('timeline')
  ) {
    return {
      text: `📋 **Humare Kaam Karne Ka 5-Step Process:**\n\n` +
        `1. **Discover**: Aapki requirement, vision, timeline aur budget ko samajhna.\n` +
        `2. **Concept**: Creative theme, stage design aur flow design karna.\n` +
        `3. **Plan**: Detailed logistics, vendor timeline aur production schedule banana.\n` +
        `4. **Produce**: Stage, sound, lights, artists aur on-ground execution setup karna.\n` +
        `5. **Deliver**: Flawless, memorable live experience deliver karna.\n\n` +
        `✦ **Kitna pehle book karein?**\n` +
        `• Corporate / Shoots: Kam se kam **2 se 4 hafte pehle**\n` +
        `• Weddings / Fashion Shows / Celebrity: Kam se kam **1 se 3 mahine pehle** taaki best dates aur artists confirm ho sakein.`,
      actions: [
        {
          label: '💬 Start Planning on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to book / plan an upcoming event.')}`,
          icon: 'whatsapp'
        },
        { label: '📋 Book via Form', type: 'link', href: '/contact', icon: 'calendar' }
      ]
    };
  }

  // 13. ABOUT / EXPERIENCE / CREDIBILITY / FOUNDER / STATS
  if (
    norm.includes('about') ||
    norm.includes('who are you') ||
    norm.includes('experience') ||
    norm.includes('history') ||
    norm.includes('kaun ho') ||
    norm.includes('creativatorss kya hai') ||
    norm.includes('clients') ||
    norm.includes('trust') ||
    norm.includes('founder') ||
    norm.includes('owner') ||
    norm.includes('stats')
  ) {
    return {
      text: `✨ **About Creativatorss Event & Production:**\n\n` +
        `Creativatorss ek premier full-service Event & Brand Management company hai jo concept-to-completion event solutions provide karti hai.\n\n` +
        `🏆 **Hamara Track Record:**\n` +
        `• **10+ Saal** ka solid experience\n` +
        `• **500+ Safal Events** aur experiences\n` +
        `• **100+ Top Brands** aur Corporate Projects\n` +
        `• **25+ Cities** me pan-India execution presence\n\n` +
        `Hamara motto hai: *"Creativity Meets Flawless Execution."*`,
      actions: [
        { label: 'Read Our Full Story', type: 'link', href: '/about', icon: 'external' },
        { label: 'Explore Our Work', type: 'link', href: '/events', icon: 'external' },
        {
          label: '💬 Chat with Us',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}`,
          icon: 'whatsapp'
        }
      ]
    };
  }

  // 14. PORTFOLIO / GALLERY / PAST EVENTS / PHOTOS
  if (
    norm.includes('portfolio') ||
    norm.includes('gallery') ||
    norm.includes('photo') ||
    norm.includes('video') ||
    norm.includes('work') ||
    norm.includes('past event') ||
    norm.includes('sample') ||
    norm.includes('dikhao')
  ) {
    return {
      text: `🎨 **Creativatorss Portfolio & Moments:**\n\n` +
        `Humne India ke kai bade events execute kiye hain jaise:\n` +
        `• **Fashion Forward** (Chandigarh) - Runway & couture production\n` +
        `• **The Product Reveal** (Delhi) - Immersive launch stage\n` +
        `• **Annual Momentum** - High-energy corporate summit\n` +
        `• **Creator Sessions** (Mumbai) - Influencer brand shoots\n` +
        `• **Golden Hour** (Chandigarh) - Grand royal wedding\n\n` +
        `Aap hamari website par pictures aur videos dekh sakte hain:`,
      actions: [
        { label: 'Explore Gallery', type: 'link', href: '/gallery', icon: 'external' },
        { label: 'View Featured Events', type: 'link', href: '/events', icon: 'external' },
        {
          label: '💬 Ask for Event Case Studies',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, please share your recent portfolio / work samples with me.')}`,
          icon: 'whatsapp'
        }
      ]
    };
  }

  // 15. STAGE / PRODUCTION / SOUND / LIGHTS / AV
  if (
    norm.includes('stage') ||
    norm.includes('light') ||
    norm.includes('sound') ||
    norm.includes('led') ||
    norm.includes('audio') ||
    norm.includes('production') ||
    norm.includes('truss') ||
    norm.includes('setup')
  ) {
    return {
      text: `🔊 **In-House Technical Production Capabilities:**\n\n` +
        `Creativatorss ke paas stage, sound aur lighting ka complete production setup hai:\n\n` +
        `• **Stage Engineering**: Custom 3D stage backdrops, multi-tier runways, hydraulic reveals\n` +
        `• **Visuals**: Seamless high-resolution P2/P3 LED walls, visual mapping & animations\n` +
        `• **Audio Systems**: Concert-grade line array sound systems (JBL, Meyer, RCF, etc.)\n` +
        `• **Intelligent Lighting**: Sharpies, washes, laser shows, cold pyrotechnics & CO2 jets\n` +
        `• **Power & Backup**: Heavy DG gensets & technical backup operators on-site`,
      actions: [
        {
          label: '💬 Inquire Production Setup',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Hi Creativatorss, I want to inquire about Stage, Sound and Lighting production setup.')}`,
          icon: 'whatsapp'
        },
        { label: '📋 Submit Technical Brief', type: 'link', href: '/contact', icon: 'calendar' }
      ]
    };
  }

  // 16. THANKS / APPRECIATION
  if (/^(thank|thanks|dhanyawad|shukriya|great|awesome|badhiya|ok|okay|theek\s*hai|thik\s*hai)/i.test(norm)) {
    return {
      text: `You're very welcome! 😊 Agar aapko event planning ya kisi bhi service ke baare mein aur kuch poochna ho, toh main yahin hoon.\n\nAap chahein toh directly hamari team se WhatsApp par jud sakte hain:`,
      actions: [
        {
          label: '💬 Chat on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}`,
          icon: 'whatsapp'
        },
        { label: 'Plan Your Event Form', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      suggestions: [
        'What services do you provide?',
        'How early should I book?',
        'Office Address'
      ]
    };
  }

  // =========================================================================
  // 17. FALLBACK - EXACTLY AS THE USER REQUESTED:
  // "AGAR NHI DA PAYA TO WO CONTACT KARNA KO BOOLA GA CHATBOT USER KO THIK HA"
  // =========================================================================
  return {
    text: `Maaf kijiye, mujhe is baare me poori jaankari nahi hai. Par hamari expert event team aapki turant aur personally madad karne ke liye ready hai! ✨\n\n` +
      `Aap direct humse WhatsApp par baat kar sakte hain, call laga sakte hain, ya apna enquiry form submit kar sakte hain:`,
    actions: FALLBACK_ACTIONS,
    suggestions: [
      'What services do you offer?',
      'Wedding Planning Details',
      'Corporate Events',
      'Where is your office located?'
    ]
  };
}

