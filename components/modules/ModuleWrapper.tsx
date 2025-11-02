"use client";

// TODO: Implement module wrapper with drag-and-drop support
export default function ModuleWrapper({
  children,
  moduleId,
}: {
  children: React.ReactNode;
  moduleId: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {children}
    </div>
  );
}

