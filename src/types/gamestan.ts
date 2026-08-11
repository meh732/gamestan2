export type GameType = 'chess' | 'othello' | 'sudoku' | 'puzzle' | 'word' | 'quiz' | 'gardoone' | 'profile' | 'chat' | 'home';

export interface UserProfile {
  name: string;
  avatar: string;
  coins: number;
  gems: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  rank: string;
  leaguePoints: number;
  stats: {
    chessWins: number;
    othelloWins: number;
    sudokuSolved: number;
    puzzleSolved: number;
    quizScore: number;
    wordsFound: number;
  };
}

export interface MauiFile {
  id: string;
  name: string;
  path: string;
  type: 'cs' | 'xaml' | 'csproj';
  description: string;
  content: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
  avatar?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline' | 'ingame';
  game?: string;
  score: number;
}
