import { useState, useEffect } from 'react'
import axios from 'axios'

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
      await axios.post('/api/v1/inventory/consume-fertilizer', {
        itemTypeId: selectedItem.type,
        growthStatusId: 1
      }, {
        headers: { 'x-user-id': '1' }
      })
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
      }, {
        headers: { 'x-user-id': '1' }
      })
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
    tab === 'basic'
      ? item.category === 'BASIC_FRUIT' || item.category === 'FERTILIZER'
      : item.category === 'GOLD_FRUIT'
  )

  return (
    <div>
      <h1> 인벤토리</h1>

      <button onClick={() => setTab('basic')}>기본</button>
      <button onClick={() => setTab('gold')}>황금</button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {visibleItems.map(item => (
          <div key={item.slot} onClick={() => setSelectedItem(item)} style={{ cursor: 'pointer' }}>
            <img src={`/${getImagePath(item.item_name)}`} alt={item.item_name} width={60} />
            <div>{item.item_name}</div>
            <div>수량: {item.qty}</div>
          </div>
        ))}
      </div>

      {selectedItem && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '10px' }}>
          <img src={`/${getImagePath(selectedItem.item_name)}`} alt={selectedItem.item_name} width={80} />
          <p>{selectedItem.item_name}</p>
          <p>개수: {selectedItem.qty}</p>
          {selectedItem.category === 'FERTILIZER' && (
            <button onClick={handleUseFertilizer}>사용하기</button>
          )}
          {selectedItem.category === 'BASIC_FRUIT' && (
            <button onClick={handlePlantSeed}>씨앗 심기</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Inventory
