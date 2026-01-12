const action = {
  ADD: '/add',
  HOSPITAL_USER_LIST: '/hospital-users',
  LIST: '/list',
  UPDATE: '/update',
  DELETE: '/delete',
  DETAIL: '/detail',
  LOGIN: '/login',
  LOGOUT: '/logout',
  CHANGE_PASSWORD: '/change-password',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_OTP: '/verify-otp',
  USER_CUSTOMER: '/list/customers',
  USER_INSURER: '/list/insurers',
  GET_DOCTORS: '/list-doctors',
  UPDATE_AMOUNT: '/update-amount',
  UPDATE_MEDICAL: '/update-medical',
  UPDATE_BASIC: '/update-basic',


};

const component = {
  ROLE: 'role',
  USER: 'user',
  HOSPITAL: 'hospital',
  DOCTOR: 'doctor',
  STAFF: 'staff',
  PATIENT: 'patient',
  POLICY: 'policy',
  CLAIM: 'claim',
};



export {  component, action,  };