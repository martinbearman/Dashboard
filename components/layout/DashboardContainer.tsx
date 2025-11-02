"use client";

// TODO: Implement grid container with react-grid-layout
export default function DashboardContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full h-full p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Grid items will be rendered here */}
        {children}
      </div>
    </div>
  );
}

