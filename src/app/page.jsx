import AboutUs from "@/components/Home/AboutUs";
import BrowseByCategory from "@/components/Home/BrowseByCategory";
import CountryCarousel from "@/components/Home/CountryCarousel";
import FeaturedProducts from "@/components/Home/FeaturedProduct";
import Footer from "@/components/Home/Footer";
import HeroSection from "@/components/Home/HeroSection";
import Navbar from "@/components/Home/Navbar";


export default function Home() {
  return (
    <div className="max-w-screen-2xl mx-auto">
      <Navbar/>
      <HeroSection/>
      <FeaturedProducts/>
      <BrowseByCategory/>
      <CountryCarousel/>
      <AboutUs/>
      <Footer/>
    </div>
  );
}
