export const ROLES = {
    ADMIN: 'ROLE_ADMIN',
    CUSTOMER: 'ROLE_CUSTOMER',
    SERVICE_PROVIDER: 'ROLE_SERVICE_PROVIDER'
};

export const ROLE_PATHS = {
    [ROLES.ADMIN]: '/admin/dashboard',
    [ROLES.CUSTOMER]: '/customer',
    [ROLES.SERVICE_PROVIDER]: '/provider/dashboard'
};
