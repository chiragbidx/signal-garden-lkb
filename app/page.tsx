import LayoutHeroSection from "@/components/home/LayoutHeroSection";
import LayoutSponsorsSection from "@/components/home/LayoutSponsorsSection";
import LayoutBenefitsSection from "@/components/home/LayoutBenefitsSection";
import LayoutFeatureGridSection from "@/components/home/LayoutFeatureGridSection";
import LayoutServicesSection from "@/components/home/LayoutServicesSection";
import LayoutTestimonialSection from "@/components/home/LayoutTestimonialSection";
import LayoutTeamSection from "@/components/home/LayoutTeamSection";
import LayoutPricingSection from "@/components/home/LayoutPricingSection";
import LayoutContactSection from "@/components/home/LayoutContactSection";
import LayoutFaqSection from "@/components/home/LayoutFaqSection";
import LayoutFooterSection from "@/components/home/LayoutFooterSection";
import Navbar from "@/components/layout/navbar";

// Section order as in FILES.md
const sections = [
  { id: "layout-hero", component: LayoutHeroSection },
  { id: "layout-sponsors", component: LayoutSponsorsSection },
  { id: "layout-benefits", component: LayoutBenefitsSection },
  { id: "layout-features", component: LayoutFeatureGridSection },
  { id: "layout-services", component: LayoutServicesSection },
  { id: "layout-testimonials", component: LayoutTestimonialSection },
  { id: "layout-team", component: LayoutTeamSection },
  { id: "layout-pricing", component: LayoutPricingSection },
  { id: "layout-contact", component: LayoutContactSection },
  { id: "layout-faq", component: LayoutFaqSection },
  { id: "layout-footer", component: LayoutFooterSection },
];

export default function Page() {
  // Sections are rendered in registered order, with Navbar always mounted above
  return (
    <>
      <Navbar />
      <main>
        {sections.map((section) => {
          const Component = section.component;
          return <Component key={section.id} />;
        })}
      </main>
    </>
  );
}