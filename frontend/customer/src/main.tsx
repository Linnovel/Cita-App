import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import { AppRouter } from "./CustomerRouter"

// Renderizado principal de la aplicación Customer
const rootElement = document.getElementById("root")
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>,
  )
}
