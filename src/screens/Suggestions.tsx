import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { TradeCard } from '../components/TradeCard';
import { fetchCryptoTop50, fetchLiveStockData } from '../services/api';
import { getTopSuggestions, TradeSuggestion } from '../utils/tradingLogic';
import { Zap, ArrowUpDown, Percent, Info } from 'lucide-react-native';

type SortType = 'SCORE' | 'RR' | 'RSI';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState<TradeSuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [sortBy, setSortBy] = useState<SortType>('SCORE');

  const loadData = async () => {
    setLoading(true);
    const stocks = await fetchLiveStockData();
    const crypto = await fetchCryptoTop50();
    const allAssets = [...stocks, ...crypto];
    const tradeSuggestions = getTopSuggestions(allAssets);
    setSuggestions(tradeSuggestions);
    setLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const sortedSuggestions = [...suggestions].sort((a, b) => {
    if (sortBy === 'SCORE') return b.score - a.score;
    if (sortBy === 'RR') return b.rr - a.rr;
    if (sortBy === 'RSI') return a.rsi - b.rsi; // Lower RSI is better for buying
    return 0;
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>Day Trade Suggestions</Text>
          <Zap size={24} color="#FFD600" fill="#FFD600" />
        </View>
        <Text style={styles.subtitle}>Daily setups for beginners</Text>
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
                Always use a Stop Loss. These suggestions are based on 15m/1H technical indicators.
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
