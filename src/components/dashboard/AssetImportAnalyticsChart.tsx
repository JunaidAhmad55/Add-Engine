
import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Upload, Globe, Film, Layers, Facebook } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getAssetImportAnalytics, resetAssetImportAnalytics, AssetImportSource } from "@/lib/asset-import-analytics";
import { Button } from "../ui/button";

// LegendColorBadge for improved hover/visuals and count animation
const LegendColorBadge: React.FC<{ icon: React.ReactNode; label: string; color: string; value: number }> = ({
  icon,
  label,
  color,
  value,
}) => {
  // Animate number up when value changes
  const [displayValue, setDisplayValue] = React.useState(value);

  React.useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    let raf: number;
    let startTime: number;
    function animate(ts: number) {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 500, 1);
      const current = Math.round(start + (end - start) * progress);
      setDisplayValue(current);
      if (progress < 1) {
        raf = requestAnimationFrame(animate);
      }
    }
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
    // Only animate on value change
    // eslint-disable-next-line
  }, [value]);

  return (
    <div
      className="flex items-center text-sm bg-white/60 border rounded px-2 py-1 shadow-sm transition-shadow hover:shadow-lg"
      style={{ borderColor: color }}
    >
      <span className="mr-1">{icon}</span>
      <span className="ml-1 text-gray-800 font-medium">{label}</span>
      <span className="ml-2 font-bold" style={{ color }}>
        {displayValue}
      </span>
    </div>
  );
};

const sourceMeta: Record<AssetImportSource, { icon: React.ReactNode; color: string; display: string }> = {
  Upload:     { icon: <Upload className="mr-1 h-5 w-5" />, color: "#2563EB", display: "Upload" },   // blue-600
  "Google Drive": { icon: <Globe className="mr-1 h-5 w-5" />, color: "#06A452", display: "Google Drive" },  // green-700
  TikTok:     { icon: <Film className="mr-1 h-5 w-5" />, color: "#EE3160", display: "TikTok" },   // pink
  AIR:        { icon: <Layers className="mr-1 h-5 w-5" />, color: "#E1BB20", display: "AIR" }, // gold-amber
  Meta:       { icon: <Facebook className="mr-1 h-5 w-5" />, color: "#2674EF", display: "Meta" },   // blue
};

const chartOrder: AssetImportSource[] = ["Upload", "Google Drive", "TikTok", "AIR", "Meta"];

const AssetImportAnalyticsChart: React.FC = () => {
  const [data, setData] = React.useState(() => {
    const analytics = getAssetImportAnalytics();
    return chartOrder.map(source => ({
      source,
      count: analytics[source],
    }));
  });

  // For animated bar hover state
  const [activeBar, setActiveBar] = React.useState<number | null>(null);

  // re-read if storage ever updates
  React.useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "asset_import_analytics") {
        const analytics = getAssetImportAnalytics();
        setData(chartOrder.map(source => ({
          source,
          count: analytics[source],
        })));
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  // Local reset handler
  const handleReset = () => {
    resetAssetImportAnalytics();
    setData(chartOrder.map(source => ({
      source,
      count: 0,
    })));
  };

  return (
    <Card className="mb-7 p-0 overflow-visible bg-gradient-to-r from-indigo-100 to-blue-50 border-0 shadow-lg">
      <CardHeader className="pb-2 flex-row items-center justify-between gap-4">
        <CardTitle className="text-lg font-bold text-blue-900 tracking-tight flex items-center">
          <span className="mr-3">Asset Imports (All Sources)</span>
          <span className="text-xs text-blue-400 font-normal">(all time, device-specific)</span>
        </CardTitle>
        <Button size="sm" variant="outline" className="hover:bg-gray-200" onClick={handleReset}>Reset</Button>
      </CardHeader>
      <CardContent className="pt-0 pb-4">
        <div className="w-full h-56 md:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              onMouseLeave={() => setActiveBar(null)}
            >
              <XAxis
                dataKey="source"
                tickFormatter={(source) => sourceMeta[source as AssetImportSource].display}
              />
              <YAxis allowDecimals={false} />
              <Tooltip
                cursor={{ fill: "rgba(37 99 235 / 0.11)" }}
                contentStyle={{ borderRadius: 10, fontSize: 14 }}
                formatter={(value, name, props) => [
                  value, 
                  sourceMeta[props.payload.source as AssetImportSource].display
                ]}
              />
              <Bar
                dataKey="count"
                radius={[10, 10, 0, 0]}
                animationDuration={850}
                animationEasing="ease-in"
                onMouseOver={(_, idx) => setActiveBar(idx)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.source}
                    fill={sourceMeta[entry.source as AssetImportSource].color}
                    // Highlight active bar with a subtle glow
                    style={activeBar === i ? {
                      filter: `drop-shadow(0px 0px 8px ${sourceMeta[entry.source as AssetImportSource].color}77)`
                    } : undefined}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-around mt-2 gap-2">
            {chartOrder.map(source => (
              <LegendColorBadge
                key={source}
                icon={sourceMeta[source].icon}
                label={sourceMeta[source].display}
                color={sourceMeta[source].color}
                value={data.find(d=>d.source===source)?.count ?? 0}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssetImportAnalyticsChart;
