import { StyleSheet, Text, View, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialIcons';
import CircularLoadingDots from "../utils/CircularLoadingDots";

const HomeScreen = (props) => {

  return (
    <SafeAreaView style={styles.container}>

      {props.loading && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderContent}>
            <CircularLoadingDots
              size={12}
              color="#d86060ff"
              dotCount={6}
              animationType="rotate"
              circleSize={80}
            />
            <Text style={styles.loadingText}>
              Loading data...
            </Text>
          </View>
        </View>
      )}
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Header */} 
        <View style={styles.header}>
          <Text style={styles.welcomeTitle}>{`Welcome, ${props.role} Officer!`}</Text>
          <Text style={styles.welcomeSubtitle}>
            Your daily tasks and quick access modules are below.
          </Text>
        </View>

<View style={styles.buttonContainer}>
  {/* Fetch Offline Data Button */}
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.richButton, styles.fetchButton]}
    onPress={props.getOfflineData}
  >
    <View style={styles.syncButtonContent}>
      <View style={styles.iconCircle}>
        <Icon name="cloud-download" size={26} color="#fff" />
      </View>
      <View>
        <Text style={styles.buttonTitle}>Fetch Latest Data</Text>
      </View>
    </View>
  </TouchableOpacity>

  {/* Sync Data Button */}
  <TouchableOpacity
    activeOpacity={0.9}
    style={[styles.richButton, styles.syncButton]}
    onPress={props.syncData}
  >
    <View style={styles.syncButtonContent}>
      <View style={styles.iconCircle}>
        <Icon name="sync" size={26} color="#fff" />
      </View>
      
      <Text style={styles.buttonTitle}>Sync Data</Text>
      
        <View style={styles.unsyncedTextContainer}>
          <Text style={styles.unsyncedText}>
            {props.unsyncedDistributionCount} : Distribution's
          </Text>
          <Text style={styles.unsyncedText}>
            {props.unsyncedCollectionCount} : Collection's
          </Text>
        </View>
    </View>
  </TouchableOpacity>

</View>

        {/* <TouchableOpacity
            style={{ backgroundColor: '#df1919ff', padding: 10 , marginBottom: 10, alignItems: 'center'}}
            onPress={props.deleteDatabase}
          >
            <Icon name="delete" size={22} color="#fff" style={styles.buttonIcon} />
            <Text style={{ color: '#fff'}}>Delete DB</Text>
        </TouchableOpacity> */}

        {/* Modules Grid */}
        <View style={styles.modulesContainer}>
          {props.modules.map((module) => (
            <TouchableOpacity
              key={module.id}
              style={styles.moduleCard}
              onPress={() => props.handleModulePress(module.screen)}
              activeOpacity={0.7}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Icon name={module.icon} size={32} color="#1e40af" />
              </View>
              
              {/* Title */}
              <Text style={styles.moduleTitle}>{module.title}</Text>
              
              {/* Description/Note */}
              <Text style={styles.moduleDescription}>{module.description}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  loaderOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderContent: {
    borderRadius: 16,
    alignItems: "center",
    shadowColor: '#000',
  },
  loadingText: {
    color: "#1e293b",
    marginTop: 12,
    fontWeight: "600",
    fontSize: 16,
  },
  header: {
    backgroundColor: '#7988b4ff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 22,
  },
  modulesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moduleCard: {
    width: '48%',
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  moduleTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1e293b',
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 18,
  },
  moduleDescription: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 16,
  },
  buttonContainer: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 28,
},
richButton: {
  flex: 1,
  borderRadius: 18,
  padding: 16,
  marginHorizontal: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.25,
  shadowRadius: 6,
  elevation: 6,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
},
fetchButton: {
  backgroundColor: '#2563eb',
  alignItems: 'center',
  justifyContent: 'center',
},
buttonContent: {
  flexDirection: 'row',
  alignItems: 'center',
},
iconCircle: {
  width: 44,
  height: 44,
  borderRadius: 22,
  backgroundColor: 'rgba(255,255,255,0.2)',
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 12,
},
buttonTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  overflow: 'hidden',
},
buttonSubtitle: {
  color: 'rgba(255,255,255,0.8)',
  fontSize: 12,
  marginTop: 2,
  overflow: 'hidden',
},
syncButton: {
  backgroundColor: '#16a34a',
  alignItems: 'center',
  justifyContent: 'center',
},
syncButtonContent: {
  alignItems: 'center',
  justifyContent: 'center',
},
buttonTitle: {
  color: '#fff',
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
  flexShrink: 1,
  maxWidth: 150,
  marginTop: 8,
},
buttonSubtitle: {
  color: 'rgba(255,255,255,0.8)',
  fontSize: 12,
  textAlign: 'center',
  marginTop: 2,
  flexShrink: 1,
  maxWidth: 150,
},
unsyncedTextContainer: {
  marginTop: 10,
  alignItems: 'center',
},
unsyncedText: {
  color: '#fff',
  fontSize: 12,
  fontWeight: '700',
  textAlign: 'center',
},
})