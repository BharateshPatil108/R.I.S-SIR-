// import { APIs } from '../constants/Api_Constants';
// import axiosInstance from '../screens/utils/axiosInstance';

// export const submitBLODetails = (feilds) => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Mobile/part-elector"+feilds)
 
//         dispatch({ type: 'SUBMIT_BLO_DETAILS_START' })
//         axiosInstance.post(APIs + '/api/Mobile/part-elector',feilds)
//             .then(function (response) {

//             dispatch({ type: 'SUBMIT_BLO_DETAILS_SUCCESS', payload: response })
//             console.log("SUBMIT_BLO_DETAILS_START",response);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'SUBMIT_BLO_DETAILS_FAILURE', payload: error })
//                 console.log("SUBMIT_BLO_DETAILS_START",error);
//             })
//     }
// }


// export const setSubmitBLODetailsSuccess = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_BLO_DETAILS_SUCCESS' })
//     }
// }


// export const setSubmitBLODetailsError = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_SUBMIT_BLO_DETAILS_ERROR' })
//     }
// }

// export const viewBLODetails = (feilds) => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Master/get-parts")
 
//         dispatch({ type: 'VIEW_BLO_DETAILS_START' })
//         axiosInstance.get(`${APIs}/api/Master/get-parts?el_part_no=${feilds.el_part_no}&el_ac_number=${feilds.el_ac_number}`)
//             .then(function (response) {

//             dispatch({ type: 'VIEW_BLO_DETAILS_SUCCESS', payload: response })
//             console.log("VIEW_BLO_DETAILS_START",response);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'VIEW_BLO_DETAILS_FAILURE', payload: error })
//                 console.log("VIEW_BLO_DETAILS_START",error);
//             })
//     }
// }


// export const setViewBLODetailsSuccess = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_VIEW_BLO_DETAILS_SUCCESS' })
//     }
// }


// export const setViewBLODetailsError = () => {
//     return (dispatch) => {
//         dispatch({ type: 'SET_IS_VIEW_BLO_DETAILS_ERROR' })
//     }
// }

import axiosInstance from '../screens/utils/axiosInstance';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDBConnection } from "../offlineDataBase/DBcreation";
import { createBLODetailsTable, saveBLODetails, getOfflineBLODetails } from "../offlineDataBase/BLOEntryDB";

// Submit BLO Details
export const submitBLODetails = (fields) => {
  return async (dispatch) => {
    console.log("/api/Mobile/part-elector", fields);

    dispatch({ type: 'SUBMIT_BLO_DETAILS_START' });

    try {
      const response = await axiosInstance('/api/Mobile/part-elector', 'POST', fields);
      dispatch({ type: 'SUBMIT_BLO_DETAILS_SUCCESS', payload: response });
      console.log("SUBMIT_BLO_DETAILS_SUCCESS", response);
    } catch (error) {
      dispatch({ type: 'SUBMIT_BLO_DETAILS_FAILURE', payload: error });
      console.log("SUBMIT_BLO_DETAILS_FAILURE", error);
    }
  };
};

export const setSubmitBLODetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_BLO_DETAILS_SUCCESS' });
};

export const setSubmitBLODetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_SUBMIT_BLO_DETAILS_ERROR' });
};

// View BLO Details
// export const viewBLODetails = (fields) => {
//   return async (dispatch) => {
//     console.log("/api/Mobile/part-elector", fields);

//     dispatch({ type: 'VIEW_BLO_DETAILS_START' });

//     try {
//       const query = `?el_part_no=${fields.el_part_no}&el_ac_number=${fields.el_ac_number}`;
//       const response = await axiosInstance(`/api/Mobile/part-elector${query}`, 'GET');
//       dispatch({ type: 'VIEW_BLO_DETAILS_SUCCESS', payload: response });
//       console.log("VIEW_BLO_DETAILS_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'VIEW_BLO_DETAILS_FAILURE', payload: error });
//       console.log("VIEW_BLO_DETAILS_FAILURE", error);
//     }
//   };
// };

export const viewBLODetails = (fields, isManualOfflineFetch = false, userId) => {
  return async (dispatch) => {
    dispatch({ type: 'VIEW_BLO_DETAILS_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createBLODetailsTable(db);

      if (netState.isConnected) {
        const query = `?el_part_no=${fields.el_part_no}&el_ac_number=${fields.el_ac_number}`;
        const response = await axiosInstance(`/api/Mobile/part-elector${query}`, 'GET');
        const data = response?.data?.data || {};

        if (isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastBLOSaved");
          const now = Date.now();

          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await saveBLODetails(db, data, userId);
            await AsyncStorage.setItem("lastBLOSaved", now.toString());
            console.log("✅ BLO details saved offline");
          // } else {
          //   console.log("⏱ BLO details already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'VIEW_BLO_DETAILS_SUCCESS', payload: response });
      } else {
        const offlineData = await getOfflineBLODetails(db, fields.el_part_no, fields.el_ac_number, userId);
        console.log("📴 Using offline BLO data:", offlineData);

        dispatch({
          type: 'VIEW_BLO_DETAILS_SUCCESS',
          payload: { data: { data: offlineData?.[0] } },
        });
      }
    } catch (error) {
      console.log("❌ VIEW_BLO_DETAILS_FAILURE", error);
      dispatch({ type: 'VIEW_BLO_DETAILS_FAILURE', payload: error });
    }
  };
};

export const setViewBLODetailsSuccess = () => (dispatch) => {
  dispatch({ type: 'SET_IS_VIEW_BLO_DETAILS_SUCCESS' });
};

export const setViewBLODetailsError = () => (dispatch) => {
  dispatch({ type: 'SET_IS_VIEW_BLO_DETAILS_ERROR' });
};
