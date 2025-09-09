import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, MapPin, ArrowLeft, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getGameById, getOwnershipsForGame, createRequest, type Game, type Ownership, type User } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

const GameDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [game, setGame] = useState<Game | null>(null);
  const [owners, setOwners] = useState<(Ownership & { user: User })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGameData = async () => {
      if (!id) return;
      
      try {
        const [gameData, ownersData] = await Promise.all([
          getGameById(id),
          getOwnershipsForGame(id)
        ]);
        
        setGame(gameData);
        setOwners(ownersData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load game details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    loadGameData();
  }, [id, toast]);

  const handleRequestToBorrow = async (ownerId: string) => {
    if (!user || !game) return;

    try {
      await createRequest({
        lenderId: ownerId,
        borrowerId: user.id,
        gameId: game.id,
        status: 'pending',
        startDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0], // Next week
        meetupLocation: 'TBD'
      });

      toast({
        title: "Request Sent!",
        description: "Your borrow request has been sent successfully."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send request",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Loading game details...</div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">Game Not Found</h2>
        <p className="text-muted-foreground mb-4">The game you're looking for doesn't exist.</p>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'very_easy': return 'bg-green-500';
      case 'easy': return 'bg-green-400';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div className="px-4 pt-4 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-lg font-semibold">Game Details</h1>
      </div>

      {/* Game Hero */}
      <div className="px-4">
        <Card className="overflow-hidden">
          <div className="flex gap-4 p-6">
            <img
              src={game.coverUrl}
              alt={game.title}
              className="w-24 h-32 object-cover rounded-lg shadow-md"
            />
            
            <div className="flex-1 space-y-3">
              <div>
                <h1 className="text-xl font-display font-bold">{game.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{game.minPlayers}-{game.maxPlayers} players</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{game.playtimeMin} min</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${getComplexityColor(game.complexity)}`} />
                <span className="text-sm capitalize">{game.complexity.replace('_', ' ')} complexity</span>
              </div>
              
              <div className="flex flex-wrap gap-1">
                {game.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <div className="px-4">
        <Card>
          <CardContent className="p-4">
            <h2 className="font-semibold mb-2">About This Game</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {game.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Owners Near You */}
      <div className="px-4">
        <h2 className="font-semibold text-lg mb-4">
          Owners Near You ({owners.length})
        </h2>
        
        {owners.length > 0 ? (
          <div className="space-y-3">
            {owners.map((ownership) => (
              <Card key={ownership.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {ownership.user.displayName[0]}
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{ownership.user.displayName}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs">{ownership.user.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>2.1km away</span>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${
                            ownership.condition === 'new' ? 'condition-new' :
                            ownership.condition === 'like_new' ? 'condition-like-new' :
                            'condition-well-loved'
                          }`}
                        >
                          {ownership.condition.replace('_', ' ')}
                        </Badge>
                        {ownership.isLendable ? (
                          <Badge variant="default" className="text-xs">Available</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Not lending</Badge>
                        )}
                      </div>
                      
                      {ownership.notes && (
                        <p className="text-xs text-muted-foreground italic">
                          "{ownership.notes}"
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    {ownership.isLendable && ownership.userId !== user?.id && (
                      <Button 
                        size="sm"
                        onClick={() => handleRequestToBorrow(ownership.userId)}
                      >
                        Request
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No owners found nearby for this game.
              </p>
              <Button variant="outline">
                Add to Your Collection
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default GameDetail;