import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, FileUp, MessageSquare, Sparkles, Clock, Search } from "lucide-react";
import Link from "next/link";

const Features = () => {
  return (
    <div className="min-h-screen bg-background text-foreground font-['Inter',sans-serif]">
      <Header onUploadClick={() => {}} />
      <main className="container mx-auto px-6 py-12">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-xl border border-border bg-card p-10 mb-10">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent pointer-events-none" />
          <div className="relative grid gap-6 md:grid-cols-2 items-center">
            <div className="space-y-4">
              <span className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground">AI for legal documents</span>
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
                Understand contracts in minutes, not hours
              </h1>
              <p className="text-muted-foreground md:text-lg">
                LawWise highlights key terms, risks, and obligations so you can make confident decisions faster.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/">
                  <Button>
                    Try the demo
                  </Button>
                </Link>
                <Button variant="outline" asChild>
                  <a href="#features-grid">Explore features</a>
                </Button>
              </div>
            </div>
            <div className="md:justify-self-end">
              <div className="rounded-lg border border-border bg-background/80 backdrop-blur p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <span className="text-sm text-muted-foreground">Instant AI insights</span>
                </div>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 mt-0.5 text-primary" /> Clause risk detection</li>
                  <li className="flex items-start gap-2"><Search className="h-4 w-4 mt-0.5 text-primary" /> Quick clause lookup</li>
                  <li className="flex items-start gap-2"><Clock className="h-4 w-4 mt-0.5 text-primary" /> Timeline and obligations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Features grid */}
        <section id="features-grid" className="space-y-6 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">Everything you need</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <FileUp className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Smart Document Upload</h3>
              </div>
              <p className="text-muted-foreground">Upload contracts securely and get instant structure-aware parsing.</p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">AI-Powered Summaries</h3>
              </div>
              <p className="text-muted-foreground">Digestible highlights, risks, and recommended next steps.</p>
            </div>
            <div className="p-6 border border-border rounded-lg bg-card hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Interactive Q&A</h3>
              </div>
              <p className="text-muted-foreground">Ask questions about clauses, obligations, and implications.</p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl font-bold text-primary mb-2">1</div>
              <h4 className="font-semibold mb-1">Upload</h4>
              <p className="text-muted-foreground">Add your contract or legal document in seconds.</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl font-bold text-primary mb-2">2</div>
              <h4 className="font-semibold mb-1">Analyze</h4>
              <p className="text-muted-foreground">AI extracts key terms, risks, and timelines automatically.</p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-3xl font-bold text-primary mb-2">3</div>
              <h4 className="font-semibold mb-1">Ask</h4>
              <p className="text-muted-foreground">Chat to clarify, compare, or prepare negotiation points.</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Frequently asked questions</h2>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Is my data secure?</AccordionTrigger>
              <AccordionContent>
                Yes. Documents are handled securely and never shared without your consent.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>What types of files are supported?</AccordionTrigger>
              <AccordionContent>
                Common formats like PDF and DOCX work best for structured extraction.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Can I try it without uploading my own file?</AccordionTrigger>
              <AccordionContent>
                Yes. Use the demo from the home page to explore capabilities instantly.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  );
};

export default Features;


