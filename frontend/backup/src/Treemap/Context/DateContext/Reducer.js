///////////////////////////////////////// THE REDUCER /////////////////////////////////////////

export default (state, action) => {
   switch(action.type) {
        case 'SET_NEW_DATES':
            return {
                startDate:  action.startDate, 
                endDate: action.endDate
            }
        default:
            return state;
   }
}