import Link from "next/link";

export default function AuthLayout({ children }: {
  children: React.ReactNode
}) {
  return (
    <div>
      <Link href='/' className="absolute top-2 left-2 opacity-50 hover:opacity-90">Back to map</Link>
      {children}
    </div>
  )
}