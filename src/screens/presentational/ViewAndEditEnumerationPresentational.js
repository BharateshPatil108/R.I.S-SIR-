import ViewAndEditEnumerationScreen from '../components/ViewAndEditEnumerationScreen'

const ViewAndEditEnumerationPresentational = (props) => {
  return (
    <ViewAndEditEnumerationScreen
        electoralRecords={props.electoralRecords}
        loading={props.loading}
    />
  )
}

export default ViewAndEditEnumerationPresentational