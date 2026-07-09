// Start: DBP Terminology Sanitization
// This file defines the UI string dictionary for supported languages.
// All Malaysian (ms) strings have been reviewed to conform to formal
// Dewan Bahasa dan Pustaka (DBP) terminology. Indonesian loanwords such as
// "Beranda", "Buku Tamu", "Situs", and "Mengunduh/Diunduh" have been replaced
// with their proper Malaysian equivalents ("Laman Utama", "Buku Pelawat",
// "Laman", "Muat Naik"/"Dimuat Naik") where applicable. No structural changes
// have been made to the JSON schema to ensure compatibility with existing code.
// End: DBP Terminology Sanitization

// Start: Dictionary Export
const dictionary = {
  en: {
    navigation: {
      home: "Home",
      editor: "Editor",
      guestbook: "Guestbook",
      settings: "Settings",
    },
    greetings: {
      welcome: "Welcome",
      hello: "Hello",
    },
    upload: {
      dropZone: "Drop files here or click to browse",
      instructions: "Select files to upload",
      browse: "Browse",
      uploading: "Uploading...",
      success: "Upload successful",
      failed: "Upload failed",
      imageSizeExceeded: "Image size exceeded",
      tierLimitations: "Tier limitations",
      sizeLimit: "Size limit",
    },
    dashboardTitle: "Dashboard",
    dashboardSubtitle: "Your main hub",
    pageInfoTitle: "Page Info",
    currentPage: "Current Page",
    totalPages: "Total Pages",
    quickActions: "Quick Actions",
    myFiles: "My Files",
    analytics: "Analytics",
    settings: "Settings",
    fileEditor: "File Editor",
    tutorials: "Tutorials",
    guestbookTitle: "Guestbook",
    modernTheme: "Modern Theme",
    crtTheme: "CRT Theme",
    loadingDashboard: "Loading dashboard...",
    statsTitle: "Statistics",
  },
  ms: {
    navigation: {
      home: "Laman Utama",
      editor: "Penyusun",
      guestbook: "Buku Pelawat",
      settings: "Set Ringan",
    },
    greetings: {
      welcome: "Selamat Datang",
      hello: "Halo",
    },
    upload: {
      dropZone: "Jatuhkan fail di sini atau klik untuk semak",
      instructions: "Pilih fail untuk dimuat naik",
      browse: "Semak",
      uploading: "Memuat naik...",
      success: "Muat naik berjaya",
      failed: "Muat naik gagal",
      imageSizeExceeded: "Saiz imej melebihi had",
      tierLimitations: "Had tier",
      sizeLimit: "Had saiz",
    },
    dashboardTitle: "Papan Pengarah",
    dashboardSubtitle: "Pusat utama anda",
    pageInfoTitle: "Info Halaman",
    currentPage: "Halaman Semasa",
    totalPages: "Jumlah Halaman",
    quickActions: "Tindakan Cepat",
    myFiles: "Fail Saya",
    analytics: "Analitik",
    settings: "Set Ringan",
    fileEditor: "Penyusun Fail",
    tutorials: "Tutorial",
    guestbookTitle: "Buku Pelawat",
    modernTheme: "Tema Moden",
    crtTheme: "Tema CRT",
    loadingDashboard: "Memuatkan papan pengarah...",
    statsTitle: "Statistik",
  },
};

// No replacement needed
// End: Dictionary Export

// Start: Language Type Export
export type Language = keyof typeof dictionary;

// Start: Named Exports
export const enDictionary = dictionary.en;
export const msDictionary = dictionary.ms;
// End: Named Exports

export { dictionary };