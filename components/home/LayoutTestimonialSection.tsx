import { Star } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { home } from "@/content/home";

export default function LayoutTestimonialSection() {
  const { testimonials } = home;
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="layout-testimonials" className="py-20 md:py-28 bg-muted relative">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-4xl font-bold tracking-tight mb-3">
          What Our Users Say
        </h2>
        <p className="text-muted-foreground">
          Real feedback from teams using PulseCRM to enhance their workflows.
        </p>
      </div>
      <Carousel>
        <CarouselContent>
          {testimonials.map((testimonial, i) => (
            <CarouselItem key={testimonial.name} className="!flex flex-col items-center">
              <div className="flex flex-row gap-1 justify-center mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" />
                ))}
              </div>
              <p className="text-lg italic max-w-xl mb-3">&ldquo;{testimonial.feedback}&rdquo;</p>
              <span className="font-bold">{testimonial.name}</span>
              <span className="text-sm text-muted-foreground">{testimonial.role}</span>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
}