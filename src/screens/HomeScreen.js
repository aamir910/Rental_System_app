import { useQuery } from "@tanstack/react-query";
import { ActivityIndicator, FlatList, Text, View } from "react-native";

const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL || "http://localhost:4001";
const demoProperties = [
  {
    id: "demo-1",
    title: "Modern Family House",
    location: "DHA Lahore",
    price_per_day: 120,
    beds: 4,
    baths: 3,
    rating: 4.8,
  },
  {
    id: "demo-2",
    title: "City View Apartment",
    location: "Gulberg Lahore",
    price_per_day: 85,
    beds: 2,
    baths: 2,
    rating: 4.6,
  },
  {
    id: "demo-3",
    title: "Luxury Villa with Garden",
    location: "Bahria Town",
    price_per_day: 210,
    beds: 5,
    baths: 4,
    rating: 4.9,
  },
  {
    id: "demo-4",
    title: "Budget Studio",
    location: "Johar Town",
    price_per_day: 45,
    beds: 1,
    baths: 1,
    rating: 4.2,
  },
];

const loadProperties = async () => {
  const response = await fetch(`${backendUrl}/api/properties`);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
};

export default function HomeScreen() {
  const { data = [], isPending, isError, error } = useQuery({
    queryKey: ["properties"],
    queryFn: loadProperties,
  });
  const showDemoData = isError || data.length === 0;
  const propertiesToRender = showDemoData ? demoProperties : data;

  if (isPending) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#111827" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingTop: 10 }}>
      <Text style={{ fontSize: 26, fontWeight: "800", color: "#111827", marginBottom: 4 }}>
        Rental Homes
      </Text>
      <Text style={{ color: "#4b5563", marginBottom: 12 }}>
        Discover, compare, and book your next stay.
      </Text>

      {showDemoData ? (
        <View
          style={{
            backgroundColor: "#fffbeb",
            borderColor: "#f59e0b",
            borderWidth: 1,
            borderRadius: 10,
            padding: 10,
            marginBottom: 12,
          }}
        >
          <Text style={{ color: "#92400e", fontWeight: "600" }}>
            Showing demo properties for preview.
          </Text>
          {isError ? (
            <Text style={{ color: "#b91c1c", marginTop: 4 }}>
              Backend error: {error?.message || "Request failed"}
            </Text>
          ) : null}
        </View>
      ) : null}

      <FlatList
        data={propertiesToRender}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 12 }}
        renderItem={({ item }) => (
          <View
            style={{
              borderWidth: 1,
              borderColor: "#e5e7eb",
              borderRadius: 14,
              backgroundColor: "#ffffff",
              padding: 14,
              marginBottom: 10,
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827", marginBottom: 4 }}>
              {item.title}
            </Text>
            <Text style={{ color: "#374151", marginBottom: 8 }}>{item.location}</Text>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ color: "#111827", fontWeight: "700" }}>${item.price_per_day}/day</Text>
              <Text style={{ color: "#4b5563" }}>
                {item.beds || "-"} Beds | {item.baths || "-"} Baths
              </Text>
            </View>
            <Text style={{ color: "#4f46e5", marginTop: 6 }}>Rating: {item.rating || "N/A"} / 5</Text>
          </View>
        )}
      />
    </View>
  );
}
