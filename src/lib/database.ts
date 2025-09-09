// Mock database layer for Jaipur Meeples

export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  minPlayers: number;
  maxPlayers: number;
  playtimeMin: number;
  complexity: 'very_easy' | 'easy' | 'medium' | 'hard';
  tags: string[];
  description: string;
}

export interface Ownership {
  id: string;
  userId: string;
  gameId: string;
  condition: 'new' | 'like_new' | 'sleeved' | 'well_loved';
  isLendable: boolean;
  notes: string;
  availabilitySlots: string[];
}

export interface Request {
  id: string;
  lenderId: string;
  borrowerId: string;
  gameId: string;
  status: 'pending' | 'accepted' | 'declined' | 'active' | 'overdue' | 'returned';
  startDate: string;
  endDate: string;
  meetupLocation?: string;
  chatThreadId?: string;
}

export interface User {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio: string;
  preferredGenres: string[];
  geoHashApprox: string;
  city: string;
  rating: number;
}

// Mock data
export const mockGames: Game[] = [
  {
    id: '1',
    title: 'Wingspan',
    coverUrl: '/src/assets/wingspan-cover.jpg',
    minPlayers: 1,
    maxPlayers: 5,
    playtimeMin: 70,
    complexity: 'medium',
    tags: ['Engine Building', 'Birds', 'Strategy'],
    description: 'Wingspan is a competitive, medium-weight, card-driven, engine-building board game from Stonemaier Games.'
  },
  {
    id: '2',
    title: 'Catan',
    coverUrl: '/src/assets/catan-cover.jpg',
    minPlayers: 3,
    maxPlayers: 4,
    playtimeMin: 60,
    complexity: 'easy',
    tags: ['Trading', 'Building', 'Classic'],
    description: 'The classic game of trading, building, and settling the island of Catan.'
  },
  {
    id: '3',
    title: 'Azul',
    coverUrl: '/api/placeholder/200/300',
    minPlayers: 2,
    maxPlayers: 4,
    playtimeMin: 45,
    complexity: 'easy',
    tags: ['Tile Placement', 'Abstract'],
    description: 'Beautiful tile-laying game where players compete to create stunning mosaics.'
  },
  {
    id: '4',
    title: 'Ticket to Ride',
    coverUrl: '/api/placeholder/200/300',
    minPlayers: 2,
    maxPlayers: 5,
    playtimeMin: 60,
    complexity: 'easy',
    tags: ['Route Building', 'Set Collection'],
    description: 'Cross-country train adventure where players collect cards and claim railway routes.'
  }
];

export const mockOwnerships: Ownership[] = [
  {
    id: 'own1',
    userId: 'user1',
    gameId: '1',
    condition: 'like_new',
    isLendable: true,
    notes: 'All components included, sleeved cards',
    availabilitySlots: ['2024-01-15', '2024-01-22', '2024-01-29']
  },
  {
    id: 'own2',
    userId: 'user1',
    gameId: '2',
    condition: 'well_loved',
    isLendable: false,
    notes: 'Some wear on box, all pieces present',
    availabilitySlots: []
  },
  {
    id: 'own3',
    userId: 'user2',
    gameId: '3',
    condition: 'new',
    isLendable: true,
    notes: 'Still in shrink wrap',
    availabilitySlots: ['2024-01-20', '2024-01-27']
  }
];

export const mockUsers: User[] = [
  {
    id: 'user1',
    displayName: 'Alex Chen',
    bio: 'Board game enthusiast who loves strategy games and hosting game nights!',
    city: 'Jaipur, Rajasthan',
    rating: 4.8,
    geoHashApprox: 'tux9qh',
    preferredGenres: ['Strategy', 'Engine Building', 'Co-op', 'Euro']
  },
  {
    id: 'user2',
    displayName: 'Sarah Wilson',
    bio: 'Love party games and family-friendly board games!',
    city: 'Jaipur, Rajasthan',
    rating: 4.9,
    geoHashApprox: 'tux9qk',
    preferredGenres: ['Party', 'Family', 'Social Deduction']
  },
  {
    id: 'user3',
    displayName: 'Mike Sharma',
    bio: 'Always looking for new games to try!',
    city: 'Jaipur, Rajasthan',
    rating: 4.7,
    geoHashApprox: 'tux9qm',
    preferredGenres: ['Adventure', 'Thematic', 'Deck Building']
  }
];

export const mockRequests: Request[] = [
  {
    id: 'req1',
    lenderId: 'user1',
    borrowerId: 'user2',
    gameId: '1',
    status: 'active',
    startDate: '2024-01-10',
    endDate: '2024-01-17',
    meetupLocation: 'Central Park, Jaipur'
  }
];

// Database functions
export const getGames = async (): Promise<Game[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockGames;
};

export const getGameById = async (id: string): Promise<Game | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockGames.find(g => g.id === id) || null;
};

export const getOwnershipsForGame = async (gameId: string): Promise<(Ownership & { user: User })[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockOwnerships
    .filter(o => o.gameId === gameId)
    .map(ownership => ({
      ...ownership,
      user: mockUsers.find(u => u.id === ownership.userId)!
    }));
};

export const getUserOwnerships = async (userId: string): Promise<(Ownership & { game: Game })[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockOwnerships
    .filter(o => o.userId === userId)
    .map(ownership => ({
      ...ownership,
      game: mockGames.find(g => g.id === ownership.gameId)!
    }));
};

export const searchGames = async (query: string): Promise<Game[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const lowercaseQuery = query.toLowerCase();
  return mockGames.filter(game => 
    game.title.toLowerCase().includes(lowercaseQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const getNearbyUsers = async (): Promise<User[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockUsers;
};

export const createRequest = async (request: Omit<Request, 'id'>): Promise<Request> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const newRequest: Request = {
    ...request,
    id: `req_${Date.now()}`
  };
  mockRequests.push(newRequest);
  return newRequest;
};

export const getUserRequests = async (userId: string): Promise<Request[]> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockRequests.filter(r => r.lenderId === userId || r.borrowerId === userId);
};