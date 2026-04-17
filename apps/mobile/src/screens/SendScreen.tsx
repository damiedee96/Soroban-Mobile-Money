import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { apiClient } from '../api/client';
import { calculateFee } from '@soroban-mm/shared';

export default function SendScreen({ navigation }: any) {
  const [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [loading, setLoading] = useState(false);

  const fee = amount ? calculateFee(parseFloat(amount)) : 0;

  const handleSend = async () => {
    if (!phone || !amount) {
      Alert.alert('Error', 'Phone and amount are required');
      return;
    }
    setLoading(true);
    try {
      const res = await apiClient.post('/transactions/send', {
        receiverPhone: phone,
        amount,
        currency: 'XLM',
        memo,
      });
      Alert.alert('Success', `Transaction submitted: ${res.data.data.txId}`, [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Failed', err.response?.data?.error || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Send Money</Text>
      <TextInput
        style={styles.input}
        placeholder="Recipient phone number"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />
      <TextInput
        style={styles.input}
        placeholder="Amount (XLM)"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />
      <TextInput
        style={styles.input}
        placeholder="Memo (optional)"
        value={memo}
        onChangeText={setMemo}
      />
      {amount ? (
        <Text style={styles.fee}>Fee: {fee} XLM</Text>
      ) : null}
      <TouchableOpacity style={styles.button} onPress={handleSend} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Send</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 24, color: '#1a1a2e' },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginBottom: 16, fontSize: 16 },
  fee: { color: '#666', marginBottom: 16, fontSize: 14 },
  button: { backgroundColor: '#4f46e5', borderRadius: 8, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
