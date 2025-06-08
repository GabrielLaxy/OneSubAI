import React from 'react';
import { View, ScrollView, Text, StyleSheet, Image } from 'react-native';
import { Button, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const PlansScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logoText}>OneSub AI</Text>
        <Text style={styles.subtitle}>
          Encontre seu próximo filme {'\n'}
          <Text style={styles.bold}>preferido usando Inteligência{'\n'}Artificial</Text>
        </Text>

        {/* Plano Standard */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Image source={require('../../assets/logo.png')} style={styles.planIcon} />
              <Text style={styles.planTitle}>Standard</Text>
            </View>
            {renderBenefitList(3, true)}
            <Text style={styles.disabledBenefit}>• Benefício: Lorem ipsum dolor sit amet</Text>
          </Card.Content>
          <Button mode="contained" style={styles.button} labelStyle={styles.buttonLabel}>
            Escolher este plano
          </Button>
        </Card>

        {/* Plano Pro */}
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <Icon name="crown" size={24} color="#7B2CBF" />
              <Text style={styles.planTitle}>Pro</Text>
            </View>
            {renderBenefitList(3, true)}
            <Text style={styles.disabledBenefit}>• Benefício: Lorem ipsum dolor sit amet</Text>
          </Card.Content>
          <Button mode="contained" style={styles.button} labelStyle={styles.buttonLabel}>
            Escolher este plano
          </Button>
        </Card>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Icon name="view-grid" size={28} color="#7B2CBF" />
        <Icon name="home" size={28} color="#7B2CBF" />
        <Icon name="account" size={28} color="#7B2CBF" />
      </View>
    </View>
  );
};

// Lista de benefícios
const renderBenefitList = (count: number, enabled: boolean) => {
  return Array.from({ length: count }).map((_, i) => (
    <Text key={i} style={enabled ? styles.benefit : styles.disabledBenefit}>
      • Benefício: Lorem ipsum dolor sit amet
    </Text>
  ));
};

export default PlansScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7B2CBF',
  },
  content: {
    padding: 16,
    paddingBottom: 100,
  },
  logoText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginVertical: 8,
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 20,
  },
  bold: {
    fontWeight: 'bold',
  },
  card: {
    borderRadius: 16,
    marginBottom: 24,
  },
  cardContent: {
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  benefit: {
    fontSize: 14,
    color: '#000',
    marginVertical: 2,
  },
  disabledBenefit: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 2,
  },
  button: {
    backgroundColor: '#7B2CBF',
    borderRadius: 50,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  buttonLabel: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 16,
    left: 32,
    right: 32,
    backgroundColor: 'white',
    borderRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
});