#!/bin/bash

# ====================================================
#      GAMESTAN 2 - AUTOMATED SANAEI-STYLE SCRIPT
#      Repository: https://github.com/meh732/gamestan2
# ====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

REPO_URL="https://github.com/meh732/gamestan2.git"
INSTALL_DIR="/var/www/gamestan2"
DEFAULT_PORT=3000

clear

show_logo() {
echo -e "${CYAN}"
cat << "LOGO"
  ██████╗  █████╗ ███╗   ███╗███████╗███████╗████████╗██╗███╗   ██╗
  ██╔════╝ ██╔══██╗████╗ ████║██╔════╝██╔════╝╚══██╔══╝██║████╗  ██║
  ██║  ███╗███████║██╔████╔██║█████╗  ███████╗   ██║   ██║██╔██╗ ██║
  ██║   ██║██╔══██║██║╚██╔╝██║██╔══╝  ╚════██║   ██║   ██║██║╚██╗██║
  ╚██████╔╝██║  ██║██║ ╚═╝ ██║███████╗███████║   ██║   ██║██║ ╚████║
   ╚═════╝ ╚═╝  ╚═╝╚═╝     ╚═╝╚══════╝╚══════╝   ╚═╝   ╚═╝╚═╝  ╚═══╝
LOGO
echo -e "${GREEN}================================================================${NC}"
echo -e "${YELLOW}  اسکریپت نصب و مدیریت خودکار گیمستان ۲ (سبک سنایی)  ${NC}"
echo -e "${GREEN}================================================================${NC}"
echo ""
}

check_root() {
    if [ "$EUID" -ne 0 ]; then
        echo -e "${RED}❌ این اسکریپت باید با دسترسی root اجرا شود (sudo -i).${NC}"
        exit 1
    fi
}

install_deps() {
    echo -e "${BLUE}🔄 در حال بروزرسانی مخازن و نصب پیش‌نیازها...${NC}"
    if [ -f /etc/debian_version ]; then
        apt update -y && apt upgrade -y
        apt install -y git curl wget nginx ufw certbot python3-certbot-nginx
    elif [ -f /etc/redhat-release ]; then
        yum update -y
        yum install -y git curl wget nginx certbot python3-certbot-nginx
    fi

    # نصب Node.js v20
    if ! command -v node &> /dev/null; then
        echo -e "${BLUE}📦 در حال نصب Node.js v20 LTS...${NC}"
        curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
        apt install -y nodejs || yum install -y nodejs
    fi

    # نصب PM2
    if ! command -v pm2 &> /dev/null; then
        echo -e "${BLUE}📦 در حال نصب PM2...${NC}"
        npm install -g pm2
    fi
}

deploy_app() {
    echo -e "${BLUE}📥 دریافت سورس‌کد از https://github.com/meh732/gamestan2.git ...${NC}"
    if [ -d "$INSTALL_DIR" ]; then
        cd "$INSTALL_DIR"
        git reset --hard
        git pull origin main || git pull origin master
    else
        git clone "$REPO_URL" "$INSTALL_DIR"
        cd "$INSTALL_DIR"
    fi

    echo -e "${BLUE}📦 در حال نصب پکیج‌های npm...${NC}"
    npm install

    echo -e "${BLUE}🏗️ در حال کامپایل و بیلد پروژه...${NC}"
    npm run build

    echo -e "${BLUE}🚀 راه‌اندازی سرویس با PM2...${NC}"
    pm2 delete gamestan2 &> /dev/null || true
    pm2 start npm --name "gamestan2" -- run preview -- --port $DEFAULT_PORT --host
    pm2 save
    pm2 startup | tail -n 1 | bash &> /dev/null || true

    echo -e "${GREEN}✅ پروژه با موفقیت روی پورت $DEFAULT_PORT بالا آمد.${NC}"
}

setup_nginx() {
    read -p "🌐 آدرس دامنه خود را وارد کنید (مثال: game.yourdomain.com): " DOMAIN
    if [ -z "$DOMAIN" ]; then
        echo -e "${YELLOW}⚠️ دامنه وارد نشد.${NC}"
        return
    fi

    CONF_FILE="/etc/nginx/sites-available/$DOMAIN"
    cat <<EOF2 > $CONF_FILE
server {
    listen 80;
    server_name $DOMAIN;

    location / {
        proxy_pass http://127.0.0.1:$DEFAULT_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF2

    ln -sf $CONF_FILE /etc/nginx/sites-enabled/
    rm -f /etc/nginx/sites-enabled/default &> /dev/null || true
    nginx -t && systemctl restart nginx

    read -p "🔒 آیا تمایل به فعال‌سازی SSL (HTTPS رایگان) دارید؟ (y/n): " SSL_CONF
    if [[ "$SSL_CONF" =~ ^[Yy]$ ]]; then
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos -m admin@$DOMAIN
    fi
}

main_menu() {
    show_logo
    check_root
    echo -e "${PURPLE}1)${NC} 🚀 نصب و استقرار کامل گیمستان ۲"
    echo -e "${PURPLE}2)${NC} 🔄 آپدیت پروژه به آخرین کد گیت‌هاب"
    echo -e "${PURPLE}3)${NC} 🌐 اتصال دامنه و تنظیم Nginx + SSL"
    echo -e "${PURPLE}4)${NC} 📊 وضعیت اجرای برنامه (PM2 Status)"
    echo -e "${PURPLE}5)${NC} 📜 مشاهده لاگ‌های آنلاین (PM2 Logs)"
    echo -e "${PURPLE}0)${NC} ❌ خروج"
    echo ""
    read -p "انتخاب شما [0-5]: " OPTION

    case $OPTION in
        1) install_deps; deploy_app; setup_nginx ;;
        2) deploy_app ;;
        3) setup_nginx ;;
        4) pm2 status ;;
        5) pm2 logs gamestan2 ;;
        0) exit 0 ;;
        *) echo -e "${RED}گزینه نامعتبر!${NC}" ;;
    esac
}

main_menu
