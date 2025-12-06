# 💬 Chat Contract - Blockchain Chat Application

Chào mừng bạn đến với **Chat Contract** - Ứng dụng chat phi tập trung (decentralized) được xây dựng trên blockchain Ethereum, sử dụng Smart Contract để lưu trữ và quản lý tin nhắn.

## Url smartcontract: https://repo.sourcify.dev/11155111/0x249520318349Da50ff684c13f56668e30F4DB4eF

## ✨ Tính năng

- 🔐 **Kết nối ví Metamask** - Đăng nhập an toàn với ví crypto
- 💬 **Chat realtime** - Tin nhắn được đồng bộ tự động qua blockchain events
- 🗂️ **Quản lý cuộc trò chuyện** - Xem danh sách conversations và chọn người chat
- ✉️ **Gửi tin nhắn** - Gửi tin nhắn trực tiếp qua Smart Contract
- 🗑️ **Xóa tin nhắn** - Xóa từng tin nhắn hoặc xóa toàn bộ cuộc trò chuyện
- 🎨 **UI hiện đại** - Giao diện dark mode đẹp mắt với shadcn/ui
- ⚡ **Performance cao** - Sử dụng Vite + React + TypeScript

## 🛠️ Công nghệ sử dụng

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: TailwindCSS, shadcn/ui
- **Blockchain**: Ethers.js, Smart Contract (Solidity)
- **State Management**: Zustand
- **Icons**: Lucide React

## 📋 Yêu cầu hệ thống

- Node.js >= 18.x
- npm hoặc yarn
- Metamask Extension (hoặc ví Ethereum tương thích)
- Tài khoản Ethereum với ETH (trên testnet hoặc mainnet)

## 🚀 Hướng dẫn cài đặt và chạy

### 1. Clone repository

```bash
git clone [<repository-url>](https://github.com/Hoangdev17/chat-contract-fe.git)
cd chat-contract-fe
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Chạy ứng dụng

#### Development mode:

```bash
npm run dev
```

Ứng dụng sẽ chạy tại: `http://localhost:5173`

#### Build cho production:

```bash
npm run build
```

#### Preview production build:

```bash
npm run preview
```

## 📖 Hướng dẫn test

### Bước 1: Kết nối ví (2 account để test)

1. Mở ứng dụng trong trình duyệt
2. Click nút "Connect Wallet" ở góc trên bên phải
3. Chọn tài khoản Metamask và xác nhận kết nối

### Bước 2: Bắt đầu cuộc trò chuyện mới

1. Click nút **+** ở sidebar bên trái
2. Nhập địa chỉ ví Ethereum của người nhận (format: 0x...)
3. Nhập tin nhắn đầu tiên
4. Click "Send Message" và xác nhận transaction trên Metamask

### Bước 3: Chat

1. Chọn một conversation từ danh sách bên trái
2. Nhập tin nhắn vào ô input phía dưới
3. Nhấn Enter hoặc click nút Send
4. Tin nhắn sẽ xuất hiện realtime sau khi transaction được confirm

### Bước 4: Xóa tin nhắn

- **Xóa từng tin nhắn**: Hover vào tin nhắn của bạn → Click icon Trash
- **Xóa toàn bộ cuộc trò chuyện**: Click icon Trash ở header chat window

## 📁 Cấu trúc thư mục

```
src/
├── components/
│   ├── organism/          # Complex components
│   │   ├── ChatSidebar.tsx
│   │   └── ChatWindow.tsx
│   └── ui/                # shadcn/ui components
├── contracts/
│   └── ChatABI.json       # Smart Contract ABI
├── lib/
│   ├── contract.ts        # Contract configuration
│   └── utils.ts           # Utility functions
├── pages/
│   ├── Chat.tsx           # Main chat page
│   └── home.tsx           # Home page
├── routes/
│   └── index.tsx          # Route configuration
└── store/
    ├── message/           # Message state management
    └── wallet/            # Wallet state management
```

## 🔧 Scripts

```bash
npm run dev        # Chạy development server
npm run build      # Build production
npm run preview    # Preview production build
npm run lint       # Chạy ESLint
```

## 👨‍💻 Tác giả

hoangdev17

---

**Happy Chatting! 🎉**
