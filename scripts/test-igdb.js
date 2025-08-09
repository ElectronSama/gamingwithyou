#!/usr/bin/env node

/**
 * IGDB Integration Test Script
 * 
 * This script tests the IGDB integration and sync functionality.
 * Run with: node scripts/test-igdb.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function testIGDBIntegration() {
  console.log('🧪 Testing IGDB Integration...\n');

  try {
    // Test 1: Search games
    console.log('1. Testing IGDB search...');
    const searchResponse = await axios.get(`${BASE_URL}/igdb/search?q=witcher&limit=5`);
    console.log(`✅ Found ${searchResponse.data.games.length} games for "witcher"`);
    
    // Test 2: Get popular games
    console.log('\n2. Testing popular games...');
    const popularResponse = await axios.get(`${BASE_URL}/igdb/popular?limit=5`);
    console.log(`✅ Found ${popularResponse.data.games.length} popular games`);
    
    // Test 3: Get genres
    console.log('\n3. Testing genres...');
    const genresResponse = await axios.get(`${BASE_URL}/igdb/genres`);
    console.log(`✅ Found ${genresResponse.data.length} genres`);
    
    // Test 4: Get platforms
    console.log('\n4. Testing platforms...');
    const platformsResponse = await axios.get(`${BASE_URL}/igdb/platforms`);
    console.log(`✅ Found ${platformsResponse.data.length} platforms`);
    
    // Test 5: Cache statistics
    console.log('\n5. Testing cache...');
    const cacheResponse = await axios.get(`${BASE_URL}/igdb/cache`);
    console.log(`✅ Cache size: ${cacheResponse.data.cache.size}`);
    
    // Test 6: Sync games by search
    console.log('\n6. Testing game sync...');
    const syncResponse = await axios.post(`${BASE_URL}/games/sync`, {
      query: 'cyberpunk',
      limit: 3
    });
    console.log(`✅ Synced ${syncResponse.data.totalSynced} games, ${syncResponse.data.totalErrors} errors`);
    
    // Test 7: Sync popular games
    console.log('\n7. Testing popular games sync...');
    const popularSyncResponse = await axios.post(`${BASE_URL}/games/sync/popular`, {
      limit: 5
    });
    console.log(`✅ Synced ${popularSyncResponse.data.totalSynced} popular games, ${popularSyncResponse.data.totalErrors} errors`);
    
    // Test 8: Get sync statistics
    console.log('\n8. Testing sync statistics...');
    const statsResponse = await axios.get(`${BASE_URL}/games/sync/stats`);
    console.log(`✅ Total games: ${statsResponse.data.stats.totalGames}`);
    console.log(`✅ Games with IGDB: ${statsResponse.data.stats.gamesWithIGDB}`);
    console.log(`✅ Sync percentage: ${statsResponse.data.stats.syncPercentage}%`);
    
    console.log('\n🎉 All tests passed! IGDB integration is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.response?.data?.error || error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Make sure your IGDB_CLIENT_ID and IGDB_CLIENT_SECRET are set correctly in your .env.local file.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Make sure your development server is running on http://localhost:3000');
    }
  }
}

async function testErrorHandling() {
  console.log('\n🧪 Testing Error Handling...\n');
  
  try {
    // Test empty search
    console.log('1. Testing empty search...');
    await axios.get(`${BASE_URL}/igdb/search?q=&limit=5`);
    console.log('❌ Should have failed with empty query');
  } catch (error) {
    if (error.response?.status === 400) {
      console.log('✅ Correctly rejected empty search query');
    } else {
      console.log('❌ Unexpected error for empty query');
    }
  }
  
  try {
    // Test invalid game ID
    console.log('\n2. Testing invalid game ID...');
    await axios.get(`${BASE_URL}/igdb/game/999999999`);
    console.log('❌ Should have failed with invalid game ID');
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('✅ Correctly handled invalid game ID');
    } else {
      console.log('❌ Unexpected error for invalid game ID');
    }
  }
  
  console.log('\n✅ Error handling tests completed.');
}

async function testMainGamesFiltering() {
  console.log('\n🧪 Testing Main Games Filtering...\n');
  
  try {
    // Test 1: Check that games API only returns main games
    console.log('1. Testing games API filtering...');
    const gamesResponse = await axios.get(`${BASE_URL}/igdb/games?limit=20`);
    console.log(`✅ Found ${gamesResponse.data.games.length} games`);
    
    // Check for common DLC/expansion keywords in game names
    const dlcKeywords = ['DLC', 'Expansion', 'Season Pass', 'Add-on', 'Pack', 'Bundle'];
    const suspiciousGames = gamesResponse.data.games.filter(game => 
      dlcKeywords.some(keyword => 
        game.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (suspiciousGames.length > 0) {
      console.log(`⚠️  Found ${suspiciousGames.length} potentially non-main games:`);
      suspiciousGames.forEach(game => {
        console.log(`   - ${game.name}`);
      });
    } else {
      console.log('✅ No DLCs or expansions found in results');
    }
    
    // Test 2: Search for a game that might have DLCs
    console.log('\n2. Testing search filtering...');
    const searchResponse = await axios.get(`${BASE_URL}/igdb/games?q=witcher&limit=10`);
    console.log(`✅ Found ${searchResponse.data.games.length} games for "witcher"`);
    
    const suspiciousSearchResults = searchResponse.data.games.filter(game => 
      dlcKeywords.some(keyword => 
        game.name.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (suspiciousSearchResults.length > 0) {
      console.log(`⚠️  Found ${suspiciousSearchResults.length} potentially non-main games in search:`);
      suspiciousSearchResults.forEach(game => {
        console.log(`   - ${game.name}`);
      });
    } else {
      console.log('✅ No DLCs or expansions found in search results');
    }
    
    console.log('\n✅ Main games filtering test completed.');
    
  } catch (error) {
    console.error('\n❌ Main games filtering test failed:', error.response?.data?.error || error.message);
  }
}

async function clearCache() {
  console.log('\n🧹 Clearing cache...');
  
  try {
    await axios.delete(`${BASE_URL}/igdb/cache`);
    console.log('✅ Cache cleared successfully');
  } catch (error) {
    console.log('❌ Failed to clear cache:', error.response?.data?.error || error.message);
  }
}

// Main execution
async function main() {
  console.log('🚀 IGDB Integration Test Suite\n');
  
  await testIGDBIntegration();
  await testErrorHandling();
  await testMainGamesFiltering();
  await clearCache();
  
  console.log('\n✨ Test suite completed!');
}

// Run the tests
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { testIGDBIntegration, testErrorHandling, testMainGamesFiltering, clearCache }; 