import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  useColorScheme,
  ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ViewShot from 'react-native-view-shot';
import { useUser } from '../utils/UserProvider';
import CircularLoadingDots from '../utils/CircularLoadingDots';

const FormCollectionScreen = (props) => {
  const { isNetPresent } = useUser();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const anyLoading = Object.values(props.loadingKeys || {}).some(val => val);

  const formatCategoryLabel = (label) => {
    return label
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

    if(props.loading || props.distloading){
      return (
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
      )
  }


  const renderImagePreview = (fieldKey, index, photoData) => {
  if (!photoData) return null;
  const timestamp = photoData.timestamp || new Date().toLocaleString();

  return (
    <View style={styles.imagePreviewContainer}>
      {photoData.photoUri && (
        <>
          <Text style={styles.imageTitle}>Captured Image:</Text>
          <ViewShot
            style={styles.imageWrapper}
            options={{ format: "jpg", quality: 0.9, result: 'base64' }}
            ref={(ref) => { props.viewShotRefs.current[`${fieldKey}_${index}`] = ref; }}
          >
            <Image 
              source={{ uri: photoData.photoUri }} 
              style={styles.previewImage}
              resizeMode="cover"
            />
            <View style={styles.timestampOverlay}>
              <Text style={styles.timestampText}>
                {timestamp}
              </Text>
            </View>
          </ViewShot>
        </>
      )}

      {photoData.location && (
        <>
          <Text style={styles.imageTitle}>Captured Location:</Text>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              📍 Latitude: {photoData.location.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              📍 Longitude: {photoData.location.longitude.toFixed(6)}
            </Text>
          </View>
        </>
      )}

      <TouchableOpacity 
        style={[styles.actionButton, styles.removeButton]}
        onPress={() => props.onRemoveImage(fieldKey, index)}
      >
        <Text style={styles.actionButtonText}> X </Text>
      </TouchableOpacity>
    </View>
  );
};

  const handleCaptureWithTimestamp = async (fieldKey, index) => {
  const ref = props.viewShotRefs.current[`${fieldKey}_${index}`];
  if (!ref) return;

  try {
    await new Promise(resolve => setTimeout(resolve, 500));

    const base64String = await ref.capture({
      format: 'jpg',
      quality: 0.8,
      result: 'base64',
    });

    const uri = `data:image/jpeg;base64,${base64String}`;

    props.onImageCaptured(fieldKey, index, {
      photoUri: uri,
      photoBase64: base64String,
      timestamp: new Date().toLocaleString(),
    });

  } catch (err) {
    console.log('Error capturing image:', err);
  }
};

  return (
    <ScrollView contentContainerStyle={styles.container}>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>No. of Visits</Text>
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Select No of Visits</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={props.visitCount}
              style={styles.picker}
              onValueChange={(itemValue) => props.setVisitCount(itemValue)}
              dropdownIconColor={isDark ? "#000" : "#000"}
            >
              <Picker.Item label="Select visits" value="" />
              <Picker.Item label="1 visit" value="1" />
              <Picker.Item label="2 visits" value="2" />
              <Picker.Item label="3 visits" value="3" />
              <Picker.Item label="Final visits" value="4" />
            </Picker>
          </View>
        </View>
      </View>

      {props.collectionList?.length > 0 && (
        <View style={[styles.gridItem1, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={styles.gridHeader}>Visit Count</Text>
          <Text style={styles.gridHeader}>Present Count</Text>
          <Text style={styles.gridHeader}>Absent Count</Text>
          <Text style={styles.gridHeader}>Shifted Count</Text>
          <Text style={styles.gridHeader}>Deceased Count</Text>
          <Text style={styles.gridHeader}>Duplicate Count</Text>
          <Text style={styles.gridHeader}>Total Count</Text>
        </View>
      )}
      
          {props.collectionList?.map((item, index) => (
            <View
              key={index}
              style={[styles.gridData, { flexDirection: 'row', justifyContent: 'space-between' }]}
            >
              <Text style={styles.gridText}>{item.col_visit_number ? item.col_visit_number : 0}</Text>
              <Text style={styles.gridText}>{item.col_present_count ? item.col_present_count : 0}</Text>
              <Text style={styles.gridText}>{item.col_absent_count ? item.col_absent_count : 0}</Text>
              <Text style={styles.gridText}>{item.col_shifted_count ? item.col_shifted_count : 0}</Text>
              <Text style={styles.gridText}>{item.col_deceased_count ? item.col_deceased_count : 0}</Text>
              <Text style={styles.gridText}>{item.col_duplicate_count ? item.col_duplicate_count : 0}</Text>
              <Text style={styles.gridText}>{item.col_total_count ? item.col_total_count : 0}</Text>
            </View>
          ))}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enumeration Forms Collected?</Text>
        <View style={styles.gridContainer}>
          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Present</Text>
              <TextInput
                style={styles.gridInput}
                value={props.present?.toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  props.setPresent(Number(numericText));
                }}
                placeholder='0'
                maxLength={5}
                placeholderTextColor='#888'
                keyboardType="numeric"
              />
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Probable absent</Text>
              <TextInput
                style={styles.gridInput}
                value={props.probableAbsent.toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  props.setProbableAbsent(Number(numericText));
                }}
                placeholder='0'
                keyboardType="numeric"
                placeholderTextColor='#888'
              />
            </View>
          </View>

          <View style={styles.gridRow}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Probable shifted</Text>
              <TextInput
                style={styles.gridInput}
                value={props.probableShifted?.toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  props.setProbableShifted(Number(numericText));
                }}
                placeholder='0'
                keyboardType="numeric"
                placeholderTextColor='#888'
              />
            </View>

            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Probable deceased</Text>
              <TextInput
                style={styles.gridInput}
                value={props.probableDeceased.toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  props.setProbableDeceased(Number(numericText));
                }}
                placeholder='0'
                keyboardType="numeric"
                placeholderTextColor='#888'
              />
            </View>
          </View>

          <View style={[styles.gridRow, styles.lastRow]}>
            <View style={styles.gridItem}>
              <Text style={styles.gridLabel}>Multiple entries</Text>
              <TextInput
                style={styles.gridInput}
                value={props.multipleEntries?.toString()}
                onChangeText={(text) => {
                  const numericText = text.replace(/[^0-9]/g, '');
                  props.setMultipleEntries(Number(numericText));
                }}
                placeholder='0'
                keyboardType="numeric"
                placeholderTextColor='#888'
              />
            </View>

            <View style={styles.gridItem}></View>
          </View>

          <View style={styles.formsContainer}>
            <Text style={styles.boldLabel}>Total No. of Enumeration Forms Collected</Text>
            <TextInput
              style={styles.formsInput}
              value={props.formsCollected}
              placeholder="Input No of Forms collected"
              keyboardType="numeric"
              editable={false}
            />
          </View>
        </View>
      </View>

      {['probableAbsent','probableShifted','probableDeceased','multipleEntries'].map((fieldKey) => {
       const count = parseInt(props[fieldKey] || 0);

        if (count > 0) {
          return (
            <View key={fieldKey} style={styles.tableContainer}>
              <Text style={styles.tableTitle}>
                {formatCategoryLabel(fieldKey)} Details
              </Text>

              <View style={styles.tableHeader}>
                <Text style={styles.tableHeaderText}>SL.No</Text>
                <Text style={styles.tableHeaderText}>Seria No in part</Text>
                <Text style={styles.tableHeaderText}>Epic No.</Text>
                <Text style={styles.tableHeaderText}>Geolocation / Camera</Text>
              </View>

              {Array.from({ length: count })?.map((_, index) => {
                const photoData = (props.cameraData || {})[`${fieldKey}_${index}`];
                const hasPhoto = !!photoData;

                return (
                  <View key={index}>
                    <View style={styles.tableRow}>
                      <Text style={styles.tableCell}>{index + 1}</Text>

                      <TextInput
                        style={[styles.tableCell, styles.tableInput]}
                        placeholder="Enter No"
                        placeholderTextColor='#888'
                        keyboardType='number-pad'
                        maxLength={20}
                        value={(props.slnumbersInPart[fieldKey] || [])[index] || ''}
                        onChangeText={(value) => props.onSlNumberInPartChange(fieldKey, index, value)}
                      />

                      <TextInput
                        style={[styles.tableCell, styles.tableInput]}
                        placeholder="Enter No"
                        placeholderTextColor='#888'
                        keyboardType='number-pad'
                        maxLength={20}
                        value={(props.epicNumbers[fieldKey] || [])[index] || ''}
                        onChangeText={(value) => props.onEpicNumberChange(fieldKey, index, value)}
                      />

                      {!isNetPresent ? (
                        <TouchableOpacity
                          style={[styles.tableCell, styles.cameraButton]}
                          onPress={() => props.onCameraPress(fieldKey, index, handleCaptureWithTimestamp)}
                        >
                          {props.loadingKeys[`${fieldKey}_${index}`] ? (
                            <ActivityIndicator color='#fff'/>
                          ) : (
                          <Text style={styles.cameraText}>{hasPhoto ? 'Re-Capture' : 'Capture'}</Text>
                          )}
                        </TouchableOpacity>
                      ) : (
                        <TouchableOpacity
                          style={[styles.tableCell, styles.cameraButton]}
                          onPress={() => props.handleLocationPress(fieldKey, index)}
                        >
                          {props.loadingKeys[`${fieldKey}_${index}`] ? (
                            <ActivityIndicator color='#fff'/>
                          ) : (
                          <Text style={styles.cameraText}>Location</Text>
                          )}
                        </TouchableOpacity>
                      )}
                    </View>

                    {hasPhoto && renderImagePreview(fieldKey, index, photoData)}
                  </View>
                );
              })}
            </View>
          );
        }
        return null;
      })}

      <Modal visible={!!props.selectedImage} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Image 
              source={{ uri: props.selectedImage }} 
              style={styles.fullScreenImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </Modal>

      <TouchableOpacity 
        style={[styles.submitButton, (props.isSubmitting || anyLoading) && { opacity: 0.5 }]} 
        onPress={props.handleSubmit} 
        disabled={props.isSubmitting || anyLoading}
      >
        {(props.isSubmitting || anyLoading )? (
          <ActivityIndicator color='#fff'/>
        ) : (
          <Text style={styles.submitButtonText}>Submit</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

export default FormCollectionScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    alignSelf: 'center'
  },
  pickerContainer: { 
    marginBottom: 20 
  },
  label: { 
    fontSize: 16, 
    color: '#000', 
    marginBottom: 8 
  },
  boldLabel: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333', 
    marginBottom: 8 
  },
  pickerWrapper: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, overflow: 'hidden' },
  picker: { height: 50, width: '100%', color: '#000' },
  formsContainer: { marginTop: 15, alignItems: 'center' },
  formsInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 12, fontSize: 16, marginTop: 5 },
  gridContainer: { marginTop: 10 },
  gridRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  lastRow: { marginBottom: 0 },
  gridItem: { flex: 1, alignItems: 'center', marginHorizontal: 5 },
  gridLabel: { fontSize: 14, color: '#000', marginBottom: 8, textAlign: 'center' },
  gridInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 10, fontSize: 16, textAlign: 'center', width: '80%' },
  submitButton: { backgroundColor: '#1a237e', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 40 },
  submitButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  tableContainer: { marginTop: 20, backgroundColor: '#fff', borderRadius: 8, padding: 10, elevation: 2 },
  tableTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 10, color: '#333' },
  tableHeader: { flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#ccc', paddingVertical: 8 },
  tableHeaderText: { flex: 1, fontWeight: 'bold', textAlign: 'center' },
  tableRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: '#eee' },
  tableCell: { flex: 1, textAlign: 'center' },
  tableInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 6, padding: 6, marginHorizontal: 4 },
  cameraButton: { backgroundColor: '#1a237e', borderRadius: 6, paddingVertical: 6, marginHorizontal: 4 },
  cameraText: { color: '#fff', fontWeight: 'bold', textAlign: 'center' },
  imagePreviewContainer: { 
    backgroundColor: '#f8f9fa', 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: '#e9ecef', 
    marginVertical: 8, 
    padding: 10, 
    alignItems: 'center'
  },
  imageTitle: { fontSize: 14, fontWeight: 'bold', marginBottom: 8, color: '#495057' },
  imageRow: { flexDirection: 'row', alignItems: 'center' },
  imageWrapper: { 
    width: 200, 
    height: 200, 
    marginBottom: 10, 
    borderRadius: 8, 
    overflow: 'hidden', 
    position: 'relative' 
  },
  previewImage: { width: 200, height: 200, borderRadius: 8, borderWidth: 2, borderColor: '#dee2e6' },
  timestampOverlay: { position: 'absolute', bottom: 5, left: 5, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  timestampText: { color: '#fff', fontSize: 12 },
  actionButton: { padding: 8, borderRadius: 6, minWidth: 35, alignItems: 'center' },
  removeButton: { backgroundColor: '#dc3545' },
  actionButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
  modalContainer: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.9)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { position: 'relative' },
  fullScreenImage: { width: 300, height: 400 },
  gridItem1: {
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
    marginBottom: 20,
    alignItems: 'center',
  },
  gridText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },
  gridHeader: {
  fontSize: 14,
  fontWeight: 'bold',
  color: '#1a237e',
  flex: 1,
  textAlign: 'center',
},
loaderOverlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
