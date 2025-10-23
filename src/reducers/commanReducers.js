const commanReducerState = {

  fetchRoleListModel: [],
  isFetchRoleListIn: false,
  isFetchRoleListSuccess: false,
  fetchRoleListError: '',

  fetchDistrictListModel: [],
  isFetchDistrictListIn: false,
  isFetchDistrictListSuccess: false,
  fetchDistrictListError: '',

  fetchAssemblyListModel: [],
  isFetchAssemblyListIn: false,
  isFetchAssemblyListSuccess: false,
  fetchAssemblyListError: '',

  fetchPartListModel: [],
  isFetchPartListIn: false,
  isFetchPartListSuccess: false,
  fetchPartListError: '',

  fetchContactDetailsModel: [],
  isFetchContactDetailsIn: false,
  isFetchContactDetailsSuccess: false,
  fetchContactDetailsError: '',

}

export const commanApi = function (state = commanReducerState, action) {
  switch (action.type) {
    case 'FETCH_ROLES_LIST_START':
      return Object.assign({}, state, { isFetchRoleListIn: true, isFetchRoleListSuccess: false })
    case 'FETCH_ROLES_LIST_SUCCESS':
      return Object.assign({}, state, { fetchRoleListModel: action.payload, isFetchRoleListIn: false, isFetchRoleListSuccess: true })
    case 'FETCH_ROLES_LIST_FAILURE':
      return Object.assign({}, state, { fetchRoleListError: action.payload, isFetchRoleListIn: false, isFetchRoleListSuccess: false })
    case 'SET_IS_FETCH_ROLES_LIST_SUCCESS':
      return Object.assign({}, state, { isFetchRoleListSuccess: false })
    case 'SET_IS_FETCH_ROLES_LIST_ERROR':
      return Object.assign({}, state, { fetchRoleListError: '' })

    case 'FETCH_DISTRICTS_START':
      return Object.assign({}, state, { isFetchDistrictListIn: true, isFetchDistrictListSuccess: false })
    case 'FETCH_DISTRICTS_SUCCESS':
      return Object.assign({}, state, { fetchDistrictListModel: action.payload, isFetchDistrictListIn: false, isFetchDistrictListSuccess: true })
    case 'FETCH_DISTRICTS_FAILURE':
      return Object.assign({}, state, { fetchDistrictListError: action.payload, isFetchDistrictListIn: false, isFetchDistrictListSuccess: false })
    case 'SET_IS_FETCH_DISTRICTS_SUCCESS':
      return Object.assign({}, state, { isFetchDistrictListSuccess: false })
    case 'SET_IS_FETCH_DISTRICTS_ERROR':
      return Object.assign({}, state, { fetchDistrictListError: '' })
      
    case 'FETCH_ASSEMBLY_LIST_START':
      return Object.assign({}, state, { isFetchAssemblyListIn: true, isFetchAssemblyListSuccess: false })
    case 'FETCH_ASSEMBLY_LIST_SUCCESS':
      return Object.assign({}, state, { fetchAssemblyListModel: action.payload, isFetchAssemblyListIn: false, isFetchAssemblyListSuccess: true })
    case 'FETCH_ASSEMBLY_LIST_FAILURE':
      return Object.assign({}, state, { fetchAssemblyListError: action.payload, isFetchAssemblyListIn: false, isFetchAssemblyListSuccess: false })
    case 'SET_IS_FETCH_ASSEMBLY_LIST_SUCCESS':
      return Object.assign({}, state, { isFetchAssemblyListSuccess: false })
    case 'SET_IS_FETCH_ASSEMBLY_LIST_ERROR':
      return Object.assign({}, state, { fetchAssemblyListError: '' })

    case 'FETCH_PARTS_LIST_START':
      return Object.assign({}, state, { isFetchPartListIn: true, isFetchPartListSuccess: false })
    case 'FETCH_PARTS_LIST_SUCCESS':
      return Object.assign({}, state, { fetchPartListModel: action.payload, isFetchPartListIn: false, isFetchPartListSuccess: true })
    case 'FETCH_PARTS_LIST_FAILURE':
      return Object.assign({}, state, { fetchPartListError: action.payload, isFetchPartListIn: false, isFetchPartListSuccess: false })
    case 'SET_IS_FETCH_PARTS_LIST_SUCCESS':
      return Object.assign({}, state, { isFetchPartListSuccess: false })
    case 'SET_IS_FETCH_PARTS_LIST_ERROR':
      return Object.assign({}, state, { fetchPartListError: '' })

    case 'FETCH_CONTACT_DEATILS_LIST_START':
      return Object.assign({}, state, { isFetchContactDetailsIn: true, isFetchContactDetailsSuccess: false })
    case 'FETCH_CONTACT_DEATILS_LIST_SUCCESS':
      return Object.assign({}, state, { fetchContactDetailsModel: action.payload, isFetchContactDetailsIn: false, isFetchContactDetailsSuccess: true })
    case 'FETCH_CONTACT_DEATILS_LIST_FAILURE':
      return Object.assign({}, state, { fetchContactDetailsError: action.payload, isFetchContactDetailsIn: false, isFetchContactDetailsSuccess: false })
    case 'SET_IS_FETCH_CONTACT_DEATILS_LIST_SUCCESS':
      return Object.assign({}, state, { isFetchContactDetailsSuccess: false })
    case 'SET_IS_FETCH_CONTACT_DEATILS_LIST_ERROR':
      return Object.assign({}, state, { fetchContactDetailsError: '' })

    default:
      return state;
  }

}