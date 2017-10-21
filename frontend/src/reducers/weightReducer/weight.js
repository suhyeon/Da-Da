const DEFAULT_WEIGHT = {
  weightListItem: [],
}

// Fetch한 데이터 변경해주는 reducer
export const weigthListReducer = (
  state = DEFAULT_WEIGHT,
  action,
) => {
  if (action.type === 'FETCHED_WEIGHT_SUCCESS') {
    return {
      ...state,
      weightListItem: [...action.payload],
    }
  }
  if (action.type === 'POST_WEIGHT_TO_DATABASE') {
    return {
      weightListItem: [
        action.payload,
        ...state.weightListItem,
      ],
    }
  }
  return {
    ...state,
  }
}