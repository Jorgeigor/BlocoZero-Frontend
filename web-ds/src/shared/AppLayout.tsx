import { Outlet } from "react-router"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function AppLayout() {
  return (
    <div className="flex w-screen h-screen bg-white-100 text-gray-100">
        <main className="flex w-full h-full">
            <Sidebar />
            <div className="h-full w-full flex flex-col flex-1">
                <Header />
                <Outlet />
            </div>
        </main>
    </div>
  )
}