// c:\Users\Luis\Desktop\design engineering\citaapp\frontend\admin\src\components\AppointmentStatsChart.tsx
import React, { useEffect, useState } from "react"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts"
import { AuthService } from "@shared/services/AuthService"
import { apiClient } from "@shared/api/client"

const COLORS = ["#4F46E5", "#06B6D4", "#8B5CF6", "#EC4899", "#10B981"]

export const AppointmentStatsChart: React.FC = () => {
  const [data, setData] = useState<{ name: string; value: number }[]>([])
  const [loading, setLoading] = useState(true)
  const authService = new AuthService(apiClient)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await authService.getDashboardStats()
        // Transformamos: { type: "Odontología", count: "5" } -> { name: "Odontología", value: 5 }
        const formattedData = response.stats.map((item: any) => ({
          name: item.type,
          value: parseInt(item.count, 10),
        }))
        setData(formattedData)
      } catch (error) {
        console.error("Error cargando gráfica:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading)
    return (
      <div className="h-64 flex items-center justify-center text-slate-400 font-bold">
        Analizando especialidades...
      </div>
    )

  return (
    <div className="h-80 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#1e293b",
              border: "none",
              borderRadius: "12px",
              color: "#fff",
            }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
