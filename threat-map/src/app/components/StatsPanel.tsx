"use client";

import React, { useMemo, useCallback } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { PieLabelRenderProps } from "recharts";

type GeoData = {
  city: string | null;
  country_iso: string | null;
  country_name: string | null;
  latitude: number | null;
  longitude: number | null;
  postal_code: string | null;
  region_iso: string | null;
  region_name: string | null;
};

type Host = {
  remote_host: string;
  count: string; 
  last_seen: string;
  geo?: GeoData | null;
};

const COLORS = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#8A2BE2",
  "#00C49F",
  "#FF7F50",
  "#A9A9A9",
];

function fmtNum(n: number) {
  return n.toLocaleString();
}

export default function StatsPanel({ hosts }: { hosts: Host[] }) {
  const {
    totalEvents,
    uniqueHosts,
    uniqueCountries,
    pieData,
    barData,
  } = useMemo(() => {
    let totalEvents = 0;
    const hostsSet = new Set<string>();
    const countryMap = new Map<string, number>();
    const ipMap = new Map<string, number>();

    hosts.forEach((h) => {
      const cnt = Number(h.count ?? 1) || 1;
      totalEvents += cnt;
      hostsSet.add(h.remote_host);

      const country = h.geo?.country_name ?? "Unknown";
      countryMap.set(country, (countryMap.get(country) ?? 0) + cnt);

      ipMap.set(h.remote_host, (ipMap.get(h.remote_host) ?? 0) + cnt);
    });

    const countriesArr = Array.from(countryMap.entries()).map(
      ([country, value]) => ({ country, value })
    );
    countriesArr.sort((a, b) => b.value - a.value);

    const top = countriesArr.slice(0, 6);
    const otherSum = countriesArr.slice(6).reduce((s, x) => s + x.value, 0);
    const pieData =
      top.map((c) => ({ name: c.country, value: c.value })) //
        .concat(otherSum > 0 ? [{ name: "Other", value: otherSum }] : []);

    const ipsArr = Array.from(ipMap.entries())
      .map(([ip, value]) => ({ ip, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
    const barData = ipsArr.map((x) => ({ name: x.ip, value: x.value }));

    return {
      totalEvents,
      uniqueHosts: hostsSet.size,
      uniqueCountries: countryMap.size,
      pieData,
      barData,
    };
  }, [hosts]);

  const renderPieLabel = useCallback(
    (entry: PieLabelRenderProps) => {
    
      const value = (entry as PieLabelRenderProps & { value?: number }).value ?? 0;
      const name = (entry as PieLabelRenderProps & { name?: string }).name ?? "";
      const percent = totalEvents > 0 ? Math.round((value / totalEvents) * 100) : 0;
      return `${name}: ${percent}%`;
    },
    [totalEvents]
  );

  return (
    <div className="w-full mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
 
      <div className="col-span-1 lg:col-span-1 flex flex-col gap-4">
        <div className="p-4 bg-white/5 rounded-lg shadow-sm">
          <div className="text-sm text-gray-300">Total events</div>
          <div className="text-2xl font-semibold">{fmtNum(totalEvents)}</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg shadow-sm">
          <div className="text-sm text-gray-300">Hosts uniques</div>
          <div className="text-2xl font-semibold">{fmtNum(uniqueHosts)}</div>
        </div>
        <div className="p-4 bg-white/5 rounded-lg shadow-sm">
          <div className="text-sm text-gray-300">Pays uniques</div>
          <div className="text-2xl font-semibold">{fmtNum(uniqueCountries)}</div>
        </div>
      </div>

  
      <div className="col-span-1 lg:col-span-1 p-4 bg-white/5 rounded-lg shadow-sm">
        <h3 className="mb-2 font-medium">Répartition par pays</h3>
        <div style={{ width: "100%", height: 270 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={80}
                innerRadius={36}
                paddingAngle={3}
                label={renderPieLabel}
              >
                {pieData.map((_, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip
                formatter={(value: any) => [value, "events"]}
                contentStyle={{ background: "#87a4ddff", borderRadius: 6 }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-1 lg:col-span-1 p-4 bg-white/5 rounded-lg shadow-sm">
        <h3 className="mb-2 font-medium">Top IPs (par events)</h3>
        <div style={{ width: "100%", height: 260 }}>
          <ResponsiveContainer>
            <BarChart data={barData} margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 10 }}
                interval={0}
                angle={-20}
                textAnchor="end"
                height={60}
              />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#FF6384" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
