import React, { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Search, Calendar, Filter } from "lucide-react";
const today = new Date("2026-05-28T12:00:00");

const formatDate = (date) =>
  new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  }).format(date);

const iso = (date) => date.toISOString().slice(0, 10);

const addDays = (date, days) => {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
};

const claimsSeed = [
  { id: "CLM-240581", patient: "Ava Thompson", dos: addDays(today, -1), payerId: "PY-1102", payerName: "Aetna", status: "Accepted", worked: false },
  { id: "CLM-240582", patient: "Liam Carter", dos: addDays(today, -2), payerId: "PY-2355", payerName: "Blue Cross", status: "Rejected", worked: false },
  { id: "CLM-240583", patient: "Sophia Nguyen", dos: addDays(today, -2), payerId: "PY-5120", payerName: "UnitedHealthcare", status: "Submitted", worked: false },
  { id: "CLM-240584", patient: "Noah Patel", dos: addDays(today, -3), payerId: "PY-3401", payerName: "Cigna", status: "Paid", worked: false },
  { id: "CLM-240585", patient: "Emma Rodriguez", dos: addDays(today, -4), payerId: "PY-4455", payerName: "Humana", status: "Pending", worked: false },
  { id: "CLM-240586", patient: "James Walker", dos: addDays(today, -5), payerId: "PY-2280", payerName: "Kaiser", status: "Accepted", worked: false },
  { id: "CLM-240588", patient: "Ethan Brown", dos: addDays(today, -8), payerId: "PY-9901", payerName: "Medicare", status: "Rejected", worked: false },
  { id: "CLM-240591", patient: "Charlotte Lee", dos: addDays(today, -15), payerId: "PY-5120", payerName: "UnitedHealthcare", status: "Rejected", worked: false }
];

export default function ClaimsPortal() {
  const [claims, setClaims] = useState(claimsSeed);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState(iso(addDays(today, -6)));
  const [toDate, setToDate] = useState(iso(today));

  const visibleClaims = useMemo(() => {
    const start = new Date(fromDate);
    const end = new Date(toDate);
    return claims.filter((c) => {
      const inRange = c.dos >= start && c.dos <= end;
      const keepRejected = c.status === "Rejected" && !c.worked;
      const matchesStatus = statusFilter === "All" || c.status === statusFilter;
      const matchesSearch = [c.id, c.patient, c.payerName].join(" ").toLowerCase().includes(search.toLowerCase());
      return (inRange || keepRejected) && matchesStatus && matchesSearch;
    });
  }, [claims, fromDate, toDate, statusFilter, search]);
  const summary = useMemo(() => {
    return {
      All: claims.length,
      Accepted: claims.filter(c => c.status === "Accepted").length,
      Rejected: claims.filter(c => c.status === "Rejected").length,
      Submitted: claims.filter(c => c.status === "Submitted").length,
      Pending: claims.filter(c => c.status === "Pending").length,
      Paid: claims.filter(c => c.status === "Paid").length,
    };
  }, [claims]);
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-white border-b px-6 py-4 flex justify-between items-center">
        <div>
          <div className="text-sm text-gray-500">Revenue Cycle / Claims</div>
          <div className="text-xl font-semibold">Claims</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export</Button>
          <Button>New Claim</Button>
        </div>
      </div>
      <div className="p-6 space-y-4">
        <div className="grid grid-cols-6 gap-3">
          {Object.keys(summary).map((key) => (
            <Card key={key} onClick={() => setStatusFilter(key)} className={`p-3 cursor-pointer ${statusFilter === key ? "border-blue-600" : ""}`}>
              <div className="text-xs text-gray-500">{key}</div>
              <div className="text-xl font-semibold">{summary[key]}</div>
            </Card>
          ))}
        </div>
        <Card className="p-4">
          <div className="flex justify-between items-center mb-4">
            <div className="flex gap-2 items-center">
              <div className="relative">
                <Search className="absolute left-2 top-2 h-4 w-4 text-gray-400" />
                <Input className="pl-8 w-72" placeholder="Search claims" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>


              <div className="flex items-center gap-2 border rounded px-3 h-9">
                <Calendar className="h-4 w-4 text-gray-500" />
                <input type="date" value={fromDate} onChange={(e)=>setFromDate(e.target.value)} />
                <span>-</span>
                <input type="date" value={toDate} onChange={(e)=>setToDate(e.target.value)} />
              </div>


              <Button variant="outline"><Filter className="h-4 w-4 mr-1"/>Filters</Button>
            </div>

            <div className="text-sm text-gray-500">{visibleClaims.length} results</div>
          </div>

          <table className="w-full text-sm">
            <thead className="text-gray-500 border-b">
              <tr>
                <th className="text-left py-2">Claim ID</th>
                <th className="text-left">Patient</th>
                <th className="text-left">DOS</th>
                <th className="text-left">Payer ID</th>
                <th className="text-left">Payer</th>
                <th className="text-left">Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {visibleClaims.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 font-medium text-blue-700 cursor-pointer">{c.id}</td>
                  <td>{c.patient}</td>
                  <td>{formatDate(c.dos)}</td>
                  <td>{c.payerId}</td>
                  <td>{c.payerName}</td>
                  <td>
                    <Badge variant="outline">{c.status}</Badge>
                    {c.status === "Rejected" && !c.worked && (
                      <Badge className="ml-2 bg-red-100 text-red-700">Needs Work</Badge>
                    )}
                  </td>
                  <td className="text-right">
                    {c.status === "Rejected" && !c.worked ? (
                      <Button size="sm" onClick={() => setClaims(prev => prev.map(x => x.id === c.id ? { ...x, worked: true } : x))}>Mark Worked</Button>
                    ) : (                      <Button size="sm" variant="ghost">View</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
