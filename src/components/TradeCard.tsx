import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Target, ShieldAlert, BarChart3, Info } from 'lucide-react-native';
import { TradeSuggestion } from '../utils/tradingLogic';

interface TradeCardProps {
  suggestion: TradeSuggestion;
}

export const TradeCard: React.FC<TradeCardProps> = ({ suggestion }) => {
  const { name, symbol, currentPrice, entry, target, stopLoss, rsi, rr, score } = suggestion;
  
  const getScoreColor = () => {
    if (score >= 75) return '#4CAF50';
    if (score >= 50) return '#FF9800';
    return '#F44336';
  };

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.symbol}>{symbol} • ${currentPrice.toLocaleString()}</Text>
        </View>
        <View style={[styles.scoreBadge, { backgroundColor: getScoreColor() }]}>
          <Text style={styles.scoreText}>{score}/100</Text>
        </View>
      </View>

      <View style={styles.planContainer}>
        <View style={styles.planItem}>
          <View style={styles.iconCircle}>
            <BarChart3 size={16} color="#2196F3" />
          </View>
          <View>
            <Text style={styles.label}>ENTRY</Text>
            <Text style={styles.value}>${entry.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.planItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Target size={16} color="#2E7D32" />
          </View>
          <View>
            <Text style={styles.label}>TARGET</Text>
            <Text style={styles.value}>${target.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.planItem}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFEBEE' }]}>
            <ShieldAlert size={16} color="#C62828" />
          </View>
          <View>
            <Text style={styles.label}>STOP LOSS</Text>
            <Text style={[styles.value, { color: '#C62828' }]}>${stopLoss.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.stat}>
          <Text style={styles.statLabel}>R/R Ratio</Text>
          <Text style={styles.statValue}>1:{rr}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>RSI (15m)</Text>
          <Text style={styles.statValue}>{rsi}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.stat}>
          <Text style={styles.statLabel}>Volume</Text>
          <Text style={[styles.statValue, { color: suggestion.volumeStatus === 'HIGH' ? '#4CAF50' : '#757575' }]}>
            {suggestion.volumeStatus}
          </Text>
        </View>
      </View>

      <View style={styles.infoBox}>
        <Info size={12} color="#757575" />
        <Text style={styles.infoText}>Suggested based on 15m/1H Time Frame logic.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  symbol: {
    fontSize: 13,
    color: '#757575',
    marginTop: 2,
  },
  scoreBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  planContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  planItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingTop: 12,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 11,
    color: '#757575',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  divider: {
    width: 1,
    height: 20,
    backgroundColor: '#EEEEEE',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    opacity: 0.7,
  },
  infoText: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 4,
  },
});
