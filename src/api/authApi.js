import api from './axiosInstance';

export const login = (data) =>
    api.post('/login', data);

export const register = (data) =>
    api.post('/register', data);

export const logout = (refreshToken) =>
    api.post('/logout', { refreshToken });

export const changeEmail = (email) =>
    api.patch('/change-email', { email });

export const changePassword = (
    oldPassword,
    newPassword
) =>
    api.patch('/change-password', {
        oldPassword,
        newPassword
    });

export const deleteAccount = (
    refreshToken
) =>
    api.delete('/delete-account', {
        data: { refreshToken }
    });