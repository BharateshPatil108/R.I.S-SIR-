import {
  StyleSheet,
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';

const ElectrolDetailsEntry = (props) => {
   return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>

        <View style={styles.section}>
          <Text style={styles.header}>Part Details</Text>
            {/* <Text style={styles.sectionTitle}>SL.NO.</Text>
            <TextInput
              style={styles.input}
              value={props.slNo}
              onChangeText={props.setSlNo}
              keyboardType="numeric"
              placeholder='Enter Serial Number'
              placeholderTextColor='#888'
            /> */}

            <Text style={styles.sectionTitle}>No. & Name of the Part</Text>
            <TextInput
              style={styles.input}
              value={props.wardName}
              onChangeText={props.setWardName}
              placeholder='Enter Ward Name'
              editable={false}
              multiline={true}
              placeholderTextColor='#888'
            />
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.header}>2002 Electors</Text>
            <Text style={styles.sectionTitle}>Male Electors</Text>
            <TextInput
              style={styles.input}
              value={props.male2002Electrol}
              onChangeText={props.setMale2002Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>Female Electors</Text>
            <TextInput
              style={styles.input}
              value={props.female2002Electrol}
              onChangeText={props.setFemale2002Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>TG Electors</Text>
            <TextInput
              style={styles.input}
              value={props.tg2002Electrol}
              onChangeText={props.setTg2002Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>Total 2002 Electors</Text>
            <TextInput
              style={styles.input}
              value={props.total2002Electrol}
              onChangeText={props.setTotal2002Electrol}
              keyboardType="numeric"
              placeholder='Total'
              editable={false}
            />
        </View> */}

        <View style={styles.section}>
          <Text style={styles.header}>As on date { props.electorDate } Electors</Text>
            <Text style={styles.sectionTitle}>No of Male Electors</Text>
            <TextInput
              style={styles.input}
              value={props.male2025Electrol}
              onChangeText={props.setMale2025Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
              editable={false}
            />

            <Text style={styles.sectionTitle}>No of Female Electors</Text>
            <TextInput
              style={styles.input}
              value={props.female2025Electrol}
              onChangeText={props.setFemale2025Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
              editable={false}
            />

            <Text style={styles.sectionTitle}>No of TG Electors</Text>
            <TextInput
              style={styles.input}
              value={props.tg2025Electrol}
              onChangeText={props.setTg2025Electrol}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
              editable={false}
            />

            <Text style={styles.sectionTitle}>Total No of 2025 Electors</Text>
            <TextInput
              style={styles.input}
              value={props.total2025Electrol}
              onChangeText={props.setTotal2025Electrol}
              keyboardType="numeric"
              placeholder='Total'
              editable={false}
            />
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.header}>Applications & Migration</Text>
            <Text style={styles.sectionTitle}>No of Form 6 Applications</Text>
            <TextInput
              style={styles.input}
              value={props.form6}
              onChangeText={props.setForm6}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>No of Form 8 Applications</Text>
            <TextInput
              style={styles.input}
              value={props.form8}
              onChangeText={props.setForm8}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>No of Migration Outside AC & State</Text>
            <TextInput
              style={styles.input}
              value={props.migrationAc}
              onChangeText={props.setMigrationAc}
              keyboardType="numeric"
              placeholder='Enter Number'
              placeholderTextColor='#888'
            />

            <Text style={styles.sectionTitle}>Total No of Applications</Text>
            <TextInput
              style={styles.input}
              value={props.totalApplications}
              onChangeText={props.setTotalApplications}
              keyboardType="numeric"
              placeholder='Total'
              editable={false}
              placeholderTextColor='#888'
            />
        </View> */}

        {/* <TouchableOpacity
          style={[
            styles.submitButton,
            props.loading ? { opacity: 0.6 } : {},
          ]}
          onPress={props.handleSubmit}
          disabled={props.loading}
        >
            {props.loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>Submit</Text>
            )}
        </TouchableOpacity> */}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export default ElectrolDetailsEntry

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    fontSize: 24,
    fontWeight: 'condensedBold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2563eb',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'medium',
    marginBottom: 12,
    color: '#111010ff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
    textAlignVertical: 'top',
    minHeight: 50,
    maxHeight: 150,
    backgroundColor: '#e5e5e5ca'
  },
  submitButton: {
    backgroundColor: '#102657ff',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 15,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});