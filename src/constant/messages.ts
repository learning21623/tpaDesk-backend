import { USE_PROXY } from "http-status";

export default {
  CREATED: 'Created',
  SUCCESS: 'Success',
  FAILURE: 'Failed',
  DATA_FETCHED: 'Data successfully fetched',
  NOT_FOUND: 'No data found',
  DELETED: 'Data successfully deleted',
  USER_CREATED: 'User successfully created',
  INVALID_DATA: 'Invalid data, please check your request',
  PRE_SIGNED_URL_SUCCESS: 'Url has been Successfully fetched.',
  USER_VERIFIED: 'User verified successfully!',
  USER_VERIFICATION_FAILED: 'User verification failed!',

  ROLE: {
    ADD_ROLE_SUCCESS: 'Role created successfully!',
    ADD_ROLE_FAILED: 'Role creation failed!',
    ALREADY_EXISTS: 'Role already exists!',
    NOT_FOUND: 'Role not found!',
    ROLE_UPDATE_SUCCESS: 'Role updated successfully!',
    ROLE_LISTING_SUCCESS: 'Roles listed successfully!',
    ROLE_UPDATE_FAILED: 'Role update has failed!',
    ROLE_DELETED: 'Role deleted successfully!',
    ROLE_DELETE_FAILED: 'Role delete failed!',
    ROLE_FETCH: 'Role fetched successfully!',
    FETCH_ERROR: 'Error fetching role details!',
    DELETE_ROLE_FAILED: 'Role deletion failed!',
    DELETE_ROLE_SUCCESS: 'Role deleted successfully!',
  },
  USER: {
    ADD_USER_SUCCESS: 'User created successfully!',
    ALREADY_EXISTS: 'User already exists!',
    NOT_FOUND: 'User not found!',
    INVALID_CREDENTIALS: 'Invalid credentials!',
    LOGIN_USER_SUCCESS: 'Login User Successfully!',
    LOGIN_USER_FAILED: 'Login user failed!',
    ADD_USER_FAILED: 'User creation failed!',
    USER_UPDATE_SUCCESS: 'User updated successfully!',
    USER_LISTING_SUCCESS: 'Users listed successfully!',
    USER_UPDATE_FAILED: 'User update has failed!',
    USER_DELETED: 'User deleted successfully!',
    USER_DELETE_FAILED: 'User delete failed!',
    USER_FETCH: 'Fetch Successfully !',
    FETCH_ERROR: "Error is fetching user details ",
    DELETE_USER_FAILED: 'User delete has failed!',
    DELETE_USER_SUCCESS: 'User deleted successfully!',
  },
HOSPITAL: {
  ADD_SUCCESS: "Hospital created successfully.",
  ADD_FAILED: "Hospital creation failed.",
  LIST_SUCCESS: "Hospital list fetched successfully.",
  FETCH_SUCCESS: "Hospital details fetched successfully.",
  UPDATE_SUCCESS: "Hospital updated successfully.",
  DELETE_SUCCESS: "Hospital deleted successfully.",
  DELETE_FAILED: "Hospital deletion failed.",
  ALREADY_EXISTS: "Hospital with the given details already exists.",
  NOT_FOUND: "Hospital not found."
},
// ... inside export default { ... }
// ... (after HOSPITAL block)

DOCTOR: {
  ADD_SUCCESS: "Doctor created successfully.",
  ADD_FAILED: "Doctor creation failed.",
  LIST_SUCCESS: "Doctor list fetched successfully.",
  FETCH_SUCCESS: "Doctor details fetched successfully.",
  UPDATE_SUCCESS: "Doctor updated successfully.",
  DELETE_SUCCESS: "Doctor deleted successfully.",
  DELETE_FAILED: "Doctor deletion failed.",
  ALREADY_EXISTS: "User is already registered as a doctor.",
  NOT_FOUND: "Doctor not found."
},

// You also need a message for forbidden access (e.g., in a new ACCESS block)
ACCESS: {
  ADMIN_ONLY: "You are not authorized. Only Admin access is allowed."
},

  POLICY: {
    ADD_POLICY_SUCCESS: 'Policy created successfully!',
    ADD_POLICY_FAILED: 'Policy creation failed!',
    UPDATE_POLICY_SUCCESS: 'Policy updated successfully!',
    UPDATE_POLICY_FAILED: 'Policy update has failed!',
    DELETE_POLICY_SUCCESS: 'Policy deleted successfully!',
    DELETE_POLICY_FAILED: 'Policy delete has failed!',
    POLICY_LISTING_SUCCESS: 'Policies listed successfully!',
    POLICY_FETCH_SUCCESS: 'Policy fetched successfully!',
    POLICY_FETCH_ERROR: 'Error fetching policy details!',
    NOT_FOUND: 'Policy not found!',
  },
  CLAIM: {
    ADD_CLAIM_SUCCESS: 'Claim created successfully!',
    ADD_CLAIM_FAILED: 'Claim creation failed!',
    UPDATE_CLAIM_SUCCESS: 'Claim updated successfully!',
    UPDATE_CLAIM_FAILED: 'Claim update has failed!',
    DELETE_CLAIM_SUCCESS: 'Claim deleted successfully!',
    DELETE_CLAIM_FAILED: 'Claim delete has failed!',
    CLAIM_LISTING_SUCCESS: 'Claims listed successfully!',
    CLAIM_FETCH_SUCCESS: 'Claim fetched successfully!',
    CLAIM_FETCH_ERROR: 'Error fetching claim details!',
    NOT_FOUND: 'Claim not found!',
  },

}