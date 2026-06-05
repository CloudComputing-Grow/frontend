import { useState, useEffect } from 'react'
import api from '../api/axiosInstance'
import '../styles/Market.css'

const getImagePath = (itemName) => {
  const map = {
    '일반 비료': 'fertilizer.png',
    '일반 사과': 'apple.png',
    '황금 사과': 'gold_apple.png',
    '일반 체리': 'cherry.png',
    '황금 체리': 'gold_cherry.png',
    '일반 포도': 'grape.png',
    '황금 포도': 'gold_grape.png',
    '일반 자몽': 'grapefruit.png',
    '황금 자몽': 'gold_grapefruit.png',
    '일반 레몬': 'lemon.png',
    '황금 레몬': 'gold_lemon.png',
    '일반 망고': 'mango.png',
    '황금 망고': 'gold_mango.png',
    '일반 오렌지': 'orange.png',
    '황금 오렌지': 'gold_orange.png',
    '일반 복숭아': 'peach.png',
    '황금 복숭아': 'gold_peach.png',
  }
  return map[itemName] || 'seed.png'
}

function Market() {
  const [listings, setListings] = useState([])
  const [inventory, setInventory] = useState([])
  const [selectedItemTypeId, setSelectedItemTypeId] = useState('')
  const [qty, setQty] = useState(1)
  const [modal, setModal] = useState({ show: false, message: '', isSuccess: false })

  const token = localStorage.getItem('accessToken')
  const userId = token ? Number(JSON.parse(atob(token.split('.')[1])).user_Id) : null

  const fetchListings = async () => {
    try {
      const res = await api.get('/api/v1/market', {})
      setListings(res.data.data?.listings || [])
    } catch (err) { console.error(err) }
  }

  const fetchInventory = async () => {
    try {
      const res = await api.get('/api/v1/inventory', {})
      const items = res.data.data?.items || []
      setInventory(items.filter(item => item.qty > 0 && (item.category === 'BASIC_FRUIT' || item.category === 'GOLD_FRUIT')))
    } catch (err) { console.error(err) }
  }

  useEffect(() => {
    fetchListings()
    fetchInventory()
  }, [])

  const handleRegister = async () => {
    if (!selectedItemTypeId) return alert('과일을 선택해주세요')
    try {
      await api.post('/api/v1/market/listings', {
        itemTypeId: Number(selectedItemTypeId), qty: Number(qty)
      }, {})
      alert('등록 완료!')
      setSelectedItemTypeId('')
      setQty(1)
      fetchListings()
      fetchInventory()
    } catch (err) { alert('등록 실패'); console.error(err) }
  }

  const handleExchange = async (postId) => {
    try {
      await api.post('/api/v1/market/exchange', { postId }, {})
      setModal({ show: true, message: '교환이 완료됐어요! ', isSuccess: true })
      fetchListings()
      fetchInventory()
    } catch (err) {
      const code = err.response?.data?.error_code
      const messages = {
        EXCEEDED_DAILY_LIMIT: '오늘 교환 횟수(3번)를 모두 사용했습니다.',
        INVALID_POST: '이미 다른 사람이 가져간 과일입니다.',
        INV_FULL: '인벤토리가 가득 찼습니다.',
        LIMIT_EXCEEDED: '해당 과일을 더 이상 보유할 수 없습니다.',
      }
      setModal({ show: true, message: messages[code] || '서버 오류가 발생했습니다.', isSuccess: false })
      console.error(err)
    }
  }

  const handleCancel = async (postId) => {
    try {
      await api.post('/api/v1/market/cancel', { postId }, {})
      alert('취소 완료!')
      fetchListings()
      fetchInventory()
    } catch (err) { alert('취소 실패'); console.error(err) }
  }

  return (
    <div className="market-container">

      {modal.show && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 9999
        }}>
          <div style={{
            background: '#fff', borderRadius: '16px', padding: '32px 24px',
            textAlign: 'center', minWidth: '260px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>
              {modal.isSuccess ? '🎉' : '😢'}
            </div>
            <p style={{ fontSize: '1rem', marginBottom: '20px', color: '#333' }}>
              {modal.message}
            </p>
            <button onClick={() => setModal({ ...modal, show: false })} style={{
              background: '#4caf50', color: '#fff', border: 'none',
              borderRadius: '8px', padding: '10px 28px', fontSize: '1rem', cursor: 'pointer'
            }}>
              확인
            </button>
          </div>
        </div>
      )}

      <h1 className="market-title">🌿 그로우 마켓</h1>

      <div className="register-form">
        <h3>과일 등록</h3>
        <select value={selectedItemTypeId} onChange={e => setSelectedItemTypeId(e.target.value)}>
          <option value="">등록할 과일 선택</option>
          {inventory.map(item => (
            <option key={item.slot} value={item.type}>
              {item.item_name} (보유: {item.qty}개)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          value={qty}
          onChange={e => setQty(e.target.value)}
          placeholder="수량"
        />
        <button className="register-btn" onClick={handleRegister}>등록</button>
        <p className="notice">
          등록 후 30일이 지나면 자동 삭제됩니다.<br />
          황금 과일은 교환이 불가능합니다.
        </p>
      </div>

      <div className="item-list">
        {listings.length === 0 && <p>등록된 과일이 없습니다.</p>}
        {listings.map(item => (
          <div key={item.post_id} className="market-item">
            <div className="item-left">
              <img src={`/${getImagePath(item.item_name)}`} alt={item.item_name} />
              <div>
                <div className="nickname">{item.nickname || '알 수 없음'}</div>
                <div className="subtext">{item.item_name}</div>
                <div className="subtext d-day">D-{item.dday}</div>
              </div>
            </div>
            <div className="item-right">
              {item.seller_id === userId ? (
                <button className="cancel-btn" onClick={() => handleCancel(item.post_id)}>등록 취소</button>
              ) : item.category !== 'GOLD_FRUIT' ? (
                <button className="exchange-btn" onClick={() => handleExchange(item.post_id)}>교환 요청</button>
              ) : (
                <span className="no-exchange">교환 불가</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Market