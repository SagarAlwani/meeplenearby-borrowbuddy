import { Clock, Users, MapPin, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GameCardProps {
  game: {
    id: string;
    title: string;
    coverUrl: string;
    minPlayers: number;
    maxPlayers: number;
    playtimeMin: number;
    complexity: "very_easy" | "easy" | "medium" | "hard";
    tags: string[];
    ownersNearby: number;
    distance?: string;
    isAvailable?: boolean;
  };
  onClick?: () => void;
  className?: string;
}

const complexityLabels = {
  very_easy: "Very Easy",
  easy: "Easy", 
  medium: "Medium",
  hard: "Hard"
};

const complexityColors = {
  very_easy: "bg-accent",
  easy: "bg-accent-light", 
  medium: "bg-primary-light",
  hard: "bg-secondary"
};

const GameCard = ({ game, onClick, className }: GameCardProps) => {
  return (
    <Card 
      className={cn("game-card bg-gradient-card shadow-card", className)}
      onClick={onClick}
    >
      <CardContent className="p-0">
        {/* Cover Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
          <img
            src={game.coverUrl}
            alt={game.title}
            className="w-full h-full object-cover"
          />
          {game.isAvailable !== undefined && (
            <div className="absolute top-2 right-2">
              <Badge
                variant={game.isAvailable ? "default" : "secondary"}
                className={cn(
                  "text-xs px-2 py-1",
                  game.isAvailable ? "bg-accent text-white" : "bg-muted"
                )}
              >
                {game.isAvailable ? "Available" : "Borrowed"}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-3 space-y-2">
          <h3 className="font-semibold text-sm leading-tight line-clamp-2">
            {game.title}
          </h3>

          {/* Game Info */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>{game.minPlayers === game.maxPlayers ? game.minPlayers : `${game.minPlayers}-${game.maxPlayers}`}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{game.playtimeMin}min</span>
            </div>
          </div>

          {/* Complexity */}
          <div className="flex items-center gap-2">
            <Badge
              className={cn(
                "text-xs px-2 py-0.5 text-white",
                complexityColors[game.complexity]
              )}
            >
              {complexityLabels[game.complexity]}
            </Badge>
          </div>

          {/* Tags */}
          {game.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {game.tags.slice(0, 2).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-xs px-1.5 py-0.5"
                >
                  {tag}
                </Badge>
              ))}
              {game.tags.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0.5">
                  +{game.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="p-3 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" />
          <span>{game.ownersNearby} owner{game.ownersNearby !== 1 ? 's' : ''} nearby</span>
          {game.distance && (
            <>
              <span>•</span>
              <span>{game.distance}</span>
            </>
          )}
        </div>
        
        <Button 
          size="sm" 
          variant="outline"
          className="text-xs px-2 py-1 h-auto"
          onClick={(e) => {
            e.stopPropagation();
            // Handle request action
          }}
        >
          Request
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;