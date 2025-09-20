// import { Button } from "@/components/ui/button";

// interface HeroProps {
//   onTryDemo: () => void;
// }

// export function Hero({ onTryDemo }: HeroProps) {
//   return (
//     <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
//       <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
//         Chat with{" "}
//         <span className="bg-gradient-primary bg-clip-text text-transparent">
//           LawWise
//         </span>
//       </h1>
//       <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
//         Simplify complex legal documents into clear, accessible guidance.
//       </p>
//       <Button 
//         onClick={onTryDemo}
//         className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-black font-semibold px-8 py-3 text-lg"
//         size="lg"
//       >
//         Try Demo
//       </Button>
//     </section>
//   );
// }

import { Button } from "@/components/ui/button";

interface HeroProps {
  onTryDemo: () => void;
}

export function Hero({ onTryDemo }: HeroProps) {
  return (
    <section className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
        Chat with{" "}
        <span className="bg-gradient-primary bg-clip-text text-transparent">
          LawWise
        </span>
      </h1>
      <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
        Simplify complex legal documents into clear, accessible guidance.
      </p>
      <Button 
        onClick={onTryDemo}
        className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-black font-semibold px-8 py-3 text-lg"
        size="lg"
      >
        Start Chatting
      </Button>
    </section>
  );
}