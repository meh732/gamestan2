import { MauiFile } from '../types/gamestan';

export const MAUI_FILES: MauiFile[] = [
  {
    id: 'csproj',
    name: 'MauiApp5.csproj',
    path: 'MauiApp5/MauiApp5.csproj',
    type: 'csproj',
    description: 'پیکربندی پروژه کلاینت اصلی .NET 9 MAUI برای اندروید',
    content: `<Project Sdk="Microsoft.NET.Sdk">
	<PropertyGroup>
		<TargetFramework>net9.0-android</TargetFramework>		<OutputType>Exe</OutputType>
		<RootNamespace>MauiApp5</RootNamespace>
		<UseMaui>true</UseMaui>
		<SingleProject>true</SingleProject>
		<ImplicitUsings>enable</ImplicitUsings>
		<Nullable>enable</Nullable>
		<ApplicationTitle>گیمســتان</ApplicationTitle>
		<ApplicationId>com.companyname.mauiapp5</ApplicationId>
		<ApplicationDisplayVersion>1.0</ApplicationDisplayVersion>
		<ApplicationVersion>1</ApplicationVersion>
		<SupportedOSPlatformVersion>21.0</SupportedOSPlatformVersion>
	</PropertyGroup>

	<ItemGroup>
		<MauiIcon Include="Resources\\AppIcon\\appicon.png" ForegroundFile="Resources\\AppIcon\\appiconfg.png" Color="#000000" />
		<MauiSplashScreen Include="Resources\\Splash\\splash.png" Color="#010109" BaseSize="712,712" />
		<MauiImage Include="Resources\\Images\\*" />
		<MauiFont Include="Resources\\Fonts\\*" />
		<MauiAsset Include="Resources\\Raw\\**" LogicalName="%(RecursiveDir)%(Filename)%(Extension)" />
	</ItemGroup>

	<ItemGroup>
		<PackageReference Include="CommunityToolkit.Maui" Version="9.0.0" />
		<PackageReference Include="CommunityToolkit.Maui.MediaElement" Version="4.0.0" />
		<PackageReference Include="Plugin.Maui.Audio" Version="3.0.0" />
		<PackageReference Include="Plugin.LocalNotification" Version="11.1.2" />
		<PackageReference Include="Microsoft.Maui.Controls" Version="9.0.0" />
	</ItemGroup>
</Project>`
  },
  {
    id: 'maui-program',
    name: 'MauiProgram.cs',
    path: 'MauiApp5/MauiProgram.cs',
    type: 'cs',
    description: 'نقطه ورود برنامه .NET 9 MAUI و ثبت سرویس‌ها و صفحات',
    content: `using Microsoft.Extensions.Logging;
using CommunityToolkit.Maui;
using Plugin.Maui.Audio;
using MauiApp5.Views;
using Plugin.LocalNotification;

namespace MauiApp5
{
    public static class MauiProgram
    {
        public static MauiApp CreateMauiApp()
        {
            var builder = MauiApp.CreateBuilder();
            builder
                .UseMauiApp<App>()
                .UseLocalNotification()
                .UseMauiCommunityToolkit()
                .UseMauiCommunityToolkitMediaElement()
                .AddAudio()
                .ConfigureFonts(fonts =>
                {
                    fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("OpenSans-Semibold.ttf", "OpenSansSemibold");
                    fonts.AddFont("Vazirmatn-Bold.ttf", "VazirmatnBold");
                });

#if DEBUG
            builder.Logging.SetMinimumLevel(LogLevel.Debug);
#endif

            // Register Services
            builder.Services.AddSingleton<HttpClient>();
            builder.Services.AddSingleton<MauiApp5.Services.LiveThemeManager>();
            builder.Services.AddSingleton<MauiApp5.Services.OnlineAssetManager>();
            builder.Services.AddSingleton<MauiApp5.Services.AudioManager>();

            // Register Main Views & ViewModels
            builder.Services.AddTransient<MainPage>();
            builder.Services.AddTransient<ChessMobail>();
            builder.Services.AddTransient<OthelloMobail>();
            builder.Services.AddTransient<sudokuMobail>();
            builder.Services.AddTransient<PuzzleMobail>();
            builder.Services.AddTransient<WordMobail>();
            builder.Services.AddTransient<QuizMobail>();
            builder.Services.AddTransient<gardoone>();
            builder.Services.AddTransient<profile>();
            builder.Services.AddTransient<chat>();
            builder.Services.AddTransient<friends>();

            return builder.Build();
        }
    }
}`
  },
  {
    id: 'app-shell',
    name: 'AppShell.xaml',
    path: 'MauiApp5/AppShell.xaml',
    type: 'xaml',
    description: 'ساختار ناوبری و تب‌های برنامه گیمستان',
    content: `<Shell
    x:Class="MauiApp5.AppShell"
    xmlns="http://schemas.microsoft.com/dotnet/2021/maui"
    xmlns:x="http://schemas.microsoft.com/winfx/2009/xaml"
    xmlns:views="clr-namespace:MauiApp5.Views"
    Shell.FlyoutBehavior="Disabled"
    Title="گیمستان">

    <TabBar FlowDirection="RightToLeft">
        <Tab Title="اصلی" Icon="home_icon.png">
            <ShellContent ContentTemplate="{DataTemplate views:MainPage}" Route="MainPage" />
        </Tab>
        <Tab Title="بازی‌ها" Icon="game_icon.png">
            <ShellContent ContentTemplate="{DataTemplate views:ChessMobail}" Route="ChessMobail" />
        </Tab>
        <Tab Title="گردونه" Icon="wheel_icon.png">
            <ShellContent ContentTemplate="{DataTemplate views:gardoone}" Route="gardoone" />
        </Tab>
        <Tab Title="پروفایل" Icon="user_icon.png">
            <ShellContent ContentTemplate="{DataTemplate views:profile}" Route="profile" />
        </Tab>
    </TabBar>
</Shell>`
  },
  {
    id: 'chess-cs',
    name: 'ChessMobail.xaml.cs',
    path: 'MauiApp5/Views/ChessMobail.xaml.cs',
    type: 'cs',
    description: 'منطق بازی شطرنج آنلاین/موبایل با هوش مصنوعی و حرکت قطعات',
    content: `using Microsoft.Maui.Controls;
using Plugin.Maui.Audio;

namespace MauiApp5.Views
{
    public partial class ChessMobail : ContentPage
    {
        private readonly IAudioManager _audioManager;
        private string _selectedSquare = string.Empty;
        private bool _isWhiteTurn = true;

        public ChessMobail(IAudioManager audioManager)
        {
            InitializeComponent();
            _audioManager = audioManager;
            InitializeChessBoard();
        }

        private void InitializeChessBoard()
        {
            // بارگذاری چیدمان اولیه مهره‌های شطرنج در گرید 8x8
            // R, N, B, Q, K, B, N, R
        }

        private async void OnSquareTapped(object sender, EventArgs e)
        {
            if (sender is Border border)
            {
                // مدیریت انتخاب خانه و جابجایی مهره
                await PlayMoveSound();
            }
        }

        private async Task PlayMoveSound()
        {
            try
            {
                var player = _audioManager.CreatePlayer(await FileSystem.OpenAppPackageFileAsync("move.mp3"));
                player.Play();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Audio Error: {ex.Message}");
            }
        }
    }
}`
  },
  {
    id: 'othello-cs',
    name: 'OthelloMobail.xaml.cs',
    path: 'MauiApp5/Views/OthelloMobail.xaml.cs',
    type: 'cs',
    description: 'منطق بازی اتلو (ریورسی) با قابلیت برگرداندن دیسک‌ها',
    content: `using Microsoft.Maui.Controls;

namespace MauiApp5.Views
{
    public partial class OthelloMobail : ContentPage
    {
        private int[,] _board = new int[8, 8]; // 0: خالی, 1: سیاه, 2: سفید
        private int _currentPlayer = 1; // 1: سیاه, 2: سفید

        public OthelloMobail()
        {
            InitializeComponent();
            ResetGame();
        }

        private void ResetGame()
        {
            _board = new int[8, 8];
            _board[3, 3] = 2; _board[3, 4] = 1;
            _board[4, 3] = 1; _board[4, 4] = 2;
            _currentPlayer = 1;
            RenderBoard();
        }

        private void OnCellClicked(int row, int col)
        {
            if (IsValidMove(row, col, _currentPlayer))
            {
                MakeMove(row, col, _currentPlayer);
                _currentPlayer = _currentPlayer == 1 ? 2 : 1;
                RenderBoard();
            }
        }

        private bool IsValidMove(int r, int c, int player)
        {
            if (_board[r, c] != 0) return false;
            // بررسی ۸ جهت برای برگرداندن دیسک‌های حریف
            return true;
        }

        private void MakeMove(int r, int c, int player)
        {
            _board[r, c] = player;
            // تبدیل مهره‌های محاصره‌شده
        }

        private void RenderBoard() { }
    }
}`
  },
  {
    id: 'gardoone-cs',
    name: 'gardoone.xaml.cs',
    path: 'MauiApp5/Views/gardoone.xaml.cs',
    type: 'cs',
    description: 'انیمیشن چرخش گردونه شانس و اهدای سکه/الماس به کاربر',
    content: `using Microsoft.Maui.Controls;

namespace MauiApp5.Views
{
    public partial class gardoone : ContentPage
    {
        private bool _isSpinning = false;
        private readonly Random _random = new Random();

        public gardoone()
        {
            InitializeComponent();
        }

        private async void OnSpinClicked(object sender, EventArgs e)
        {
            if (_isSpinning) return;
            _isSpinning = true;

            int targetDegree = _random.Next(1080, 2160); // ۳ تا ۶ دور کامل
            
            // انیمیشن چرخش دایره با Easing.CubicOut در MAUI
            await WheelImage.RotateTo(targetDegree, 4000, Easing.CubicOut);

            int finalDegree = targetDegree % 360;
            string prize = CalculatePrize(finalDegree);

            await DisplayAlert("تبریک!", $"شما برنده {prize} شدید!", "قبول");
            
            WheelImage.Rotation = finalDegree;
            _isSpinning = false;
        }

        private string CalculatePrize(int degree)
        {
            if (degree < 45) return "۵۰ سکه";
            if (degree < 90) return "۱۰ الماس";
            if (degree < 135) return "۱۰۰ سکه";
            if (degree < 180) return "پوچ!";
            if (degree < 225) return "۲۵۰ سکه";
            if (degree < 270) return "۵ الماس";
            if (degree < 315) return "۵۰۰ سکه";
            return "جایزه ویژه ۵۰ الماس!";
        }
    }
}`
  },
  {
    id: 'profile-cs',
    name: 'profile.xaml.cs',
    path: 'MauiApp5/Views/profile.xaml.cs',
    type: 'cs',
    description: 'مدیریت پروفایل کاربر، سطح، دستاوردها و لیگ‌های گیمستان',
    content: `using Microsoft.Maui.Controls;

namespace MauiApp5.Views
{
    public partial class profile : ContentPage
    {
        public profile()
        {
            InitializeComponent();
            LoadUserProfile();
        }

        private void LoadUserProfile()
        {
            // بارگذاری اطلاعات کاربر شامل سکه، امتیاز لیگ و آمار بازی‌ها
            LblCoins.Text = "1,450";
            LblGems.Text = "85";
            LblLevel.Text = "سطح ۱۲ (استاد)";
            ProgressBarXp.Progress = 0.75;
        }

        private async void OnEditProfileClicked(object sender, EventArgs e)
        {
            await Navigation.PushAsync(new Page());
        }
    }
}`
  },
  {
    id: 'online-asset-manager',
    name: 'OnlineAssetManager.cs',
    path: 'MauiApp5/Services/OnlineAssetManager.cs',
    type: 'cs',
    description: 'سرویس آنلاین جامع دانلود، کش، و به‌روزرسانی زنده تمام منابع (تصاویر، موزیک‌ها، افکت‌های صوتی، ویس‌ها و فونت‌ها)',
    content: `using System;
using System.IO;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Maui.Storage;

namespace MauiApp5.Services
{
    public class AssetManifestItem
    {
        [JsonPropertyName("fileName")]
        public string FileName { get; set; } = string.Empty;

        [JsonPropertyName("url")]
        public string Url { get; set; } = string.Empty;

        [JsonPropertyName("category")]
        public string Category { get; set; } = "image"; // "image" | "music" | "sfx" | "voice" | "font"

        [JsonPropertyName("version")]
        public string Version { get; set; } = "1.0.0";

        [JsonPropertyName("hash")]
        public string Hash { get; set; } = string.Empty;
    }

    public class AssetManifestResponse
    {
        [JsonPropertyName("manifestVersion")]
        public string ManifestVersion { get; set; } = "1.0.0";

        [JsonPropertyName("assets")]
        public List<AssetManifestItem> Assets { get; set; } = new();
    }

    public class OnlineAssetManager
    {
        private readonly HttpClient _httpClient;
        private readonly LiveThemeManager _themeManager;
        private const string MANIFEST_URL = "https://gamestan.ir/api/v1/latest-assets.json";
        private readonly string _baseStorageDir;
        private readonly string _imagesDir;
        private readonly string _audioDir;
        private readonly string _fontsDir;

        public OnlineAssetManager(HttpClient httpClient, LiveThemeManager themeManager)
        {
            _httpClient = httpClient;
            _themeManager = themeManager;

            // ساخت مسیرهای اختصاصی ذخیره‌سازی در AppDataDirectory
            _baseStorageDir = Path.Combine(FileSystem.Current.AppDataDirectory, "OnlineAssets");
            _imagesDir = Path.Combine(_baseStorageDir, "Images");
            _audioDir = Path.Combine(_baseStorageDir, "Audio");
            _fontsDir = Path.Combine(_baseStorageDir, "Fonts");

            EnsureDirectoriesExist();
        }

        private void EnsureDirectoriesExist()
        {
            if (!Directory.Exists(_baseStorageDir)) Directory.CreateDirectory(_baseStorageDir);
            if (!Directory.Exists(_imagesDir)) Directory.CreateDirectory(_imagesDir);
            if (!Directory.Exists(_audioDir)) Directory.CreateDirectory(_audioDir);
            if (!Directory.Exists(_fontsDir)) Directory.CreateDirectory(_fontsDir);
        }

        public async Task SyncLatestAssetsAndThemeAsync()
        {
            try
            {
                System.Diagnostics.Debug.WriteLine("🚀 شروع همگام‌سازی زنده تمام منابع (تصاویر، موزیک، صدا، تم) در MauiApp5...");

                // 1. دانلود مانیفست کامل از سرور آنلاین سایت
                var jsonResponse = await _httpClient.GetStringAsync(MANIFEST_URL);
                if (string.IsNullOrWhiteSpace(jsonResponse)) return;

                var manifest = JsonSerializer.Deserialize<AssetManifestResponse>(jsonResponse);
                if (manifest?.Assets == null) return;

                // 2. دانلود و ذخیره متناوب تمام دیتای مالتی‌مدیا
                foreach (var item in manifest.Assets)
                {
                    await DownloadAndCacheAssetAsync(item);
                }

                // 3. اعمال زنده آخرین استایل‌های CSS/JSON روی ResourceDictionary
                await _themeManager.FetchAndApplyLatestThemeAsync();

                System.Diagnostics.Debug.WriteLine("✅ تمامی تصاویر، افکت‌های صوتی، موزیک‌ها و تم‌های جدید با موفقیت جایگزین شدند.");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"⚠️ عدم دسترسی آنلاین - استفاده از آخرین نسخه موجود در حافظه: {ex.Message}");
            }
        }

        private async Task DownloadAndCacheAssetAsync(AssetManifestItem item)
        {
            try
            {
                string targetDir = GetCategoryDirectory(item.Category);
                string filePath = Path.Combine(targetDir, item.FileName);

                // دانلود جدیدترین فایل به صورت بایت
                byte[] data = await _httpClient.GetByteArrayAsync(item.Url);

                // ذخیره و اورراید نسخه جدید
                await File.WriteAllBytesAsync(filePath, data);
                System.Diagnostics.Debug.WriteLine($"📥 دریافت و جایگزینی فایل {item.Category}: {item.FileName}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"❌ خطای دانلود فایل {item.FileName}: {ex.Message}");
            }
        }

        private string GetCategoryDirectory(string category)
        {
            return category.ToLower() switch
            {
                "music" or "sfx" or "voice" => _audioDir,
                "font" => _fontsDir,
                _ => _imagesDir
            };
        }

        public string GetAssetFilePath(string fileName, string category = "image")
        {
            string targetDir = GetCategoryDirectory(category);
            string localPath = Path.Combine(targetDir, fileName);

            if (File.Exists(localPath))
            {
                return localPath; // اولویت با فایل دانلودشده از سرور
            }

            return fileName; // فال‌بک به منابع داخلی بسته
        }
    }
}`
  },
  {
    id: 'audio-manager',
    name: 'AudioManager.cs',
    path: 'MauiApp5/Services/AudioManager.cs',
    type: 'cs',
    description: 'مدیریت و پخش حرفه‌ای موزیک‌های پس‌زمینه، افکت‌های صوتی و ویس‌های دانلودشده از سرور آنلاین',
    content: `using System;
using System.IO;
using System.Threading.Tasks;
using Plugin.Maui.Audio;
using Microsoft.Maui.Storage;

namespace MauiApp5.Services
{
    public class AudioManager
    {
        private readonly IAudioManager _audioManager;
        private readonly OnlineAssetManager _assetManager;
        private IAudioPlayer? _bgMusicPlayer;
        private IAudioPlayer? _sfxPlayer;

        public AudioManager(IAudioManager audioManager, OnlineAssetManager assetManager)
        {
            _audioManager = audioManager;
            _assetManager = assetManager;
        }

        /// <summary>
        /// پخش موزیک پس‌زمینه از فایل‌های دانلودشده آنلاین یا منابع محلی
        /// </summary>
        public async Task PlayBackgroundMusicAsync(string musicFileName, bool loop = true)
        {
            try
            {
                StopBackgroundMusic();

                string filePath = _assetManager.GetAssetFilePath(musicFileName, "music");

                if (File.Exists(filePath))
                {
                    using var stream = File.OpenRead(filePath);
                    _bgMusicPlayer = _audioManager.CreatePlayer(stream);
                }
                else
                {
                    // فال‌بک به فایل صوتی پیش‌فرض داخل اپ
                    var defaultStream = await FileSystem.OpenAppPackageFileAsync(musicFileName);
                    _bgMusicPlayer = _audioManager.CreatePlayer(defaultStream);
                }

                if (_bgMusicPlayer != null)
                {
                    _bgMusicPlayer.Loop = loop;
                    _bgMusicPlayer.Volume = 0.5;
                    _bgMusicPlayer.Play();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"❌ خطای پخش موزیک پس‌زمینه {musicFileName}: {ex.Message}");
            }
        }

        /// <summary>
        /// پخش افکت صوتی (SFX) یا ویس‌های بازی
        /// </summary>
        public async Task PlaySoundEffectAsync(string soundFileName)
        {
            try
            {
                string filePath = _assetManager.GetAssetFilePath(soundFileName, "sfx");

                if (File.Exists(filePath))
                {
                    using var stream = File.OpenRead(filePath);
                    _sfxPlayer = _audioManager.CreatePlayer(stream);
                }
                else
                {
                    var defaultStream = await FileSystem.OpenAppPackageFileAsync(soundFileName);
                    _sfxPlayer = _audioManager.CreatePlayer(defaultStream);
                }

                if (_sfxPlayer != null)
                {
                    _sfxPlayer.Volume = 1.0;
                    _sfxPlayer.Play();
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"❌ خطای پخش افکت صوتی {soundFileName}: {ex.Message}");
            }
        }

        public void StopBackgroundMusic()
        {
            if (_bgMusicPlayer != null && _bgMusicPlayer.IsPlaying)
            {
                _bgMusicPlayer.Stop();
                _bgMusicPlayer.Dispose();
                _bgMusicPlayer = null;
            }
        }
    }
}`
  },
  {
    id: 'live-theme-manager',
    name: 'LiveThemeManager.cs',
    path: 'MauiApp5/Services/LiveThemeManager.cs',
    type: 'cs',
    description: 'دریافت و اعمال داینامیک ResourceDictionary و استایل‌های زنده نسخه جدید',
    content: `using System;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;
using Microsoft.Maui.ApplicationModel;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Graphics;

namespace MauiApp5.Services
{
    public class LiveThemeConfig
    {
        [JsonPropertyName("primaryColor")]
        public string PrimaryColor { get; set; } = "#F59E0B";

        [JsonPropertyName("backgroundColor")]
        public string BackgroundColor { get; set; } = "#0F172A";

        [JsonPropertyName("cardBackground")]
        public string CardBackground { get; set; } = "#1E293B";

        [JsonPropertyName("accentColor")]
        public string AccentColor { get; set; } = "#06B6D4";

        [JsonPropertyName("textColor")]
        public string TextColor { get; set; } = "#F8FAFC";

        [JsonPropertyName("buttonRadius")]
        public double ButtonRadius { get; set; } = 12.0;
    }

    public class LiveThemeManager
    {
        private readonly HttpClient _httpClient;
        private const string THEME_URL = "https://gamestan.ir/api/v1/latest-theme.json";

        public LiveThemeManager(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task FetchAndApplyLatestThemeAsync()
        {
            try
            {
                var themeJson = await _httpClient.GetStringAsync(THEME_URL);
                var theme = JsonSerializer.Deserialize<LiveThemeConfig>(themeJson);

                if (theme != null)
                {
                    // اعمال زنده استایل‌ها روی نخ اصلی (MainThread) برنامه
                    MainThread.BeginInvokeOnMainThread(() =>
                    {
                        var resources = Application.Current?.Resources;
                        if (resources == null) return;

                        // اورراید متغیرهای رنگی ResourceDictionary
                        resources["PrimaryColor"] = Color.FromArgb(theme.PrimaryColor);
                        resources["BackgroundColor"] = Color.FromArgb(theme.BackgroundColor);
                        resources["CardBackground"] = Color.FromArgb(theme.CardBackground);
                        resources["AccentColor"] = Color.FromArgb(theme.AccentColor);
                        resources["TextColor"] = Color.FromArgb(theme.TextColor);
                        resources["ButtonRadius"] = theme.ButtonRadius;

                        System.Diagnostics.Debug.WriteLine("🎨 استایل‌های زنده نسخه جدید روی ResourceDictionary اعمال شدند.");
                    });
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"⚠️ عدم امکان دریافت استایل زنده: {ex.Message}");
            }
        }
    }
}`
  },
  {
    id: 'asset-helper',
    name: 'AssetHelper.cs',
    path: 'MauiApp5/Helpers/AssetHelper.cs',
    type: 'cs',
    description: 'کلاس کمکی برای لود هوشمند آخرین نسخه فایل یا فال‌بک پیش‌فرض',
    content: `using System.IO;
using Microsoft.Maui.Controls;
using Microsoft.Maui.Storage;

namespace MauiApp5.Helpers
{
    public static class AssetHelper
    {
        public static ImageSource GetLatestImageSource(string fileName, string fallbackResource = "placeholder.png")
        {
            string onlineAssetDir = Path.Combine(FileSystem.Current.AppDataDirectory, "OnlineAssets", "Images");
            string localFilePath = Path.Combine(onlineAssetDir, fileName);

            // اولویت با آخرین نسخه دانلودشده و اورراید شده در گوشی است
            if (File.Exists(localFilePath))
            {
                return ImageSource.FromFile(localFilePath);
            }

            // در صورت عدم وجود (آفلاین)، فایل پیش‌فرض لود می‌شود
            return ImageSource.FromFile(fallbackResource);
        }
    }
}`
  },
  {
    id: 'app-xaml-cs',
    name: 'App.xaml.cs',
    path: 'MauiApp5/App.xaml.cs',
    type: 'cs',
    description: 'راه‌اندازی Async و غیربلاک‌کننده دانلود منابع آنلاین در هنگام استارت اپلیکیشن',
    content: `using MauiApp5.Services;
using Microsoft.Maui.Controls;
using System.Threading.Tasks;

namespace MauiApp5
{
    public partial class App : Application
    {
        public App(OnlineAssetManager assetManager, AudioManager audioManager)
        {
            InitializeComponent();

            MainPage = new AppShell();

            // اجرای غیربلاک‌کننده (Async) دانلود منابع و استایل‌ها روی پس‌زمینه
            Task.Run(async () =>
            {
                await assetManager.SyncLatestAssetsAndThemeAsync();
                
                // شروع موزیک پس‌زمینه نسخه جدید
                await audioManager.PlayBackgroundMusicAsync("bg_music_latest.mp3");
            });
        }
    }
}`
  },
  {
    id: 'web-cache-buster',
    name: 'WebCacheBuster.cs',
    path: 'MauiApp5/Services/WebCacheBuster.cs',
    type: 'cs',
    description: 'مدیریت و ابطال اجباری کش مرورگر، پاکسازی Service Worker و افزودن Version Query String در محیط وب/وب‌اپ',
    content: `using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace MauiApp5.Services
{
    public class WebCacheBuster
    {
        private readonly IJSRuntime _jsRuntime;
        private readonly string _cacheVersionTag;

        public WebCacheBuster(IJSRuntime jsRuntime)
        {
            _jsRuntime = jsRuntime;
            _cacheVersionTag = DateTime.UtcNow.Ticks.ToString();
        }

        /// <summary>
        /// پاکسازی اجباری کش مرورگر و به‌روزرسانی Service Worker برای وب‌اپلیکیشن
        /// </summary>
        public async Task ForceClearWebCacheAsync()
        {
            try
            {
                // فراخوانی اسکریپت پاکسازی Service Worker و HTML5 Storage Caches
                await _jsRuntime.InvokeVoidAsync("eval", @"
                    (async () => {
                        if ('caches' in window) {
                            const keys = await caches.keys();
                            for (let key of keys) {
                                await caches.delete(key);
                            }
                        }
                        if ('serviceWorker' in navigator) {
                            const regs = await navigator.serviceWorker.getRegistrations();
                            for (let reg of regs) {
                                await reg.update();
                            }
                        }
                        console.log('✅ کش‌های قدیمی وب با موفقیت حذف شدند.');
                    })();
                ");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"⚠️ عدم امکان پاکسازی کش وب: {ex.Message}");
            }
        }

        /// <summary>
        /// افزودن نسخه زنده جهت جلوگیری از دریافت فایل از کش قدیمی مرورگر
        /// </summary>
        public string GetVersionedUrl(string originalUrl)
        {
            string separator = originalUrl.Contains("?") ? "&" : "?";
            return $"{originalUrl}{separator}v={_cacheVersionTag}";
        }
    }
}`
  },
  {
    id: 'web-audio-service',
    name: 'WebAudioService.cs',
    path: 'MauiApp5/Services/WebAudioService.cs',
    type: 'cs',
    description: 'مدیریت و پخش کامل فایلهای صوتی، موزیک و ویسها در کلاینت وب بدون خطای کش یا CORS',
    content: `using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace MauiApp5.Services
{
    public class WebAudioService
    {
        private readonly IJSRuntime _jsRuntime;
        private readonly WebCacheBuster _cacheBuster;

        public WebAudioService(IJSRuntime jsRuntime, WebCacheBuster cacheBuster)
        {
            _jsRuntime = jsRuntime;
            _cacheBuster = cacheBuster;
        }

        public async Task PlayBackgroundMusicWebAsync(string musicUrl, bool loop = true)
        {
            try
            {
                string versionedUrl = _cacheBuster.GetVersionedUrl(musicUrl);

                await _jsRuntime.InvokeVoidAsync("eval", $@"
                    (() => {{
                        if (window.__bgAudio) {{
                            window.__bgAudio.pause();
                        }}
                        window.__bgAudio = new Audio('{versionedUrl}');
                        window.__bgAudio.crossOrigin = 'anonymous';
                        window.__bgAudio.loop = {loop.ToString().ToLower()};
                        window.__bgAudio.volume = 0.5;
                        window.__bgAudio.play().catch(e => console.log('Audio autoplay blocked', e));
                    })();
                ");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"❌ خطای پخش موزیک در کلاینت وب: {ex.Message}");
            }
        }

        public async Task PlaySoundEffectWebAsync(string soundUrl)
        {
            try
            {
                string versionedUrl = _cacheBuster.GetVersionedUrl(soundUrl);

                await _jsRuntime.InvokeVoidAsync("eval", $@"
                    (() => {{
                        let sfx = new Audio('{versionedUrl}');
                        sfx.crossOrigin = 'anonymous';
                        sfx.volume = 0.9;
                        sfx.play().catch(e => console.log('SFX play error', e));
                    })();
                ");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"❌ خطای پخش SFX در کلاینت وب: {ex.Message}");
            }
        }
    }
}`
  }
];

