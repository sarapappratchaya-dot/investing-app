import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator, RefreshControl } from 'react-native';
import { PriceCard } from '../components/PriceCard';
import { fetchCryptoTop50, fetchLiveMarketData } from '../services/api';
import { Wallet, TrendingUp, Globe, Coins } from 'lucide-react-native';

const CATEGORIES = [
  { id: 'ALL', label: 'All', icon: Wallet },
  { id: 'THAI', label: 'Thai Stock', icon: TrendingUp },
  { id: 'CRYPTO', label: 'Crypto', icon: Coins },
  { id: 'GLOBAL', label: 'Global', icon: Globe },
];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const thaiStocks = await fetchLiveMarketData('THAI');
      const globalStocks = await fetchLiveMarketData('GLOBAL');
      const crypto = await fetchCryptoTop50();
      setData([...thaiStocks, ...globalStocks, ...crypto]);
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
        <Text style={styles.subtitle}>Market Scan (SET100 & NASDAQ)</Text>
      </View>

      <View style={styles.categories}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat.id}
            style={[
              styles.categoryItem,
              selectedCategory === cat.id && styles.categoryItemSelected
            ]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <cat.icon 
              size={18} 
              color={selectedCategory === cat.id ? '#fff' : '#757575'} 
            />
            <Text style={[
              styles.categoryLabel,
              selectedCategory === cat.id && styles.categoryLabelSelected
            ]}>
              {cat.label}
            </Text>
          </TouchableOpacity>
        ))}
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
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: '#F5F5F5',
  },
  categoryItemSelected: {
    backgroundColor: '#2196F3',
  },
  categoryLabel: {
    fontSize: 12,
    fontWeight: '600',
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
