import { BrandStory } from '../components/BrandStory';
import { FeaturedDishes } from '../components/FeaturedDishes';
import { FoodStorySection } from '../components/FoodStorySection';
import { HeroSection, Marquee } from '../components/HeroSection';
import { MenuPreview } from '../components/MenuPreview';
import { VisitSection } from '../components/VisitSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <Marquee />
      <BrandStory />
      <FeaturedDishes />
      <FoodStorySection />
      <MenuPreview />
      <VisitSection />
    </>
  );
}
