const PRIVILEGED_ROLES = ["senior", "admin"];

const isPrivilegedRole = (role) => PRIVILEGED_ROLES.includes(role);

module.exports = { PRIVILEGED_ROLES, isPrivilegedRole };