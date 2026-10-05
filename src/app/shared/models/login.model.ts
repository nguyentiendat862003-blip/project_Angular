// 1. Dữ liệu gửi lên khi người dùng bấm Đăng nhập (Request)
export interface LoginRequest {
  username: string;
  password: string;
}

// 2. Dữ liệu phản hồi thực tế trả về từ Server (Response)
export interface LoginResponse {
  status: number;
  message: string;
  token: string;
  timeout: number;
  expired_timestamp: number;
  sve_member: SveMember;
  roles: RolesConfig;
}

// 3. Thông tin chi tiết cá nhân của nhân viên
export interface SveMember {
  sve_member_id: string;
  member_name: string;
  member_family_name: string;
  member_mid_name: string;
  member_full_name: string;
  description: string;
  id_card_no: string;
  passport_no: string;
  email: string;
  primary_mobile: string;
  staff_id: string;
  ldap_user: string;
  job_code_list: string;
  rec_state: number;
  bio_state: number;
  work_status: string;
  linked_user_id: string;
  linked_username: string;
  creator: string;
  created_timestamp: number;
  modifier: string;
  last_modified_timestamp: number;
}

// 4. Cấu hình phân quyền theo đơn vị/chi nhánh (Foundations)
export interface RolesConfig {
  server_roles: any[];
  foundations: Record<string, FoundationDetail>; // "001", "002"...
}

// 5. Chi tiết quyền hạn tại từng chi nhánh
export interface FoundationDetail {
  foundation_id: string;
  foundation_alias_name: string;
  foundation_alias_path: string;
  foundation_name: string;
  system_roles: string[];
  access_roles: {
    roles: Record<string, any>;
    jobcodes: any[];
  };
}