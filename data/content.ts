export const portfolio = [
 {title:'Fashion Forward',category:'FASHION',type:'Fashion & Production',location:'Chandigarh',year:'2025',image:'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1400&q=85'},
 {title:'The Product Reveal',category:'PRODUCT LAUNCH',type:'Brand Event',location:'Delhi',year:'2025',image:'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=85'},
 {title:'Annual Momentum',category:'CORPORATE',type:'Corporate',location:'Chandigarh',year:'2024',image:'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1400&q=85'},
 {title:'Creator Sessions',category:'INFLUENCER',type:'Brand Shoot',location:'Mumbai',year:'2024',image:'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1400&q=85'},
 {title:'A Night To Remember',category:'CELEBRITY',type:'Entertainment',location:'Delhi',year:'2024',image:'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1400&q=85'},
 {title:'Golden Hour',category:'WEDDING',type:'Wedding Planning',location:'Chandigarh',year:'2025',image:'https://images.unsplash.com/photo-1507504031003-b417219a0fde?auto=format&fit=crop&w=1400&q=85'}
];
export const gallery = portfolio.map((item, i) => ({...item, id: i+1}));
export const faqs = ['How early should I book an event planner?','Do you manage complete event production?','Do you organize corporate events?','Can you manage events outside Chandigarh?','Do you provide stage and production?','Do you manage artists and celebrities?','Do you provide model management?','Do you handle product launches?','Can you help with promotional activities?','Do you plan weddings?'];
export const posts = [
 {slug:'designing-events-that-stay-with-you',category:'Event Planning',title:'Designing events that stay with you',date:'September 12, 2026',excerpt:'A considered approach to turning a brief into an experience people carry home.',image:'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1000&q=85'},
 {slug:'the-new-language-of-brand-activations',category:'Brand Activations',title:'The new language of brand activations',date:'August 28, 2026',excerpt:'Why the most effective activations feel less like campaigns and more like culture.',image:'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=1000&q=85'},
 {slug:'behind-the-production',category:'Production',title:'Behind the production',date:'August 04, 2026',excerpt:'The quiet details, teams and timelines that make a live moment feel effortless.',image:'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1000&q=85'}
];
