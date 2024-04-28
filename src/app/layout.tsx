import 'bootstrap/dist/css/bootstrap.min.css';

export const metadata = {
  title: 'Book Shopping',
  description: 'Migrate by Aye Myint Htet',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
