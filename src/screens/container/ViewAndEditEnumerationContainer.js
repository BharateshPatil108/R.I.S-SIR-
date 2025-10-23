import React, { useEffect, useState } from 'react';
import ViewAndEditEnumerationPresentational from '../presentational/ViewAndEditEnumerationPresentational'
import { connect } from 'react-redux';
import * as ElectorDetailsActions from '../../actions/ElectorDetailsActions';
import { useUser } from '../utils/UserProvider';

const ViewAndEditEnumerationContainer = (props) => {
  const [electoralRecords, setElectoralRecords] = useState([]);
  const { decodedToken } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(()=>{
    if(decodedToken){
      const fields = {
        el_part_no: parseInt(decodedToken?.PartNumber),
        el_ac_number: parseInt(decodedToken?.AcNumber),
      }
      setLoading(true);
      props.viewBLODetails(fields, false, parseInt(decodedToken?.sub))
    }
  },[]);

  useEffect(()=>{
    if(props.isViewBloDetailsSuccess) {
      console.log("ViewBloDetailsModel:-",props.ViewBloDetailsModel);
      const statusCode = props.ViewBloDetailsModel?.statusCode;
      setLoading(false);
      if(statusCode === 200){
        const BloDetailsList = props.ViewBloDetailsModel?.data?.data;
        setElectoralRecords(BloDetailsList ? [BloDetailsList] : []);
      }
    }
  },[props.isViewBloDetailsSuccess]);

  return (
    <ViewAndEditEnumerationPresentational
        electoralRecords={electoralRecords}
        loading={loading}
    />
  )
}


function mapStateToProps(state) {
  return {
    ViewBloDetailsModel: state.BloDetails.ViewBloDetailsModel,
    ViewBloDetailsIn: state.BloDetails.ViewBloDetailsIn,
    isViewBloDetailsSuccess: state.BloDetails.isViewBloDetailsSuccess,
    ViewBloDetailsError: state.BloDetails.ViewBloDetailsError,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    viewBLODetails: (fields, isManualOfflineFetch, userId) => dispatch(ElectorDetailsActions.viewBLODetails(fields, isManualOfflineFetch, userId)),
    setViewBLODetailsSuccess: () => dispatch(ElectorDetailsActions.setViewBLODetailsSuccess()),
    setViewBLODetailsError: () => dispatch(ElectorDetailsActions.setViewBLODetailsError()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(ViewAndEditEnumerationContainer);