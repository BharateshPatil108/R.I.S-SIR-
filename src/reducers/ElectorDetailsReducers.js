const BloDetailsState = {

  BloDetailsModel: [],
  BloDetailsIn: false,
  isBloDetailsSuccess: false,
  BloDetailsError: '',

  ViewBloDetailsModel: [],
  ViewBloDetailsIn: false,
  isViewBloDetailsSuccess: false,
  ViewBloDetailsError: '',

}

export const BloDetails = function (state = BloDetailsState, action) {
  switch (action.type) {
    case 'SUBMIT_BLO_DETAILS_START':
      return Object.assign({}, state, { BloDetailsIn: true, isBloDetailsSuccess: false })
    case 'SUBMIT_BLO_DETAILS_SUCCESS':
      return Object.assign({}, state, { BloDetailsModel: action.payload, BloDetailsIn: false, isBloDetailsSuccess: true })
    case 'SUBMIT_BLO_DETAILS_FAILURE':
      return Object.assign({}, state, { BloDetailsError: action.payload, BloDetailsIn: false, isBloDetailsSuccess: false })
    case 'SET_IS_SUBMIT_BLO_DETAILS_SUCCESS':
      return Object.assign({}, state, { isBloDetailsSuccess: false })
    case 'SET_IS_SUBMIT_BLO_DETAILS_ERROR':
      return Object.assign({}, state, { BloDetailsError: '' })

    case 'VIEW_BLO_DETAILS_START':
      return Object.assign({}, state, { ViewBloDetailsIn: true, isViewBloDetailsSuccess: false })
    case 'VIEW_BLO_DETAILS_SUCCESS':
      return Object.assign({}, state, { ViewBloDetailsModel: action.payload, ViewBloDetailsIn: false, isViewBloDetailsSuccess: true })
    case 'VIEW_BLO_DETAILS_FAILURE':
      return Object.assign({}, state, { ViewBloDetailsError: action.payload, ViewBloDetailsIn: false, isViewBloDetailsSuccess: false })
    case 'SET_IS_VIEW_BLO_DETAILS_SUCCESS':
      return Object.assign({}, state, { isViewBloDetailsSuccess: false })
    case 'SET_IS_VIEW_BLO_DETAILS_ERROR':
      return Object.assign({}, state, { ViewBloDetailsError: '' })

    default:
      return state;
  }

}