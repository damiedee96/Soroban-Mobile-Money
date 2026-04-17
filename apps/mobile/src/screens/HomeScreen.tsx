import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useWalletStore } from '../store/walletStore';
import { formatAmount, truncateAddress } from '@soroban-mm/shared';

export default function HomeScreen({ navigation }: any) {
  const { wallet, loading, fetchWallet, createWallet } = useWalletStore();

  useEffect(() => { fetchWallet(); }, []);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#4f46e5" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        {wallet ? (
          <>
            <Text style={styles.label}>Wallet Address</Text>
            <Text style={styles.address}>{truncateAddress(wallet.address)}</Text>
            <Text style={styles.label}>Balances</Text>
            {wallet.balances?.map((b) => (
              <Text key={b.currency} style={styles.balance}>
                {formatAmount(b.amount, b.currency)}
              </Text>
            ))}
          </>
        ) : (
          <>
            <Text style={styles.noWallet}>No wallet yet</Text>
            <TouchableOpacity style={styles.button} onPress={createWallet}>
              <Text style={styles.buttonText}>Create Wallet</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Send')}>
          <Text style={styles.actionText}>Send</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => navigation.navigate('Transactions')}>
          <Text style={styles.actionText}>History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  card: { margin: 16, padding: 20, backgroundColor: '#4f46e5', borderRadius: 16 },
  label: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 8 },
  address: { color: '#fff', fontSize: 14, fontFamily: 'monospace' },
  balance: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 4 },
  noWallet: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 12 },
  button: { backgroundColor: '#fff', borderRadius: 8, padding: 12, alignItems: 'center' },
  buttonText: { color: '#4f46e5', fontWeight: '600' },
  actions: { flexDirection: 'row', margin: 16, gap: 12 },
  actionBtn: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center' },
  actionText: { color: '#4f46e5', fontWeight: '600', fontSize: 16 },
});
