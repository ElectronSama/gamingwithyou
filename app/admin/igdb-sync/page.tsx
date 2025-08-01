"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Search, Download, Star } from "lucide-react"

export default function IGDBSyncPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [syncing, setSyncing] = useState(false)
  const [syncResults, setSyncResults] = useState<any[]>([])
  const [syncingPopular, setSyncingPopular] = useState(false)

  const handleSearchAndSync = async () => {
    if (!searchQuery.trim()) return

    try {
      setSyncing(true)
      const response = await fetch('/api/games/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          limit: 10
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSyncResults(data.games)
      } else {
        console.error('Failed to sync games')
      }
    } catch (error) {
      console.error('Error syncing games:', error)
    } finally {
      setSyncing(false)
    }
  }

  const handleSyncPopular = async () => {
    try {
      setSyncingPopular(true)
      const response = await fetch('/api/games/sync/popular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 20
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSyncResults(data.games)
      } else {
        console.error('Failed to sync popular games')
      }
    } catch (error) {
      console.error('Error syncing popular games:', error)
    } finally {
      setSyncingPopular(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900 p-8">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            IGDB Sync Manager
          </h1>
          <p className="text-gray-300">
            Sync games from IGDB to your local database
          </p>
        </div>

        <div className="grid gap-6">
          {/* Search and Sync */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="text-white">Search and Sync Games</CardTitle>
              <CardDescription className="text-gray-300">
                Search for games on IGDB and sync them to your database
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <Label htmlFor="search" className="text-white">Search Query</Label>
                  <Input
                    id="search"
                    placeholder="Enter game name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearchAndSync()}
                    className="mt-2"
                  />
                </div>
                <div className="flex items-end">
                  <Button 
                    onClick={handleSearchAndSync}
                    disabled={syncing || !searchQuery.trim()}
                    className="gaming-button"
                  >
                    {syncing ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Search className="h-4 w-4 mr-2" />
                    )}
                    Search & Sync
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sync Popular Games */}
          <Card className="gaming-card">
            <CardHeader>
              <CardTitle className="text-white">Sync Popular Games</CardTitle>
              <CardDescription className="text-gray-300">
                Sync the most popular games from IGDB
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleSyncPopular}
                disabled={syncingPopular}
                className="gaming-button"
              >
                {syncingPopular ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Sync Popular Games
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {syncResults.length > 0 && (
            <Card className="gaming-card">
              <CardHeader>
                <CardTitle className="text-white">Synced Games</CardTitle>
                <CardDescription className="text-gray-300">
                  {syncResults.length} games have been synced
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {syncResults.map((game) => (
                    <div key={game.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                      <div className="flex items-center gap-4">
                        {game.igdbCoverUrl && (
                          <img 
                            src={game.igdbCoverUrl} 
                            alt={game.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        )}
                        <div>
                          <h3 className="text-white font-semibold">{game.name}</h3>
                          <p className="text-gray-300 text-sm">{game.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            {game.genre && (
                              <span className="text-green-300 text-sm">{game.genre}</span>
                            )}
                            {game.igdbRating && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-yellow-300 text-sm">{game.igdbRating.toFixed(1)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-green-400 text-sm">
                        ✓ Synced
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
} 