import {
  StyleSheet,
  View,
  Text,
  FlatList,
  ScrollView,
  Dimensions
} from 'react-native';
import CircularLoadingDots from '../utils/CircularLoadingDots';

const ViewAndEditEnumerationScreen = (props) => {

  const tableWidth = 70 + 180 + 120 + 120 + 120;

  const renderItem = ({ item }) => (
    <View style={[styles.tableRow, { width: tableWidth }]}>
      <Text style={[styles.cell, styles.slCell]}>{item.el_id}</Text>
      <Text style={[styles.cell, styles.partCell]}>{item.el_part_no}</Text>
      <Text style={[styles.cell, styles.dataCell]}>{item.el_2002_total}</Text>
      <Text style={[styles.cell, styles.dataCell]}>{item.el_2025_total}</Text>
      <Text style={[styles.cell, styles.dataCell]}>{item.el_total_app}</Text>
    </View>
  );

  if (props.loading) {
    return (
      <View style={styles.loaderOverlay}>
        <CircularLoadingDots 
          size={12}
          color="#d86060ff"
          dotCount={6}
          animationType="rotate"
          circleSize={80}
        />
        <Text style={{ color: '#fff', marginTop: 12, fontWeight: '600' }}>Loading Records...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Electoral Records</Text>

      <View style={styles.tableContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={true} nestedScrollEnabled={true}>
          <View style={{ width: tableWidth }}>

            <View style={[styles.tableHeader, { width: tableWidth }]}>
              <Text style={[styles.headerCell, styles.slCell]}>SL NO</Text>
              <Text style={[styles.headerCell, styles.partCell]}>PART NUMBER</Text>
              <Text style={[styles.headerCell, styles.dataCell]}>2002 TOTAL</Text>
              <Text style={[styles.headerCell, styles.dataCell]}>2025 TOTAL</Text>
              <Text style={[styles.headerCell, styles.dataCell]}>TOTAL APPS</Text>
            </View>

            {props.electoralRecords && props.electoralRecords?.length > 0 ? (
                <FlatList
                  data={props.electoralRecords}
                  renderItem={renderItem}
                  keyExtractor={(item, index) => item.el_id?.toString() || index.toString()}
                  nestedScrollEnabled={true}
                />
            ) : (
              <View style={styles.emptyContainer}>
                  <Text style={styles.emptyText}>No electoral records found</Text>
              </View>
            )}
            {console.log("data=====", props.electoralRecords)}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default ViewAndEditEnumerationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    alignSelf: 'center',
    color: '#202124',
  },
  tableContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1a73e8',
    paddingVertical: 12,
  },
  headerCell: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  cell: {
    padding: 12,
    textAlign: 'center',
    color: '#000',
  },
  slCell: {
    width: 70,
  },
  partCell: {
    width: 180,
    textAlign: 'center',
  },
  dataCell: {
    width: 120,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
    emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  emptyText: {
    fontSize: 18,
    color: '#c04141ff',
    textAlign: 'center',
  },
});