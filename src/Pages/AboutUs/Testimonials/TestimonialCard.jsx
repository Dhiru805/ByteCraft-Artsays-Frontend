// TestimonialCard.jsx
export default function TestimonialCard({ text, name }) {
  return (
    <div className="relative w-full max-w-lg mx-auto p-8 bg-[#FFF3EB] rounded-lg shadow-md 
        before:content-[''] before:absolute before:inset-0 before:border-[3px] before:border-[#3b2a20] 
        before:rounded-lg before:rotate-3 before:translate-x-1 before:translate-y-0 
        after:content-[''] after:absolute after:inset-0 after:border-[3px] after:border-[#3b2a20] 
        after:rounded-lg after:-rotate-2 after:-translate-x-1 after:-translate-y-1">
      
      {/* Content */}
      <p className="relative z-10 text-[#2E2B26] text-lg leading-relaxed mb-6">
        "{text}"
      </p>
      <h3 className="relative z-10 text-xl font-bold text-[#3b2a20]">{name}</h3>
    </div>
  );
}
