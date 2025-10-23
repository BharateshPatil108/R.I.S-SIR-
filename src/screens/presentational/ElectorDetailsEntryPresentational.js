import ElectrolDetailsEntry from "../components/ElectorDetailsEntry"

const ElectrolDetailsEntryPresentational = (props) => {
  return (
    <ElectrolDetailsEntry
        slNo={props.slNo}
        setSlNo={props.setSlNo}
        wardName={props.wardName}
        setWardName={props.setWardName}
        male2002Electrol={props.male2002Electrol}
        setMale2002Electrol={props.setMale2002Electrol}
        female2002Electrol={props.female2002Electrol}
        setFemale2002Electrol={props.setFemale2002Electrol}
        tg2002Electrol={props.tg2002Electrol}
        setTg2002Electrol={props.setTg2002Electrol}
        total2002Electrol={props.total2002Electrol}
        setTotal2002Electrol={props.setTotal2002Electrol}
        male2025Electrol={props.male2025Electrol}
        setMale2025Electrol={props.setMale2025Electrol}
        female2025Electrol={props.female2025Electrol}
        setFemale2025Electrol={props.setFemale2025Electrol}
        tg2025Electrol={props.tg2025Electrol}
        setTg2025Electrol={props.setTg2025Electrol}
        total2025Electrol={props.total2025Electrol}
        setTotal2025Electrol={props.setTotal2025Electrol}
        form6={props.form6}
        setForm6={props.setForm6}
        form8={props.form8}
        setForm8={props.setForm8}
        migrationAc={props.migrationAc}
        setMigrationAc={props.setMigrationAc}
        totalApplications={props.totalApplications}
        setTotalApplications={props.setTotalApplications}
        handleSubmit={props.handleSubmit}
        loading={props.loading}
        electorDate={props.electorDate}
    />
  )
}

export default ElectrolDetailsEntryPresentational;