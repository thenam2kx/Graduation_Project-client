# Backend API Requirements cho tính năng Checkbox Cart

## 1. API xóa nhiều items cùng lúc (Tùy chọn - để tối ưu performance)

### Endpoint
```
DELETE /api/v1/carts/{cartId}/items/batch
```

### Request Body
```json
{
  "itemIds": ["item1_id", "item2_id", "item3_id"]
}
```

### Response
```json
{
  "statusCode": 200,
  "message": "Đã xóa các sản phẩm thành công",
  "data": {
    "_id": "cart_id",
    "userId": "user_id", 
    "items": [...], // Danh sách items còn lại
    "totalPrice": 0
  }
}
```

## 2. Cách triển khai hiện tại (không cần thay đổi backend)

Frontend hiện tại sử dụng API có sẵn:
- `DELETE /api/v1/carts/{cartId}/items/{itemId}` - xóa từng item một
- Gọi API này nhiều lần cho các items đã chọn

## 3. Lợi ích khi có API batch delete

- **Performance**: Giảm số lượng request từ N requests xuống 1 request
- **Consistency**: Đảm bảo tất cả items được xóa cùng lúc
- **Error handling**: Dễ xử lý lỗi hơn

## 4. Nếu backend chưa sẵn sàng

Code frontend đã được thiết kế để hoạt động với cả 2 cách:
1. **Có API batch**: Sử dụng 1 request duy nhất
2. **Không có API batch**: Tự động fallback về việc gọi nhiều API đơn lẻ

## 5. Migration path

### Bước 1: Sử dụng API hiện tại (đã implement)
```typescript
// Tạm thời xóa từng item một
const promises = itemIds.map(itemId => deleteItemFromCartAPI(cartId, itemId))
await Promise.all(promises)
```

### Bước 2: Khi backend có API batch (chỉ cần thay đổi 1 dòng)
```typescript
// Chuyển sang API batch
const response = await axios.delete(`/api/v1/carts/${cartId}/items/batch`, { 
  data: { itemIds } 
})
```