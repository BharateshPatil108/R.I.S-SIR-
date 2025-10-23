import FormDistributionScreen from '../components/FormDistributionScreen'

const FormDistributionPresentational = (props) => {
  return (
    <FormDistributionScreen
        directDistribution={props.directDistribution}
        setDirectDistribution={props.setDirectDistribution}
        droppedDistribution={props.droppedDistribution}
        setDroppedDistribution={props.setDroppedDistribution}
        totalForms={props.totalForms}
        setTotalForms={props.setTotalForms}
        days={props.days}
        setDays={props.setDays}
        handleSubmit={props.handleSubmit}
        handleCancel={props.handleCancel}
        loading={props.loading}
        bloLoading={props.bloLoading}
        totalFormData={props.totalFormData}
        submittedList={props.submittedList}
    />
  )
}

export default FormDistributionPresentational