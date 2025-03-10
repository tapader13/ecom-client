import BabyItems from '@/components/BabyItems';
import BeggiItems from '@/components/BeggiItems';
import Boundle from '@/components/Boundle';
import BraSpotlite from '@/components/BraSpotlite';
import CargoItems from '@/components/CargoItems';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NewRelease from '@/components/NewRelease';
import PaintItems from '@/components/PaintItems';
import SecondHero from '@/components/SecondHero';
import ShirtItems from '@/components/ShirtItems';
import SpecialPart from '@/components/SpecialPart';
import Tranding from '@/components/Tranding';

export default function Home() {
  return (
    <div className='font-young'>
      {/* <Hero /> */}
      {/* <SecondHero /> */}
      <BabyItems />
      <NewRelease />
      <ShirtItems />
      <PaintItems />
      <BeggiItems />
      <CargoItems />
      {/* <BraSpotlite /> */}
      <Tranding />
      {/* <Boundle /> */}
      {/* <SpecialPart /> */}
      <Footer />
    </div>
  );
}
