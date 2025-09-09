import { useState } from "react";
import { Star, MapPin, Clock, Users, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GameCard from "@/components/GameCard";
import wingspanCover from "@/assets/wingspan-cover.jpg";
import catanCover from "@/assets/catan-cover.jpg";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const [isMyProfile] = useState(true); // In real app, this would check if viewing own profile

  // Mock user data
  const user = {
    id: "user1",
    displayName: "Alex Chen",
    avatar: "A",
    bio: "Board game enthusiast who loves strategy games and hosting game nights!",
    city: "San Francisco, CA",
    rating: 4.8,
    totalReviews: 24,
    gamesOwned: 12,
    gamesWishlisted: 8,
    gamesLent: 32,
    preferredGenres: ["Strategy", "Engine Building", "Co-op", "Euro"]
  };

  // Mock owned games
  const ownedGames = [
    {
      id: "1",
      title: "Wingspan",
      coverUrl: wingspanCover,
      minPlayers: 1,
      maxPlayers: 5,
      playtimeMin: 70,
      complexity: "medium" as const,
      tags: ["Engine Building", "Birds", "Strategy"],
      ownersNearby: 0, // Not applicable for owned games
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
      ownersNearby: 0,
      isAvailable: false
    }
  ];

  // Mock wishlist games
  const wishlistGames = [
    {
      id: "3",
      title: "Azul",
      coverUrl: "/api/placeholder/200/300",
      minPlayers: 2,
      maxPlayers: 4,
      playtimeMin: 45,
      complexity: "easy" as const,
      tags: ["Tile Placement", "Abstract"],
      ownersNearby: 3,
      distance: "1.2km"
    }
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Profile Header */}
      <div className="px-4 pt-4">
        <Card className="bg-gradient-card">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {user.avatar}
                </div>
                
                <div className="space-y-2">
                  <div>
                    <h1 className="text-xl font-display font-bold">{user.displayName}</h1>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span>{user.city}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{user.rating}</span>
                      <span className="text-muted-foreground">({user.totalReviews} reviews)</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground max-w-sm">
                    {user.bio}
                  </p>
                </div>
              </div>
              
              {isMyProfile && (
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            {/* Stats */}
            <div className="mt-6 grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-xl font-bold text-primary">{user.gamesOwned}</div>
                <div className="text-xs text-muted-foreground">Games Owned</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-accent">{user.gamesLent}</div>
                <div className="text-xs text-muted-foreground">Times Lent</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-secondary">{user.gamesWishlisted}</div>
                <div className="text-xs text-muted-foreground">Wishlist</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preferred Genres */}
      <div className="px-4">
        <h2 className="font-semibold mb-3">Preferred Genres</h2>
        <div className="flex flex-wrap gap-2">
          {user.preferredGenres.map((genre) => (
            <Badge key={genre} variant="outline">
              {genre}
            </Badge>
          ))}
        </div>
      </div>

      {/* Games Tabs */}
      <div className="px-4">
        <Tabs defaultValue="owned" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="owned">Owned ({user.gamesOwned})</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist ({user.gamesWishlisted})</TabsTrigger>
            <TabsTrigger value="lending">Lending</TabsTrigger>
          </TabsList>
          
          <TabsContent value="owned" className="space-y-4 mt-4">
            {isMyProfile && (
              <Button 
                onClick={() => navigate("/add-game")}
                className="w-full"
                variant="outline"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Game to Collection
              </Button>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              {ownedGames.map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onClick={() => navigate(`/game/${game.id}`)}
                />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="wishlist" className="space-y-4 mt-4">
            {wishlistGames.length > 0 ? (
              <div className="grid grid-cols-2 gap-4">
                {wishlistGames.map((game) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    onClick={() => navigate(`/game/${game.id}`)}
                  />
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <p className="text-muted-foreground">No games in wishlist yet</p>
                  <Button variant="outline" className="mt-2">
                    Browse Games
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="lending" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={wingspanCover}
                      alt="Wingspan"
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div>
                      <h3 className="font-medium">Wingspan</h3>
                      <p className="text-sm text-muted-foreground">
                        Lent to Sarah • Due Friday
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline">Active</Badge>
                </div>
              </Card>
              
              <Card className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <Users className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-medium">Request from Mike</h3>
                      <p className="text-sm text-muted-foreground">
                        Wants to borrow Azul
                      </p>
                    </div>
                  </div>
                  <Badge>Pending</Badge>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;