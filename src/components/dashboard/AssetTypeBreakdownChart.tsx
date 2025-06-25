
import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type TypeBreakdown = {
  type: string;
  count: number;
};

const COLORS = ['#2563EB', '#06A452', '#EE3160', '#E1BB20', '#2674EF', '#64748b', '#d946ef'];

interface AssetTypeBreakdownChartProps {
  data: TypeBreakdown[];
}

const typeLabelPretty = (type: string) => {
  switch (type) {
    case "image": return "Images";
    case "video": return "Videos";
    case "pdf": return "PDFs";
    case "document": return "Documents";
    case "archive": return "Archives";
    case "text": return "Text";
    default: return type?.charAt(0).toUpperCase() + type.slice(1);
  }
};

const AssetTypeBreakdownChart: React.FC<AssetTypeBreakdownChartProps> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card className="mb-7 p-0 overflow-visible bg-gradient-to-r from-green-100 to-blue-50 border-0 shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold text-blue-900 tracking-tight flex items-center">
          <span className="mr-3">Asset Type Breakdown</span>
          <span className="text-xs text-blue-400 font-normal">{total} total assets</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 pb-4 flex flex-col md:flex-row items-center justify-between">
        <div className="w-full md:w-72 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={70}
                innerRadius={40}
                label={({ name, percent }) => `${typeLabelPretty(name)} (${(percent * 100).toFixed(0)}%)`}
                isAnimationActive
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${entry.type}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value}`, typeLabelPretty(name)]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="mt-5 md:mt-0 md:ml-5 space-y-1 text-sm">
          {data.map((d, i) => (
            <li key={d.type} className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              ></span>
              <span className="font-medium">{typeLabelPretty(d.type)}:</span>
              <span>{d.count}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default AssetTypeBreakdownChart;

