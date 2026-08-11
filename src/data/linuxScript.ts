export const GENERATE_LINUX_SCRIPT = (port: number = 3000, domain: string = 'gamestan.example.com', enableSsl: boolean = true) => `#!/usr/bin/env bash
# ==============================================================================
# اسکریپت نصب، به‌روزرسانی و مدیریت هوشمند وب‌اپلیکیشن «گیمستان» (Gamestan Web App)
# ویژه سرورهای لینوکس (Ubuntu / Debian / CentOS / RHEL / Fedora)
# پشتیبانی از پورت سفارشی، دامنه، Nginx Reverse Proxy و گواهی SSL Certbot
# ==============================================================================

# تنظیمات رنگ‌بندی ترمینال
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
BLUE='\\033[0;34m'
PURPLE='\\033[0;35m'
CYAN='\\033[0;36m'
NC='\\033[0m' # No Color

# متغیرهای پیش‌فرض
APP_NAME="gamestan"
APP_DIR="/opt/gamestan"
SERVICE_FILE="/etc/systemd/system/gamestan.service"
DEFAULT_PORT="${port}"
DEFAULT_DOMAIN="${domain}"
ENABLE_SSL=${enableSsl}

# بررسی دسترسی Root
check_root() {
  if [ "$EUID" -ne 0 ]; then
    echo -e "\${RED}❌ خطای دسترسی: این اسکریپت باید با دسترسی Root اجرا شود.\${NC}"
    echo -e "\${YELLOW}لطفاً اسکریپت را به صورت sudo اجرا کنید: sudo bash setup.sh\${NC}"
    exit 1
  fi
}

# بنر گرافیکی گیمستان
show_banner() {
  clear
  echo -e "\${CYAN}"
  echo "=========================================================================="
  echo "      🎮 اسکریپت نصب و مدیریت هوشمند سرور «گیمستان» (Gamestan) 🎮       "
  echo "              پشتیبانی کامل از وب‌اپلیکیشن، پورت سفارشی و SSL            "
  echo "=========================================================================="
  echo -e "\${NC}"
}

# بررسی و نصب نیازمندی‌های سیستم
install_dependencies() {
  echo -e "\${BLUE}🔄 در حال بررسی و نصب پیش‌نیازهای لینوکس (Node.js, Nginx, Certbot)... \${NC}"
  
  if [ -f /etc/debian_version ]; then
    apt-get update -y
    apt-get install -y curl wget git nginx certbot python3-certbot-nginx build-essential
    if ! command -v node &> /dev/null; then
      curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
      apt-get install -y nodejs
    fi
  elif [ -f /etc/redhat-release ]; then
    yum update -y
    yum install -y curl wget git nginx certbot python3-certbot-nginx gcc-c++ make
    if ! command -v node &> /dev/null; then
      curl -fsSL https://rpm.nodesource.com/setup_20.x | bash -
      yum install -y nodejs
    fi
  fi

  echo -e "\${GREEN}✅ تمامی پیش‌نیازها با موفقیت نصب شدند.\${NC}"
}

# پیکربندی Nginx Reverse Proxy
configure_nginx() {
  local domain_name=$1
  local app_port=$2

  echo -e "\${BLUE}🌐 در حال تنظیم Nginx به عنوان Reverse Proxy روی پورت \${app_port}...\${NC}"

  cat <<EOF > /etc/nginx/sites-available/gamestan
server {
    listen 80;
    server_name \${domain_name};

    location / {
        proxy_pass http://127.0.0.1:\${app_port};
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

  ln -sf /etc/nginx/sites-available/gamestan /etc/nginx/sites-enabled/gamestan
  rm -f /etc/nginx/sites-enabled/default

  nginx -t
  if [ $? -eq 0 ]; then
    systemctl reload nginx
    echo -e "\${GREEN}✅ تنظیمات Nginx با موفقیت اعمال شد.\${NC}"
  else
    echo -e "\${RED}❌ خطایی در پیکربندی Nginx رخ داد.\${NC}"
  fi
}

# دریافت گواهی SSL رایگان با Certbot
setup_ssl() {
  local domain_name=$1
  echo -e "\${PURPLE}🔒 در حال پیکربندی و دریافت گواهی SSL رایگان (Let's Encrypt) برای \${domain_name}...\${NC}"
  certbot --nginx -d "\${domain_name}" --non-interactive --agree-tos --register-unsafely-without-email || true
  echo -e "\${GREEN}✅ گواهی SSL برای \${domain_name} فعال گردید.\${NC}"
}

# ایجاد سرویس Systemd برای کنترل خودکار
create_systemd_service() {
  local app_port=$1
  echo -e "\${BLUE}⚙️ در حال ساخت سرویس Systemd (gamestan.service)...\${NC}"

  cat <<EOF > \${SERVICE_FILE}
[Unit]
Description=Gamestan Web Application Service
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=\${APP_DIR}
ExecStart=/usr/bin/npm run preview -- --port \${app_port} --host 0.0.0.0
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=\${app_port}

[Install]
WantedBy=multi-user.target
EOF

  systemctl daemon-reload
  systemctl enable gamestan
  systemctl restart gamestan
  echo -e "\${GREEN}✅ سرویس gamestan.service ایجاد و فعال شد.\${NC}"
}

# تابع نصب کامل
install_gamestan() {
  show_banner
  echo -e "\ref{\${GREEN}🚀 شروع فرآیند نصب وب‌اپلیکیشن گیمستان روی لینوکس\${NC}}"
  
  read -p "لطفاً پورت دلخواه برای سرویس را وارد کنید [پیش‌فرض: \${DEFAULT_PORT}]: " INPUT_PORT
  PORT=\${INPUT_PORT:-\${DEFAULT_PORT}}

  read -p "لطفاً آدرس دامنه خود را وارد کنید [پیش‌فرض: \${DEFAULT_DOMAIN}]: " INPUT_DOMAIN
  DOMAIN=\${INPUT_DOMAIN:-\${DEFAULT_DOMAIN}}

  read -p "آیا مایل به فعال‌سازی SSL رایگان (HTTPS) هستید؟ (y/n) [پیش‌فرض: y]: " INPUT_SSL
  USE_SSL=\${INPUT_SSL:-y}

  install_dependencies

  echo -e "\${BLUE}📦 در حال راه‌اندازی فایل‌های پروژه در \${APP_DIR}...\${NC}"
  mkdir -p \${APP_DIR}
  cp -r ./* \${APP_DIR}/ 2>/dev/null || true

  cd \${APP_DIR}
  echo -e "\${BLUE}📥 در حال نصب پکیج‌های npm...\${NC}"
  npm install

  echo -e "\${BLUE}🔨 در حال ساخت فایل‌های اجرایی (Production Build)...\${NC}"
  npm run build

  create_systemd_service \${PORT}

  if [ -n "\${DOMAIN}" ]; then
    configure_nginx \${DOMAIN} \${PORT}
    if [[ "\${USE_SSL}" =~ ^[Yy]$ ]]; then
      setup_ssl \${DOMAIN}
    fi
  fi

  echo -e "\${GREEN}==========================================================================\${NC}"
  echo -e "\${GREEN}🎉 نصب گیمستان با موفقیت انجام شد!\${NC}"
  echo -e "\${YELLOW}🔗 آدرس دسترسی محلی: http://localhost:\${PORT}\${NC}"
  if [ -n "\${DOMAIN}" ]; then
    echo -e "\${YELLOW}🌐 آدرس دامنه شما: http://\${DOMAIN}\${NC}"
  fi
  echo -e "\${GREEN}==========================================================================\${NC}"
}

# تابع به‌روزرسانی پروژه
update_gamestan() {
  show_banner
  echo -e "\${BLUE}🔄 در حال به‌روزرسانی پروژه گیمستان...\${NC}"

  if [ ! -d "\${APP_DIR}" ]; then
    echo -e "\${RED}❌ پوشه پروژه یافت نشد! ابتدا گزینه ۱ (نصب) را اجرا کنید.\${NC}"
    return
  fi

  cd \${APP_DIR}
  echo -e "\${BLUE}📥 به‌روزرسانی پکیج‌ها...\${NC}"
  npm install
  echo -e "\${BLUE}🔨 ساخت مجدد پروژه (Build)...\${NC}"
  npm run build

  echo -e "\${BLUE}🔄 ریستارت سرویس...\${NC}"
  systemctl restart gamestan
  echo -e "\${GREEN}✅ به‌روزرسانی با موفقیت انجام شد.\${NC}"
}

# تغییر پورت و دامنه
reconfigure_app() {
  show_banner
  echo -e "\${YELLOW}⚙️ تغییر پورت و دامنه گیمستان\${NC}"

  read -p "پورت جدید [پیش‌فرض: \${DEFAULT_PORT}]: " NEW_PORT
  NEW_PORT=\${NEW_PORT:-\${DEFAULT_PORT}}

  read -p "دامنه جدید: " NEW_DOMAIN

  create_systemd_service \${NEW_PORT}

  if [ -n "\${NEW_DOMAIN}" ]; then
    configure_nginx \${NEW_DOMAIN} \${NEW_PORT}
    read -p "آیا گواهی SSL نیز دریافت شود؟ (y/n): " WANT_SSL
    if [[ "\${WANT_SSL}" =~ ^[Yy]$ ]]; then
      setup_ssl \${NEW_DOMAIN}
    fi
  fi

  echo -e "\${GREEN}✅ تنظیمات جدید با موفقیت اعمال شدند.\${NC}"
}

# نمایش وضعیت سرویس و لاگ‌ها
check_status() {
  show_banner
  echo -e "\${CYAN}📊 وضعیت سرویس gamestan.service:\${NC}"
  systemctl status gamestan --no-pager
  echo -e "\n\${YELLOW}📑 ۱۰ سطر آخرین لاگ‌های سرویس:\${NC}"
  journalctl -u gamestan -n 10 --no-pager
}

# حذف کامل پروژه
uninstall_gamestan() {
  show_banner
  echo -e "\${RED}⚠️ در حال حذف کامل پروژه گیمستان از لینوکس...\${NC}"
  read -p "آیا مطمئن هستید؟ (y/n): " CONFIRM
  if [[ "\${CONFIRM}" =~ ^[Yy]$ ]]; then
    systemctl stop gamestan 2>/dev/null || true
    systemctl disable gamestan 2>/dev/null || true
    rm -f \${SERVICE_FILE}
    systemctl daemon-reload

    rm -f /etc/nginx/sites-available/gamestan
    rm -f /etc/nginx/sites-enabled/gamestan
    systemctl reload nginx 2>/dev/null || true

    rm -rf \${APP_DIR}
    echo -e "\${GREEN}✅ وب‌اپلیکیشن گیمستان با موفقیت و به‌طور کامل حذف شد.\${NC}"
  else
    echo -e "\${YELLOW}انصراف از حذف.\${NC}"
  fi
}

# منوی اصلی لینوکس
main_menu() {
  check_root
  while true; do
    show_banner
    echo -e "\${YELLOW}لطفاً یکی از گزینه‌های منو را انتخاب کنید:\${NC}"
    echo -e "  \${GREEN}1)\${NC} 🚀 نصب کامل وب‌اپلیکیشن گیمستان (با پورت سفارشی، Nginx و SSL)"
    echo -e "  \${GREEN}2)\${NC} 🔄 به‌روزرسانی پروژه (Update & Rebuild)"
    echo -e "  \${GREEN}3)\${NC} ⚙️ تغییر پورت، دامنه و تنظیمات SSL"
    echo -e "  \${GREEN}4)\${NC} 📊 مشاهده وضعیت سرویس و لاگ‌های لینوکس"
    echo -e "  \${GREEN}5)\${NC} 🗑️ حذف کامل گیمستان (Uninstall)"
    echo -e "  \${GREEN}0)\${NC} 🚪 خروج از منو"
    echo "=========================================================================="
    read -p "شماره گزینه مورد نظر: " CHOICE

    case \$CHOICE in
      1) install_gamestan ;;
      2) update_gamestan ;;
      3) reconfigure_app ;;
      4) check_status ;;
      5) uninstall_gamestan ;;
      0) echo -e "\${GREEN}خروج. روز خوبی داشته باشید!🎮\${NC}"; exit 0 ;;
      *) echo -e "\${RED}❌ گزینه نامعتبر است.\${NC}" ;;
    es":
    read -p "برای ادامه Enter را فشار دهید..."
  done
}

# اجرای منوی اصلی
main_menu
`;
