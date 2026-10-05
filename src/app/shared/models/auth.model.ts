// 1. Phản hồi chung từ API (Vỏ bọc chung)
export interface ApiResponse<T> {
  code: number;      // Mã phản hồi (200, 400, 401...)
  message: string;   // Thông báo ("Thành công", "Lỗi...")
  result?: T;        // Dữ liệu chính trả về (tùy chọn)
}

// 2. Cấu trúc dữ liệu khi danh sách có phân trang
export interface PageResponse<T> {
  data: T[];             // Mảng dữ liệu của trang hiện tại
  totalElements: number; // Tổng số bản ghi trong CSDL
  totalPages: number;    // Tổng số trang
  currentPage?: number;  // Trang hiện tại (tùy chọn)
  size?: number;         // Kích thước trang (tùy chọn)
}

// 3. Khóa xác thực (Token trả về sau khi đăng nhập)
export interface CheckToken {
  accessToken: string;
}

// 4. Kiểm tra trạng thái và quyền hạn của Token (Introspect)
export interface Introspect {
  valid: boolean;   // Token còn hiệu lực hay không (true/false)
  roles: string;    // Quyền hạn của user (ví dụ: "ADMIN,USER")
  user: any;        // Thông tin chi tiết của user
}