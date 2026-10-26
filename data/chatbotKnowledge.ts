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
  lang?: 'hi' | 'en';
}

export interface QuickSuggestion {
  label: string;
  query: string;
}

export const INITIAL_SUGGESTIONS_EN: QuickSuggestion[] = [
  { label: '✨ Our Services', query: 'What services do you provide?' },
  { label: '💍 Wedding Planning', query: 'Tell me about wedding planning' },
  { label: '🏢 Corporate Events', query: 'Corporate events and conferences' },
  { label: '🌟 Celebrity & Artist', query: 'Celebrity and artist booking' },
  { label: '💰 Pricing & Quote', query: 'How much does an event cost?' },
  { label: '📍 Office Location', query: 'Where is your office located?' },
  { label: '📞 Contact Details', query: 'How can I contact Creativatorss?' },
];

export const INITIAL_SUGGESTIONS_HI: QuickSuggestion[] = [
  { label: '✨ Hamari Services', query: 'Aap kya kya services dete hain?' },
  { label: '💍 Wedding Planning', query: 'Wedding planning ki jankari chahiye' },
  { label: '🏢 Corporate Events', query: 'Corporate events aur conferences' },
  { label: '🌟 Celebrity & Artist', query: 'Celebrity aur artist booking' },
  { label: '💰 Kharcha aur Quote', query: 'Event ka kitna kharcha hota hai?' },
  { label: '📍 Office Kahan Hai', query: 'Aapka office kahan par hai?' },
  { label: '📞 Contact Karein', query: 'Creativatorss team se kaise contact karein?' },
];

export const INITIAL_SUGGESTIONS = INITIAL_SUGGESTIONS_EN;

// Official Contact details action buttons
export const getContactActions = (lang: 'hi' | 'en'): ActionButton[] => [
  {
    label: lang === 'hi' ? '💬 WhatsApp Par Baat Karein' : '💬 Chat on WhatsApp',
    type: 'whatsapp',
    href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
      lang === 'hi'
        ? 'Namaste Creativatorss, mujhe event planning ke baare me baat karni hai.'
        : 'Hello Creativatorss, I would like to inquire about event management.'
    )}`,
    icon: 'whatsapp'
  },
  {
    label: lang === 'hi' ? `📞 Call Karein (${site.phone})` : `📞 Call Now (${site.phone})`,
    type: 'call',
    href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`,
    icon: 'phone'
  },
  {
    label: lang === 'hi' ? '📋 Enquiry Form Bharein' : '📋 Fill Enquiry Form',
    type: 'link',
    href: '/contact',
    icon: 'external'
  }
];

// Helper to normalize user string
function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Language detector: detects if query is Hindi / Hinglish or English
export function detectLanguage(text: string, sessionLang?: 'hi' | 'en'): 'hi' | 'en' {
  // Check for Devanagari characters
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi';
  }

  const norm = normalize(text);
  const words = norm.split(' ').filter(Boolean);

  // Distinct Hindi / Hinglish markers
  const distinctHindiKeywords = [
    'kya', 'kaise', 'kese', 'kahan', 'kaha', 'kidhar', 'kaun', 'kon', 'kitna', 'kitne', 'kitni',
    'chahiye', 'chahie', 'karwana', 'karwa', 'karwani', 'karwane', 'karna', 'karni', 'karne',
    'karo', 'kare', 'karein', 'kardo', 'karao',
    'hai', 'hain', 'hoon', 'hu', 'ho', 'h', 'hn', 'tha', 'thi', 'the',
    'batao', 'bataiye', 'bataye', 'btao', 'bata',
    'dega', 'degi', 'denge', 'shadi', 'shaadi', 'shadiyan', 'baare', 'bare',
    'humko', 'hume', 'hum', 'meri', 'mera', 'mere', 'apka', 'aapka', 'aapki', 'aapke', 'mujhe', 'mujhko',
    'baat', 'sampark', 'theek', 'thik', 'haan', 'han', 'ha',
    'nahi', 'nhi', 'mat', 'aur', 'orr', 'vha', 'waha', 'yaha', 'yahan', 'pata', 'shahar',
    'kab', 'kharcha', 'kharch', 'paisa', 'paise', 'namaste', 'pranam', 'shukriya', 'dhanyawad', 'kripya', 'madad',
    'bhai', 'bolo', 'boliye', 'bologe', 'jankari', 'jaankari', 'zankari', 'pucho',
    'poochna', 'puchein', 'lagega', 'hoga', 'hogi', 'honge', 'aayega', 'aayegi', 'sakta', 'sakte', 'sakti',
    'dekhna', 'dekho', 'dikhao', 'kuch', 'kuchh', 'achha', 'accha', 'badhiya', 'hindi', 'hinglish'
  ];

  let hindiScore = 0;
  for (const word of words) {
    if (distinctHindiKeywords.includes(word)) {
      hindiScore++;
    }
  }

  // Check common Hindi multi-word combinations
  if (
    norm.includes('bata do') ||
    norm.includes('kar do') ||
    norm.includes('ke baare') ||
    norm.includes('ke bare') ||
    norm.includes('kaise kare') ||
    norm.includes('kitna hai') ||
    norm.includes('kitna kharcha') ||
    norm.includes('thik hai') ||
    norm.includes('thik h') ||
    norm.includes('baat karo') ||
    norm.includes('baat karein') ||
    norm.includes('karni hai') ||
    norm.includes('karna hai') ||
    norm.includes('karwana hai') ||
    norm.includes('karwani hai') ||
    norm.includes('kaha h') ||
    norm.includes('kahan h')
  ) {
    hindiScore += 2;
  }

  if (hindiScore > 0) {
    return 'hi';
  }

  // If user was already talking in Hindi, keep Hindi unless they explicitly switch to English
  if (sessionLang === 'hi') {
    const isExplicitEnglish = /^(switch to english|speak in english|english please|talk in english|in english)/i.test(norm);
    if (!isExplicitEnglish) {
      return 'hi';
    }
  }

  return 'en';
}

// Intent matchers
export function getChatbotResponse(userMessage: string, sessionLang?: 'hi' | 'en'): ChatResponse {
  const norm = normalize(userMessage);
  const lang = detectLanguage(userMessage, sessionLang);

  if (!norm) {
    return {
      text: lang === 'hi'
        ? `Namaste! Main **Creativatorss Event & Production** ka assistant hoon. Aap Creativatorss ki services, events, wedding planning ya booking ke baare me pooch sakte hain.`
        : `Hello! I am the **Creativatorss Event & Production** assistant. You can ask me anything about our services, wedding planning, corporate events, or bookings.`,
      suggestions: (lang === 'hi' ? INITIAL_SUGGESTIONS_HI : INITIAL_SUGGESTIONS_EN).map(s => s.query),
      lang
    };
  }

  // 0. EXPLICIT LANGUAGE SWITCH (Hindi / Hinglish vs English)
  if (
    /(hindi|hinglish)/i.test(norm) &&
    (norm.includes('baat') ||
      norm.includes('bolo') ||
      norm.includes('speak') ||
      norm.includes('talk') ||
      norm.includes('bolte') ||
      norm.includes('aati') ||
      norm.includes('change') ||
      norm.includes('switch') ||
      norm.includes('please') ||
      norm.length <= 15)
  ) {
    return {
      text: `Haan ji, bilkul! Main **Hindi aur Hinglish** dono samajhta hoon aur aapse Hindi mein hi baat karunga. 🙏✨\n\nAap Creativatorss ki kisi bhi service ya event ke baare mein pooch sakte hain:\n• 💍 **Wedding Planning** (Theme, Decor, Royal Entry, Sangeet)\n• 🏢 **Corporate Events** (Conferences, Summits, LED Walls & AV)\n• 🌟 **Celebrity & Artist Booking** (Bollywood & Punjabi Singers, Live Bands)\n• 👠 **Fashion Shows & Model Management**\n• 📸 **Brand Shoots & Influencer Campaigns**\n• 💰 **Pricing & Customized Quotations**\n\nAapko kis event ki jaankari chahiye?`,
      suggestions: [
        'Aap kya kya services dete hain?',
        'Wedding planning ki jankari',
        'Corporate events aur conferences',
        'Event ka kitna kharcha hota hai?',
        'Aapka office kahan par hai?'
      ],
      actions: [
        { label: 'Services Dekhein', type: 'link', href: '/services', icon: 'external' },
        {
          label: '💬 WhatsApp Par Baat Karein',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent('Namaste Creativatorss, mujhe event planning ke baare me baat karni hai.')}`,
          icon: 'whatsapp'
        }
      ],
      lang: 'hi'
    };
  }

  if (
    /english/i.test(norm) &&
    (norm.includes('speak') ||
      norm.includes('talk') ||
      norm.includes('switch') ||
      norm.includes('change') ||
      norm.includes('please') ||
      norm.length <= 15)
  ) {
    return {
      text: `Sure! I am happy to assist you in **English**. ✨\n\nI specialize strictly in Creativatorss Event & Production services:\n• 💍 **Luxury Wedding Planning**\n• 🏢 **Corporate Conferences & Galas**\n• 🌟 **Celebrity & Artist Management**\n• 👠 **Fashion Shows & Runway Production**\n• 📸 **Brand Shoots & Product Launches**\n• 💰 **Custom Quotations & Packages**\n\nHow can I help you plan your event today?`,
      suggestions: [
        'What services do you offer?',
        'Wedding planning details',
        'Corporate events and conferences',
        'How much does an event cost?',
        'Where is your office located?'
      ],
      actions: [
        { label: 'View All Services', type: 'link', href: '/services', icon: 'external' },
        { label: '💬 Chat on WhatsApp', type: 'whatsapp', href: `https://wa.me/${site.whatsapp}`, icon: 'whatsapp' }
      ],
      lang: 'en'
    };
  }

  // 1. PHONE NUMBER DETECTION (Callback request)
  const phoneRegex = /(?:\+?91[\s-]?)?[6-9]\d{9}/;
  const phoneMatch = userMessage.match(phoneRegex);
  if (
    phoneMatch &&
    (norm.includes('call') ||
      norm.includes('contact') ||
      norm.includes('number') ||
      norm.includes('callback') ||
      norm.includes('mera') ||
      norm.includes('phone') ||
      norm.length < 25)
  ) {
    const detectedPhone = phoneMatch[0];
    return {
      text: lang === 'hi'
        ? `Dhanyawad! Humne aapka contact number (**${detectedPhone}**) note kar liya hai. Hamari event team aapse jald hi sampark karegi.\n\nAap chahein toh turant WhatsApp par bhi jud sakte hain ya direct call kar sakte hain:`
        : `Thank you! We have received your phone number (**${detectedPhone}**). Our event production team will reach out to you shortly.\n\nYou can also connect instantly via WhatsApp or call us directly:`,
      actions: [
        {
          label: lang === 'hi' ? '💬 WhatsApp Par Connect Karein' : '💬 Connect on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi'
              ? `Hi, maine website par apna number ${detectedPhone} diya hai. Kripya event details ke liye contact karein.`
              : `Hi, I submitted my phone number ${detectedPhone} on your website. Please connect regarding event planning.`
          )}`,
          icon: 'whatsapp'
        },
        {
          label: lang === 'hi' ? `📞 Call Karein (${site.phone})` : `📞 Call Directly (${site.phone})`,
          type: 'call',
          href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`,
          icon: 'phone'
        }
      ],
      lang
    };
  }

  // 2. GREETINGS
  if (/^(hi|hello|hey|namaste|hlo|helo|hy|hola|good\s*(morning|afternoon|evening)|kya\s*haal|kem\s*cho|sat\s*sri\s*akal|ss|salam)/i.test(norm)) {
    return {
      text: lang === 'hi'
        ? `Namaste! **Creativatorss Event & Production** mein aapka swagat hai! ✨\n\nMain aapka personal event assistant hoon. Main sirf hamari website aur event services (Wedding, Corporate, Celebrity Booking, Shoots, Fashion Show, Stage & Production) se judi jaankari de sakta hoon.\n\nAap kis service ke baare mein jaanna chahte hain?`
        : `Hello! Welcome to **Creativatorss Event & Production**! ✨\n\nI am your dedicated event assistant. I specialize strictly in Creativatorss event services, including luxury weddings, corporate conferences, fashion shows, brand shoots, and celebrity bookings.\n\nHow may I help you plan your event today?`,
      suggestions: lang === 'hi'
        ? ['Aap kya kya services dete hain?', 'Wedding planning ki jankari', 'Corporate events', 'Event ka quote chahiye']
        : ['What services do you offer?', 'Wedding Planning details', 'Corporate Events', 'How to get a quote?'],
      actions: [
        { label: lang === 'hi' ? 'Services Dekhein' : 'View Services', type: 'link', href: '/services', icon: 'external' },
        { label: lang === 'hi' ? '💬 WhatsApp Chat' : '💬 WhatsApp Us', type: 'whatsapp', href: `https://wa.me/${site.whatsapp}`, icon: 'whatsapp' }
      ],
      lang
    };
  }

  // 3. CONTACT DETAILS / PHONE / WHATSAPP / EMAIL
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
    norm.includes('baat karna') ||
    norm.includes('baat kaise') ||
    norm.includes('number do') ||
    norm.includes('number chahiye') ||
    norm.includes('sampark') ||
    norm.includes('kaise contact') ||
    norm.includes('reach out') ||
    norm.includes('talk to')
  ) {
    return {
      text: lang === 'hi'
        ? `Aap **Creativatorss Event & Production** team se in official madhyamon par sampark kar sakte hain:\n\n` +
          `📞 **Official Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')})\n` +
          `📞 **Alternate Phone**: [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n` +
          `💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})\n` +
          `✉️ **Email**: [${site.email}](mailto:${site.email})\n` +
          `📍 **Office**: ${site.address.join(', ')}\n\n` +
          `Hamari team aam taur par WhatsApp aur Call par turant response deti hai.`
        : `You can reach the official **Creativatorss Event & Production** team directly through:\n\n` +
          `📞 **Primary Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')})\n` +
          `📞 **Alternate Phone**: [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n` +
          `💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})\n` +
          `✉️ **Email**: [${site.email}](mailto:${site.email})\n` +
          `📍 **Office**: ${site.address.join(', ')}\n\n` +
          `Our team is available 6 days a week with 24/7 support during ongoing live events.`,
      actions: getContactActions(lang),
      lang
    };
  }

  // 4. OUTSIDE CHANDIGARH / PAN-INDIA / OTHER CITIES
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
      text: lang === 'hi'
        ? `Haan, bilkul! **Creativatorss pan-India level par kaam karta hai.** 🇮🇳\n\n` +
          `Humne ab tak **25+ cities** (Delhi NCR, Mumbai, Jaipur, Udaipur, Chandigarh, Punjab, Goa etc.) me 500+ events successfully deliver kiye hain.\n\n` +
          `Chahe destination wedding ho, corporate conference ho ya brand tour — hamari complete technical & production team aapke city mein pahunch kar setup execute karti hai.`
        : `Yes, absolutely! **Creativatorss operates Pan-India.** 🇮🇳\n\n` +
          `We have successfully executed 500+ events across **25+ cities** including Delhi NCR, Mumbai, Jaipur, Udaipur, Chandigarh, Punjab, Goa, and Himachal Pradesh.\n\n` +
          `Whether it is a luxury destination wedding or a multi-city corporate summit, our complete in-house production crew handles end-to-end execution on-site.`,
      actions: [
        {
          label: lang === 'hi' ? '💬 Apne Shahar ke Liye Baat Karein' : '💬 Inquire for Your City',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi, mujhe Chandigarh ke bahar ek event organize karwana hai.' : 'Hi Creativatorss, I need an event organized in my city.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? 'Events Portfolio Dekhein' : 'View Events Portfolio', type: 'link', href: '/events', icon: 'external' }
      ],
      lang
    };
  }

  // 5. OFFICE LOCATION / ADDRESS / CITY / CHANDIGARH / MAP
  if (
    norm.includes('address') ||
    norm.includes('location') ||
    norm.includes('where are you') ||
    norm.includes('office') ||
    norm.includes('kahan hai') ||
    norm.includes('kaha hai') ||
    norm.includes('kahan h') ||
    norm.includes('kaha h') ||
    norm.includes('kidhar') ||
    norm.includes('kahan pe') ||
    norm.includes('pata') ||
    norm.includes('sector 34') ||
    norm.includes('chandigarh') ||
    norm.includes('map')
  ) {
    return {
      text: lang === 'hi'
        ? `📍 **Creativatorss Head Office Address:**\n\n` +
          `**Creativatorss Event & Production**\n` +
          `${site.address[0]},\n` +
          `${site.address[1]}.\n\n` +
          `✦ **Service Coverage**: Hum Chandigarh ke sath-sath **Pan-India (25+ cities)** jaise Delhi NCR, Mumbai, Jaipur, Ludhiana, Amritsar, Rajasthan aur Himachal me events organize karte hain!`
        : `📍 **Creativatorss Head Office Address:**\n\n` +
          `**Creativatorss Event & Production**\n` +
          `${site.address[0]},\n` +
          `${site.address[1]}.\n\n` +
          `✦ **Coverage**: In addition to Chandigarh, we operate **Pan-India across 25+ cities** including Delhi NCR, Mumbai, Jaipur, Rajasthan, Punjab, and Himachal Pradesh.`,
      actions: [
        {
          label: lang === 'hi' ? '🗺️ Google Maps Par Dekhein' : '🗺️ Open in Google Maps',
          type: 'link',
          href: site.addressMapUrl,
          icon: 'external'
        },
        {
          label: lang === 'hi' ? '💬 WhatsApp Par Location Maange' : '💬 Get Directions on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe aapke office aana hai, location guide karein.' : 'Hi Creativatorss, please share your office location details.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      suggestions: lang === 'hi'
        ? ['Kya aap Chandigarh ke bahar event karte hain?', 'Office contact number', 'Event booking kaise karein?']
        : ['Do you organize events outside Chandigarh?', 'Contact phone number', 'How to book an event?'],
      lang
    };
  }

  // 6. WEDDING PLANNING / SHAADI / DESTINATION WEDDING
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
    return {
      text: lang === 'hi'
        ? `💍 **Creativatorss Luxury Wedding Planning Services:**\n\n` +
          `Hum shaadiyon ko ek royal aur unforgettable experience banate hain:\n` +
          `• **Theme & Regal Decor**: Stage setup, luxury floral styling, signature entry concepts\n` +
          `• **Entertainment**: Celebrity singers, Sufi live bands, DJ with concert sound & lights\n` +
          `• **Hospitality & Logistics**: Guest RSVP, airport transfers, VIP hospitality, room hampers\n` +
          `• **Pre-Wedding Functions**: Haldi, Mehendi, Sangeet night, Cocktail & Grand Reception\n` +
          `• **Destination Weddings**: Udaipur, Jaipur, Chandigarh, Goa, Jim Corbett & Himachal.`
        : `💍 **Luxury Wedding Planning by Creativatorss:**\n\n` +
          `We craft bespoke, royal weddings with seamless execution:\n` +
          `• **Theme & Floral Decor**: Regal stage setups, custom floral arches, immersive guest pathways\n` +
          `• **Live Entertainment**: Bollywood & Punjabi singers, Sufi musicians, top club DJs\n` +
          `• **Hospitality & Coordination**: Guest RSVP, VIP escorting, logistics & itinerary management\n` +
          `• **All Functions**: Haldi, Mehendi, Sangeet choreography, Cocktail & Grand Reception\n` +
          `• **Destination Weddings**: Udaipur, Jaipur, Chandigarh, Goa, and Himachal palaces.`,
      actions: [
        { label: lang === 'hi' ? 'Wedding Page Dekhein' : 'View Wedding Details', type: 'link', href: '/services/wedding-planning', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Wedding Quote Maange' : '💬 Get Wedding Quote on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe wedding planning ki quotation aur details chahiye.' : 'Hi Creativatorss, I want to get a quote for Wedding Planning.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? '📋 Wedding Enquiry Form' : '📋 Fill Wedding Inquiry', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      suggestions: lang === 'hi'
        ? ['Wedding ke liye kitne din pehle book karein?', 'Celebrity singer booking for wedding', 'Wedding pricing aur packages']
        : ['How early should I book for a wedding?', 'Celebrity booking for wedding', 'Get custom wedding quote'],
      lang
    };
  }

  // 7. CORPORATE EVENTS / CONFERENCES / ANNUAL MEETS
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
      text: lang === 'hi'
        ? `🏢 **Corporate Events & Production Solutions:**\n\n` +
          `Creativatorss 100+ national aur multinational brands ke corporate events manage kar chuka hai:\n` +
          `• **Conferences & Summits**: Seamless P2/P3 LED walls, multi-mic podium setups, sound & AV\n` +
          `• **Annual Meets & Award Galas**: Premium stage trussing, trophy reveal choreography, thematic dinner\n` +
          `• **Dealer Meets & Brand Summits**: Interactive keynote presentations, registration desks\n` +
          `• **Corporate Entertainment**: Professional emcees, stand-up comedians, live bands.`
        : `🏢 **Corporate Event Planning & Production:**\n\n` +
          `Creativatorss has delivered high-impact corporate experiences for 100+ brands:\n` +
          `• **Conferences & Summits**: High-definition LED screens, synchronized line arrays, webcast setup\n` +
          `• **Annual Meets & Award Galas**: Custom staging, synchronized lighting, trophy reveal choreography\n` +
          `• **Dealer Meets & Product Summits**: Complete hospitality, registration, and presentation tech\n` +
          `• **Entertainment**: Renowned emcees, standup comics, and live musical acts.`,
      actions: [
        { label: lang === 'hi' ? 'Corporate Service Page' : 'Corporate Events Page', type: 'link', href: '/services/corporate-events', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Corporate Proposal Maange' : '💬 Request Corporate Proposal',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe Corporate Event / Conference organize karwana hai.' : 'Hi Creativatorss, I want to discuss a Corporate Event requirement.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? '📋 RFP / Form Bharein' : '📋 Submit RFP Form', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      suggestions: lang === 'hi'
        ? ['Product launches setup', 'Corporate events kitne din pehle book karein?', 'Contact details']
        : ['Product Launches setup', 'How early to book corporate event?', 'Official contact numbers'],
      lang
    };
  }

  // 8. CELEBRITY & ARTIST MANAGEMENT
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
      text: lang === 'hi'
        ? `🌟 **Celebrity & Artist Management by Creativatorss:**\n\n` +
          `Creativatorss ke paas industry ke top artists aur celebrities ka direct access hai:\n` +
          `• **Bollywood & Punjabi Singers**: Live concert performances for weddings & college fests\n` +
          `• **Celebrity Appearances**: Chief guest appearances, store launches, brand endorsements\n` +
          `• **Live Bands & DJs**: Sufi fusion bands, rock bands, high-energy party DJs\n` +
          `• **VIP Protocol**: Green rooms, vanity vans, bouncers & rider management.`
        : `🌟 **Celebrity & Artist Management:**\n\n` +
          `We provide direct artist coordination, talent booking, and stage rider management:\n` +
          `• **Bollywood & Punjabi Singers**: Live stage performances for weddings, corporate, and galas\n` +
          `• **Celebrity Appearances**: Star ribbon-cutting, brand inaugurations, guest appearances\n` +
          `• **Live Bands & Top DJs**: Sufi, Bollywood fusion, rock bands, and wedding DJs\n` +
          `• **Security & Hospitality**: VIP green rooms, bouncers, transit, and rider fulfillment.`,
      actions: [
        { label: lang === 'hi' ? 'Artist Management' : 'Artist Management', type: 'link', href: '/services/artist-management', icon: 'external' },
        { label: lang === 'hi' ? 'Celebrity Management' : 'Celebrity Management', type: 'link', href: '/services/celebrity-management', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Artist Availability Puchein' : '💬 Inquire Artist Availability',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe event ke liye Artist / Celebrity booking ki availability chahiye.' : 'Hi Creativatorss, I want to check availability for artist / celebrity booking.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      lang
    };
  }

  // 9. FASHION SHOW & MODEL MANAGEMENT
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
      text: lang === 'hi'
        ? `👠 **Fashion Show Production & Model Management:**\n\n` +
          `Creativatorss India ke leading couture aur fashion runways produce karta hai:\n` +
          `• **Ramp & Staging**: Custom elevated runway, ramp lighting, LED backdrop\n` +
          `• **Model Management**: Professional male & female runway models casting\n` +
          `• **Backstage Operations**: Makeup teams, hair stylists, rapid change sequencing\n` +
          `• **Show Direction**: Music track curation, show choreographer, photography & video.`
        : `👠 **Fashion Show Production & Model Management:**\n\n` +
          `We create premier runway experiences from concept to the final bow:\n` +
          `• **Runway Staging**: Custom runway architecture, calibrated fashion lighting, LED screens\n` +
          `• **Model Casting**: Experienced male & female models for couture and commercial shows\n` +
          `• **Backstage Management**: Makeup artists, backstage directors, cue choreography\n` +
          `• **Creative Direction**: Music mixing, runway pacing, and HD visual coverage.`,
      actions: [
        { label: lang === 'hi' ? 'Fashion Show Service' : 'Fashion Show Service', type: 'link', href: '/services/fashion-show', icon: 'external' },
        { label: lang === 'hi' ? 'Model Management' : 'Model Management', type: 'link', href: '/services/model-management', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Fashion Show Plan Karein' : '💬 Discuss Runway Production',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe Fashion Show / Model Management ke baare me baat karni hai.' : 'Hi Creativatorss, I want to discuss Fashion Show production.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      lang
    };
  }

  // 10. INFLUENCER SHOOTS, BRAND SHOOTS, PRODUCT LAUNCHES & ACTIVATIONS
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
      text: lang === 'hi'
        ? `📸 **Brand Shoots, Influencer Campaigns & Product Launches:**\n\n` +
          `Hamari creative production team brands ko powerful visual storytelling deti hai:\n` +
          `• **Influencer Shoots**: High-engagement branded content, top creators coordination, studio/outdoor sets\n` +
          `• **Brand Shoots**: Professional commercial photography, ad campaigns, lookbooks\n` +
          `• **Product Launches**: Dramatic unveilings, 3D hologram/LED reveals, media press coverage\n` +
          `• **Promotional Activations**: Mall activations, roadshows, BTL consumer engagements.`
        : `📸 **Brand Shoots, Influencer Shoots & Product Launches:**\n\n` +
          `We combine creative direction and production power for brands:\n` +
          `• **Influencer Shoots**: Curated creator collaborations, studio & outdoor sets, branded content\n` +
          `• **Brand Shoots**: High-fashion product photography, lookbooks, campaign visuals\n` +
          `• **Product Launches**: High-octane product reveal moments, synchronized light and AV\n` +
          `• **Promotional Activations**: Mall activations, on-ground BTL engagements, and roadshows.`,
      actions: [
        { label: lang === 'hi' ? 'Influencer Shoots' : 'Influencer Shoots', type: 'link', href: '/services/influencer-shoot', icon: 'external' },
        { label: lang === 'hi' ? 'Product Launches' : 'Product Launches', type: 'link', href: '/services/product-launches', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Shoot / Launch Discuss Karein' : '💬 Plan a Shoot / Launch',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe Brand Shoot / Influencer Shoot / Product Launch plan karna hai.' : 'Hi Creativatorss, I want to discuss a Brand Shoot / Product Launch.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      lang
    };
  }

  // 11. ALL SERVICES SUMMARY
  if (
    norm.includes('services') ||
    norm.includes('service') ||
    norm.includes('kya karte ho') ||
    norm.includes('kya service') ||
    norm.includes('what do you do') ||
    norm.includes('offer') ||
    norm.includes('capabilities') ||
    norm.includes('kaam') ||
    norm.includes('kya kya') ||
    norm.includes('sab service')
  ) {
    return {
      text: lang === 'hi'
        ? `Creativatorss ek **Full-Service Event & Production Company** hai. Hamari 10 main services hain:\n\n` +
          `1. 📸 **Influencer Shoot** - Branded content aur creator shoots\n` +
          `2. 👠 **Fashion Show** - Runway staging, models aur choreography\n` +
          `3. 🎬 **Brand Shoot** - High-impact commercial brand photography\n` +
          `4. 🚀 **Product Launches** - Grand stage reveals aur AV experiences\n` +
          `5. 🎯 **Promotional Activities** - Mall activations aur BTL campaigns\n` +
          `6. 🏢 **Corporate Events** - Conferences, dealer meets aur annual galas\n` +
          `7. 💃 **Model Management** - Runway aur commercial model casting\n` +
          `8. 🎤 **Artist Management** - Live singers, Sufi bands aur DJs\n` +
          `9. 🌟 **Celebrity Management** - Star appearances aur VIP security\n` +
          `10. 💍 **Wedding Planning** - Luxury destination aur royal theme weddings`
        : `Creativatorss is a **Full-Service Event & Brand Production Company**. Here are our 10 core capabilities:\n\n` +
          `1. 📸 **Influencer Shoot** - Creative content & creator production\n` +
          `2. 👠 **Fashion Show** - Complete runway & couture stage production\n` +
          `3. 🎬 **Brand Shoot** - High-impact product & lookbook photography\n` +
          `4. 🚀 **Product Launches** - Unveilings, 3D AV & memorable launch moments\n` +
          `5. 🎯 **Promotional Activities** - Mall activations & BTL brand experiences\n` +
          `6. 🏢 **Corporate Events** - Conferences, seminars & annual galas\n` +
          `7. 💃 **Model Management** - Professional casting & talent coordination\n` +
          `8. 🎤 **Artist Management** - Live singers, bands & DJ bookings\n` +
          `9. 🌟 **Celebrity Management** - Star appearances & VIP management\n` +
          `10. 💍 **Wedding Planning** - Bespoke luxury & destination weddings`,
      actions: [
        { label: lang === 'hi' ? 'Services Page Dekhein' : 'View All Services Page', type: 'link', href: '/services', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 WhatsApp Par Baat Karein' : '💬 Chat on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe aapki services ke baare mein jaanna hai.' : 'Hi Creativatorss, I want to learn more about your services.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      suggestions: lang === 'hi'
        ? ['Wedding planning ki jankari', 'Corporate events details', 'Celebrity booking', 'Event ka quote kaise lein?']
        : ['Wedding Planning details', 'Corporate Events', 'Celebrity Booking', 'How to get a quote?'],
      lang
    };
  }

  // 12. PRICING / COST / CHARGES / BUDGET / QUOTATION
  if (
    norm.includes('price') ||
    norm.includes('pricing') ||
    norm.includes('cost') ||
    norm.includes('charge') ||
    norm.includes('rate') ||
    norm.includes('budget') ||
    norm.includes('kharcha') ||
    norm.includes('kharch') ||
    norm.includes('paisa') ||
    norm.includes('paise') ||
    norm.includes('kitna lagega') ||
    norm.includes('kitne paise') ||
    norm.includes('package') ||
    norm.includes('quote') ||
    norm.includes('quotation') ||
    norm.includes('fees')
  ) {
    return {
      text: lang === 'hi'
        ? `💰 **Event Pricing & Quotation Details:**\n\n` +
          `Creativatorss har event ko client ke specific vision, location, guest count aur scale ke hisaab se customize karta hai. Isiliye koi ek fixed rate nahi hota, balki hum **aapke budget ke hisaab se best customized proposal** banate hain.\n\n` +
          `Estimate ke liye bas 3 cheezein zaroori hain:\n` +
          `1. Event Type (Wedding, Corporate, Fashion Show, Shoot, etc.)\n` +
          `2. Tentative Date & Location / City\n` +
          `3. Expected Guest Count ya Scope\n\n` +
          `Aap WhatsApp par 2 minute me direct baat karke instant quotation le sakte hain!`
        : `💰 **Pricing & Quotations at Creativatorss:**\n\n` +
          `Because every event has a unique scale, venue, guest count, and technical requirement, we don't have a rigid one-size-fits-all package. Instead, we prepare **customized proposals tailored to your budget and vision**.\n\n` +
          `To get an accurate estimate, simply share:\n` +
          `1. Event Type (Wedding, Corporate Summit, Fashion Show, Shoot, etc.)\n` +
          `2. Date & Venue / City\n` +
          `3. Expected Guest Count or Technical Scope\n\n` +
          `You can get an instant estimate within minutes on WhatsApp!`,
      actions: [
        {
          label: lang === 'hi' ? '💬 WhatsApp Par Instant Quote Lein' : '💬 Get Instant Quote on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe apne event ke liye customized quotation chahiye.' : 'Hi Creativatorss, I would like to get a customized quote for my event.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? '📋 Enquiry Form Bharein' : '📋 Fill Event Form', type: 'link', href: '/contact', icon: 'calendar' },
        { label: lang === 'hi' ? `📞 Call Karein (${site.phone})` : `📞 Call Directly (${site.phone})`, type: 'call', href: `tel:${site.phone.replace(/[^0-9+]/g, '')}`, icon: 'phone' }
      ],
      lang
    };
  }

  // 13. HOW TO BOOK / PROCESS / TIMELINE / HOW EARLY
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
      text: lang === 'hi'
        ? `📋 **Humare Kaam Karne Ka 5-Step Process:**\n\n` +
          `1. **Discover**: Aapki event requirements, date, budget aur expectations ko samajhna.\n` +
          `2. **Concept**: Creative theme, 3D stage layout aur event flow design karna.\n` +
          `3. **Plan**: Detailed logistics, vendor timeline aur production schedule banana.\n` +
          `4. **Produce**: Stage, sound, lights, artists aur on-ground operational setup.\n` +
          `5. **Deliver**: Seamless execution aur unforgettable live experience.\n\n` +
          `✦ **Kitne din pehle book karein?**\n` +
          `• Corporate & Shoots: Kam se kam **2-4 hafte pehle**\n` +
          `• Weddings & Major Fashion Shows: Kam se kam **1-3 mahine pehle** taaki best dates aur artists lock ho sakein.`
        : `📋 **Our 5-Step Event Production Process:**\n\n` +
          `1. **Discover**: Understand your vision, objectives, date, and budget.\n` +
          `2. **Concept**: Develop creative themes, 3D stage architecture, and experiential flow.\n` +
          `3. **Plan**: Build detailed logistics, artist timelines, and operational runsheets.\n` +
          `4. **Produce**: Stage engineering, line arrays, LED backdrops, and talent management.\n` +
          `5. **Deliver**: Flawless live execution with complete on-site management.\n\n` +
          `✦ **How early should you book?**\n` +
          `• Corporate & Brand Shoots: Ideally **2 to 4 weeks** in advance.\n` +
          `• Weddings & Celebrity Shows: Ideally **1 to 3 months** in advance to secure top dates and venues.`,
      actions: [
        {
          label: lang === 'hi' ? '💬 WhatsApp Par Booking Discuss Karein' : '💬 Start Booking on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe upcoming event book karna hai.' : 'Hi Creativatorss, I want to book an upcoming event.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? '📋 Contact Form Bharein' : '📋 Fill Booking Form', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      lang
    };
  }

  // 14. ABOUT / EXPERIENCE / CREDIBILITY / TRACK RECORD / STATS
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
      text: lang === 'hi'
        ? `✨ **Creativatorss Event & Production ke baare mein:**\n\n` +
          `Creativatorss ek premier full-service Event & Brand Management company hai jo concept-to-completion event solutions deti hai.\n\n` +
          `🏆 **Hamara Track Record:**\n` +
          `• **10+ Saal** ka solid experience\n` +
          `• **500+ Safal Events** aur experiences\n` +
          `• **100+ Top Brands** aur Corporate Projects\n` +
          `• **25+ Cities** me pan-India execution\n\n` +
          `Hamara motto hai: *"Creativity Meets Flawless Execution."*`
        : `✨ **About Creativatorss Event & Production:**\n\n` +
          `Creativatorss is a premier full-service Event and Brand Management company dedicated to delivering memorable live experiences.\n\n` +
          `🏆 **Our Track Record:**\n` +
          `• **10+ Years** of professional event experience\n` +
          `• **500+ Successfully Executed** events & experiences\n` +
          `• **100+ Leading Brands** & corporate partners\n` +
          `• **25+ Cities** covered across India\n\n` +
          `Our guiding principle: *"Creativity Meets Flawless Execution."*`,
      actions: [
        { label: lang === 'hi' ? 'Hamari Story Padhein' : 'Read Our Full Story', type: 'link', href: '/about', icon: 'external' },
        { label: lang === 'hi' ? 'Hamara Kaam Dekhein' : 'Explore Our Work', type: 'link', href: '/events', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Team Se Baat Karein' : '💬 Chat with Our Team',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}`,
          icon: 'whatsapp'
        }
      ],
      lang
    };
  }

  // 15. PORTFOLIO / GALLERY / PAST EVENTS / PHOTOS
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
      text: lang === 'hi'
        ? `🎨 **Creativatorss Portfolio & Moments:**\n\n` +
          `Humne India ke kai bade events execute kiye hain jaise:\n` +
          `• **Fashion Forward** (Chandigarh) - Runway couture production\n` +
          `• **The Product Reveal** (Delhi) - Immersive stage unveil\n` +
          `• **Annual Momentum** - High-energy corporate summit\n` +
          `• **Creator Sessions** (Mumbai) - Influencer brand shoots\n` +
          `• **Golden Hour** (Chandigarh) - Grand royal wedding\n\n` +
          `Website par aap photos aur videos explore kar sakte hain:`
        : `🎨 **Creativatorss Portfolio & Moments:**\n\n` +
          `We have orchestrated premier productions across India:\n` +
          `• **Fashion Forward** (Chandigarh) - High-fashion runway production\n` +
          `• **The Product Reveal** (Delhi) - Immersive brand unveil\n` +
          `• **Annual Momentum** - High-energy corporate summit\n` +
          `• **Creator Sessions** (Mumbai) - Branded influencer shoot\n` +
          `• **Golden Hour** (Chandigarh) - Grand destination wedding\n\n` +
          `Explore our visual showcases on the website:`,
      actions: [
        { label: lang === 'hi' ? 'Gallery Dekhein' : 'Explore Gallery', type: 'link', href: '/gallery', icon: 'external' },
        { label: lang === 'hi' ? 'Events Portfolio' : 'View Events Portfolio', type: 'link', href: '/events', icon: 'external' },
        {
          label: lang === 'hi' ? '💬 Work Samples Maange' : '💬 Request Portfolio on WhatsApp',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe aapke recent events ke samples aur videos dekhne hain.' : 'Hi Creativatorss, please share recent portfolio samples and videos.'
          )}`,
          icon: 'whatsapp'
        }
      ],
      lang
    };
  }

  // 16. STAGE / PRODUCTION / SOUND / LIGHTS / AV
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
      text: lang === 'hi'
        ? `🔊 **In-House Technical & Stage Production Setup:**\n\n` +
          `Creativatorss ke paas stage, sound aur lighting ka complete in-house setup hai:\n` +
          `• **Stage Engineering**: Custom 3D stage backdrops, multi-tier runways, hydraulic reveals\n` +
          `• **Visual Screens**: High-resolution P2/P3 indoor & outdoor LED walls\n` +
          `• **Concert Audio**: Professional line array sound systems (JBL, Meyer, RCF)\n` +
          `• **Intelligent Lighting**: Sharpies, beams, washes, lasers, cold pyrotechnics & CO2 jets\n` +
          `• **Power & Backup**: Heavy DG gensets aur on-site technical operators.`
        : `🔊 **In-House Technical & Stage Production:**\n\n` +
          `Creativatorss manages complete technical audio-visual and stage infrastructure:\n` +
          `• **Stage Engineering**: Custom 3D stage sets, multi-tier runways, and hydraulic reveals\n` +
          `• **Visual Screens**: High-resolution P2/P3 indoor & outdoor LED display walls\n` +
          `• **Concert Audio**: Line array sound systems, digital mixers, and stage monitors\n` +
          `• **Intelligent Lighting**: Sharpies, washes, lasers, cold pyros, and CO2 jets\n` +
          `• **Backup Power**: Heavy DG gensets with certified on-site technical engineers.`,
      actions: [
        {
          label: lang === 'hi' ? '💬 Production Setup Discuss Karein' : '💬 Inquire Production Setup',
          type: 'whatsapp',
          href: `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(
            lang === 'hi' ? 'Hi Creativatorss, mujhe stage, sound aur lighting setup ki jankari chahiye.' : 'Hi Creativatorss, I want to inquire about stage, sound, and lighting production setup.'
          )}`,
          icon: 'whatsapp'
        },
        { label: lang === 'hi' ? '📋 Technical Brief Submit Karein' : '📋 Submit Technical Brief', type: 'link', href: '/contact', icon: 'calendar' }
      ],
      lang
    };
  }

  // 17. THANKS / APPRECIATION
  if (/^(thank|thanks|dhanyawad|shukriya|great|awesome|badhiya|ok|okay|theek\s*hai|thik\s*hai)/i.test(norm)) {
    return {
      text: lang === 'hi'
        ? `Aapka bahut-bahut swagat hai! 😊\n\nAgar Creativatorss ki kisi bhi service ya event planning ke baare mein aur kuch poochna ho, toh main yahin hoon.\n\nDirect contact ke liye hamare numbers:\n📞 **Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')}) / [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})`
        : `You are very welcome! 😊\n\nIf you have any further questions about Creativatorss event services or planning, feel free to ask anytime.\n\nDirect contact numbers:\n📞 **Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')}) / [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})`,
      actions: getContactActions(lang),
      lang
    };
  }

  // =========================================================================
  // 18. STRICT REFUSAL FOR OUTSIDE / NON-WEBSITE QUERIES:
  // "mera chatbot bss jo meri website hai uski jankari dega bss agar user bhar ki
  // zankari pucha saf mana kardega thik ha orr vha par ya likh ka da da ki ya contact number ha"
  // =========================================================================
  if (lang === 'hi') {
    return {
      text: `Kshama kijiye, main sirf **Creativatorss Event & Production** aur hamari website se judi event services ki jaankari dene ke liye banaya gaya hoon. Main bahar ki ya anya vishayon ki jaankari nahi de sakta.\n\nAgar aapko kisi bhi event, booking ya hamari services se judi koi jaankari chahiye, toh aap hamare official contact numbers par direct sampark kar sakte hain:\n\n` +
        `📞 **Phone Number**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')})\n` +
        `📞 **Alternate Number**: [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n` +
        `💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})\n` +
        `✉️ **Email**: [${site.email}](mailto:${site.email})\n\n` +
        `Aap niche diye gaye button par click karke turant WhatsApp par baat kar sakte hain ya call laga sakte hain:`,
      actions: getContactActions('hi'),
      suggestions: [
        'Aap kya kya services dete hain?',
        'Wedding planning ki jankari',
        'Corporate events aur conferences',
        'Aapka office kahan par hai?'
      ],
      lang: 'hi'
    };
  }

  return {
    text: `I apologize, but I am specifically designed to provide assistance **only for Creativatorss Event & Production** and website-related services. I cannot answer queries outside our event management domain.\n\nIf you need any information regarding events, wedding planning, corporate productions, or bookings, please contact our team directly at our official numbers:\n\n` +
      `📞 **Primary Phone**: [${site.phone}](tel:${site.phone.replace(/[^0-9+]/g, '')})\n` +
      `📞 **Alternate Phone**: [${site.alternatePhone}](tel:${site.alternatePhone.replace(/[^0-9+]/g, '')})\n` +
      `💬 **WhatsApp**: [+91 8626000002](https://wa.me/${site.whatsapp})\n` +
      `✉️ **Email**: [${site.email}](mailto:${site.email})\n\n` +
      `Feel free to reach out via WhatsApp or call us directly:`,
    actions: getContactActions('en'),
    suggestions: [
      'What services do you provide?',
      'Tell me about wedding planning',
      'Corporate events and conferences',
      'Where is your office located?'
    ],
    lang: 'en'
  };
}
