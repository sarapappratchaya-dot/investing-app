import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import Dashboard from './src/screens/Dashboard';
import Suggestions from './src/screens/Suggestions';
import { LayoutDashboard, Lightbulb } from 'lucide-react-native';

export default function App() {
  const [activeTab, setActiveTab] = useState<'MARKET' | 'SUGGESTIONS'>('MARKET');

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {activeTab === 'MARKET' ? <Dashboard /> : <Suggestions />}
      </View>
      
      <SafeAreaView style={styles.tabBar}>
        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('MARKET')}
        >
          <LayoutDashboard 
            size={24} 
            color={activeTab === 'MARKET' ? '#2196F3' : '#757575'} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'MARKET' ? '#2196F3' : '#757575' }]}>
            Market
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.tabItem} 
          onPress={() => setActiveTab('SUGGESTIONS')}
        >
          <Lightbulb 
            size={24} 
            color={activeTab === 'SUGGESTIONS' ? '#2196F3' : '#757575'} 
          />
          <Text style={[styles.tabLabel, { color: activeTab === 'SUGGESTIONS' ? '#2196F3' : '#757575' }]}>
            Suggestions
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 80,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    paddingBottom: 20,
  },
  tabItem: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});
