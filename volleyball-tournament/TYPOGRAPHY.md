# Typography System - shadcn/ui Implementation

This application now uses a complete typography system based on shadcn/ui documentation guidelines, powered by **Geist Font** from Vercel.

## 🎨 **Font System: Geist Font**

**Geist Font** adalah font resmi yang digunakan oleh shadcn/ui dan merupakan pilihan terbaik untuk aplikasi modern:

- ✅ **Font Resmi shadcn/ui**: Digunakan dalam semua contoh resmi
- ✅ **Dikembangkan Vercel**: Terintegrasi sempurna dengan Next.js
- ✅ **Modern & Clean**: Dioptimalkan untuk UI/UX contemporary
- ✅ **Performance**: Loading cepat dengan next/font optimization

### **Font Families:**
- **Geist Sans**: Font utama untuk semua UI elements
- **Geist Mono**: Font monospace untuk code dan technical content

## 🎨 Typography Components

The following typography components are available and have been implemented throughout the application:

### Headings

```tsx
import { TypographyH1, TypographyH2, TypographyH3, TypographyH4 } from "@/components/ui/typography"

<TypographyH1>Main Page Title</TypographyH1>
<TypographyH2>Section Heading</TypographyH2>
<TypographyH3>Subsection Heading</TypographyH3>
<TypographyH4>Minor Heading</TypographyH4>
```

### Text Elements

```tsx
import {
  TypographyP,
  TypographyLead,
  TypographyLarge,
  TypographyMuted,
  TypographySmall
} from "@/components/ui/typography"

<TypographyP>Regular paragraph text</TypographyP>
<TypographyLead>Lead paragraph for introductions</TypographyLead>
<TypographyLarge>Large text for emphasis</TypographyLarge>
<TypographyMuted>Muted text for secondary information</TypographyMuted>
<TypographySmall>Small text for captions</TypographySmall>
```

### Special Elements

```tsx
import {
  TypographyBlockquote,
  TypographyList,
  TypographyInlineCode
} from "@/components/ui/typography"

<TypographyBlockquote>
  Important quoted text
</TypographyBlockquote>

<TypographyList>
  <li>List item one</li>
  <li>List item two</li>
</TypographyList>

<TypographyInlineCode>code snippet</TypographyInlineCode>
```

## 📝 CSS Classes Applied

### Global Typography Styles

All HTML elements now automatically apply shadcn/ui typography classes:

- **H1**: `scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl`
- **H2**: `scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0`
- **H3**: `scroll-m-20 text-2xl font-semibold tracking-tight`
- **H4**: `scroll-m-20 text-xl font-semibold tracking-tight`
- **P**: `leading-7 [&:not(:first-child)]:mt-6`
- **Blockquote**: `mt-6 border-l-2 pl-6 italic`
- **Lists**: `my-6 ml-6 list-disc [&>li]:mt-2` (scoped to content areas only)
- **Code**: `relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold`

**Important Note**: List styles are carefully scoped to `.prose`, `article`, and `.content` classes to prevent conflicts with UI components like navigation menus.

## 🏐 Implementation in Volleyball App

### Updated Pages

All pages have been updated to use proper typography:

1. **Home Page** (`/`)
   - `TypographyH1` for main title
   - `TypographyLead` for subtitle
   - `TypographyH2` for section headings
   - `TypographyMuted` for descriptions

2. **Admin Dashboard** (`/admin`)
   - `TypographyH1` for page titles
   - `TypographyMuted` for page descriptions

3. **Tournament Management** (`/admin/tournaments`)
   - Consistent heading hierarchy
   - Proper text sizing and spacing

4. **Teams Page** (`/admin/teams`)
   - Table typography follows shadcn/ui guidelines
   - Consistent text treatment

5. **Registrations Page** (`/admin/registrations`)
   - Status badges with proper typography
   - Consistent spacing and hierarchy

6. **Public Registration** (`/register`)
   - Clear heading hierarchy
   - Proper form typography

7. **Login Form** (`/login`)
   - Error messages use `TypographyMuted`
   - Consistent form element spacing

## 🎯 Key Typography Features

### Responsive Design
- Headings automatically scale with screen size
- Proper line heights for readability
- Consistent spacing across devices

### Accessibility
- Proper heading hierarchy (H1 → H2 → H3 → H4)
- Sufficient color contrast
- Readable font sizes and line spacing

### Visual Hierarchy
- Clear distinction between heading levels
- Proper spacing between elements
- Consistent text treatment throughout

### shadcn/ui Compliance
- Uses exact classes from shadcn/ui documentation
- Follows their design system principles
- Maintains consistency with shadcn/ui components

## 🔧 Customization

### Adding Custom Typography

To extend the typography system:

```tsx
// In typography.tsx
export function TypographyCustom({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <div
      className={cn(
        "your-custom-classes-here",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
```

### Override Default Styles

Global typography can be customized in `globals.css`:

```css
@layer base {
  h1 {
    @apply your-custom-h1-classes;
  }
}
```

## 📊 Benefits

1. **Consistency**: All text elements follow the same design system
2. **Maintainability**: Centralized typography management
3. **Accessibility**: Proper semantic HTML with consistent styling
4. **Developer Experience**: Easy to use components with TypeScript support
5. **Design System Compliance**: Follows shadcn/ui guidelines exactly

## 🚀 Usage Guidelines

1. **Always use typography components** instead of raw HTML elements for styled text
2. **Maintain heading hierarchy** (don't skip from H1 to H3)
3. **Use TypographyMuted** for secondary information
4. **Use TypographyLead** for introduction paragraphs
5. **Leverage className prop** to override styles when needed

The typography system is now fully integrated and provides a solid foundation for consistent, accessible, and beautiful text throughout the volleyball tournament application!