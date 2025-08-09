"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { 
  Users as GamersIcon,
  Search,
  Filter,
  Loader2,
  AlertCircle,
  Users,
  ChevronLeft,
  ChevronRight,
  Trophy
} from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"

// Changed interface from Game to User
interface User {
  id: string
  username: string
  slug: string
  bio?: string | null
  image?: string | null
  country?: string | null
  createdAt?: Date | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
  nextPage: number | null
  prevPage: number | null
}

// Changed component name
export default function GamersPage() {
  // Changed state variable names
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<Pagination | null>(null)
  
  // State for user inputs
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [retryCount, setRetryCount] = useState(0);

  // Debounced search query for API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery)

  // Debounce the search input and reset page to 1
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset page when search query is updated
    }, 500); // 500ms delay
    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // The main effect that triggers the data fetch
  useEffect(() => {
    // Changed function name
    const fetchUsers = async () => {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
            page: currentPage.toString(),
            limit: '12',
        });
        if (debouncedSearchQuery.trim()) {
            params.append('q', debouncedSearchQuery.trim());
        }

        try {
            // Changed API endpoint
            const response = await fetch(`/api/users?${params.toString()}`);
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch users');
            }
            const data = await response.json();
            // Changed state update
            setUsers(data.users || []);
            setPagination(data.pagination);
        } catch (err: any) {
            console.error('Error fetching users:', err);
            setError(err.message || 'An unexpected error occurred.');
            setUsers([]);
            setPagination(null);
        } finally {
            setLoading(false);
        }
    };
    
    fetchUsers();
  }, [currentPage, debouncedSearchQuery, retryCount]);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      setCurrentPage(page);
    }
  };

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-900">
      {/* Header */}
      <section className="py-6 bg-black/20">
        <div className="container mx-auto px-4 max-w-4xl">
          
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                <GamersIcon className="inline mr-3 h-8 w-8 text-green-400" />
                Gamers Directory
              </h1>
              <p className="text-lg text-gray-300 mb-2">
                Explore our community of gamers
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  10,000+ gamers registered
                </span>
                <span className="flex items-center gap-1">
                  <Search className="h-4 w-4" />
                  Real-time search
                </span>
                <span className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Filter by country
                </span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="relative z-20 py-6 bg-gradient-to-r from-white/5 to-white/10 border-b border-white/10">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex flex-col items-start justify-start gap-4 lg:gap-6" style={{minHeight: 'auto', width: '100%', justifyContent: 'center', padding: '1rem 0'}}>
            
            {/* First Row - Search Bar and Leaderboard button */}
            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 lg:gap-6 w-full">
              {/* Search Input Group */}
              <div className="relative group flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                <div className="relative flex items-center w-full h-12 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl shadow-lg hover:shadow-green-500/20 transition-all duration-300 group-hover:border-green-400/30 pr-2">
                  <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 ml-3 sm:ml-4 mr-2 sm:mr-3 group-hover:text-green-400 transition-colors duration-200" />
                  <input
                    type="text"
                    placeholder="Search gamers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 focus:outline-none text-sm sm:text-base font-medium"
                  />
                </div>
              </div>

              {/* Leaderboard Button */}
              <Link href="/leaderboard" passHref>
                <Button variant="outline" className="h-12 sm:h-14 bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-green-400/50 transition-all duration-300 flex items-center justify-center px-4 rounded-2xl shadow-lg">
                  <Trophy className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span className="font-semibold">Leaderboard</span>
                </Button>
              </Link>

            </div>
          </div>
        </div>
      </section>

      {/* Gamers Grid */}
      <section className="relative z-0 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-green-400" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="h-12 w-12 text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Error Loading Gamers</h3>
              <p className="text-gray-400 mb-4">{error}</p>
              <Button onClick={handleRetry} className="gaming-button">
                Try Again
              </Button>
            </div>
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <Users className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Gamers Found</h3>
              <p className="text-gray-400 mb-4 text-center">
                No gamers match your current search criteria.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {users.map((user) => (
                  <Link href={`/gamers/${user.slug}`} key={user.id} className="block group">
                    <Card className="h-full bg-slate-800/50 border-slate-700/50 rounded-lg overflow-hidden transition-all duration-300 hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10 flex flex-col">
                      <div className="aspect-square overflow-hidden">
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.username}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-slate-800">
                            <Users className="h-10 w-10 text-slate-500" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 text-center">
                        <h3 className="font-semibold text-white text-sm truncate group-hover:text-green-400 transition-colors">{user.username}</h3>
                        <p className="text-xs text-gray-400 mt-1">{user.country || 'Unknown'}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <Button
                    onClick={() => handlePageChange(pagination.prevPage!)}
                    disabled={!pagination.hasPrev}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg">
                    <span className="text-white font-medium">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                  </div>
                  
                  <Button
                    onClick={() => handlePageChange(pagination.nextPage!)}
                    disabled={!pagination.hasNext}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
