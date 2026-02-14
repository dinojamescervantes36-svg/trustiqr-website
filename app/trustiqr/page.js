'use client'

import { useAuth } from "@/context/AuthContext"

export default function Home() {
  const { currentUser, isLoadingUser } = useAuth()

  if (isLoadingUser) {
    return <h6 className="text-generated">Loading...</h6>
  }

  return (
    <div>Welcome to TrustiQR</div>
  )
}
