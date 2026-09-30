import './globals.css';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
export const metadata = { title:'Creativatorss Event & Production | Events, Production & Brand Experiences', description:'Creativatorss Event & Production creates memorable events, brand experiences, fashion shows, product launches, corporate events, artist management and wedding experiences.', openGraph:{title:'Creativatorss Event & Production',description:'Events. Production. Experiences.',type:'website'} };
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body><Navbar/>{children}<Footer/></body></html>}
