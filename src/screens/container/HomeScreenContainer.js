import React, { useLayoutEffect, useEffect, useState, useCallback } from 'react';
import { Text, TouchableOpacity, Alert, BackHandler } from 'react-native';
import HomeScreenPresentational from '../presentational/HomeScreenPresentational';
import { useNavigation, CommonActions, useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import { useUser } from '../utils/UserProvider';
import { connect } from 'react-redux';
import * as commanActions from '../../actions/commanActions';
import { getDBConnection, deleteDatabase } from '../../offlineDataBase/DBcreation';
import * as BothDistriCollectActions from '../../actions/BothDistriCollectActions';
import * as ElectorDetailsActions from '../../actions/ElectorDetailsActions';
import { fetchUnsyncedDistributions, getUnsyncedDistributions, createSubmitDistributionTable, deleteOfflineDistributionById } from '../../offlineDataBase/FormDistributionDB';
import { getSubmittedCollections, getUnsyncedCollectionCount, deleteOfflineCollectionById, createSubmitCollectionsTable } from '../../offlineDataBase/FormCollectionDB';
import axiosInstance from '../../screens/utils/axiosInstance';

const HomeScreenContainer = (props) => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const { i18n, t } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const { setToken, decodedToken, isNetPresent } = useUser();
  const [loading , setLoading] = useState(false);
  const initialOfflineStatus = {
    roles: false,
    districts: false,
    assemblies: false,
    parts: false,
    contactDetails: false,
    bloDetails: false,
    distribution: false,
    collection: false,
  };
  const [offlineStatus, setOfflineStatus] = useState(initialOfflineStatus);
  const [unsyncedDistributionCount, setUnsyncedDistributionCount] = useState(0);
  const [unsyncedCollectionCount, setUnsyncedCollectionCount] = useState(0);
  const [hasErrorShown, setHasErrorShown] = useState(false);
  const initialSyncStatus = {
    contactDetails: false,
    bloDetails: false,
    distribution: false,
    collection: false,
  };
  const [syncStatus, setSyncStatus] = useState(initialSyncStatus);

  const fetchOfflineDistributionData = useCallback(async () => {
    const db = await getDBConnection();
    await createSubmitDistributionTable(db);
    const count = await fetchUnsyncedDistributions(db, parseInt(decodedToken?.sub));
    setUnsyncedDistributionCount(count);
    console.log("setUnsyncedDistributionCount", count);
  }, []);

  const fetchOfflineCollectionData = useCallback(async () => {
    const db = await getDBConnection();
    await createSubmitCollectionsTable(db);
    const count = await getUnsyncedCollectionCount(db, parseInt(decodedToken?.sub));
    setUnsyncedCollectionCount(count);
    console.log("setUnsyncedCollectionCount", count);
  }, []);

  useEffect(() => {
    if (isFocused) {
      fetchOfflineDistributionData();
      fetchOfflineCollectionData();
    }
  }, [isFocused, fetchOfflineDistributionData, fetchOfflineCollectionData]);


useEffect(() => {

  const checkOfflineDataPopup = async () => {
    const offlineDataCount = (unsyncedDistributionCount || 0) + (unsyncedCollectionCount || 0);
    if (offlineDataCount === 0) return;

    const lastPopup = await AsyncStorage.getItem('lastOfflinePopup');
    const now = Date.now();

    if (!lastPopup || now - parseInt(lastPopup) >= 60000) { // 1 min
      Alert.alert(
        'Offline Data Present',
        `You have ${offlineDataCount} unsynced offline records. Please sync when online.`
      );
      await AsyncStorage.setItem('lastOfflinePopup', now.toString());
    }
  };

  if (isNetPresent) checkOfflineDataPopup();
}, [unsyncedDistributionCount, unsyncedCollectionCount, isNetPresent]);

   const getOfflineData = () => {
    if (!decodedToken) return;
    setHasErrorShown(false);

    if(decodedToken){
      setOfflineStatus(initialOfflineStatus);
        
        setLoading(true);

        if(isNetPresent){

            const partFields = {
                id: 0,
              }

            props.fetchAllPartsInChunks(partFields, true);

          const fields1 = {
            el_part_no: parseInt(decodedToken?.PartNumber),
            el_ac_number: parseInt(decodedToken?.AcNumber),
          }

        const userId = parseInt(decodedToken?.sub);
        props.viewBLODetails(fields1, true, userId)
        props.getDistributionDetails(fields1, true, userId);
        props.getCollectionDetails(fields1, true, userId);
        props.fetchRolesList(true);
        props.fetchDistricts(true);

        const assemblyFields = {
          Dist_Num: 0,
        }
        props.fetchAssemblyList(assemblyFields, true);

        const fields = {
          Role_Id: 0, //decodedToken?.RoleId ? decodedToken?.RoleId : 
          Dist_Num: 0, // decodedToken?.DistNumber ? decodedToken?.DistNumber :
          AC_Num: 0, //decodedToken?.AcNumber ? decodedToken?.AcNumber :
          Part_Num: 0, //decodedToken?.PartNumber ? decodedToken?.PartNumber :
        }
        props.fetchContactDetailsList(fields, true);

        } else {
          setLoading(false);
          Alert.alert("No Internet", "Please check your internet connection");
        }
      }
    };

    useEffect(() => {
      const allKeys = Object.keys(offlineStatus);
      const completedCount = allKeys.filter(k => offlineStatus[k])?.length;
      const totalCount = allKeys?.length;    

      console.log(`✅ Completed ${completedCount} / ${totalCount}`);    

      if (completedCount === totalCount) {
        setLoading(false);
        setOfflineStatus(initialOfflineStatus);
        if(isFocused){
          Alert.alert("Success", "Online data fetched and stored successfully!");
        }
      }
    }, [offlineStatus]);

    useEffect(() => {
      const allKeys = Object.keys(syncStatus);
      const completedCount = allKeys.filter(k => syncStatus[k])?.length;
      const totalCount = allKeys?.length;    

      console.log(`✅ Synced and Completed ${completedCount} / ${totalCount}`);    

      if (completedCount === totalCount) {
        setLoading(false);
        setSyncStatus(initialSyncStatus);
        if(isFocused){
          Alert.alert("Success", "Synced and updated data stored successfully!");
        }
      }
    }, [syncStatus]);

    useEffect(() => {
      if (props.fetchRoleListError || props.fetchDistrictListError || props.fetchPartListError || props.fetchContactDetailsError 
        || props.ViewBloDetailsError || props.getDistributionDetailsError || props.getCollectionDetailsError) {
        setLoading(false);
        // Alert.alert("Failed", "Online data fetching Failed, please try again!");
      }
    }, [
      props.fetchRoleListError,
      props.fetchDistrictListError,
      props.fetchPartListError,
      props.fetchContactDetailsError,
      props.ViewBloDetailsError,
      props.getDistributionDetailsError,
      props.getCollectionDetailsError
    ]);

    const syncData = async () => {
      setLoading(true);
      const db = await getDBConnection();
      await createSubmitDistributionTable(db);
      await createSubmitCollectionsTable(db);

      if(isNetPresent){
          await syncOfflineDistributions(db);
      } else {
          setLoading(false);
          Alert.alert("No Internet", "Please check your internet connection");
      }
    };

    // sync offline data to api
const syncOfflineDistributions = async (db) => {
  try {
    setLoading(true);
    const userId = parseInt(decodedToken?.sub);
    const unsyncedDistributions = await getUnsyncedDistributions(db, userId);
    const unsyncedCollections = await getSubmittedCollections(db, userId);

    // ✅ If no offline data
    if (unsyncedDistributions.length === 0 && unsyncedCollections.length === 0) {
      console.log("✅ No offline data to sync");
      Alert.alert("Info", "No offline data to sync");
      setLoading(false);
      return;
    }

    console.log(`🔁 Syncing ${unsyncedDistributions.length} offline distributions`);
    console.log(`🔁 Syncing ${unsyncedCollections.length} offline collections`);

    for (const dist of unsyncedDistributions) {
      try {
        const response = await axiosInstance('/api/Mobile/distribution', 'POST', dist);
        if (response?.statusCode === 200 && response?.success === 1) {
          await deleteOfflineDistributionById(db, dist.id, userId);
          console.log(`✅ Distribution ID ${dist.id} synced successfully`);
        } else {
          Alert.alert("Sync Failed", response?.message || "Unknown error from API");
          break;
        }
      } catch (error) {
        console.log(`❌ Distribution sync failed:`, error?.message || error);
        Alert.alert("Sync Failed", error?.message || "Something went wrong while syncing distributions.");
        break;
      }
    }

    for (const coll of unsyncedCollections) {
      try {
        const payload = JSON.parse(coll.payload);
        const response = await axiosInstance('/api/Mobile/collection', 'POST', payload);
        if (response?.statusCode === 200 && response?.success === 1) {
          await deleteOfflineCollectionById(db, coll.id, userId);
          console.log(`✅ Collection ID ${coll.id} synced successfully`);
        } else {
          Alert.alert("Sync Failed", response?.message || "Unknown error from API");
          break;
        }
      } catch (error) {
        console.log(`❌ Collection sync failed:`, error?.message || error);
        Alert.alert("Sync Failed", error?.message || "Something went wrong while syncing collections.");
        break;
      }
    }

    console.log("✅ Offline sync completed");

    setSyncStatus(initialSyncStatus);

    const fields1 = {
      el_part_no: parseInt(decodedToken?.PartNumber),
      el_ac_number: parseInt(decodedToken?.AcNumber),
    };
    props.viewBLODetails(fields1, true, userId);
    props.getDistributionDetails(fields1, true, userId);
    props.getCollectionDetails(fields1, true, userId);

    const fields = {
      Role_Id: 0,
      Dist_Num: 0,
      AC_Num: 0,
      Part_Num: 0,
    };
    props.fetchContactDetailsList(fields, true);

    await fetchOfflineDistributionData();
    await fetchOfflineCollectionData();
  } catch (error) {
    console.log("❌ Unexpected sync error:", error);
    Alert.alert("Error", "Something went wrong while syncing offline data.");
  } finally {
    setLoading(false);
  }
};

    const clearOfflineData = async () => {
      try {
        await deleteDatabase();
        console.log("🧹 SQLite database deleted successfully");
      } catch (e) {
        console.log("⚠️ Error deleting SQLite database:", e);
      }
    };

  const showApiErrorPopup = (response, apiName) => {
    if (!response || hasErrorShown) return;

    const status = response?.status;
    if (status) {
      setLoading(false);
      setHasErrorShown(true);

      const title = `Fetching ${apiName} Error`;
      const message =
        response?.message || 
        "Online data fetching Failed, please try again!" ||
        'Something went wrong. Please try again.';
      Alert.alert(title, message);
    }
  };

    useEffect(() => {
      const saveRolesData = async () => {
        if (props.isFetchRoleListSuccess && props.fetchRoleListModel?.data?.data?.length) {

          showApiErrorPopup(props.fetchRoleListModel, "Roles");
        if(isNetPresent){
          const rolesList = props.fetchRoleListModel?.data?.data || [];
          setOfflineStatus(prev => ({ ...prev, roles: true }));
          const desiredOrder = [6, 5, 4, 3, 2, 1];
        
          const rolesMap = {};
          rolesList?.forEach(role => {
            rolesMap[Number(role.role_id)] = role;
          });
        
          const sortedRoles = [];
          desiredOrder?.forEach(rId => {
            if (rolesMap[rId]) {
              sortedRoles.push(rolesMap[rId]);
            }
          });
        
          console.log("home sortedRoles response:-", sortedRoles);
        
          props.setFetchRolesListSuccess();
          }
      }
    }
      saveRolesData();
    }, [props.isFetchRoleListSuccess]);
    
    
      useEffect(() => {
        const saveDistrictsData = async () => {
          if (props.isFetchDistrictListSuccess && props.fetchDistrictListModel?.data?.data?.length) {
          
            showApiErrorPopup(props.fetchDistrictListModel, "Districts");
            const districtList = props.fetchDistrictListModel?.data?.data || [];
          setOfflineStatus(prev => ({ ...prev, districts: true }));
          console.log("home districtList response:-", districtList);

          props.setFetchDistrictsSuccess();
          }
        }
            saveDistrictsData();
      }, [props.isFetchDistrictListSuccess]);
    
      useEffect(() => {
        const saveAssemblyData = async() => {
          if (props.isFetchAssemblyListSuccess && props.fetchAssemblyListModel?.data?.data?.length) {
          const assemblyList = props.fetchAssemblyListModel?.data?.data || [];

          showApiErrorPopup(props.fetchAssemblyListModel, "Assemblies");
          setOfflineStatus(prev => ({ ...prev, assemblies: true }));
          console.log("home assemblyList response:-", assemblyList);

          props.setFetchAssemblyListSuccess();

          }
        }
          saveAssemblyData();
      }, [props.isFetchAssemblyListSuccess]);
    
      useEffect(() => {
        const savePartsData = async() => {
          if (props.isFetchPartListSuccess && props.fetchPartListModel?.data?.data?.length) {
          const partsList = props.fetchPartListModel?.data?.data || [];

          showApiErrorPopup(props.fetchPartListModel, "Parts");
          setOfflineStatus(prev => ({ ...prev, parts: true }));
          console.log("home partsList response:-", partsList);
          
          props.setFetchPartsListSuccess();
          }
        }
          savePartsData();
      }, [props.isFetchPartListSuccess]);

    useEffect(()=>{
      const saveApiData = async () => {
      if(props.isFetchContactDetailsSuccess) {
        if(props.fetchContactDetailsModel?.data) {
          setOfflineStatus(prev => ({ ...prev, contactDetails: true }));
          setSyncStatus(prev => ({ ...prev, contactDetails: true }));
        }

        showApiErrorPopup(props.fetchContactDetailsModel, "Contact Details");
        
        if(props.fetchContactDetailsModel.error){
          setLoading(false);
          setOfflineStatus(prev => ({ ...prev, contactDetails: false }));
          setSyncStatus(prev => ({ ...prev, contactDetails: false }));
        }

        console.log("home contact details response:-", props.fetchContactDetailsModel);

        props.setFetchContactDetailsListSuccess();
      }
    }
     saveApiData();
    },[props.isFetchContactDetailsSuccess]);

    useEffect(()=>{
      if(props.isGetDistributionDetailsSuccess || props.getDistributionDetailsModel) {
        console.log(" home Distribution Details:-",props.getDistributionDetailsModel);
        // const statusCode = props.getDistributionDetailsModel?.statusCode;

        showApiErrorPopup(props.getDistributionDetailsModel, "Distributions");
          setOfflineStatus(prev => ({ ...prev, distribution: true }));
          setSyncStatus(prev => ({ ...prev, contactDetails: true }));
          props.setGetDistributionDetailsSuccess();

      }
    },[props.isGetDistributionDetailsSuccess]);
      
    useEffect(()=>{
      if(props.isViewBloDetailsSuccess && props.ViewBloDetailsModel) {
        console.log("home Blo Details :-",props.ViewBloDetailsModel);
         showApiErrorPopup(props.ViewBloDetailsModel, "BLO Details");

           setOfflineStatus(prev => ({ ...prev, bloDetails: true }));
           setSyncStatus(prev => ({ ...prev, contactDetails: true }));
           props.setViewBLODetailsSuccess();
      }
    },[props.isViewBloDetailsSuccess]);

    useEffect(()=>{
      if(props.isGetCollectionDetailsSuccess || props.getCollectionDetailsModel){
        console.log("home Collection Details:-", props.getCollectionDetailsModel);

        showApiErrorPopup(props.getCollectionDetailsModel, "Collections");
          setOfflineStatus(prev => ({ ...prev, collection: true }));
          setSyncStatus(prev => ({ ...prev, contactDetails: true }));
          props.setGetCollectionDetailsSuccess();

      }
    },[props.isGetCollectionDetailsSuccess])

  const toggleLanguage = async () => {
    const newLanguage = currentLanguage === 'en' ? 'kn' : 'en';
    i18n.changeLanguage(newLanguage);
    setCurrentLanguage(newLanguage);
    await AsyncStorage.setItem('appLanguage', newLanguage);
  };

  useEffect(() => {
    const loadLanguagePreference = async () => {
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
        setCurrentLanguage(savedLanguage);
      }
    };
    loadLanguagePreference();
  }, [currentLanguage]);

      useLayoutEffect(() => {
        navigation.setOptions({
          headerShown: true,
          title: "",
          headerTitleAlign: 'center',
          headerBackVisible: false,
          gestureEnabled: false,
          headerStyle: {
            backgroundColor: '#1e40af',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          // headerLeft: () => (
          //   <TouchableOpacity 
          //     onPress={toggleLanguage}
          //     style={{ 
          //       flexDirection: 'row',
          //       alignItems: 'center',
          //       paddingRight: 8,
          //       paddingTop:8,
          //       paddingBottom: 8,
          //       color: '#fff',
          //       borderRadius: 20,
          //     }}
          //   >
          //     <Icon name="language" size={20} color="white" style={{ marginRight: 5 }} />
          //     <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Kannada</Text>
          //   </TouchableOpacity>
          // ),
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleLogOut}
              style={{ 
                flexDirection: 'row',
                alignItems: 'center',
                padding: 8,
                color: '#fff',
                borderRadius: 20,
              }}
            >
              <Icon name="logout" size={20} color="white" style={{ marginRight: 5 }} />
              <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>Logout</Text>
            </TouchableOpacity>
          ),
        });
      }, [navigation]);

  const handleLogOut = async () => {
    setToken('');

      try {
        await AsyncStorage.removeItem('userToken');
        // await AsyncStorage.removeItem('lastCollectionSaved')
        // await AsyncStorage.removeItem('lastDistributionSaved')
        // await AsyncStorage.removeItem('lastRolesSaved')
        // await AsyncStorage.removeItem('lastDistrictsSaved')
        // await AsyncStorage.removeItem('lastAssemblySaved')
        // await AsyncStorage.removeItem('lastPartsSaved')
        // await AsyncStorage.removeItem('lastContactsSaved')
        console.log('Token removed successfully');
      } catch (error) {
        console.log('Error removing items:', error);
      }

      navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

      useEffect(() => {
          const backAction = () => {
            if (navigation.isFocused()) {
              Alert.alert("", "Are you sure you want to exit?", [
                { text: 'Cancel', style: "cancel" },
                { text: 'Yes', onPress: () => BackHandler.exitApp() },
              ]);
              return true;
            }
            return false;
          };
      
          const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
          return () => backHandler.remove();
      }, [navigation]);

      const modules = [
        {
          id: 1,
          title: 'Contact Information',
          description: 'To view Contact information.',
          icon: 'call',
          screen: 'ContactDetails'
        },
      ]
    
      const RoleModules = [
        {
          id: 1,
          title: 'Contact Information',
          description: 'To view Contact information.',
          icon: 'call',
          screen: 'ContactDetails'
        },
        {
          id: 2,
          title: 'Electoral Details Entry',
          description: 'Enter new voter details and update existing records efficiently.',
          icon: 'how-to-reg',
          screen: 'ElectoralDetails'
        },
        // {
        //   id: 3,
        //   title: 'View and Edit Enumeration',
        //   description: 'Provision to View and edit the Enumeration forms distributed',
        //   icon: 'edit-document',
        //   screen: 'EnumerationView'
        // },
        {
          id: 4,
          title: 'Form Distribution',
          description: 'Manage and track the distribution of enumeration forms to households.',
          icon: 'send',
          screen: 'FormDistribution'
        },
        {
          id: 5,
          title: 'Form Collection',
          description: 'Oversee the collection of completed enumeration forms from the field.',
          icon: 'archive',
          screen: 'FormCollection'
        }
      ]

      const handleModulePress = (screen) => {
        console.log("ScreenS:-", screen);
        switch(screen) {
            case 'ElectoralDetails' :
                navigation.navigate('BloDetailsEntry');
                break;
            case 'EnumerationView': 
                navigation.navigate('ViewAndEditEnumeration');
                break;
            case 'FormDistribution': 
                navigation.navigate('FormDistribution');
                break;
            case 'FormCollection': 
                navigation.navigate('FormCollection');
                break;
            case 'ContactDetails': 
                navigation.navigate('ContactDetails');
                break;
        }
      }
      
  return (
    <HomeScreenPresentational
        modules={decodedToken?.RoleId === '1' ? RoleModules : modules}
        handleModulePress={handleModulePress}
        toggleLanguage={toggleLanguage}
        role={decodedToken?.Role}
        loading={loading}
        getOfflineData={getOfflineData}
        deleteDatabase={clearOfflineData}
        syncData={syncData}
        unsyncedDistributionCount={unsyncedDistributionCount}
        unsyncedCollectionCount={unsyncedCollectionCount}
    />
  )
}

function mapStateToProps(state) {
  return {

    fetchContactDetailsModel: state.commanApi.fetchContactDetailsModel,
    isFetchContactDetailsIn: state.commanApi.isFetchContactDetailsIn,
    isFetchContactDetailsSuccess: state.commanApi.isFetchContactDetailsSuccess,
    fetchContactDetailsError: state.commanApi.fetchContactDetailsError,

    getDistributionDetailsModel: state.bothDistriCollectApi.getDistributionDetailsModel,
    isGetDistributionDetailsIn: state.bothDistriCollectApi.isGetDistributionDetailsIn,
    isGetDistributionDetailsSuccess: state.bothDistriCollectApi.isGetDistributionDetailsSuccess,
    getDistributionDetailsError: state.bothDistriCollectApi.getDistributionDetailsError,

    ViewBloDetailsModel: state.BloDetails.ViewBloDetailsModel,
    ViewBloDetailsIn: state.BloDetails.ViewBloDetailsIn,
    isViewBloDetailsSuccess: state.BloDetails.isViewBloDetailsSuccess,
    ViewBloDetailsError: state.BloDetails.ViewBloDetailsError,

    fetchRoleListModel: state.commanApi.fetchRoleListModel,
    isFetchRoleListIn: state.commanApi.isFetchRoleListIn,
    isFetchRoleListSuccess: state.commanApi.isFetchRoleListSuccess,
    fetchRoleListError: state.commanApi.fetchRoleListError,

    fetchDistrictListModel: state.commanApi.fetchDistrictListModel,
    isFetchDistrictListIn: state.commanApi.isFetchDistrictListIn,
    isFetchDistrictListSuccess: state.commanApi.isFetchDistrictListSuccess,
    fetchDistrictListError: state.commanApi.fetchDistrictListError,

    fetchAssemblyListModel: state.commanApi.fetchAssemblyListModel,
    isFetchAssemblyListIn: state.commanApi.isFetchAssemblyListIn,
    isFetchAssemblyListSuccess: state.commanApi.isFetchAssemblyListSuccess,
    fetchAssemblyListError: state.commanApi.fetchAssemblyListError,

    fetchPartListModel: state.commanApi.fetchPartListModel,
    isFetchPartListIn: state.commanApi.isFetchPartListIn,
    isFetchPartListSuccess: state.commanApi.isFetchPartListSuccess,
    fetchPartListError: state.commanApi.fetchPartListError,

    getCollectionDetailsModel: state.bothDistriCollectApi.getCollectionDetailsModel,
    isGetCollectionDetailsIn: state.bothDistriCollectApi.isGetCollectionDetailsIn,
    isGetCollectionDetailsSuccess: state.bothDistriCollectApi.isGetCollectionDetailsSuccess,
    getCollectionDetailsError: state.bothDistriCollectApi.getCollectionDetailsError,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchContactDetailsList: (fields, isManualOfflineFetch) => dispatch(commanActions.fetchContactDetailsList(fields, isManualOfflineFetch)),
    setFetchContactDetailsListSuccess: () => dispatch(commanActions.setFetchContactDetailsListSuccess()),
    setFetchContactDetailsListError: () => dispatch(commanActions.setFetchContactDetailsListError()),
  
    getDistributionDetails: (fields, isManualOfflineFetch, userId) => dispatch(BothDistriCollectActions.getDistributionDetails(fields, isManualOfflineFetch, userId)),
    setGetDistributionDetailsSuccess: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsSuccess()),
    setGetDistributionDetailsError: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsError()),
  
    viewBLODetails: (fields, isManualOfflineFetch, userId) => dispatch(ElectorDetailsActions.viewBLODetails(fields, isManualOfflineFetch, userId)),
    setViewBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setViewBLODetailsSuccess()),
    setViewBLODetailsError: () => dispatch(ElectorDetailsActions.setViewBLODetailsError()),
  
    fetchRolesList: (isManualOfflineFetch) => dispatch(commanActions.fetchRolesList(isManualOfflineFetch)),
    setFetchRolesListSuccess: () => dispatch(commanActions.setFetchRolesListSuccess()),
    setFetchRolesListError: () => dispatch(commanActions.setFetchRolesListError()),

    fetchDistricts: (isManualOfflineFetch) => dispatch(commanActions.fetchDistricts(isManualOfflineFetch)),
    setFetchDistrictsSuccess: () => dispatch(commanActions.setFetchDistrictsSuccess()),
    setFetchDistrictsError: () => dispatch(commanActions.setFetchDistrictsError()),

    fetchAssemblyList: (feilds, isManualOfflineFetch) => dispatch(commanActions.fetchAssemblyList(feilds, isManualOfflineFetch)),
    setFetchAssemblyListSuccess: () => dispatch(commanActions.setFetchAssemblyListSuccess()),
    setFetchAssemblyListError: () => dispatch(commanActions.setFetchAssemblyListError()),

    fetchPartsList: (feilds, isManualOfflineFetch) => dispatch(commanActions.fetchPartsList(feilds, isManualOfflineFetch)),
    fetchAllPartsInChunks: (feilds) => dispatch(commanActions.fetchAllPartsInChunks(feilds)),
    setFetchPartsListSuccess: () => dispatch(commanActions.setFetchPartsListSuccess()),
    setFetchPartsListError: () => dispatch(commanActions.setFetchPartsListError()),
    
    getCollectionDetails: (fields, isManualOfflineFetch, userId) => dispatch(BothDistriCollectActions.getCollectionDetails(fields, isManualOfflineFetch, userId)),
    setGetCollectionDetailsSuccess: () => dispatch(BothDistriCollectActions.setGetCollectionDetailsSuccess()),
    setGetCollectionDetailsError: () => dispatch(BothDistriCollectActions.setGetCollectionDetailsError()),

  };
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreenContainer);