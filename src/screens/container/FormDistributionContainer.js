import React, { useEffect, useState } from 'react'
import FormDistributionPresentational from '../presentational/FormDistributionPresentational'
import * as BothDistriCollectActions from '../../actions/BothDistriCollectActions';
import { connect } from 'react-redux';
import { useUser } from '../utils/UserProvider';
import { Alert } from 'react-native';
import { useNavigation, CommonActions } from '@react-navigation/native';
import * as ElectorDetailsActions from '../../actions/ElectorDetailsActions';
import { saveSubmittedDistributionOffline, createSubmitDistributionTable } from '../../offlineDataBase/FormDistributionDB';
import { getDBConnection } from '../../offlineDataBase/DBcreation';

const FormDistributionContainer = (props) => {
  const navigation = useNavigation();
  const [directDistribution, setDirectDistribution] = useState('');
  const [droppedDistribution, setDroppedDistribution] = useState('');
  const [totalForms, setTotalForms] = useState('');
  const { decodedToken, isNetPresent } = useUser();
  const [loading, setLoading] = useState(false);
  const [bloLoading, setBloLoading] = useState(false);
  const [totalFormData, setTotalFormData] = useState('');
  const [submittedList, setSubmittedList] = useState([]);

  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const [days, setDays] = useState(formatDate(new Date()));

    useEffect(()=>{
      if(decodedToken){
        const fields = {
          el_part_no: parseInt(decodedToken?.PartNumber),
          el_ac_number: parseInt(decodedToken?.AcNumber),
        }
        setLoading(true);
        setBloLoading(true);
        props.viewBLODetails(fields, false, parseInt(decodedToken?.sub))
        props.getDistributionDetails(fields, true, parseInt(decodedToken?.sub));
      }
    },[]);

     useEffect(()=>{
      if(props.isGetDistributionDetailsSuccess) {
        console.log("getDistributionDetailsModel:-",props.getDistributionDetailsModel);
        const statusCode = props.getDistributionDetailsModel?.statusCode;

        setLoading(false);
        // if(statusCode === 200){
          setSubmittedList(props.getDistributionDetailsModel?.data?.data);
        // }
        props.setGetDistributionDetailsSuccess();
      }
    },[props.isGetDistributionDetailsSuccess]);
  
    useEffect(()=>{
      if(props.isViewBloDetailsSuccess) {
        console.log("ViewBloDetailsModel:-",props.ViewBloDetailsModel);
        const statusCode = props.ViewBloDetailsModel?.statusCode;
        
        setBloLoading(false);
        // if(statusCode === 200){
          setTotalFormData(props.ViewBloDetailsModel?.data?.data?.el_2025_total);
        // }
        console.log("props.ViewBloDetailsModel?.data?.data?.el_2025_total",props.ViewBloDetailsModel?.data?.data?.el_2025_total);
        props.setViewBLODetailsSuccess();
      }
    },[props.isViewBloDetailsSuccess]);

    useEffect(() => {
      const direct = parseInt(directDistribution) || 0;
      const dropped = parseInt(droppedDistribution) || 0;
      setTotalForms((direct + dropped).toString());
    }, [directDistribution, droppedDistribution]);

    const handleSubmit = async () => {
      if((directDistribution || droppedDistribution) && decodedToken){
        const newForms = parseInt(totalForms) || 0;

        const submittedTotal = submittedList?.reduce(
            (sum, item) => sum + (parseInt(item.dtb_total_count) || 0),
              0
            );

        const grandTotal = submittedTotal + newForms;

        if (grandTotal > parseInt(totalFormData)) {
            Alert.alert(
              "Forms Exceeded",
              `You cannot submit more than ${totalFormData} forms. Already submitted: ${submittedTotal}, trying to add: ${newForms}.`
            );
            return;
        }
        
        const fields = {
          dtb_day_count: parseInt(totalForms),
          dtb_direct_count: parseInt(directDistribution),
          dtb_dropped_count: parseInt(droppedDistribution),
          dtb_total_count: parseInt(totalForms),
          dtb_part_no: parseInt(decodedToken?.PartNumber),
          dtb_created_by: parseInt(decodedToken?.sub),
          dtb_ac_number: parseInt(decodedToken?.AcNumber),
          user_id: parseInt(decodedToken?.sub),
        }

        setLoading(true);
        console.log("distribution api fields:-", fields);
        const db = await getDBConnection();
        await createSubmitDistributionTable(db);

        if (isNetPresent) {
          console.log("Internet is present:-", isNetPresent);
          // Online: submit to API
          props.submitDistributionDetails(fields);
        } else {
          console.log("Internet is absent:-", isNetPresent);
          // Offline: save to SQLite
          await saveSubmittedDistributionOffline(db, fields);
          Alert.alert(
                      "Success",
                      "Distribution saved offline Successfully. Please sync when you online.",
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            const routes = navigation.getState()?.routes;
                            const updatedRoutes = routes.filter(route => route.name !== "FormDistribution");
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
          setLoading(false);
        }

      } else {
        Alert.alert("Incomplete Fields","Please enter required fields!!");
      }
    }

    useEffect(()=>{
      if(props.isSubmitDistributionDetailsSuccess){
        console.log("submitDistributionDetailsModel:-", props.submitDistributionDetailsModel);
        const statusCode = props.submitDistributionDetailsModel?.statusCode;
        const message = props.submitDistributionDetailsModel?.message;

        setLoading(false);

        const fields = {
          el_part_no: parseInt(decodedToken?.PartNumber),
          el_ac_number: parseInt(decodedToken?.AcNumber),
        }
        props.getDistributionDetails(fields, true, parseInt(decodedToken?.sub));

        props.setSubmitDistributionDetailsSuccess();
        if(statusCode === 200){
          Alert.alert(
                      "Success",
                      message,
                      [
                        {
                          text: "OK",
                          onPress: () => {
                            const routes = navigation.getState()?.routes;
                            const updatedRoutes = routes.filter(route => route.name !== "FormDistribution");
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
    },[props.isSubmitDistributionDetailsSuccess]);

  useEffect(()=>{
    if(props.SubmitDistributionDetailsError){
      setLoading(false);
      if (props.SubmitDistributionDetailsError === "Failed to connect to /49.204.72.5:8080"){
         Alert.alert("Submission Failed", "Please check internet connection!");
      } else {
         Alert.alert("Submission Failed", props.SubmitDistributionDetailsError?.message ? props.SubmitDistributionDetailsError?.message : "Something went wrong, please try again!");
      }
    }
  },[props.SubmitDistributionDetailsError])

    const handleCancel = () => {
        setDays('');
        setDirectDistribution(0);
        setDroppedDistribution(0);
    }

    return (
      <FormDistributionPresentational
        directDistribution={directDistribution}
        setDirectDistribution={setDirectDistribution}
        droppedDistribution={droppedDistribution}
        setDroppedDistribution={setDroppedDistribution}
        totalForms={totalForms}
        setTotalForms={setTotalForms}
        days={days}
        setDays={setDays}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        loading={loading}
        bloLoading={bloLoading}
        totalFormData={totalFormData}
        submittedList={submittedList}
      />
    )
}

function mapStateToProps(state) {
  return {
    submitDistributionDetailsModel: state.bothDistriCollectApi.submitDistributionDetailsModel,
    isSubmitDistributionDetailsIn: state.bothDistriCollectApi.isSubmitDistributionDetailsIn,
    isSubmitDistributionDetailsSuccess: state.bothDistriCollectApi.isSubmitDistributionDetailsSuccess,
    SubmitDistributionDetailsError: state.bothDistriCollectApi.SubmitDistributionDetailsError,

    getDistributionDetailsModel: state.bothDistriCollectApi.getDistributionDetailsModel,
    isGetDistributionDetailsIn: state.bothDistriCollectApi.isGetDistributionDetailsIn,
    isGetDistributionDetailsSuccess: state.bothDistriCollectApi.isGetDistributionDetailsSuccess,
    getDistributionDetailsError: state.bothDistriCollectApi.getDistributionDetailsError,

    ViewBloDetailsModel: state.BloDetails.ViewBloDetailsModel,
    ViewBloDetailsIn: state.BloDetails.ViewBloDetailsIn,
    isViewBloDetailsSuccess: state.BloDetails.isViewBloDetailsSuccess,
    ViewBloDetailsError: state.BloDetails.ViewBloDetailsError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    submitDistributionDetails: (fields) => dispatch(BothDistriCollectActions.submitDistributionDetails(fields)),
    setSubmitDistributionDetailsSuccess: () => dispatch(BothDistriCollectActions.setSubmitDistributionDetailsSuccess()),
    setSubmitDistributionDetailsError: () => dispatch(BothDistriCollectActions.setSubmitDistributionDetailsError()),

    getDistributionDetails: (fields, isManualOfflineFetch, userId) => dispatch(BothDistriCollectActions.getDistributionDetails(fields, isManualOfflineFetch, userId)),
    setGetDistributionDetailsSuccess: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsSuccess()),
    setGetDistributionDetailsError: () => dispatch(BothDistriCollectActions.setGetDistributionDetailsError()),
  
    viewBLODetails: (fields, isManualOfflineFetch, userId) => dispatch(ElectorDetailsActions.viewBLODetails(fields, isManualOfflineFetch, userId)),
    setViewBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setViewBLODetailsSuccess()),
    setViewBLODetailsError: () => dispatch(ElectorDetailsActions.setViewBLODetailsError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FormDistributionContainer);