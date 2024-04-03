import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import colors from 'tailwindcss/colors'

import { ResponsiveContainer, LineChart, XAxis, YAxis, CartesianGrid, Line } from 'recharts';
import { useQuery } from "@tanstack/react-query";
import { getDailyRevenueInPeriod } from "@/api/get-daily-revenue-in-period";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "@/components/ui/date-picker";
import { useMemo, useState } from "react";
import { DateRange } from "react-day-picker";
import { subDays} from 'date-fns'

export function RevenueChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const {data: dailyRevenueInPeriod} = useQuery({
    queryKey: ['metrics', 'daily-revenue-in-period', dateRange],
    queryFn: () => getDailyRevenueInPeriod({
      from: dateRange?.from,
      to: dateRange?.to,
    }),
  })

  const chartData = useMemo(() => {
    return dailyRevenueInPeriod?.map(chartItem => {
      return {
        date: chartItem.date,
        receipt: chartItem.receipt / 100,
      }
    })
  }, [dailyRevenueInPeriod])

  return (
    <Card className="col-span-6">
      <CardHeader className="flex-row items-center justify-between pb-8">
        <div className="space-y-1 ">
          <CardTitle className="text-base font-medium"
          >Receita no período</CardTitle>
          <CardDescription>Receita diária no período</CardDescription>
        </div>

        <div className="flex items-center gap-3">
          <Label>Período</Label>
          <DatePickerWithRange date={dateRange} onDateChange={setDateRange} />
        </div>
      </CardHeader>
      <CardContent>
        {chartData && (
          <ResponsiveContainer width="100%" height={240}>
          <LineChart data={dailyRevenueInPeriod} style={{ fontSize: 12 }}>
            <XAxis dataKey="date" 
            tickLine={false} axisLine={false} dy={16} />
            <YAxis stroke="#888" 
            axisLine={false} 
            tickLine={false}
            width={80} 
            tickFormatter={(value: number) =>
            value.toLocaleString('pt-BR', { 
            style: 'currency',
            'currency': 'BRL', })} />
            <CartesianGrid vertical={false} className="stroke-muted"/>
            <Line type="linear" strokeWidth={2} dataKey="receipt" stroke={colors['violet']['500']} /></LineChart>
        </ResponsiveContainer>   
        )}
      </CardContent>
    </Card>
  )
}