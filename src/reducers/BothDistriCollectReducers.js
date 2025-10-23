const bothDistriCollectState = {

  submitDistributionDetailsModel: [],
  isSubmitDistributionDetailsIn: false,
  isSubmitDistributionDetailsSuccess: false,
  SubmitDistributionDetailsError: '',

  getDistributionDetailsModel: [],
  isGetDistributionDetailsIn: false,
  isGetDistributionDetailsSuccess: false,
  getDistributionDetailsError: '',

  submitCollectionDetailsModel: [],
  isSubmitCollectionDetailsIn: false,
  isSubmitCollectionDetailsSuccess: false,
  SubmitCollectionDetailsError: '',

  getCollectionDetailsModel: [],
  isGetCollectionDetailsIn: false,
  isGetCollectionDetailsSuccess: false,
  getCollectionDetailsError: '',

}

export const bothDistriCollectApi = function (state = bothDistriCollectState, action) {
  switch (action.type) {
    case 'SUBMIT_DISTRIBUTION_DETAILS_START':
      return Object.assign({}, state, { isSubmitDistributionDetailsIn: true, isSubmitDistributionDetailsSuccess: false })
    case 'SUBMIT_DISTRIBUTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { submitDistributionDetailsModel: action.payload, isSubmitDistributionDetailsIn: false, isSubmitDistributionDetailsSuccess: true })
    case 'SUBMIT_DISTRIBUTION_DETAILS_FAILURE':
      return Object.assign({}, state, { SubmitDistributionDetailsError: action.payload, isSubmitDistributionDetailsIn: false, isSubmitDistributionDetailsSuccess: false })
    case 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { isSubmitDistributionDetailsSuccess: false })
    case 'SET_IS_SUBMIT_DISTRIBUTION_DETAILS_ERROR':
      return Object.assign({}, state, { SubmitDistributionDetailsError: '' })

    case 'GET_DISTRIBUTION_DETAILS_START':
      return Object.assign({}, state, { isGetDistributionDetailsIn: true, isGetDistributionDetailsSuccess: false })
    case 'GET_DISTRIBUTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { getDistributionDetailsModel: action.payload, isGetDistributionDetailsIn: false, isGetDistributionDetailsSuccess: true })
    case 'GET_DISTRIBUTION_DETAILS_FAILURE':
      return Object.assign({}, state, { getDistributionDetailsError: action.payload, isGetDistributionDetailsIn: false, isGetDistributionDetailsSuccess: false })
    case 'SET_IS_GET_DISTRIBUTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { isGetDistributionDetailsSuccess: false })
    case 'SET_IS_GET_DISTRIBUTION_DETAILS_ERROR':
      return Object.assign({}, state, { getDistributionDetailsError: '' })

    case 'SUBMIT_COLLECTION_DETAILS_START':
      return Object.assign({}, state, { isSubmitCollectionDetailsIn: true, isSubmitCollectionDetailsSuccess: false })
    case 'SUBMIT_COLLECTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { submitCollectionDetailsModel: action.payload, isSubmitCollectionDetailsIn: false, isSubmitCollectionDetailsSuccess: true })
    case 'SUBMIT_COLLECTION_DETAILS_FAILURE':
      return Object.assign({}, state, { SubmitCollectionDetailsError: action.payload, isSubmitCollectionDetailsIn: false, isSubmitCollectionDetailsSuccess: false })
    case 'SET_IS_SUBMIT_COLLECTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { isSubmitCollectionDetailsSuccess: false })
    case 'SET_IS_SUBMIT_COLLECTION_DETAILS_ERROR':
      return Object.assign({}, state, { SubmitCollectionDetailsError: '' })

    case 'GET_COLLECTION_DETAILS_START':
      return Object.assign({}, state, { isGetCollectionDetailsIn: true, isGetCollectionDetailsSuccess: false })
    case 'GET_COLLECTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { getCollectionDetailsModel: action.payload, isGetCollectionDetailsIn: false, isGetCollectionDetailsSuccess: true })
    case 'GET_COLLECTION_DETAILS_FAILURE':
      return Object.assign({}, state, { getCollectionDetailsError: action.payload, isGetCollectionDetailsIn: false, isGetCollectionDetailsSuccess: false })
    case 'SET_IS_GET_COLLECTION_DETAILS_SUCCESS':
      return Object.assign({}, state, { isGetCollectionDetailsSuccess: false })
    case 'SET_IS_GET_COLLECTION_DETAILS_ERROR':
      return Object.assign({}, state, { getCollectionDetailsError: '' })

    default:
      return state;
  }

}