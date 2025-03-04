import Boundle from '@/components/Boundle';
import BraSpotlite from '@/components/BraSpotlite';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NewRelease from '@/components/NewRelease';
import SecondHero from '@/components/SecondHero';
import ShirtItems from '@/components/ShirtItems';
import SpecialPart from '@/components/SpecialPart';
import Tranding from '@/components/Tranding';

export default function Home() {
  return (
    <div className='font-young'>
      <Hero />
      <SecondHero />
      <NewRelease />
      <ShirtItems />
      <BraSpotlite />
      <Tranding />
      <Boundle />
      <SpecialPart />
      <Footer />
    </div>
  );
}
