import { useState, useEffect } from "react";
import { Filter, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/SearchBar";
import GameCard from "@/components/GameCard";
import { useNavigate } from "react-router-dom";
import { getGames, type Game } from "@/lib/database";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-games.jpg";
import wingspanCover from "@/assets/wingspan-cover.jpg";
import catanCover from "@/assets/catan-cover.jpg";
import emptyMeeple from "@/assets/empty-meeple.jpg";

const Home = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const games = await getGames();
        const gamesWithMockData = games.map(game => ({
          ...game,
          ownersNearby: Math.floor(Math.random() * 15) + 1,
          distance: `${(Math.random() * 3 + 0.5).toFixed(1)}km`,
          isAvailable: Math.random() > 0.3
        }));
        setFeaturedGames(gamesWithMockData);
      } catch (error) {
        console.error('Failed to load games:', error);
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

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
                Welcome to Jaipur Meeples
              </h1>
              <p className="text-white/90 text-sm max-w-sm">
                Discover games nearby, connect with players in Jaipur, and never wonder who owns what again.
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

        {loading ? (
          <div className="grid grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="bg-muted h-24 rounded mb-2" />
                  <div className="bg-muted h-4 rounded mb-1" />
                  <div className="bg-muted h-3 rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : featuredGames.length > 0 ? (
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
                  Start building your collection or invite friends to join Jaipur Meeples.
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
                <p className="text-xs text-muted-foreground">Jaipur, Rajasthan • 5 minutes ago</p>
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
                <p className="text-xs text-muted-foreground">Jaipur, Rajasthan • 1 hour ago</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Home;