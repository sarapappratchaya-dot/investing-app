import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';

interface PriceCardProps {
  name: string;
  symbol: string;
  price: number;
  change: number;
  image?: string;
}

export const PriceCard: React.FC<PriceCardProps> = ({ name, symbol, price, change, image }) => {
  const isPositive = change >= 0;

  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        {image ? (
          <Image source={{ uri: image }} style={styles.icon} />
        ) : (
          <View style={styles.placeholderIcon}>
            <Text style={styles.placeholderText}>{symbol[0]}</Text>
          </View>
        )}
        <View style={styles.info}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol}</Text>
        </View>
      </View>
      <View style={styles.rightContent}>
        <Text style={styles.price}>${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text>
        <View style={[styles.changeBadge, { backgroundColor: isPositive ? '#E8F5E9' : '#FFEBEE' }]}>
          {isPositive ? (
            <TrendingUp size={14} color="#2E7D32" />
          ) : (
            <TrendingDown size={14} color="#C62828" />
          )}
          <Text style={[styles.changeText, { color: isPositive ? '#2E7D32' : '#C62828' }]}>
            {Math.abs(change).toFixed(2)}%
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  placeholderIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9E9E9E',
  },
  info: {
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
  },
  symbol: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#212121',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginTop: 4,
  },
  changeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
