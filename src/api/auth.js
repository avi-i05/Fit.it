import api from "./axios";

export const register = (data) =>  api.post('/api/v1/partners/register', data );
export const login = (data) =>  api.post('/api/v1/partners/login', data );
export const logout = () =>  api.post('/api/v1/partners/logout');
export const getProfile = (data) =>  api.get('/api/v1/partners/me', data );
