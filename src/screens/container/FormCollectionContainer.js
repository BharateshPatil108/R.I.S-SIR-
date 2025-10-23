import { Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react';
import FormCollectionPresentational from '../presentational/FormCollectionPresentational'
import useMultiCamera from '../hooks/useMultiCamera';
import useCameraWithLocation from '../utils/useCameraWithLocation';
import { connect } from 'react-redux';
import * as BothDistriCollectActions from '../../actions/BothDistriCollectActions';
import { useUser } from '../utils/UserProvider';
import { useNavigation, CommonActions } from '@react-navigation/native';
import RNFS from 'react-native-fs';
import { getDBConnection } from '../../offlineDataBase/DBcreation';
import { createSubmitCollectionsTable, insertSubmittedCollections } from '../../offlineDataBase/FormCollectionDB';
import * as ElectorDetailsActions from '../../actions/ElectorDetailsActions';
import ImageResizer from 'react-native-image-resizer';

const FormCollectionContainer = (props) => {
  const navigation = useNavigation();
    const [visitCount, setVisitCount] = useState('');
    const [present, setPresent] = useState('');
    const [probableAbsent, setProbableAbsent] = useState('');
    const [probableShifted, setProbableShifted] = useState('');
    const [probableDeceased, setProbableDeceased] = useState('');
    const [multipleEntries, setMultipleEntries] = useState('');
    const [formsCollected, setFormsCollected] = useState('');
    const [selectedImage, setSelectedImage] = useState(null);
    const { captureLocationOnly } = useCameraWithLocation();
    const { decodedToken, isNetPresent } = useUser();
    const [epicNumbers, setEpicNumbers] = useState({
      probableAbsent: [],
      probableShifted: [],
      probableDeceased: [],
      multipleEntries: [],
    });
    const [slnumbersInPart, setSlnumbersInPart] = useState({
      probableAbsent: [],
      probableShifted: [],
      probableDeceased: [],
      multipleEntries: [],
    });
    const [loadingKeys, setLoadingKeys] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const viewShotRefs = useRef({});
    const [collectionList, setCollectionList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [distloading, setDistLoading] = useState(false);
    const { capturePhotoForField, getPhotoData, cameraData, clearPhotoData, setCameraData } = useMultiCamera();
    const [totalFormData, setTotalFormData] = useState('');
    const [distributiondata, setDistributionData] = useState('');

    useEffect(()=>{
      if(decodedToken){
        const fields = {
          el_part_no: parseInt(decodedToken?.PartNumber),
          el_ac_number: parseInt(decodedToken?.AcNumber),
        }

        setLoading(true);
        setDistLoading(true);
        props.getDistributionDetails(fields, false, parseInt(decodedToken?.sub));
        props.viewBLODetails(fields, false, parseInt(decodedToken?.sub))
        props.getCollectionDetails(fields, true, parseInt(decodedToken?.sub));
      }
    },[]);

    useEffect(()=>{
      if(props.isGetDistributionDetailsSuccess) {
        console.log("getDistributionDetailsModel:-",props.getDistributionDetailsModel);

        setDistLoading(false);
        const data = props.getDistributionDetailsModel?.data?.data || [];
        const totalDistribution = data?.reduce((sum, item) => sum + (parseInt(item.dtb_total_count) || 0), 0);
        
        console.log("Total Distribution Count:", totalDistribution);

        setDistributionData(totalDistribution);
        props.setGetDistributionDetailsSuccess();
      }
    },[props.isGetDistributionDetailsSuccess]);

    useEffect(()=>{
      if(props.isGetCollectionDetailsSuccess){
        console.log("getCollectionDetailsModel:-", props.getCollectionDetailsModel);
        const statusCode = props.getCollectionDetailsModel?.statusCode;

        setLoading(false);
        // if(statusCode === 200){
          const data = props.getCollectionDetailsModel?.data?.data;
          setCollectionList(data);
        // }
        props.setGetCollectionDetailsSuccess();
      }
    },[props.isGetCollectionDetailsSuccess])

    useEffect(()=>{
      if(props.isViewBloDetailsSuccess) {
        console.log("ViewBloDetailsModel:-",props.ViewBloDetailsModel);
        const statusCode = props.ViewBloDetailsModel?.statusCode;
        
        setTotalFormData(props.ViewBloDetailsModel?.data?.data?.el_2025_total);
        
        console.log("props.ViewBloDetailsModel?.data?.data?.el_2025_total",props.ViewBloDetailsModel?.data?.data?.el_2025_total);
        props.setViewBLODetailsSuccess();
      }
    },[props.isViewBloDetailsSuccess]);
    
    const handleLocationPress = async (fieldKey, index) => {
      const key = `${fieldKey}_${index}`;
      setLoadingKeys(prev => ({ ...prev, [key]: true }));
      try {
        const locData = await captureLocationOnly();    

        if (!locData) {
          Alert.alert("Error", "Unable to fetch location. Please enable GPS.");
          return;
        }   

        const key = `${fieldKey}_${index}`;
        setCameraData(prev => ({
          ...prev,
          [key]: locData,
        }));    

        console.log(`Location stored for ${key}:`, locData);
      } catch (err) {
        console.log("Location fetch error:", err);
        Alert.alert("Error", "Unable to fetch location. Please enable GPS.");
      } finally {
          setLoadingKeys(prev => ({ ...prev, [key]: false }));
      }
    };

    useEffect(() => {
        const total =
          (Number(present) || 0) +
          (Number(probableAbsent) || 0) +
          (Number(probableShifted) || 0) +
          (Number(probableDeceased) || 0) +
          (Number(multipleEntries) || 0);

        setFormsCollected(total.toString());
    }, [present, probableAbsent, probableShifted, probableDeceased, multipleEntries]);

  const handleEpicNumberChange = (fieldKey, index, value) => {
      setEpicNumbers(prev => {
        const updated = { ...prev };
        if (!updated[fieldKey]) updated[fieldKey] = [];
        updated[fieldKey][index] = value;
        return updated;
      });
      console.log("epic number:-", fieldKey, index, value);
  };

  const onSlNumberInPartChange = (fieldKey, index, value) => {
      setSlnumbersInPart(prev => {
        const updated = { ...prev };
        if (!updated[fieldKey]) updated[fieldKey] = [];
        updated[fieldKey][index] = value;
        return updated;
      });
      console.log("SlNo in part number:-", fieldKey, index, value);
  };

  // const handleCameraPress = async (fieldKey, index) => {
  //   const key = `${fieldKey}_${index}`;
  //   setLoadingKeys(prev => ({ ...prev, [key]: true }));

  //   try {
  //     const photoData = await capturePhotoForField(fieldKey, index);

  //     if (photoData && photoData.photoUri) {

  //       await new Promise(resolve => setTimeout(resolve, 300));

  //       const ref = viewShotRefs.current[`${fieldKey}_${index}`];
  //       let base64String = '';
  //       let uri = photoData.photoUri;

  //       if (ref) {
  //         base64String = await ref.capture({
  //           format: 'jpg',
  //           quality: 0.8,
  //           result: 'base64',
  //         });
  //         uri = `data:image/jpeg;base64,${base64String}`;
  //       } else {
  //         base64String = await RNFS.readFile(photoData.photoUri, 'base64');
  //       }

  //       setCameraData((prev) => ({
  //         ...prev,
  //         [key]: {
  //           ...photoData,
  //           filePath: photoData.photoUri,
  //           fileName: photoData.photoUri.split('/').pop(),
  //           mimeType: 'image/jpeg',
  //           photoUri: uri,
  //           photoBase64: base64String,
  //           timestamp: new Date().toLocaleString(),
  //         },
  //       }));
  //     }

  //   } catch (error) {
  //     console.log('Camera error:', error);
  //     Alert.alert('Error', 'Failed to capture photo');
  //   } finally {
  //     setLoadingKeys(prev => ({ ...prev, [key]: false }));
  //   }
  // };

   const handleCameraPress = async (fieldKey, index) => {
    const key = `${fieldKey}_${index}`;
    setLoadingKeys(prev => ({ ...prev, [key]: true }));
  
    try {
      const photoData = await capturePhotoForField(fieldKey, index);
      if (!photoData?.photoUri) return;
    
      const ref = viewShotRefs.current[key];
      let base64String = '';
      let uri = photoData.photoUri;
    
      if (ref) {
        base64String = await ref.capture({ format: 'jpg', quality: 0.8, result: 'base64' });
      
        let sizeInMB = (base64String.length * (3 / 4)) / (1024 * 1024);
      
        if (sizeInMB > 2) {
          Alert.alert(
            'Image Too Large',
            `Captured image is ${sizeInMB.toFixed(2)} MB. Please recapture a smaller image.`,
            [{ text: 'OK' }]
          );
          setLoadingKeys(prev => ({ ...prev, [key]: false }));
          return;
        }
      
        uri = `data:image/jpeg;base64,${base64String}`;
      } else {
        let quality = 70;
        let width = 1280;
        let height = 720;
        let compressed = await ImageResizer.createResizedImage(photoData.photoUri, width, height, 'JPEG', quality, 0);
        base64String = await RNFS.readFile(compressed.uri, 'base64');
      
        let sizeInMB = (base64String.length * (3 / 4)) / (1024 * 1024);
        while (sizeInMB > 2 && quality > 20) {
          quality -= 10;
          compressed = await ImageResizer.createResizedImage(photoData.photoUri, width, height, 'JPEG', quality, 0);
          base64String = await RNFS.readFile(compressed.uri, 'base64');
          sizeInMB = (base64String.length * (3 / 4)) / (1024 * 1024);
        }
      
        if (sizeInMB > 2) {
          Alert.alert(
            'Image Too Large',
            `Image is still ${sizeInMB.toFixed(2)} MB after compression. Please recapture.`,
            [{ text: 'OK' }]
          );
          setLoadingKeys(prev => ({ ...prev, [key]: false }));
          return;
        }
      
        uri = compressed.uri;
      }
    
      setCameraData(prev => ({
        ...prev,
        [key]: {
          ...photoData,
          filePath: uri,
          fileName: photoData.photoUri.split('/').pop(),
          mimeType: 'image/jpeg',
          photoUri: uri,
          photoBase64: base64String,
          timestamp: new Date().toLocaleString(),
        },
      }));
    
    } catch (error) {
      console.log('Camera error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setLoadingKeys(prev => ({ ...prev, [key]: false }));
    }
  };

  const handleSubmit = async() => {

    setIsSubmitting(true);

  const requiredFields = [
    { field: visitCount, name: 'Visit Count' },
    { field: present, name: 'Present Count' },
    { field: probableAbsent, name: 'Probable Absent Count' },
    { field: probableShifted, name: 'Probable Shifted Count' },
    { field: probableDeceased, name: 'Probable Deceased Count' },
    { field: multipleEntries, name: 'Multiple Entries Count' },
    { field: formsCollected, name: 'Forms Collected' }
  ];

  const missingFields = requiredFields?.filter(item => item.field === '' || item.field === null || item.field === undefined);
  
  if (missingFields?.length > 0) {
    const fieldNames = missingFields?.map(item => item.name).join(', ');
    setIsSubmitting(false);
    Alert.alert(
      'Incomplete Fields',
      `Please fill the following required fields: ${fieldNames}`,
      [{ text: 'OK' }]
    );
    return;
  }

  const categoriesWithEpicRequired = [];
  
  if (parseInt(probableAbsent) > 0) {
  if (!epicNumbers.probableAbsent || epicNumbers.probableAbsent?.length !== parseInt(probableAbsent)) {
    categoriesWithEpicRequired.push(`Probable Absent (${probableAbsent} required)`);
  }
}

if (parseInt(probableShifted) > 0) {
  if (!epicNumbers.probableShifted || epicNumbers.probableShifted?.length !== parseInt(probableShifted)) {
    categoriesWithEpicRequired.push(`Probable Shifted (${probableShifted} required)`);
  }
}

if (parseInt(probableDeceased) > 0) {
  if (!epicNumbers.probableDeceased || epicNumbers.probableDeceased?.length !== parseInt(probableDeceased)) {
    categoriesWithEpicRequired.push(`Probable Deceased (${probableDeceased} required)`);
  }
}

if (parseInt(multipleEntries) > 0) {
  if (!epicNumbers.multipleEntries || epicNumbers.multipleEntries?.length !== parseInt(multipleEntries)) {
    categoriesWithEpicRequired.push(`Multiple Entries (${multipleEntries} required)`);
  }
}

  if (categoriesWithEpicRequired?.length > 0) {
    setIsSubmitting(false);
    Alert.alert(
      'EPIC Numbers Required',
      `Please add EPIC numbers for the following categories: ${categoriesWithEpicRequired.join(', ')}`,
      [{ text: 'OK' }]
    );
    return;
  }

  const missingSLNumbers = [];
  const categoryCounts = {
    probableAbsent,
    probableShifted,
    probableDeceased,
    multipleEntries
  };

  Object.keys(slnumbersInPart).forEach((categoryKey) => {
    const count = parseInt(categoryCounts[categoryKey] || 0);
    if (count > 0) {
      const slArray = slnumbersInPart[categoryKey] || [];
      for (let i = 0; i < count; i++) {
        if (!slArray[i] || slArray[i].toString().trim() === '') {
          missingSLNumbers.push(`${categoryKey} - SL number at position ${i + 1}`);
        }
      }
    }
  });

  if (missingSLNumbers?.length > 0) {
    setIsSubmitting(false);
    Alert.alert(
      "Missing SL Numbers",
      `Please fill SL numbers for the following:\n${missingSLNumbers.join('\n')}`
    );
    return;
  }

  const missingData = [];
  
  const checkCategoryData = (categoryKey, categoryName) => {
    if (epicNumbers[categoryKey] && epicNumbers[categoryKey]?.length > 0) {
      epicNumbers[categoryKey].forEach((epicNo, index) => {
        const dataKey = `${categoryKey}_${index}`;
        const categoryData = cameraData[dataKey];
        
        if (!categoryData) {
          missingData.push(`${categoryName} - EPIC: ${epicNo} (Need photo OR location)`);
        } else {
          const hasLocation = categoryData.location && categoryData.location.latitude;
          const hasPhoto = categoryData.photoBase64;
          
          if (!hasLocation && !hasPhoto) {
            missingData.push(`${categoryName} - EPIC: ${epicNo} (Need photo OR location)`);
          }
        }
      });
    }
  };

  checkCategoryData('probableAbsent', 'Probable Absent');
  checkCategoryData('probableShifted', 'Probable Shifted');
  checkCategoryData('probableDeceased', 'Probable Deceased');
  checkCategoryData('multipleEntries', 'Multiple Entries');

  if (missingData?.length > 0) {
    setIsSubmitting(false);
    Alert.alert(
      'Missing Location/Photo Data',
      `Please capture location and photo for the following entries:\n\n${missingData.slice(0, 5).join('\n')}${missingData.length > 5 ? `\n...and ${missingData.length - 5} more` : ''}`,
      [{ text: 'OK' }]
    );
    return;
  }

    const calculatedTotal =
      parseInt(present || 0) +
      parseInt(probableAbsent || 0) +
      parseInt(probableShifted || 0) +
      parseInt(probableDeceased || 0) +
      parseInt(multipleEntries || 0);

    if (parseInt(formsCollected) !== calculatedTotal) {
      setIsSubmitting(false);
      Alert.alert(
        'Data Mismatch',
        "The total forms collected doesn't match the sum of individual categories. Please check your entries.",
        [{ text: 'OK' }]
      );
      return;
    }

    // if (calculatedTotal > totalFormData || parseInt(formsCollected) > totalFormData) {
    //   setIsSubmitting(false);
    //   Alert.alert(
    //     'Limit Exceeded',
    //     `The total forms collected (${calculatedTotal}) cannot exceed the allowed total (${totalFormData}).`,
    //     [{ text: 'OK' }]
    //   );
    //   return;
    // }

    const distLimit = parseInt(distributiondata) || 0;
    const formLimit = parseInt(totalFormData) || 0;

    if (calculatedTotal > distLimit || calculatedTotal > formLimit) {
      setIsSubmitting(false);
      Alert.alert(
        'Limit Exceeded',
        `The total forms collected (${calculatedTotal}) cannot exceed the allowed limit.\n\n` +
        `Distribution Limit: ${distLimit}\nForm Limit: ${formLimit}`,
        [{ text: 'OK' }]
      );
      return;
    }

    const fields = {
      col_visit_number: parseInt(visitCount),
      col_present_count: parseInt(present),
      col_absent_count: parseInt(probableAbsent),
      col_shifted_count: parseInt(probableShifted),
      col_deceased_count: parseInt(probableDeceased),
      col_duplicate_count: parseInt(multipleEntries),
      col_total_count: parseInt(formsCollected),
      col_part_no: parseInt(decodedToken?.PartNumber),
      col_created_by: parseInt(decodedToken?.sub),
      col_ac_number: parseInt(decodedToken?.AcNumber),
      col_visit_number2: parseInt(visitCount),
      col_visit_number3: parseInt(visitCount),
      col_visit_number_final: parseInt(visitCount),
      user_id: parseInt(decodedToken?.sub),
    };

    const buildTransactions = (fieldKey) => {
      return (epicNumbers[fieldKey] || []).map((epicNo, index) => {
        const key = `${fieldKey}_${index}`;
        const locData = cameraData[key] || {};
        const serialNo = slnumbersInPart[fieldKey]?.[index] || '';

        return {
          categoryType: fieldKey,
          epicNo: epicNo || '',
          latitude: locData?.location?.latitude || 0,
          longitude: locData?.location?.longitude || 0,
          photoUrl: locData.photoBase64 || '',
          remarks: locData.remarks || '',
          createdBy: parseInt(decodedToken?.sub),
          serial_no: parseInt(serialNo) || 0,
        };
      });
    };

    const payload = {
      ...fields,
      absentCountTransactions: buildTransactions('probableAbsent'),
      duplicatedCountTransactions: buildTransactions('multipleEntries'),
      deceasedCountTransactions: buildTransactions('probableDeceased'),
      shiftedCountTransactions: buildTransactions('probableShifted'),
    };

    const db = await getDBConnection();
    await createSubmitCollectionsTable(db);

    console.log('Form submitted Payload:', payload);

    if(isNetPresent) {
      props.submitCollectionDetails(payload);
    } else {
      await insertSubmittedCollections(db, payload);
      setIsSubmitting(false);

      Alert.alert(
                  "Success",
                  "Collections saved offline Successfully. Please sync when you online.",
                  [
                    {
                      text: "OK",
                      onPress: () => {
                        const routes = navigation.getState()?.routes;
                        const updatedRoutes = routes.filter(route => route.name !== "FormCollection");
                        navigation.dispatch(
                            CommonActions.reset({
                              index: updatedRoutes?.length - 1,
                              routes: updatedRoutes,
                            })
                          );
                      },
                    },
                  ]
                );
      return;
    }
  };

    const handleViewImage = (fieldKey, index) => {
      const photoData = getPhotoData(fieldKey, index);
      if (photoData) {
        Alert.alert(
          "Image Preview",
          `Field: ${fieldKey}\nIndex: ${index + 1}\nTimestamp: ${photoData.timestamp}`,
          [
            { text: "OK" },
            { 
              text: "View Full", 
              onPress: () => {
                console.log('View full image:', photoData.photoUri);
              }
            }
          ]
        );
      }
    };

    const handleRemoveImage = (fieldKey, index) => {
      Alert.alert(
        "Remove Image",
        "Are you sure you want to remove this image?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Remove", 
            onPress: () => {
              clearPhotoData(fieldKey, index);
              Alert.alert("Success", "Image removed successfully!");
            }
          }
        ]
      );
    };

    useEffect(()=>{
      if(props.isSubmitCollectionDetailsSuccess){
        console.log("submitCollectionDetailsModel",props.submitCollectionDetailsModel);
        const statusCode = props.submitCollectionDetailsModel?.statusCode;
        const message = props.submitCollectionDetailsModel?.message;

        setIsSubmitting(false);

        const fields = {
          el_part_no: parseInt(decodedToken?.PartNumber),
          el_ac_number: parseInt(decodedToken?.AcNumber),
        }
        props.getCollectionDetails(fields, true, parseInt(decodedToken?.sub));
        
        props.setSubmitCollectionDetailsSuccess();

        if(statusCode === 200) {
          Alert.alert(
                      "Success",
                      message,
                            [
                              {
                                text: "OK",
                                onPress: () => {
                                  const routes = navigation.getState()?.routes;
                                  const updatedRoutes = routes.filter(route => route.name !== "FormCollection");
                                  navigation.dispatch(
                                      CommonActions.reset({
                                        index: updatedRoutes?.length - 1,
                                        routes: updatedRoutes,
                                      })
                                    );
                                },
                              },
                            ]
                          );
        } else {
          Alert.alert('Attention', message);
        }
      }
    },[props.isSubmitCollectionDetailsSuccess]);

    useEffect(()=>{
      if(props.SubmitCollectionDetailsError){
        setIsSubmitting(false);
        console.log("props.SubmitCollectionDetailsError",props.SubmitCollectionDetailsError);
        if(props.SubmitCollectionDetailsError === "Failed to connect to /49.204.72.5:8080"){
          Alert.alert("Submission Failed", "Please check internet connection!");
        } else {
          Alert.alert("Submission Failed", props.SubmitCollectionDetailsError.message);
        }
      }
    },[props.SubmitCollectionDetailsError])

    return (
        <FormCollectionPresentational
            visitCount={visitCount}
            setVisitCount={setVisitCount}
            formsCollected={formsCollected}
            setFormsCollected={setFormsCollected}
            present={present}
            setPresent={setPresent}
            probableAbsent={probableAbsent}
            setProbableAbsent={setProbableAbsent}
            probableShifted={probableShifted}
            setProbableShifted={setProbableShifted}
            probableDeceased={probableDeceased}
            setProbableDeceased={setProbableDeceased}
            multipleEntries={multipleEntries}
            setMultipleEntries={setMultipleEntries}
            handleSubmit={handleSubmit}
            onCameraPress={handleCameraPress}
            onEpicNumberChange={handleEpicNumberChange}
            epicNumbers={epicNumbers}
            cameraData={cameraData}
            onViewImage={handleViewImage}
            setSelectedImage={setSelectedImage}
            selectedImage={selectedImage}
            onRemoveImage={handleRemoveImage}
            handleLocationPress={handleLocationPress}
            loadingKeys={loadingKeys}
            isSubmitting={isSubmitting}
            viewShotRefs={viewShotRefs}
            collectionList={collectionList}
            loading={loading}
            distloading={distloading}
            slnumbersInPart={slnumbersInPart}
            onSlNumberInPartChange={onSlNumberInPartChange}
        />
    )
}

function mapStateToProps(state) {
  return {
    submitCollectionDetailsModel: state.bothDistriCollectApi.submitCollectionDetailsModel,
    isSubmitCollectionDetailsIn: state.bothDistriCollectApi.isSubmitCollectionDetailsIn,
    isSubmitCollectionDetailsSuccess: state.bothDistriCollectApi.isSubmitCollectionDetailsSuccess,
    SubmitCollectionDetailsError: state.bothDistriCollectApi.SubmitCollectionDetailsError,
    
    getCollectionDetailsModel: state.bothDistriCollectApi.getCollectionDetailsModel,
    isGetCollectionDetailsIn: state.bothDistriCollectApi.isGetCollectionDetailsIn,
    isGetCollectionDetailsSuccess: state.bothDistriCollectApi.isGetCollectionDetailsSuccess,
    getCollectionDetailsError: state.bothDistriCollectApi.getCollectionDetailsError,

    ViewBloDetailsModel: state.BloDetails.ViewBloDetailsModel,
    ViewBloDetailsIn: state.BloDetails.ViewBloDetailsIn,
    isViewBloDetailsSuccess: state.BloDetails.isViewBloDetailsSuccess,
    ViewBloDetailsError: state.BloDetails.ViewBloDetailsError,

    getDistributionDetailsModel: state.bothDistriCollectApi.getDistributionDetailsModel,
    isGetDistributionDetailsIn: state.bothDistriCollectApi.isGetDistributionDetailsIn,
    isGetDistributionDetailsSuccess: state.bothDistriCollectApi.isGetDistributionDetailsSuccess,
    getDistributionDetailsError: state.bothDistriCollectApi.getDistributionDetailsError,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitCollectionDetails: (fields) => dispatch(BothDistriCollectActions.submitCollectionDetails(fields)),
    setSubmitCollectionDetailsSuccess: () => dispatch(BothDistriCollectActions.setSubmitCollectionDetailsSuccess()),
    setSubmitCollectionDetailsError: () => dispatch(BothDistriCollectActions.setSubmitCollectionDetailsError()),

    getCollectionDetails: (fields, isManualOfflineFetch, userId) => dispatch(BothDistriCollectActions.getCollectionDetails(fields, isManualOfflineFetch, userId)),
    setGetCollectionDetailsSuccess: () => dispatch(BothDistriCollectActions.setGetCollectionDetailsSuccess()),
    setGetCollectionDetailsError: () => dispatch(BothDistriCollectActions.setGetCollectionDetailsError()),

    viewBLODetails: (fields, isManualOfflineFetch, userId) => dispatch(ElectorDetailsActions.viewBLODetails(fields, isManualOfflineFetch, userId)),
    setViewBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setViewBLODetailsSuccess()),
    setViewBLODetailsError: () => dispatch(ElectorDetailsActions.setViewBLODetailsError()),
  
    getDistributionDetails: (fields, isManualOfflineFetch, userId) => dispatch(BothDistriCollectActions.getDistributionDetails(fields, isManualOfflineFetch, userId)),
    setGetDistributionDetailsSuccess: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsSuccess()),
    setGetDistributionDetailsError: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsError()),
      
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormCollectionContainer);