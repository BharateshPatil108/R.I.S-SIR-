import axiosInstance from '../screens/utils/axiosInstance';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from "@react-native-community/netinfo";
import { getDBConnection } from '../offlineDataBase/DBcreation';
import { getOfflineContacts, saveContacts, createContactTable, createRoleTable, saveRoles, getOfflineRoles, 
         createDistrictTable, saveDistricts, getOfflineDistricts, createAssemblyTable, saveAssemblys, 
         getOfflineAssemblys, createPartTable, saveParts, appendParts, getOfflineParts 
        } from "../offlineDataBase/contactDetailsDB";

// export const fetchRolesList = (feilds) => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Master/get-RoleList")
 
//         dispatch({ type: 'FETCH_ROLES_LIST_START' })
//         axiosInstance.get(APIs + '/api/Master/get-RoleList')
//             .then(function (response) {

//             dispatch({ type: 'FETCH_ROLES_LIST_SUCCESS', payload: response.data })
//             console.log("FETCH_ROLES_LIST_SUCCESS",response.data);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'FETCH_ROLES_LIST_FAILURE', payload: error })
//                 console.log("FETCH_ROLES_LIST_FAILURE",error);
//             })
//     }
// }

// 🔹 Fetch Roles List
// export const fetchRolesList = () => {
//   return async (dispatch) => {
//     console.log(APIs + "/api/Master/get-RoleList");

//     dispatch({ type: 'FETCH_ROLES_LIST_START' });

//     try {
//       const response = await axiosInstance('/api/Master/get-RoleList', 'GET');
//       dispatch({ type: 'FETCH_ROLES_LIST_SUCCESS', payload: response });
//       console.log("FETCH_ROLES_LIST_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'FETCH_ROLES_LIST_FAILURE', payload: error });
//       console.log("FETCH_ROLES_LIST_FAILURE", error);
//     }
//   };
// };

export const fetchRolesList = (isManualOfflineFetch = false) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_ROLES_LIST_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createRoleTable(db);

      if (netState.isConnected) {
        const response = await axiosInstance('/api/Master/get-RoleList', 'GET');
        const roleList = response?.data?.data || [];

        if(isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastRolesSaved");
          const now = Date.now();
        
          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await saveRoles(db, roleList);
            await AsyncStorage.setItem("lastRolesSaved", now.toString());
            console.log("✅ Roles saved offline (fresh within 1 hour)");
          // } else {
          //   console.log("⏱ Roles already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'FETCH_ROLES_LIST_SUCCESS', payload: response });
      } else {
        const offlineRoles = await getOfflineRoles(db);
        console.log("📴 Using offline roles:", offlineRoles);

        dispatch({
          type: 'FETCH_ROLES_LIST_SUCCESS',
          payload: { data: { data: offlineRoles } },
        });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ROLES_LIST_FAILURE', payload: error });
      console.log("❌ FETCH_ROLES_LIST_FAILURE", error);
    }
  };
};

export const setFetchRolesListSuccess = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_ROLES_LIST_SUCCESS' })
    }
}


export const setFetchRolesListError = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_ROLES_LIST_ERROR' })
    }
}

// export const fetchDistricts = () => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Master/get-District")
 
//         dispatch({ type: 'FETCH_DISTRICTS_START' })
//         axiosInstance.get(APIs + '/api/Master/get-District')
//             .then(function (response) {

//             dispatch({ type: 'FETCH_DISTRICTS_SUCCESS', payload: response.data })
//             console.log("FETCH_DISTRICTS_SUCCESS",response.data);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'FETCH_DISTRICTS_FAILURE', payload: error })
//                 console.log("FETCH_DISTRICTS_FAILURE",error);
//             })
//     }
// }

// 🔹 Fetch Districts
// export const fetchDistricts = () => {
//   return async (dispatch) => {
//     console.log(APIs + "/api/Master/get-District");

//     dispatch({ type: 'FETCH_DISTRICTS_START' });

//     try {
//       const response = await axiosInstance('/api/Master/get-District', 'GET');
//       dispatch({ type: 'FETCH_DISTRICTS_SUCCESS', payload: response });
//       console.log("FETCH_DISTRICTS_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'FETCH_DISTRICTS_FAILURE', payload: error });
//       console.log("FETCH_DISTRICTS_FAILURE", error);
//     }
//   };
// };

export const fetchDistricts = (isManualOfflineFetch) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_DISTRICTS_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createDistrictTable(db);

      if (netState.isConnected) {
        const response = await axiosInstance('/api/Master/get-District', 'GET');
        const districtList = response?.data?.data || [];

        if(isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastDistrictsSaved");
          const now = Date.now();

          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await saveDistricts(db, districtList);
            await AsyncStorage.setItem("lastDistrictsSaved", now.toString());
            console.log("✅ Districts saved offline (fresh within 1 hour)");
          // } else {
          //   console.log("⏱ Districts already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'FETCH_DISTRICTS_SUCCESS', payload: response });
      } else {
        const offlineDistricts = await getOfflineDistricts(db);
        console.log("📴 Using offline districts:", offlineDistricts);

        dispatch({
          type: 'FETCH_DISTRICTS_SUCCESS',
          payload: { data: { data: offlineDistricts } },
        });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_DISTRICTS_FAILURE', payload: error });
      console.log("❌ FETCH_DISTRICTS_FAILURE", error);
    }
  };
};

export const setFetchDistrictsSuccess = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_DISTRICTS_SUCCESS' })
    }
}


export const setFetchDistrictsError = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_DISTRICTS_ERROR' })
    }
}


// export const fetchAssemblyList = (feilds) => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Master/get-AssemblyList?=h_id"+feilds.Dist_Num)
 
//         dispatch({ type: 'FETCH_ASSEMBLY_LIST_START' })
//         axiosInstance.get(`${APIs}/api/Master/get-AssemblyList?=h_id${feilds.Dist_Num}`)
//             .then(function (response) {

//             dispatch({ type: 'FETCH_ASSEMBLY_LIST_SUCCESS', payload: response.data })
//             console.log("FETCH_ASSEMBLY_LIST_SUCCESS",response.data);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'FETCH_ASSEMBLY_LIST_FAILURE', payload: error })
//                 console.log("FETCH_ASSEMBLY_LIST_FAILURE",error);
//             })
//     }
// }
// 🔹 Fetch Assembly List
// export const fetchAssemblyList = (fields) => {
//   return async (dispatch) => {
//     console.log(`${APIs}/api/Master/get-AssemblyList?Dist_Num=${fields.Dist_Num}`);

//     dispatch({ type: 'FETCH_ASSEMBLY_LIST_START' });

//     try {
//       const response = await axiosInstance(`/api/Master/get-AssemblyList?Dist_Num=${fields.Dist_Num}`, 'GET');
//       dispatch({ type: 'FETCH_ASSEMBLY_LIST_SUCCESS', payload: response });
//       console.log("FETCH_ASSEMBLY_LIST_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'FETCH_ASSEMBLY_LIST_FAILURE', payload: error });
//       console.log("FETCH_ASSEMBLY_LIST_FAILURE", error);
//     }
//   };
// };

export const fetchAssemblyList = (fields, isManualOfflineFetch = false) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_ASSEMBLY_LIST_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createAssemblyTable(db);

      if (netState.isConnected) {
        const response = await axiosInstance(`/api/Master/get-AssemblyList?Dist_Num=${fields.Dist_Num}`, 'GET');
        const assemblyList = response?.data?.data || [];

        if(isManualOfflineFetch) {
          // const lastSavedTime = await AsyncStorage.getItem("lastAssemblySaved");
          const now = Date.now();
        
          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await saveAssemblys(db, assemblyList);
            await AsyncStorage.setItem("lastAssemblySaved", now.toString());
            console.log("✅ Assemblies saved offline (fresh within 1 hour)");
          // } else {
          //   console.log("⏱ Assemblies already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'FETCH_ASSEMBLY_LIST_SUCCESS', payload: response });
      } else {
        const offlineAssemblys = await getOfflineAssemblys(db);
        console.log("📴 Using offline assemblies:", offlineAssemblys);

        dispatch({
          type: 'FETCH_ASSEMBLY_LIST_SUCCESS',
          payload: { data: { data: offlineAssemblys } },
        });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_ASSEMBLY_LIST_FAILURE', payload: error });
      console.log("❌ FETCH_ASSEMBLY_LIST_FAILURE", error);
    }
  };
};

export const setFetchAssemblyListSuccess = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_ASSEMBLY_LIST_SUCCESS' })
    }
}


export const setFetchAssemblyListError = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_ASSEMBLY_LIST_ERROR' })
    }
}

// export const fetchPartsList = (feilds) => {
//     return (dispatch) => {
//         console.log(APIs +"/api/Master/get-parts?id="+feilds.id)
 
//         dispatch({ type: 'FETCH_PARTS_LIST_START' })
//         axiosInstance.get(`${APIs}/api/Master/get-parts?id=${feilds.id}`)
//             .then(function (response) {

//             dispatch({ type: 'FETCH_PARTS_LIST_SUCCESS', payload: response.data })
//             console.log("FETCH_PARTS_LIST_SUCCESS",response.data);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'FETCH_PARTS_LIST_FAILURE', payload: error })
//                 console.log("FETCH_PARTS_LIST_FAILURE",error);
//             })
//     }
// }
// 🔹 Fetch Parts List online 
// export const fetchPartsList = (fields) => {
//   return async (dispatch) => {
//     console.log(`${APIs}/api/Master/get-parts?id=${fields.id}`);

//     dispatch({ type: 'FETCH_PARTS_LIST_START' });

//     try {
//       const response = await axiosInstance(`/api/Master/get-parts?id=${fields.id}`, 'GET');
//       dispatch({ type: 'FETCH_PARTS_LIST_SUCCESS', payload: response });
//       console.log("FETCH_PARTS_LIST_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'FETCH_PARTS_LIST_FAILURE', payload: error });
//       console.log("FETCH_PARTS_LIST_FAILURE", error);
//     }
//   };
// };

// Fetch Parts List online and offline
export const fetchPartsList = (fields, isManualOfflineFetch = false) => {
  return async (dispatch) => {
   
    dispatch({ type: 'FETCH_PARTS_LIST_START' });

    try {
      const netState = await NetInfo.fetch();
      const db = await getDBConnection();
      await createPartTable(db);

      if (netState.isConnected) {
        const response = await axiosInstance(`/api/Master/get-parts?id=${fields.id}`, 'GET');
        const partList = response?.data?.data || [];

        if(isManualOfflineFetch) { 

          // const lastSavedTime = await AsyncStorage.getItem("lastPartsSaved");
          const now = Date.now();

          // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
            await saveParts(db, partList);
            await AsyncStorage.setItem("lastPartsSaved", now.toString());
            console.log("✅ Parts saved offline (fresh within 1 hour)");
          // } else {
          //   console.log("⏱ Parts already saved recently — skipping re-save");
          // }
        }

        dispatch({ type: 'FETCH_PARTS_LIST_SUCCESS', payload: response });
      } else {
        const offlineParts = await getOfflineParts(db);
        console.log("📴 Using offline parts:", offlineParts);

        dispatch({
          type: 'FETCH_PARTS_LIST_SUCCESS',
          payload: { data: { data: offlineParts } },
        });
      }
    } catch (error) {
      dispatch({ type: 'FETCH_PARTS_LIST_FAILURE', payload: error });
      console.log("❌ FETCH_PARTS_LIST_FAILURE", error);
    }
  };
};

const CHUNK_SIZE = 10000;

export const fetchAllPartsInChunks = (fields) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_PARTS_LIST_START' });

    try {
      const db = await getDBConnection();
      await createPartTable(db);

      let allData = [];
      let totalRecords = 0;
      let offset = 0;

      // 🧮 Step 1: First call to get total_count
      const firstResponse = await axiosInstance(
        `/api/Master/get-parts?id=${fields.id ?? 0}&offset=${offset}`,
        'GET'
      );

      console.log('firstResponse:-', firstResponse);

      const firstChunk = Array.isArray(firstResponse?.data?.data) ? firstResponse.data?.data : [];
      if (firstChunk.length === 0) {
        console.log('⚠️ No data found on first call');
        dispatch({ type: 'FETCH_PARTS_LIST_SUCCESS', payload: { data: { data: [] } } });
        return;
      }

      // Get total count from first chunk
      totalRecords = firstChunk[0]?.total_count ?? 0;
      console.log(`📦 Total Records to fetch: ${totalRecords}`);

      // Save first chunk
      await saveParts(db, firstChunk);
      allData = [...allData, ...firstChunk];

      // 🌀 Step 2: Calculate total loops
      const totalLoops = Math.ceil(totalRecords / CHUNK_SIZE);
      console.log(`🔁 Total loops required: ${totalLoops}`);

      // 🌀 Step 3: Fetch remaining chunks
      for (offset = 1; offset < totalLoops; offset++) {
        console.log(`📡 Fetching chunk ${offset} of ${totalLoops - 1}`);

        const response = await axiosInstance(
          `/api/Master/get-parts?id=${fields.id ?? 0}&offset=${offset}`,
          'GET'
        );

        const chunkData = Array.isArray(response?.data?.data) ? response?.data?.data : [];
        if (chunkData.length === 0) {
          console.log('⚠️ No more data received, stopping...');
          break;
        }

        await appendParts(db, chunkData);
        allData = [...allData, ...chunkData];

        console.log(`✅ Completed ${offset + 1} / ${totalLoops}`);
      }

      console.log(`🏁 Total fetched: ${allData.length}`);
      dispatch({ type: 'FETCH_PARTS_LIST_SUCCESS', payload: { data: { data: allData } } });

    } catch (error) {
      console.log('❌ Error in chunk fetch:', error);
      dispatch({ type: 'FETCH_PARTS_LIST_FAILURE', payload: error });
    }
  };
};


export const setFetchPartsListSuccess = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_PARTS_LIST_SUCCESS' })
    }
}


export const setFetchPartsListError = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_PARTS_LIST_ERROR' })
    }
}

// export const fetchContactDetailsList = (feilds) => {
//     return (dispatch) => {
//         console.log(`${APIs}/api/Mobile/user/get-userscontacts?Dist_Num=${feilds.Dist_Num}&AC_Num=${feilds.AC_Num}&Part_Num=${feilds.Part_Num}&Role_Id=${feilds.Role_Id}`)
 
//         dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_START' })
//         axiosInstance.get(`${APIs}/api/Mobile/user/get-userscontacts?Dist_Num=${feilds.Dist_Num}&AC_Num=${feilds.AC_Num}&Part_Num=${feilds.Part_Num}&Role_Id=${feilds.Role_Id}`)
//             .then(function (response) {

//             dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_SUCCESS', payload: response.data })
//             console.log("FETCH_CONTACT_DEATILS_LIST_SUCCESS",response.data);
//         })
//             .catch(function (error) {
//                 dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_FAILURE', payload: error })
//                 console.log("FETCH_CONTACT_DEATILS_LIST_FAILURE",error);
//             })
//     }
// }

// 🔹 Fetch Contact Details List
// export const fetchContactDetailsList = (fields) => {
//   return async (dispatch) => {
//     console.log(`${APIs}/api/Mobile/user/get-userscontacts?Dist_Num=${fields.Dist_Num}&AC_Num=${fields.AC_Num}&Part_Num=${fields.Part_Num}&Role_Id=${fields.Role_Id}`);

//     dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_START' });

//     try {
//       const response = await axiosInstance(
//         `/api/Mobile/user/get-userscontacts?Dist_Num=${fields.Dist_Num}&AC_Num=${fields.AC_Num}&Part_Num=${fields.Part_Num}&Role_Id=${fields.Role_Id}`,
//         'GET'
//       );
//       dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_SUCCESS', payload: response });
//       console.log("FETCH_CONTACT_DEATILS_LIST_SUCCESS", response);
//     } catch (error) {
//       dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_FAILURE', payload: error });
//       console.log("FETCH_CONTACT_DEATILS_LIST_FAILURE", error);
//     }
//   };
// };


export const fetchContactDetailsList = (fields, isManualOfflineFetch = false) => {
  return async (dispatch) => {
    dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_START' });

    try {
      // 🔹 Check Internet Availability
      const netState = await NetInfo.fetch();

      const db = await getDBConnection();
      await createContactTable(db);

      if (netState.isConnected) {
        // ✅ ONLINE → Fetch from API
        const response = await axiosInstance(
          `/api/Mobile/user/get-userscontacts?Dist_Num=${fields.Dist_Num}&AC_Num=${fields.AC_Num}&Part_Num=${fields.Part_Num}&Role_Id=${fields.Role_Id}`,
          'GET'
        );

        const contactList = response?.data?.data || [];

      if (isManualOfflineFetch) {

        const normalizedContacts = contactList.map(c => ({
          ...c,
          role: c.role?.trim().toUpperCase()
        }));

        // 🔹 Save only once every hour
        // const lastSavedTime = await AsyncStorage.getItem("lastContactsSaved");
        const now = Date.now();

        // if (!lastSavedTime || now - Number(lastSavedTime) > 3600000) {
          await saveContacts(db, normalizedContacts);
          await AsyncStorage.setItem("lastContactsSaved", now.toString());
          console.log("✅ Contacts saved offline (fresh within 1 hour)");
        // } else {
        //   console.log("⏱ Contacts already saved recently — skipping re-save");
        // }
      }

        dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_SUCCESS', payload: response });
      } else {

        // ⚠️ OFFLINE → Fetch from SQLite
        const offlineContacts = await getOfflineContacts(db, fields);
        console.log("📴 Using offline contacts:", offlineContacts);

        dispatch({
          type: 'FETCH_CONTACT_DEATILS_LIST_SUCCESS',
          payload: { data: { data: offlineContacts } },
        });
      }
    } catch (error) {
      console.log("❌ Error fetching contact details:", error);
      dispatch({ type: 'FETCH_CONTACT_DEATILS_LIST_FAILURE', payload: error });
    }
  };
};

export const setFetchContactDetailsListSuccess = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_CONTACT_DEATILS_LIST_SUCCESS' })
    }
}


export const setFetchContactDetailsListError = () => {
    return (dispatch) => {
        dispatch({ type: 'SET_IS_FETCH_CONTACT_DEATILS_LIST_ERROR' })
    }
}