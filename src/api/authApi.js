import api from './axiosInstance';

export const login = (data) =>
    api.post('/auth/login', data);

export const register = (data) =>
    api.post('/auth/signup', data);

export const logout = (refreshToken) =>
    api.post('/user/logout', { refreshToken });

export const changeEmail = (email) =>
    api.patch('/user/change-email', { email });

export const changePassword = (
    oldPassword,
    newPassword
) =>
    api.patch('/user/change-password', {
        oldPassword,
        newPassword
    });

export const deleteAccount = (
    refreshToken
) =>
    api.delete('/user/delete-account', {
        data: { refreshToken }
    });