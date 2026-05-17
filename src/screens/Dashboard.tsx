import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { PriceCard } from '../components/PriceCard';
import { fetchCryptoTop50, fetchLiveMarketData } from '../services/api';
import { Wallet, TrendingUp, Globe, Coins, Zap } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: Wallet },
  { id: 'SET', label: 'SET', icon: TrendingUp },
  { id: 'NASDAQ', label: 'NASDAQ', icon: Globe },
  { id: 'CRYPTO', label: 'Crypto', icon: Coins },
  { id: 'GOLD', label: 'Gold', icon: Zap },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const setStocks = await fetchLiveMarketData('SET');
      const nasdaqStocks = await fetchLiveMarketData('NASDAQ');
      const gold = await fetchLiveMarketData('GOLD');
      const crypto = await fetchCryptoTop50();
      setData([...setStocks, ...nasdaqStocks, ...gold, ...crypto]);
    } catch (error) {
      console.error('Dashboard loading error:', error);
    }
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

  const filteredData = selectedCategory === 'ALL' 
    ? data 
    : data.filter(item => item.type === selectedCategory);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Investing</Text>
        <Text style={styles.subtitle}>Market Overview</Text>
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

      {loading && !refreshing ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <FlatList
          data={filteredData}
          keyExtractor={item => `${item.type}-${item.id}`}
          renderItem={({ item }) => (
            <PriceCard
              name={item.name}
              symbol={item.symbol}
              price={item.price}
              change={item.change}
              image={item.image}
            />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
  title: {
    fontSize: 28,
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
  listContent: {
    padding: 16,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
