const initialState = {
  employerName: '',
  pay: '',
  isStateAgency: null
};

const job = (state = initialState) => ({
  employerName: state.employerName,
  pay: state.pay,
  isStateAgency: state.isStateAgency,
});

export default job;
