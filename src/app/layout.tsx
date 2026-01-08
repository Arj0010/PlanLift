export const metadata = { title: "PlanLift MVP", description: "Blueprint → 3D render" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-neutral-200">
        {children}
      </body>
    </html>
  );
}
