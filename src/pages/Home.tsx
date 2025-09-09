import { useState } from "react";
import { Filter, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-games.jpg";
import wingspanCover from "@/assets/wingspan-cover.jpg";
import catanCover from "@/assets/catan-cover.jpg";
import emptyMeeple from "@/assets/empty-meeple.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  // Mock data
  const featuredGames = [
    {
      id: "1",
      title: "Wingspan",
      coverUrl: wingspanCover,
      minPlayers: 1,
      maxPlayers: 5,
      playtimeMin: 70,
      complexity: "medium" as const,
      tags: ["Engine Building", "Birds", "Strategy"],
      ownersNearby: 12,
      distance: "2.1km",
      isAvailable: true
    },
    {
      id: "2", 
      title: "Catan",
      coverUrl: catanCover,
      minPlayers: 3,
      maxPlayers: 4,
      playtimeMin: 60,
      complexity: "easy" as const,
      tags: ["Trading", "Building", "Classic"],
      ownersNearby: 8,
      distance: "1.8km",
      isAvailable: false
    }
  ];

  const filterOptions = [
    "2 Players", "3-4 Players", "5+ Players", 
    "Under 30min", "30-60min", "60+ min",
    "Party", "Strategy", "Co-op", "Family"
  ];

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl mx-4 mt-4">
        <div 
          className="h-48 bg-cover bg-center bg-gradient-primary"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-secondary/60" />
          <div className="relative h-full flex items-center justify-center text-center p-6">
            <div className="space-y-2">
              <h1 className="text-2xl font-display font-bold text-white">
                Find Your Next Game Night
              </h1>
              <p className="text-white/90 text-sm max-w-sm">
                Discover games nearby, connect with players, and never wonder who owns what again.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="px-4">
        <SearchBar 
          onSelect={(result) => {
            if (result.type === "game") {
              navigate(`/game/${result.id}`);
            } else {
              navigate(`/player/${result.id}`);
            }
          }}
        />
      </div>

      {/* Quick Filters */}
      <div className="px-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Quick Filters</h2>
          <Button variant="ghost" size="sm">
            <Sliders className="h-4 w-4 mr-1" />
            More Filters
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {filterOptions.map((filter) => (
            <Badge
              key={filter}
              variant={selectedFilters.includes(filter) ? "default" : "outline"}
              className="cursor-pointer transition-colors"
              onClick={() => toggleFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>
      </div>

      {/* Featured Games */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Featured Games Near You</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate("/map")}>
            View on Map
          </Button>
        </div>

        {featuredGames.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {featuredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onClick={() => navigate(`/game/${game.id}`)}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12 animate-bounce-in">
            <CardContent className="space-y-4">
              <img 
                src={emptyMeeple}
                alt="No games found"
                className="w-16 h-16 mx-auto opacity-60"
              />
              <div className="space-y-2">
                <h3 className="font-semibold">No games yet — add your first treasure!</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Start building your collection or invite friends to join BoardBuddy.
                </p>
              </div>
              <Button onClick={() => navigate("/add-game")}>
                Add Your First Game
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      <div className="px-4 space-y-4">
        <h2 className="font-semibold text-lg">Recent Activity</h2>
        <div className="space-y-3">
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                A
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Alex just added Azul to their collection</p>
                <p className="text-xs text-muted-foreground">2.1km away • 5 minutes ago</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-semibold text-sm">
                S
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Sarah returned Wingspan to Mike</p>
                <p className="text-xs text-muted-foreground">3.4km away • 1 hour ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;