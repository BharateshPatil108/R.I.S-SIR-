import FormCollectionScreen from "../components/FormCollectionScreen"

const FormCollectionPresentational = (props) => {
  return (
    <FormCollectionScreen
        visitCount={props.visitCount}
        setVisitCount={props.setVisitCount}
        formsCollected={props.formsCollected}
        setFormsCollected={props.setFormsCollected}
        present={props.present}
        setPresent={props.setPresent}
        probableAbsent={props.probableAbsent}
        setProbableAbsent={props.setProbableAbsent}
        probableShifted={props.probableShifted}
        setProbableShifted={props.setProbableShifted}
        probableDeceased={props.probableDeceased}
        setProbableDeceased={props.setProbableDeceased}
        multipleEntries={props.multipleEntries}
        setMultipleEntries={props.setMultipleEntries}
        handleSubmit={props.handleSubmit}
        onCameraPress={props.onCameraPress}
        onEpicNumberChange={props.onEpicNumberChange}
        epicNumbers={props.epicNumbers}
        cameraData={props.cameraData}
        onViewImage={props.onViewImage}
        setSelectedImage={props.setSelectedImage}
        selectedImage={props.selectedImage}
        onRemoveImage={props.onRemoveImage}
        handleLocationPress={props.handleLocationPress}
        loadingKeys={props.loadingKeys}
        isSubmitting={props.isSubmitting}
        viewShotRefs={props.viewShotRefs}
        collectionList={props.collectionList}
        loading={props.loading}
        distloading={props.distloading}
        slnumbersInPart={props.slnumbersInPart}
        onSlNumberInPartChange={props.onSlNumberInPartChange}
    />
  )
}

export default FormCollectionPresentational