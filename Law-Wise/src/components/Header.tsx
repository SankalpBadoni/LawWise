import { Upload, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import legalScaleIcon from "@/assets/legal-scale-icon.png";

interface HeaderProps {
  onUploadClick: () => void;
}

export function Header({ onUploadClick }: HeaderProps) {
  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3">
        <Image 
          src={legalScaleIcon}
          alt="LawWise Logo" 
          className="w-8 h-8"
          width={32}
          height={32}
          priority
        />
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          LawWise
        </h1>
      </div>

      {/* Navigation */}
      <nav className="hidden md:flex items-center gap-8">
        <Link href="/" className="text-foreground hover:text-primary transition-colors">
          Home
        </Link>
        <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
          Features
        </Link>
        <Link href={{ pathname: "/pricing" }} className="text-foreground hover:text-accent transition-colors">
  Pricing
</Link>

      </nav>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Button 
          onClick={onUploadClick}
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary"
        >
          <Upload className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="sm" 
          className="text-muted-foreground hover:text-primary"
        >
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
