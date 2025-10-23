import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import CircularLoadingDots from '../utils/CircularLoadingDots';

const FormDistributionScreen = (props) => {

  return (
    <ScrollView contentContainerStyle={styles.container}>

      {props.loading || props.bloLoading ? (
        <View style={styles.loaderOverlay}>
          <CircularLoadingDots 
            size={12}
            color="#d86060ff"
            dotCount={6}
            animationType="rotate"
            circleSize={80}
          />
          <Text style={{ color: '#fff', marginTop: 12, fontWeight: '600' }}>
            Please wait...
          </Text>
        </View>
      ) : (
        <>
      <View style={styles.dateContainer}>
        <Text style={styles.sectionTitle}>Date</Text>
        <Text style={[styles.dateText, {alignSelf: 'center'}]}>{props.days}</Text>
      </View>

      <View style={styles.modeContainer}>
        <Text style={styles.sectionTitle}>Mode of Distribution</Text>
        
        <View style={styles.distributionRow}>
          <Text style={styles.distributionLabel}>Direct Distribution to Elector</Text>
          <TextInput
            style={styles.distributionInput}
            value={String(props.directDistribution)}
            onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                props.setDirectDistribution(Number(numericText) || 0);
            }}
            keyboardType="numeric"
            placeholder='0'
            maxLength={5}
            placeholderTextColor="#888"
          />
        </View>

        {props.submittedList?.length >= 3 && (
          <View style={styles.distributionRow}>
            <Text style={styles.distributionLabel}>Dropped Inside House (House Locked)</Text>
            <TextInput
              style={styles.distributionInput}
              value={String(props.droppedDistribution)}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9]/g, '');
                props.setDroppedDistribution(Number(numericText) || 0);
              }}
              keyboardType="numeric"
              placeholder='0'
              maxLength={5}
              placeholderTextColor="#888"
            />
          </View>
        )}

        <View style={styles.totalContainer}>
          <Text style={styles.label}>Total No. of Enumeration Forms Distributed</Text>
          <TextInput
            style={styles.totalInput}
            value={props.totalForms}
            onChangeText={props.setTotalForms}
            keyboardType="numeric"
            editable={false}
          />
        </View>
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.submitButton, props.loading || props.bloLoading ? { opacity: 0.6 } : {},]} 
          disabled={props.loading || props.bloLoading}
          onPress={props.handleSubmit}
        >
          {props.loading || props.bloLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Submit</Text>
            )}
        </TouchableOpacity>
      </View>

    <View style={[styles.gridItem, { flexDirection: 'row', justifyContent: 'space-between' }]}>
      <Text style={styles.gridHeader}>Day</Text>
      <Text style={styles.gridHeader}>Direct to Elector</Text>
      <Text style={styles.gridHeader}>Dropped Inside House</Text>
      <Text style={styles.gridHeader}>Total Forms</Text>
    </View>

    {props.submittedList && props.submittedList?.length > 0 ? (
      props.submittedList.map((item, index) => (
        <View
          key={index}
          style={[styles.gridData, { flexDirection: 'row', justifyContent: 'space-between' }]}
        >
          <Text style={styles.gridText}>{item.dtb_created_on ? item.dtb_created_on : 0}</Text>
          <Text style={styles.gridText}>{item.dtb_direct_count ? item.dtb_direct_count : 0}</Text>
          <Text style={styles.gridText}>{item.dtb_dropped_count ? item.dtb_dropped_count : 0}</Text>
          <Text style={styles.gridText}>{item.dtb_total_count ? item.dtb_total_count : 0}</Text>
        </View>
      ))
    ) : (
      <View style={styles.noDataContainer}>
        <Text style={styles.noDataText}>Not yet Distributed</Text>
      </View>
    )}
    </>
    )}

    </ScrollView>
  );
};

export default FormDistributionScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  totalContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  totalInput: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 6,
  },
  modeContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#1a237e',
    textAlign: 'center',
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#1a237e',
  },
  distributionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  distributionLabel: {
    fontSize: 16,
    color: '#000',
    flex: 1,
    marginRight: 10,
  },
  distributionInput: {
    width: 120,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#000',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#1a237e',
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    justifyContent: 'space-between',
  },
  gridItem: {
    backgroundColor: '#e7babaff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  gridData:{
    backgroundColor: '#e6e6e6ff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  gridHeader: {
  fontSize: 16,
  fontWeight: 'bold',
  color: '#1a237e',
  flex: 1,
  textAlign: 'center',
},
gridText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#000',
  flex: 1,
  textAlign: 'center',
},
noDataContainer: {
  padding: 20,
  alignItems: 'center',
  justifyContent: 'center',
},
noDataText: {
  fontSize: 16,
  fontWeight: '600',
  color: '#d76161ff',
},
});
