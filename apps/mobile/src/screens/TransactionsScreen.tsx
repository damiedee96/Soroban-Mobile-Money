import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';
import { Transaction } from '@soroban-mm/shared';

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiClient.get('/transactions').then((res) => {
      setTransactions(res.data.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4f46e5" /></View>;
  }

  return (
    <FlatList
      style={styles.list}
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.item}>
          <View>
            <Text style={styles.type}>{item.type.replace('_', ' ').toUpperCase()}</Text>
            <Text style={styles.date}>{new Date(item.createdAt).toLocaleDateString()}</Text>
          </View>
          <View style={styles.right}>
            <Text style={[styles.amount, item.type === 'receive' ? styles.green : styles.red]}>
              {item.type === 'receive' ? '+' : '-'}{item.amount} {item.currency}
            </Text>
            <Text style={styles.status}>{item.status}</Text>
          </View>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.empty}>No transactions yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '#fff', padding: 16, marginHorizontal: 16, marginTop: 8, borderRadius: 10 },
  type: { fontWeight: '600', color: '#1a1a2e' },
  date: { color: '#999', fontSize: 12, marginTop: 2 },
  right: { alignItems: 'flex-end' },
  amount: { fontWeight: 'bold', fontSize: 16 },
  status: { fontSize: 11, color: '#999', marginTop: 2 },
  green: { color: '#16a34a' },
  red: { color: '#dc2626' },
  empty: { textAlign: 'center', marginTop: 40, color: '#999' },
});
