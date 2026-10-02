import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { CategoryShowcase } from "@/components/sections/CategoryShowcase";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BrandStory } from "@/components/sections/BrandStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { Newsletter } from "@/components/sections/Newsletter";
import { FooterDark } from "@/components/sections/FooterDark";

export default function BerandaPage() {
  return (
    // Dark theme menyeluruh untuk halaman marketing/atmosfer
    <div className="bg-il-dark-bg min-h-dvh">
      <Navbar variant="dark" />

      <main>
        <HeroSection />
        <CategoryShowcase />
        <FeaturedProducts />
        <BrandStory />
        <Testimonials />
        <Newsletter />
      </main>

      <FooterDark />
    </div>
  );
}
