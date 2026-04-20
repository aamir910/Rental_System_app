import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4000";

export default function HomeScreen() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      const response = await fetch(`${backendUrl}/api/properties`);
      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(err.message || "Failed to load properties");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#333" />;
  }

  if (error) {
    return <Text style={styles.error}>Error: {error}</Text>;
  }

  if (properties.length === 0) {
    return <Text style={styles.muted}>No properties found.</Text>;
  }

  return (
    <FlatList
      data={properties}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardMeta}>{item.location}</Text>
          <Text style={styles.cardMeta}>${item.price_per_day}/day</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  cardMeta: {
    marginTop: 4,
    color: "#444",
  },
  muted: {
    color: "#666",
  },
  error: {
    color: "crimson",
  },
});
