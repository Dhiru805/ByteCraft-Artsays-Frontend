import TestimonialCard from "./TestimonialCard";

export default function Testimonials() {
  const testimonials = [
    {
      text: `What I love most is the community—everyone hypes each other up and gives constructive feedback. It’s not just a platform, it’s like a creative fam!`,
      name: "Sophia Fernandes",
      bg: "bg-[#FFF3ED]",
    },
    {
      text: `I used to struggle getting eyes on my art, but on ArtSays, people actually engage and appreciate the process behind my creations.`,
      name: "Rohit Sharma",
      bg: "bg-white",
    },
    {
      text: `It feels like my art finally speaks to the right audience.`,
      name: "Ananya Mehta",
      bg: "bg-[#FFF3ED]",
    },
  ];

  return (
    <section className="py-16 bg-[#F8F8F8]">
      <div className="max-w-[1440px] mx-auto py-3 my-5 px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2E2B26] mb-4">
          Testimonials
        </h2>
        <p className="text-[#2E2B26] max-w-3xl mx-auto mb-12">
          All of these people are becoming your ideal workplaces for your team
          meeting, corporate events, press & influencers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <TestimonialCard key={i} text={t.text} name={t.name} bg={t.bg} />
          ))}
        </div>
      </div>
    </section>
  );
}
