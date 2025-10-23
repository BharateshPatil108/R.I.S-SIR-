// import { APIs } from '../constants/Api_Constants';
// import axiosInstance from '../screens/utils/axiosInstance';

// export const submitDistributionDetails = (feilds) => {
//     return (dispatch) => {
//         console.log(`${APIs}/api/Mobile/distribution${feilds}`)
 
//         dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_START' })
//         axiosInstance.post(`${APIs}/api/Mobile/distribution`,feilds)
//             .then(function (response) {

//             dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_SUCCESS', payload: response})
//             console.log("SUBMIT_DISTRIBUTION_DETAILS_SUCCESS",response);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_FAILURE', payload: error })
//                 console.log("SUBMIT_DISTRIBUTION_DETAILS_FAILURE",error);
//             })
//     }
// }


// export const setSubmitDistributionDetailsSuccess = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_SUCCESS' })
//     }
// }


// export const setSubmitDistributionDetailsError = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_ERROR' })
//     }
// }


// export const submitCollectionDetails = (feilds) => {
//     return (dispatch) => {
//         console.log(`${APIs}/api/Mobile/collection${feilds}`)
 
//         dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_START' })
//         axiosInstance.post(`${APIs}/api/Mobile/collection`,feilds)
//             .then(function (response) {

//             dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_SUCCESS', payload: response})
//             console.log("SUBMIT_COLLECTION_DETAILS_SUCCESS",response);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_FAILURE', payload: error })
//                 console.log("SUBMIT_COLLECTION_DETAILS_FAILURE",error);
//             })
//     }
// }


// export const setSubmitCollectionDetailsSuccess = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_COLLECTION_DETAILS_SUCCESS' })
//     }
// }


// export const setSubmitCollectionDetailsError = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_COLLECTION_DETAILS_ERROR' })
//     }
// }

import axiosInstance from '../screens/utils/axiosInstance';
import { getDBConnection } from '../offlineDataBase/DBcreation';
import { createDistributionTable, insertDistributionData, getOfflineDistributionData } from '../offlineDataBase/FormDistributionDB';
import { createCollectionTable, insertCollectionData, getAllCollectionData } from '../offlineDataBase/FormCollectionDB';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUser } from '../screens/utils/UserProvider';

// Submit Distribution Details
export const submitDistributionDetails = (fields) => {
  return async (dispatch) => {
    console.log(`/api/Mobile/distribution`, fields);
    dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_START' });

    try {
      const response = await axiosInstance('/api/Mobile/distribution', 'POST', fields);
      dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_SUCCESS', payload: response });
      console.log("SUBMIT_DISTRIBUTION_DETAILS_SUCCESS", response);
    } catch (error) {
      dispatch({ type: 'SUBMIT_DISTRIBUTION_DETAILS_FAILURE', payload: error });
      console.log("SUBMIT_DISTRIBUTION_DETAILS_FAILURE", error);
    }
  };
};

export const setSubmitDistributionDetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_SUCCESS' });
};

export const setSubmitDistributionDetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_ERROR' });
};

// get distribution details
// export const getDistributionDetails = (fields) => {
//   return async (dispatch) => {
//     console.log(`/api/Mobile/distribution`, fields);
//     dispatch({ type: 'GET_DISTRIBUTION_DETAILS_START' });

//     try {
//       const response = await axiosInstance(`/api/Mobile/distribution?dtb_part_no=${fields.el_part_no}&dtb_ac_number=${fields.el_ac_number}`, 'GET');
//       dispatch({ type: 'GET_DISTRIBUTION_DETAILS_SUCCESS', payload: response });
//       console.log("GET_DISTRIBUTION_DETAILS_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'GET_DISTRIBUTION_DETAILS_FAILURE', payload: error });
//       console.log("GET_DISTRIBUTION_DETAILS_FAILURE", error);
//     }
//   };
// };

export const getDistributionDetails = (fields, isManualOfflineFetch = false, userId) => {
  return async (dispatch) => {
    dispatch({ type: 'GET_DISTRIBUTION_DETAILS_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createDistributionTable(db);

      if (netState.isConnected) {
        // Online: fetch API data
        const query = `?dtb_part_no=${fields.el_part_no}&dtb_ac_number=${fields.el_ac_number}`;
        const response = await axiosInstance(`/api/Mobile/distribution${query}`, 'GET');
        const data = response?.data?.data || [];

        if (isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastDistributionSaved");
          const now = Date.now();

          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            // Save data to SQLite
            await insertDistributionData(db, data, userId);
            await AsyncStorage.setItem("lastDistributionSaved", now.toString());
            console.log("✅ Distribution data saved offline");
          // } else {
          //   console.log("⏱ Distribution data already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'GET_DISTRIBUTION_DETAILS_SUCCESS', payload: response });
      } else {
        // Offline: fetch from SQLite
        const offlineData = await getOfflineDistributionData(db, userId);
        console.log("📴 Using offline Distribution data:", offlineData);

        dispatch({
          type: 'GET_DISTRIBUTION_DETAILS_SUCCESS',
          payload: { data: { data: offlineData } },
        });
      }
    } catch (error) {
      console.log("❌ GET_DISTRIBUTION_DETAILS_FAILURE", error);
      dispatch({ type: 'GET_DISTRIBUTION_DETAILS_FAILURE', payload: error });
    }
  };
};

export const setGetDistributionDetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_GET_DISTRIBUTION_DETAILS_SUCCESS' });
};

export const setGetDistributionDetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_GET_DISTRIBUTION_DETAILS_ERROR' });
};

// Submit Collection Details
export const submitCollectionDetails = (fields) => {
  return async (dispatch) => {
    console.log(`/api/Mobile/collection`, fields);
    dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_START' });

    try {
      const response = await axiosInstance('/api/Mobile/collection', 'POST', fields);
      dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_SUCCESS', payload: response });
      console.log("SUBMIT_COLLECTION_DETAILS_SUCCESS", response);
    } catch (error) {
      dispatch({ type: 'SUBMIT_COLLECTION_DETAILS_FAILURE', payload: error });
      console.log("SUBMIT_COLLECTION_DETAILS_FAILURE", error);
    }
  };
};

export const setSubmitCollectionDetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_COLLECTION_DETAILS_SUCCESS' });
};

export const setSubmitCollectionDetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_COLLECTION_DETAILS_ERROR' });
};

// get Collection Details
// export const getCollectionDetails = (fields) => {
//   return async (dispatch) => {
//     console.log(`/api/Mobile/collection`, fields);
//     dispatch({ type: 'GET_COLLECTION_DETAILS_START' });

//     try {
//       const response = await axiosInstance(`/api/Mobile/collection?col_part_no=${fields.el_part_no}&col_ac_number=${fields.el_ac_number}`, 'GET');
//       dispatch({ type: 'GET_COLLECTION_DETAILS_SUCCESS', payload: response });
//       console.log("GET_COLLECTION_DETAILS_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'GET_COLLECTION_DETAILS_FAILURE', payload: error });
//       console.log("GET_COLLECTION_DETAILS_FAILURE", error);
//     }
//   };
// };

export const getCollectionDetails = (fields, isManualOfflineFetch = false, userId) => {
  return async (dispatch) => {
    console.log("/api/Mobile/collection", fields);
    dispatch({ type: 'GET_COLLECTION_DETAILS_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createCollectionTable(db);

      if (netState.isConnected) {
        // ✅ ONLINE MODE
        const response = await axiosInstance(
          `/api/Mobile/collection?col_part_no=${fields.el_part_no}&col_ac_number=${fields.el_ac_number}`,
          'GET'
        );

        const dataArray = response?.data?.data ?? [];

        if (isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastCollectionSaved");
          const now = Date.now();

          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await insertCollectionData(db, dataArray, userId);
            await AsyncStorage.setItem("lastCollectionSaved", now.toString());
            console.log("✅ Collection details saved offline");
          // } else {
          //   console.log("⏱ Collection data already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'GET_COLLECTION_DETAILS_SUCCESS', payload: response });

      } else {
        // 📴 OFFLINE MODE
        const offlineData = await getAllCollectionData(db, userId);
        console.log("📴 Using offline Collection data:", offlineData);

        dispatch({
          type: 'GET_COLLECTION_DETAILS_SUCCESS',
          payload: { data: { data: offlineData } },
        });
      }
    } catch (error) {
      console.log("❌ GET_COLLECTION_DETAILS_FAILURE", error);
      dispatch({ type: 'GET_COLLECTION_DETAILS_FAILURE', payload: error });
    }
  };
};

export const setGetCollectionDetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_GET_COLLECTION_DETAILS_SUCCESS' });
};

export const setGetCollectionDetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_GET_COLLECTION_DETAILS_ERROR' });
};
