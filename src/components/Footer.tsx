import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <div className="text-center py-4 px-4 border-t bg-muted/30">
      <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
        designed with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> from Sagar
      </p>
    </div>
  );
};

export default Footer;