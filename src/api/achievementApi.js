import api from './axiosInstance'

export const getAchievements = async () => {
  const response = await api.get('/achievements')
  return response.data
}