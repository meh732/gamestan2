// Web Client Service for Cache Busting, Live Theme Sync, and Online Web Audio Handling

export interface WebThemeConfig {
  primaryColor: string;
  backgroundColor: string;
  cardBackground: string;
  accentColor: string;
  textColor: string;
  buttonRadius: number;
}

export class WebOnlineManager {
  private static instance: WebOnlineManager;
  private currentAudio: HTMLAudioElement | null = null;
  private sfxAudio: HTMLAudioElement | null = null;
  private appVersion: string = Date.now().toString();

  private constructor() {
    this.initCacheBusting();
  }

  public static getInstance(): WebOnlineManager {
    if (!WebOnlineManager.instance) {
      WebOnlineManager.instance = new WebOnlineManager();
    }
    return WebOnlineManager.instance;
  }

  /**
   * 1. غیرفعال‌سازی و پاکسازی کش‌های قدیمی مرورگر و آپدیت Service Worker
   */
  public async initCacheBusting(): Promise<void> {
    try {
      console.log('🚀 شروع پاکسازی کش‌های قدیمی وب‌اپلیکیشن (Force Cache Invalidation)...');

      // پاکسازی تمامی Storage Caches قدیمی مرورگر
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log(`🗑️ حذف کش قدیمی: ${cacheName}`);
            return caches.delete(cacheName);
          })
        );
      }

      // آپدیت اجباری Service Worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
          console.log('🔄 سرویس ورکر به آخرین نسخه آنلاین به‌روزرسانی شد.');
        }
      }

      // به‌روزرسانی نسخه آنلاین جهت افزودن نسخه به آدرس تمام فایل‌ها
      this.appVersion = `v_${Date.now()}`;
    } catch (error) {
      console.warn('⚠️ عدم امکان پاکسازی کامل کش مرورگر:', error);
    }
  }

  /**
   * ساخت URL با تابع Cache-Busting جهت جلوگیری از لود فایل‌های قدیمی
   */
  public getCacheBustedUrl(url: string): string {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${this.appVersion}`;
  }

  /**
   * 2. دریافت و اعمال زنده تم و استایل‌های نسخه آخر سرور روی CSS Variables
   */
  public async syncLatestTheme(themeUrl: string = 'https://gamestan.ir/api/v1/latest-theme.json'): Promise<WebThemeConfig | null> {
    try {
      const bustedUrl = this.getCacheBustedUrl(themeUrl);
      const response = await fetch(bustedUrl, { cache: 'no-store' });
      if (!response.ok) throw new Error('Network response was not ok');

      const themeConfig: WebThemeConfig = await response.json();

      // اعمال مستقیم روی CSS Variables سند وب
      const root = document.documentElement;
      root.style.setProperty('--primary-color', themeConfig.primaryColor);
      root.style.setProperty('--bg-color', themeConfig.backgroundColor);
      root.style.setProperty('--card-bg', themeConfig.cardBackground);
      root.style.setProperty('--accent-color', themeConfig.accentColor);
      root.style.setProperty('--text-color', themeConfig.textColor);
      root.style.setProperty('--button-radius', `${themeConfig.buttonRadius}px`);

      console.log('🎨 تم زنده نسخه آخر سرور با موفقیت روی وب‌اپلیکیشن اعمال شد.');
      return themeConfig;
    } catch (error) {
      console.warn('⚠️ لود استایل پیش‌فرض به دلیل عدم دسترسی به تم آنلاین:', error);
      return null;
    }
  }

  /**
   * 3. پخش موزیک پس‌زمینه آنلاین بدون خطای کش یا CORS
   */
  public playOnlineMusic(musicUrl: string, loop: boolean = true): void {
    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const bustedUrl = this.getCacheBustedUrl(musicUrl);
      const audio = new Audio(bustedUrl);
      audio.crossOrigin = 'anonymous';
      audio.loop = loop;
      audio.volume = 0.4;

      audio.play().then(() => {
        console.log(`🎵 پخش آنلاین موزیک نسخه جدید: ${musicUrl}`);
      }).catch(err => {
        console.warn('⚠️ پخش موزیک به تعامل اولیه کاربر نیاز دارد:', err);
      });

      this.currentAudio = audio;
    } catch (error) {
      console.error('❌ خطا در پخش آنلاین موزیک:', error);
    }
  }

  /**
   * پخش آنلاین افکت‌های صوتی و ویس‌ها
   */
  public playOnlineSfx(sfxUrl: string): void {
    try {
      if (this.sfxAudio) {
        this.sfxAudio.pause();
      }

      const bustedUrl = this.getCacheBustedUrl(sfxUrl);
      const audio = new Audio(bustedUrl);
      audio.crossOrigin = 'anonymous';
      audio.volume = 0.8;

      audio.play().catch(err => console.warn('⚠️ پخش SFX نااموفق بود:', err));
      this.sfxAudio = audio;
    } catch (error) {
      console.error('❌ خطا در پخش افکت صوتی:', error);
    }
  }

  public stopMusic(): void {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
    }
  }
}

export const webOnlineManager = WebOnlineManager.getInstance();
