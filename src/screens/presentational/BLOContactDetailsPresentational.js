import BLOContanctDetails from "../components/BLOContanctDetails";

const BLOContactDetailsPresentational = (props) => {
  return (
    <BLOContanctDetails 
      roleData={props.roleData}
      setRoleData={props.setRoleData}
      district={props.district}
      setDistrict={props.setDistrict}
      assembly={props.assembly}
      setAssembly={props.setAssembly}
      part={props.part}
      setPart={props.setPart}
      roleDataOptions={props.roleDataOptions}
      districtOptions={props.districtOptions}
      assemblyOptions={props.assemblyOptions}
      partOptions={props.partOptions}
      loading={props.loading}
      contactDetails={props.contactDetails}
      setContactDetails={props.setContactDetails}
      decodedToken={props.decodedToken}
    />
  )
}

export default BLOContactDetailsPresentational;