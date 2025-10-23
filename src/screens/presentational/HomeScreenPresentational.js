import HomeScreen from '../components/HomeScreen'

const HomeScreenPresentational = (props) => {
  return (
    <HomeScreen
        modules={props.modules}
        handleModulePress={props.handleModulePress}
        role={props.role}
        loading={props.loading}
        getOfflineData={props.getOfflineData}
        syncData={props.syncData}
        deleteDatabase={props.deleteDatabase}
        unsyncedDistributionCount={props.unsyncedDistributionCount}
        unsyncedCollectionCount={props.unsyncedCollectionCount}
    />
  )
}

export default HomeScreenPresentational