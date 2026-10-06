import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

/**
 * TRANG HOME (KHUNG)
 * - Giao diện tối giản: tiêu đề + vùng nội dung chờ API.
 * - Chưa có API: bạn tự gọi API thật và nối dữ liệu vào đây.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  readonly greeting = this.buildGreeting();

  private buildGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }
}
