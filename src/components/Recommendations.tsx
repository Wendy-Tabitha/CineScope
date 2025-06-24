// @/components/Recommendations.tsx
"use client";

import { useState } from 'react';
import { recommendMovies } from '@/ai/flows/recommend-movies';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Wand2, Loader2 } from 'lucide-react';

interface RecommendationsProps {
  watchlistTitles: string[];
}

export function Recommendations({ watchlistTitles }: RecommendationsProps) {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await recommendMovies({ watchlist: watchlistTitles });
      setRecommendations(result);
    } catch (e) {
      setError('Could not get recommendations. Please try again.');
      console.error(e);
    }
    setIsLoading(false);
  };

  return (
    <Card className="bg-card/50 border-accent/30 border-dashed">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-accent">
          <Wand2 />
          Recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-muted-foreground">
          Get personalized recommendations based on your watchlist.
        </p>
        <Button onClick={handleGetRecommendations} disabled={isLoading || watchlistTitles.length === 0}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : "Get AI Recommendations"}
        </Button>
        {watchlistTitles.length === 0 && (
            <p className="text-sm text-amber-500 mt-2">Add items to your watchlist to get recommendations.</p>
        )}

        {error && <p className="mt-4 text-destructive">{error}</p>}
        
        {recommendations.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-headline font-semibold mb-3">Here are some suggestions for you:</h3>
            <ul className="list-disc list-inside space-y-2">
              {recommendations.map((rec, index) => (
                <li key={index} className="text-foreground/90">{rec}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
