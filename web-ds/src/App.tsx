import { AuthProvider } from "./contexts/AuthContext"
import { AppRouter } from "./routes"

export function App(){
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
)
}