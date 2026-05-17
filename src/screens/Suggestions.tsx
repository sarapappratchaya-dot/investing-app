import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { TradeCard } from '../components/TradeCard';
import { fetchCryptoTop50, fetchSETData, fetchNASDAQData, fetchGoldData } from '../services/api';
import { getTopSuggestions, TradeSuggestion } from '../utils/tradingLogic';
import { Zap, ArrowUpDown, Percent, Info, Wallet, TrendingUp, Globe, Coins } from 'lucide-react-native';

type SortType = 'SCORE' | 'RR' | 'RSI';

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: Wallet },
  { id: 'SET', label: 'SET', icon: TrendingUp },
  { id: 'NASDAQ', label: 'NASDAQ', icon: Globe },
  { id: 'CRYPTO', label: 'Crypto', icon: Coins },
  { id: 'GOLD', label: 'Gold', icon: Zap },
];

export default function Suggestions() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('SCORE');

  const loadData = async (force = false) => {
    setLoading(true);
    try {
      const [setStocks, nasdaqStocks, gold, crypto] = await Promise.all([
        fetchSETData(force),
        fetchNASDAQData(force),
        fetchGoldData(force),
        fetchCryptoTop50(force)
      ]);
      
      const allAssets = [...setStocks, ...nasdaqStocks, ...gold, ...crypto];
      const tradeSuggestions = getTopSuggestions(allAssets);
      setSuggestions(tradeSuggestions);
    } catch (error) {
      console.error('Suggestions loading error:', error);
    }
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData(true);
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredSuggestions = selectedCategory === 'ALL' 
    ? suggestions 
    : suggestions.filter(item => item.type === selectedCategory);

  const sortedSuggestions = [...filteredSuggestions].sort((a, b) => {
    if (sortBy === 'SCORE') return b.score - a.score;
    if (sortBy === 'RR') return b.rr - a.rr;
    if (sortBy === 'RSI') return a.rsi - b.rsi;
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Day Trade Scanner</Text>
          <Zap size={24} color="#FFD600" fill="#FFD600" />
        </View>
        <Text style={styles.subtitle}>SET (Yahoo) • NASDAQ (Finnhub)</Text>
      </View>

      <View style={styles.categories}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryItem,
                selectedCategory === item.id && styles.categoryItemSelected
              ]}
              onPress={() => setSelectedCategory(item.id)}
            >
              <item.icon 
                size={14} 
                color={selectedCategory === item.id ? '#fff' : '#757575'} 
              />
              <Text style={[
                styles.categoryLabel,
                selectedCategory === item.id && styles.categoryLabelSelected
              ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      <View style={styles.sortBar}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'SCORE' && styles.sortBtnActive]}
          onPress={() => setSortBy('SCORE')}
        >
          <Text style={[styles.sortBtnText, sortBy === 'SCORE' && styles.sortBtnTextActive]}>Score</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'RR' && styles.sortBtnActive]}
          onPress={() => setSortBy('RR')}
        >
          <ArrowUpDown size={12} color={sortBy === 'RR' ? '#fff' : '#757575'} />
          <Text style={[styles.sortBtnText, sortBy === 'RR' && styles.sortBtnTextActive, { marginLeft: 4 }]}>R/R</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.sortBtn, sortBy === 'RSI' && styles.sortBtnActive]}
          onPress={() => setSortBy('RSI')}
        >
          <Percent size={12} color={sortBy === 'RSI' ? '#fff' : '#757575'} />
          <Text style={[styles.sortBtnText, sortBy === 'RSI' && styles.sortBtnTextActive, { marginLeft: 4 }]}>RSI</Text>
        </TouchableOpacity>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={sortedSuggestions}
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={({ item }) => <TradeCard suggestion={item} />}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListHeaderComponent={
            <View style={styles.banner}>
              <Info size={16} color="#0288D1" />
              <Text style={styles.bannerText}>
                Top setups for {selectedCategory === 'ALL' ? 'all markets' : selectedCategory} based on 15m/1H logic.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  categories: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoriesList: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#2196F3',
  },
  categoryLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#757575',
    marginLeft: 6,
  },
  categoryLabelSelected: {
    color: '#fff',
  },
  sortBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  sortLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9E9E9E',
    marginRight: 12,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 8,
  },
  sortBtnActive: {
    backgroundColor: '#2196F3',
  },
  sortBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
  },
  sortBtnTextActive: {
    color: '#fff',
  },
  listContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  banner: {
    flexDirection: 'row',
    backgroundColor: '#E1F5FE',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  bannerText: {
    fontSize: 12,
    color: '#0288D1',
    marginLeft: 8,
    flex: 1,
    lineHeight: 18,
  },
});
