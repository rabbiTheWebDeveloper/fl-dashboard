import ComingSoonCard from "@/app/(dashboard)/_component/ComingSoonCard";

export default function ThemeGalleryPage() {
  return (
    <ComingSoonCard
      title="Theme Marketplace Coming Soon"
      subtitle="Browse and install high-converting storefront themes with one click. Meanwhile, customize your active colors in My Shop → Customize Theme."
      badge="Storefront Themes"
      progress={85}
      backHref="/dashboard/myshop/theme"
      backLabel="Customize Current Theme"
    />
  );
}
