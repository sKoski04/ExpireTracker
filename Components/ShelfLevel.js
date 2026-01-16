import React from 'react';
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Animated } from 'react-native';
import { getItemsByShelf, deleteItem } from '../dbInit';

function ShelfLevel({ shelf }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadShelfItems();
  }, [shelf?.id]);

  async function loadShelfItems() {
    if (!shelf?.id) return;
    setLoading(true);
    try {
      const shelfItems = await getItemsByShelf(shelf.id);
      setItems(shelfItems);
      console.log(`Loaded ${shelfItems.length} items for shelf ${shelf.name}`);
    } catch (error) {
      console.log('Error loading shelf items:', error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteItem(item) {
    Alert.alert(
      'Delete Item',
      `Are you sure you want to delete "${item.name}"?`,
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Delete cancelled'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteItem(item.id);
              console.log('✓ Item deleted:', item.name);
              await loadShelfItems();
              Alert.alert('Success', 'Item deleted successfully');
            } catch (error) {
              console.log('Error deleting item:', error);
              Alert.alert('Error', 'Failed to delete item');
            }
          },
          style: 'destructive',
        },
      ]
    );
  }

  const renderRightActions = (item) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => handleDeleteItem(item)}
      >
        <Text style={styles.deleteText}>🗑️</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{shelf?.name}</Text>
      {loading ? (
        <Text style={styles.loadingText}>Loading items...</Text>
      ) : items.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={styles.swipeContainer}>
              <TouchableOpacity style={styles.itemCard}>
                <View style={styles.itemContent}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemBarcode}>Barcode: {item.barcode}</Text>
                  <Text style={styles.itemExpiry}>Expires: {item.expiration}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.deleteAction}
                onPress={() => handleDeleteItem(item)}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      ) : (
        <Text style={styles.emptyText}>No items in this shelf</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9e9e9ff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  swipeContainer: {
    flexDirection: 'row',
    marginBottom: 10,
    borderRadius: 8,
    overflow: 'hidden',
  },
  itemCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    borderLeftWidth: 4,
    borderLeftColor: '#1067d9',
  },
  itemContent: {
    gap: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  itemBarcode: {
    fontSize: 13,
    color: '#666',
  },
  itemExpiry: {
    fontSize: 13,
    color: '#e74c3c',
    fontWeight: '500',
  },
  deleteAction: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  deleteText: {
    fontSize: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
  loadingText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
    marginTop: 20,
  },
});

export default ShelfLevel;
