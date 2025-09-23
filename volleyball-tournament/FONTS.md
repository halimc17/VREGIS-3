# Font System - Geist Font Implementation

## 📝 Font yang Digunakan oleh shadcn/ui

Berdasarkan penelitian terbaru, aplikasi ini menggunakan **Geist Font** dari Vercel, yang merupakan pilihan font terdepan untuk aplikasi shadcn/ui modern.

## 🎨 **Geist Font - Font Resmi shadcn/ui**

### **Mengapa Geist?**
- ✅ Font resmi yang digunakan dalam contoh-contoh shadcn/ui
- ✅ Dikembangkan oleh Vercel (pembuat Next.js)
- ✅ Dioptimalkan untuk UI/UX modern
- ✅ Mendukung semua karakter Latin dan simbol
- ✅ Konsisten dengan ecosystem Next.js + shadcn/ui

### **Font Families yang Digunakan:**

#### 1. **Geist Sans** - Font Utama
```typescript
import { Geist } from "next/font/google";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
```

**Penggunaan:**
- Semua teks UI (headings, paragraphs, buttons)
- Typography components
- Form elements
- Navigation

#### 2. **Geist Mono** - Font Monospace
```typescript
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
```

**Penggunaan:**
- Code snippets
- Technical text
- API responses
- Configuration values

## 🔧 **Implementasi di Aplikasi**

### **1. Layout Configuration**
```typescript
// src/app/layout.tsx
<body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
```

### **2. Tailwind CSS Configuration**
```css
/* globals.css */
@theme inline {
  --font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, SFMono-Regular, "SF Mono";
}
```

### **3. Font Fallbacks**
Sistem fallback font yang komprehensif:

**Sans-serif fallbacks:**
- `ui-sans-serif`
- `system-ui`
- `sans-serif`
- `"Apple Color Emoji"`
- `"Segoe UI Emoji"`

**Monospace fallbacks:**
- `ui-monospace`
- `SFMono-Regular`
- `"SF Mono"`
- `Menlo`
- `Monaco`
- `Consolas`

## 📱 **Font dalam Typography Components**

### **Automatic Font Application**
Semua typography components otomatis menggunakan Geist:

```tsx
// Menggunakan Geist Sans
<TypographyH1>Volleyball Tournament</TypographyH1>
<TypographyP>Team registration information</TypographyP>

// Menggunakan Geist Mono
<TypographyInlineCode>npm run dev</TypographyInlineCode>
```

### **Manual Font Classes**
```tsx
// Font Sans (default)
<div className="font-sans">Regular text</div>

// Font Mono untuk kode
<div className="font-mono">Technical content</div>
```

## 🌟 **Keunggulan Geist vs Alternatif Lain**

### **Geist vs Inter**

| Aspek | Geist | Inter |
|-------|-------|-------|
| **Asal** | Vercel (Next.js) | Independent |
| **shadcn/ui** | ✅ Resmi digunakan | ⚠️ Alternatif |
| **Ecosystem** | ✅ Next.js native | ⚠️ Third-party |
| **Updates** | ✅ Active development | ✅ Stable |
| **Modern UI** | ✅ Optimized | ✅ Good |

### **Geist vs System Fonts**

| Aspek | Geist | System Fonts |
|-------|-------|---------------|
| **Konsistensi** | ✅ Cross-platform | ❌ Varies |
| **Design** | ✅ Modern, clean | ⚠️ Inconsistent |
| **Performance** | ✅ Optimized | ✅ Fast loading |
| **Branding** | ✅ Professional | ❌ Generic |

## 🚀 **Performance & Loading**

### **Font Loading Strategy**
```typescript
// Optimized loading dengan next/font
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],       // Only load Latin characters
  display: "swap",          // Automatic fallback display
});
```

### **Benefits:**
- ⚡ **Fast Loading**: Optimized dengan Next.js font system
- 🎯 **Subset Loading**: Hanya load karakter yang diperlukan
- 🔄 **Font Swapping**: Fallback fonts saat loading
- 📱 **Responsive**: Automatic scaling di semua device

## 🔄 **Migration dari Font Lain**

### **Dari Inter ke Geist:**
```typescript
// Sebelum (Inter)
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

// Sesudah (Geist) - Current Implementation
import { Geist } from "next/font/google";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});
```

### **Update CSS Variables:**
```css
/* Update theme variables */
@theme inline {
  --font-sans: var(--font-geist-sans);
}
```

## 📋 **Checklist Font Implementation**

- ✅ Geist Sans imported dan configured
- ✅ Geist Mono imported untuk code
- ✅ CSS variables properly set
- ✅ Fallback fonts configured
- ✅ Typography components menggunakan font-sans
- ✅ Body element menggunakan font-sans
- ✅ Antialiasing enabled
- ✅ Responsive font scaling
- ✅ Performance optimized

## 🎯 **Best Practices**

1. **Gunakan typography components** instead of raw CSS classes
2. **Maintain font hierarchy** dengan heading levels yang benar
3. **Use Geist Mono** untuk semua technical content
4. **Test cross-platform** untuk memastikan fallbacks bekerja
5. **Monitor performance** dengan font loading metrics

## 📖 **Referensi**

- [Geist Font - Vercel](https://vercel.com/font)
- [Next.js Font Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/fonts)
- [shadcn/ui Typography](https://ui.shadcn.com/docs/components/typography)
- [Tailwind CSS Typography](https://tailwindcss.com/docs/font-family)

Implementasi font Geist di aplikasi volleyball tournament ini mengikuti best practices terbaru dari ecosystem shadcn/ui dan Next.js! 🏐