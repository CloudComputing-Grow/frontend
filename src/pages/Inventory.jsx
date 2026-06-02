import { useState, useEffect } from 'react'
import axios from 'axios'
import '../styles/Inventory.css'

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

function Inventory() {
  const [items, setItems] = useState([])
  const [tab, setTab] = useState('basic')
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    axios.get('/api/v1/inventory', {
      headers: { 'x-user-id': '1' }
    })
    .then(res => setItems(res.data.data?.items || []))
    .catch(err => console.error(err))
  }, [])

  const handleUseFertilizer = async () => {
    try {
      // 현재 심은 나무의 growthStatusId 가져오기
      const gardenRes = await axios.get('/api/v1/growth-diary/garden', { headers: { 'x-user-id': '1' } })
      const growthStatusId = gardenRes.data?.growthStatusId || 1

      await axios.post('/api/v1/inventory/consume-fertilizer', {
        itemTypeId: selectedItem.type,
        growthStatusId
      }, { headers: { 'x-user-id': '1' } })
      alert('비료 사용 완료!')
      setSelectedItem(null)
      const res = await axios.get('/api/v1/inventory', { headers: { 'x-user-id': '1' } })
      setItems(res.data.data?.items || [])
    } catch (err) {
      alert('비료 사용 실패')
      console.error(err)
    }
  }

  const handlePlantSeed = async () => {
    try {
      await axios.post('/api/v1/inventory/consume-seed', {
        itemTypeId: selectedItem.type
      }, { headers: { 'x-user-id': '1' } })
      alert('씨앗 심기 완료!')
      setSelectedItem(null)
      const res = await axios.get('/api/v1/inventory', { headers: { 'x-user-id': '1' } })
      setItems(res.data.data?.items || [])
    } catch (err) {
      alert('씨앗 심기 실패')
      console.error(err)
    }
  }

  const visibleItems = items.filter(item =>
    item.qty > 0 && (
      tab === 'basic'
        ? item.category === 'BASIC_FRUIT' || item.category === 'FERTILIZER'
        : item.category === 'GOLD_FRUIT'
    )
  )

  // 빈 슬롯 포함 20개 채우기
  const filledSlots = [...visibleItems]
  while (filledSlots.length < 20) filledSlots.push(null)

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: '40px', paddingBottom: '80px' }}>
    <div className="inventory-container">
      <div className="inventory-header">
        <span>👜 인벤토리</span>
      </div>

      <div className="tab-buttons">
        <button
          className={`tab-btn ${tab === 'basic' ? 'active' : ''}`}
          onClick={() => setTab('basic')}
        >기본</button>
        <button
          className={`tab-btn ${tab === 'gold' ? 'active' : ''}`}
          onClick={() => setTab('gold')}
        >황금</button>
      </div>

      <div className="item-grid">
        {filledSlots.map((item, index) => (
          item ? (
            <div
              key={item.slot}
              className={`item-slot ${selectedItem?.slot === item.slot ? 'selected' : ''}`}
              onClick={() => setSelectedItem(item)}
            >
              <img src={`/${getImagePath(item.item_name)}`} alt={item.item_name} />
              <div className="item-count">{item.qty}</div>
            </div>
          ) : (
            <div key={`empty-${index}`} className="item-slot" />
          )
        ))}
      </div>

      <div className="slot-count">{visibleItems.length} / 20</div>

      {selectedItem && (
        <div className="item-info" style={{ display: 'block' }}>
          <div className="info-wrapper">
            <div className="info-left">
              <img src={`/${getImagePath(selectedItem.item_name)}`} alt={selectedItem.item_name} />
            </div>
            <div className="info-divider"></div>
            <div className="info-right">
              <strong className="info-title">{selectedItem.item_name}</strong>
              <div className="item-count-text">개수: {selectedItem.qty}개</div>
              {selectedItem.category === 'FERTILIZER' && (
                <button className="plant-btn" onClick={handleUseFertilizer}>사용하기</button>
              )}
              {selectedItem.category === 'BASIC_FRUIT' && (
                <button className="plant-btn" onClick={handlePlantSeed}>씨앗 심기</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default Inventory
