import BLOContactDetailsPresentational from '../presentational/BLOContactDetailsPresentational';
import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import * as commanActions from '../../actions/commanActions';
import { useFocusEffect } from '@react-navigation/native';
import { useUser } from '../utils/UserProvider';
import { getDBConnection } from '../../offlineDataBase/DBcreation';
import { getOfflineContacts, createContactTable, getOfflineAssemblys, createAssemblyTable, getOfflineParts, createPartTable } from "../../offlineDataBase/contactDetailsDB";

const BLOContactDetailsContainer = (props) => {
  const [roleData, setRoleData] = useState(null);
  const [district, setDistrict] = useState(null);
  const [assembly, setAssembly] = useState(null);
  const [part, setPart] = useState(null);
  const [roleDataOptions, setRoleDataOptions] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [assemblyOptions, setAssemblyOptions] = useState([]);
  const [partOptions, setPartOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const { decodedToken, isNetPresent } = useUser();

  useFocusEffect(
    useCallback(() => {
      props.fetchRolesList(false);
      props.fetchDistricts(false);
    }, [])
  );

  useEffect(() => {
    if (district) {
      const fields = {
        Dist_Num: district,
      }
      props.fetchAssemblyList(fields, false);
    }
  }, [district]);

  useEffect(() => {
    if (assembly) {
      const fields = {
        id: parseInt(assembly),
      }
      props.fetchPartsList(fields, false);
    }
  }, [assembly]);

useEffect(() => {
  const loadContactDetails = async () => {
    try {
      if (!roleData) {
        setContactDetails([]);
        return;
      }
      
      setLoading(true);
      const db = await getDBConnection();
      await createContactTable(db);
      await createAssemblyTable(db);
      await createPartTable(db);

      if (isNetPresent) {
        // Online → fetch API data
        const fields = {
          Role_Id: parseInt(roleData ?? 0),
          Dist_Num: parseInt(district ?? 0),
          AC_Num: parseInt(assembly ?? 0),
          Part_Num: parseInt(part ?? 0),
        };
        props.fetchContactDetailsList(fields, false);
      } else {
        // Offline → fetch from SQLite
        const offlineContacts = await getOfflineContacts(db);

        // --- FILTER ASSEMBLIES BY SELECTED DISTRICT ---
        let offlineAssemblies = await getOfflineAssemblys(db);
        if (district) {
          offlineAssemblies = offlineAssemblies.filter(a => Number(a.ac_dist_number) === Number(district));
        }
        const assemblyDropdownOptions = offlineAssemblies.map(a => ({
          label: `${a.ac_number} - ${a.name}`,
          value: String(a.ac_number)
        }));
        setAssemblyOptions(assemblyDropdownOptions);

        // --- FILTER PARTS BY SELECTED ASSEMBLY ---
        let offlineParts = await getOfflineParts(db);
        if (assembly) {
          offlineParts = offlineParts.filter(p => Number(p.h_ac_number) === Number(assembly));
        }
        
        offlineParts.sort((a, b) => Number(a.number) - Number(b.number));

        const partDropdownOptions = offlineParts.map(p => ({
          label: `${p.number} - ${p.name}`,
          value: String(p.number)
        }));
        setPartOptions(partDropdownOptions);

        // --- FILTER CONTACTS ---
        let filteredData = offlineContacts;
        if (roleData) {
          filteredData = filteredData.filter(item => {
            const roleString = item.role?.toUpperCase() || '';
            const selectedRole = roleDataOptions.find(r => r.value === roleData)?.label?.toUpperCase() || '';
            return roleString === selectedRole || roleString.startsWith(selectedRole + ':');
          });
        }
        if (district) filteredData = filteredData.filter(c => Number(c.dist_number) === Number(district));
        if (assembly) filteredData = filteredData.filter(c => Number(c.ac_number) === Number(assembly));
        // if (part) filteredData = filteredData.filter(c => Number(c.part_number) === Number(part));

        if (part) {
          filteredData = filteredData.filter(c => {
            const partsArray = String(c.part_number).split(',').map(p => Number(p.trim()));
            return partsArray.includes(Number(part));
          });
        }

        setContactDetails(filteredData);
        setLoading(false);
        console.log("📴 Offline contact details:", filteredData);
      }
    } catch (error) {
      console.log("Error loading contact details:", error);
      setContactDetails([]);
      setLoading(false);
    }
  };

  loadContactDetails();
}, [roleData, district, assembly, part]);


  useEffect(() => {
    if (props.isFetchContactDetailsSuccess) {
      console.log("fetch contact details response:-", props.fetchContactDetailsModel);
      const contactList = props.fetchContactDetailsModel?.data?.data || [];
      setContactDetails(contactList);
      setLoading(false);
      props.setFetchContactDetailsListSuccess();
    }
  }, [props.isFetchContactDetailsSuccess]);

  useEffect(() => {
    if (props.fetchContactDetailsError) {
      // console.log("API error, trying offline data...");
      setLoading(false);
    }
  }, [props.fetchContactDetailsError]);

useEffect(() => {
  if (props.isFetchRoleListSuccess) {
    const rolesList = props.fetchRoleListModel?.data?.data || [];

    const roleId = Number(decodedToken?.RoleId);

    const desiredOrder = [6, 5, 4, 3, 2, 1];

    let allowedRoles = [];
    if (roleId === 6) {
      allowedRoles = [5, 4, 3, 2, 1];
    } else if (roleId === 5) {
      allowedRoles = [5, 4, 3, 2, 1];
    } else if ([5, 4, 3, 2, 1].includes(roleId)) {
      allowedRoles = [5, 4, 3, 2, 1];
    }

    const rolesMap = {};
    rolesList.forEach(role => {
      rolesMap[Number(role.role_id)] = role;
    });
 
    const sortedRoles = [];
    desiredOrder.forEach(rId => {
      if (rolesMap[rId] && allowedRoles.includes(rId)) {
        sortedRoles.push(rolesMap[rId]);
      }
    });

    const roleDataOptions = sortedRoles.map(item => ({
      label: item.name,
      value: String(item.role_id),
    }));

    setRoleDataOptions(roleDataOptions);
    props.setFetchRolesListSuccess();
  }
}, [props.isFetchRoleListSuccess]);


  useEffect(() => {
    if (props.isFetchDistrictListSuccess) {
      const districtList = props.fetchDistrictListModel?.data?.data || [];

      const districtDataOptions = districtList.map(item => ({
        label: `${item.dist_number} - ${item.name}`,
        value: String(item.dist_number),
      }));
      setDistrictOptions(districtDataOptions);

      props.setFetchDistrictsSuccess();
    }
  }, [props.isFetchDistrictListSuccess]);

  useEffect(() => {
    if (props.isFetchAssemblyListSuccess) {
      const assemblyList = props.fetchAssemblyListModel?.data?.data || [];

      const assemblyDataOptions = assemblyList.map(item => ({
        label: `${item.ac_number} - ${item.name}`,
        value: String(item.ac_number),
      }));
      setAssemblyOptions(assemblyDataOptions);

      props.setFetchAssemblyListSuccess();
    }
  }, [props.isFetchAssemblyListSuccess]);

  useEffect(() => {
    if (props.isFetchPartListSuccess) {
      const partsList = props.fetchPartListModel?.data?.data || [];
      partsList.sort((a, b) => Number(a.number) - Number(b.number));
      const partDataOptions = partsList.map(item => ({
        label: `${item.number} - ${item.name}`,
        value: String(item.number),
      }));
      setPartOptions(partDataOptions);

      props.setFetchPartsListSuccess();
    }
  }, [props.isFetchPartListSuccess]);

  return (
    <BLOContactDetailsPresentational 
      roleData={roleData}
      setRoleData={setRoleData}
      district={district}
      setDistrict={setDistrict}
      assembly={assembly}
      setAssembly={setAssembly}
      part={part}
      setPart={setPart}
      roleDataOptions={roleDataOptions}
      districtOptions={districtOptions}
      assemblyOptions={assemblyOptions}
      partOptions={partOptions}
      loading={loading}
      contactDetails={contactDetails}
      setContactDetails={setContactDetails}
      decodedToken={decodedToken}
    />
  )
}

function mapStateToProps(state) {
  return {

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

    fetchContactDetailsModel: state.commanApi.fetchContactDetailsModel,
    isFetchContactDetailsIn: state.commanApi.isFetchContactDetailsIn,
    isFetchContactDetailsSuccess: state.commanApi.isFetchContactDetailsSuccess,
    fetchContactDetailsError: state.commanApi.fetchContactDetailsError,

  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchRolesList: () => dispatch(commanActions.fetchRolesList()),
    setFetchRolesListSuccess: () => dispatch(commanActions.setFetchRolesListSuccess()),
    setFetchRolesListError: () => dispatch(commanActions.setFetchRolesListError()),

    fetchDistricts: () => dispatch(commanActions.fetchDistricts()),
    setFetchDistrictsSuccess: () => dispatch(commanActions.setFetchDistrictsSuccess()),
    setFetchDistrictsError: () => dispatch(commanActions.setFetchDistrictsError()),

    fetchAssemblyList: (feilds) => dispatch(commanActions.fetchAssemblyList(feilds)),
    setFetchAssemblyListSuccess: () => dispatch(commanActions.setFetchAssemblyListSuccess()),
    setFetchAssemblyListError: () => dispatch(commanActions.setFetchAssemblyListError()),

    fetchPartsList: (feilds) => dispatch(commanActions.fetchPartsList(feilds)),
    setFetchPartsListSuccess: () => dispatch(commanActions.setFetchPartsListSuccess()),
    setFetchPartsListError: () => dispatch(commanActions.setFetchPartsListError()),
  
    fetchContactDetailsList: (fields) => dispatch(commanActions.fetchContactDetailsList(fields)),
    setFetchContactDetailsListSuccess: () => dispatch(commanActions.setFetchContactDetailsListSuccess()),
    setFetchContactDetailsListError: () => dispatch(commanActions.setFetchContactDetailsListError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BLOContactDetailsContainer);