import { useState, useEffect } from 'react'
import axios from 'axios'
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
  const userId = 1

  const fetchListings = async () => {
    try {
      const res = await axios.get('/api/v1/market', { headers: { 'x-user-id': userId } })
      setListings(res.data.data?.listings || [])
    } catch (err) { console.error(err) }
  }

  const fetchInventory = async () => {
    try {
      const res = await axios.get('/api/v1/inventory', { headers: { 'x-user-id': userId } })
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
      await axios.post('/api/v1/market/listings', {
        itemTypeId: Number(selectedItemTypeId), qty: Number(qty)
      }, { headers: { 'x-user-id': userId } })
      alert('등록 완료!')
      setSelectedItemTypeId('')
      setQty(1)
      fetchListings()
      fetchInventory()
    } catch (err) { alert('등록 실패'); console.error(err) }
  }

  const handleExchange = async (postId) => {
    try {
      await axios.post('/api/v1/market/exchange', { postId }, { headers: { 'x-user-id': userId } })
      alert('교환 완료!')
      fetchListings()
      fetchInventory()
    } catch (err) { alert('교환 실패'); console.error(err) }
  }

  const handleCancel = async (postId) => {
    try {
      await axios.post('/api/v1/market/cancel', { postId }, { headers: { 'x-user-id': userId } })
      alert('취소 완료!')
      fetchListings()
      fetchInventory()
    } catch (err) { alert('취소 실패'); console.error(err) }
  }

  return (
    <div className="market-container">
      <h1 className="market-title">🌿 그로우 마켓</h1>

      {/* 과일 등록 폼 */}
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

      {/* 마켓 목록 */}
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
