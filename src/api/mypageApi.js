import api from './axiosInstance';

export const getMyPage = () =>
    api.get('/user/mypage');