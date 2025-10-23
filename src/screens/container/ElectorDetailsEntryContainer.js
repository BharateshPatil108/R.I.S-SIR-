import React, { useEffect, useState } from 'react';
import ElectrolDetailsEntryPresentational from '../presentational/ElectorDetailsEntryPresentational'
import { connect } from 'react-redux';
import * as ElectorDetailsActions from '../../actions/ElectorDetailsActions';
import { Alert } from 'react-native';
import { useUser } from '../utils/UserProvider';
import { useNavigation, CommonActions } from '@react-navigation/native';

const ElectrolDetailsEntryContainer = (props) => {
  const navigation = useNavigation();
  const [slNo, setSlNo] = useState(0);
  const [wardName, setWardName] = useState(0);
  const [male2002Electrol, setMale2002Electrol] = useState(0);
  const [female2002Electrol, setFemale2002Electrol] = useState(0);
  const [tg2002Electrol, setTg2002Electrol] = useState(0);
  const [total2002Electrol, setTotal2002Electrol] = useState(0);
  const [male2025Electrol, setMale2025Electrol] = useState(0);
  const [female2025Electrol, setFemale2025Electrol] = useState(0);
  const [tg2025Electrol, setTg2025Electrol] = useState(0);
  const [total2025Electrol, setTotal2025Electrol] = useState(0);
  const [form6, setForm6] = useState(0);
  const [form8, setForm8] = useState(0);
  const [migrationAc, setMigrationAc] = useState(0);
  const [totalApplications, setTotalApplications] = useState(0);
  const { decodedToken, isNetPresent } = useUser();
  const [loading, setLoading] = useState(false);
  const [electorDate, setElectorDate] = useState('');

  useEffect(()=>{
    if(decodedToken){
      const dataofPartNumberName = `${decodedToken?.PartNumber} - ${decodedToken?.PartName}`
      setWardName(dataofPartNumberName);
    }

    const fields = {
      el_part_no: parseInt(decodedToken?.PartNumber),
      el_ac_number: parseInt(decodedToken?.AcNumber),
    }
    setLoading(true);
    props.viewBLODetails(fields, false, parseInt(decodedToken?.sub))
  },[]);

  useEffect(()=>{
    if(props.isViewBloDetailsSuccess){

      console.log("View blo details",props.ViewBloDetailsModel);
      setLoading(false);
      const BloDetailsList = props.ViewBloDetailsModel?.data?.data;

      if(BloDetailsList && Object.keys(BloDetailsList)?.length > 0){

        setMale2025Electrol(String(BloDetailsList.el_2025_male));
        setFemale2025Electrol(String(BloDetailsList.el_2025_female));
        setTg2025Electrol(String(BloDetailsList.el_2025_tg));
        setTotal2025Electrol(String(BloDetailsList.el_2025_total));

        setForm6(String(BloDetailsList?.el_form6_app));
        setForm8(String(BloDetailsList?.el_form8_app));
        setMigrationAc(String(BloDetailsList?.el_migration));
        setTotalApplications(String(BloDetailsList?.el_total_app));

        setElectorDate(BloDetailsList?.el_created_on);

      } else {
        Alert.alert("Empty", "Data is not there");
      }
      props.setViewBLODetailsSuccess();
    }
  },[props.isViewBloDetailsSuccess]);

  useEffect(()=>{
    if(props.ViewBloDetailsError){
      setLoading(false);
      if(isNetPresent){
        if (props.ViewBloDetailsError?.message === "Failed to connect to /49.204.72.5:8080"){
           Alert.alert("Fetching Elector Data Failed", "Please check internet connection!,try after some time..");
        } else {
           Alert.alert("Fetching Elector Data Failed", props.ViewBloDetailsError?.message ? props.ViewBloDetailsError?.message : "Something went wrong, please try again!");
        }
      }
      props.setViewBLODetailsError();
    }
  },[props.ViewBloDetailsError])

// useEffect(() => {
//   const total2002 =
//     parseInt(male2002Electrol || 0) +
//     parseInt(female2002Electrol || 0) +
//     parseInt(tg2002Electrol || 0);

//   setTotal2002Electrol(total2002.toString());
// }, [male2002Electrol, female2002Electrol, tg2002Electrol]);

// useEffect(() => {
//   const total2025 =
//     parseInt(male2025Electrol || 0) +
//     parseInt(female2025Electrol || 0) +
//     parseInt(tg2025Electrol || 0);

//   setTotal2025Electrol(total2025.toString());
// }, [male2025Electrol, female2025Electrol, tg2025Electrol]);

// useEffect(() => {
//   const totalApplications = 
//     parseInt(form6 || 0) +
//     parseInt(form8 || 0) +
//     parseInt(migrationAc || 0);

//   setTotalApplications(totalApplications.toString());
// }, [form6, form8, migrationAc]);


      const handleSubmit = () => {
        console.log('Form submitted');

        if((wardName && male2002Electrol && female2002Electrol && tg2002Electrol 
          && male2025Electrol && female2025Electrol && tg2025Electrol && form6 &&
            form8 && migrationAc) && decodedToken) {

            const fields = {
              el_2002_male: parseInt(male2002Electrol),
              el_2002_female: parseInt(female2002Electrol),
              el_2002_tg: parseInt(tg2002Electrol),
              el_2002_total: parseInt(total2002Electrol),
              el_2025_male: parseInt(male2025Electrol),
              el_2025_female: parseInt(female2025Electrol),
              el_2025_tg: parseInt(tg2025Electrol),
              el_2025_total: parseInt(total2025Electrol),
              el_form6_app: parseInt(form6),
              el_form8_app: parseInt(form8),
              el_migration: parseInt(migrationAc),
              el_total_app: parseInt(totalApplications),
              el_part_no: parseInt(decodedToken?.PartNumber),
              el_ac_number: parseInt(decodedToken?.AcNumber),
              el_created_by: parseInt(decodedToken?.sub),
            }
            
            console.log("Api BLO Details:-", fields);

            setLoading(true);
            props.submitBLODetails(fields);

        } else {
          Alert.alert("Incomplete Fields", "Please fill the Required fields!!");
        }
      };

  // useEffect (()=> {
  //   if(props.isBloDetailsSuccess){
  //     console.log("BLO Details Response", props.BloDetailsModel);
  //     const statusCode = props.BloDetailsModel?.statusCode;
  //     const message = props.BloDetailsModel?.message;
  //     setLoading(false);

  //     if(statusCode === 200){
  //       Alert.alert('Success', message);

  //       const routes = navigation.getState()?.routes;
  //       const updatedRoutes = routes.filter(route => route.name !== "BloDetailsEntry");
  //       navigation.dispatch(
  //                 CommonActions.reset({
  //                   index: updatedRoutes?.length - 1,
  //                   routes: updatedRoutes,
  //                 })
  //               );
  //     } else {
  //       Alert.alert('Attention', message);
  //     }

  //     props.setSubmitBLODetailsSuccess();
  //   }
  // },[props.isBloDetailsSuccess]);

  useEffect(()=>{
    if(props.BloDetailsError){
      setLoading(false);
      if (props.BloDetailsError?.message === "Failed to connect to /49.204.72.5:8080"){
         Alert.alert("Submission Failed", "Please check internet connection!");
      } else {
         Alert.alert("Submission Failed", props.BloDetailsError?.message ? props.BloDetailsError?.message : "Something went wrong, please try again!");
      }
    }
  },[props.BloDetailsError])
      
  return (
    <ElectrolDetailsEntryPresentational
        slNo={slNo}
        setSlNo={setSlNo}
        wardName={wardName}
        setWardName={setWardName}
        male2002Electrol={male2002Electrol}
        setMale2002Electrol={setMale2002Electrol}
        female2002Electrol={female2002Electrol}
        setFemale2002Electrol={setFemale2002Electrol}
        tg2002Electrol={tg2002Electrol}
        setTg2002Electrol={setTg2002Electrol}
        total2002Electrol={total2002Electrol}
        setTotal2002Electrol={setTotal2002Electrol}
        male2025Electrol={male2025Electrol}
        setMale2025Electrol={setMale2025Electrol}
        female2025Electrol={female2025Electrol}
        setFemale2025Electrol={setFemale2025Electrol}
        tg2025Electrol={tg2025Electrol}
        setTg2025Electrol={setTg2025Electrol}
        total2025Electrol={total2025Electrol}
        setTotal2025Electrol={setTotal2025Electrol}
        form6={form6}
        setForm6={setForm6}
        form8={form8}
        setForm8={setForm8}
        migrationAc={migrationAc}
        setMigrationAc={setMigrationAc}
        totalApplications={totalApplications}
        setTotalApplications={setTotalApplications}
        handleSubmit={handleSubmit}
        loading={loading}
        electorDate={electorDate}
    />
  )
}

function mapStateToProps(state) {
  return {
    BloDetailsModel: state.BloDetails.BloDetailsModel,
    BloDetailsIn: state.BloDetails.BloDetailsIn,
    isBloDetailsSuccess: state.BloDetails.isBloDetailsSuccess,
    BloDetailsError: state.BloDetails.BloDetailsError,

    ViewBloDetailsModel: state.BloDetails.ViewBloDetailsModel,
    ViewBloDetailsIn: state.BloDetails.ViewBloDetailsIn,
    isViewBloDetailsSuccess: state.BloDetails.isViewBloDetailsSuccess,
    ViewBloDetailsError: state.BloDetails.ViewBloDetailsError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitBLODetails: (fields) => dispatch(ElectorDetailsActions.submitBLODetails(fields)),
    setSubmitBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setSubmitBLODetailsSuccess()),
    setSubmitBLODetailsError: () => dispatch(ElectorDetailsActions.setSubmitBLODetailsError()),

    viewBLODetails: (fields, isManualOfflineFetch, userId) => dispatch(ElectorDetailsActions.viewBLODetails(fields, isManualOfflineFetch, userId)),
    setViewBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setViewBLODetailsSuccess()),
    setViewBLODetailsError: () => dispatch(ElectorDetailsActions.setViewBLODetailsError()),
  
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ElectrolDetailsEntryContainer);