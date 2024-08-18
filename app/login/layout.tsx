import "../globals.css";

export const metadata = {
  title: "JM-Pharma.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <main className="">{children}</main>
      </body>
    </html>
  );
}
