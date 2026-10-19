"use client";

import * as React from "react";
import {
  HeartHandshake,
  Search,
  Filter,
  RefreshCw,
  Eye,
  CheckCircle2,
  Clock,
  XCircle,
  IndianRupee,
  X,
  FileText,
  MapPin,
  Mail,
  Phone,
  User,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatINR } from "@/components/customer/donation/donation-validation";
import { Pagination } from "@/components/shared/pagination";

interface DonationListItem {
  id: string;
  referenceId: string;
  amountInRupees: number;
  currency: string;
  frequency: string;
  status: "PENDING" | "ORDER_CREATED" | "PAID" | "FAILED" | "EXPIRED";
  causeId: string;
  causeTitle: string;
  donorName: string;
  donorEmail: string;
  donorPhone: string;
  panNumber: string | null;
  isAnonymous: boolean;
  consentUpdates: boolean;
  address: string;
  message: string | null;
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
  paymentMethod: string | null;
  capturedAt: string | null;
  createdAt: string;
}

interface MetricsSummary {
  totalReceivedAmount: number;
  confirmedCount: number;
  pendingCount: number;
  failedCount: number;
  totalAttempts: number;
}

export default function AdminDonationsPage() {
  const [donations, setDonations] = React.useState<DonationListItem[]>([]);
  const [metrics, setMetrics] = React.useState<MetricsSummary>({
    totalReceivedAmount: 0,
    confirmedCount: 0,
    pendingCount: 0,
    failedCount: 0,
    totalAttempts: 0,
  });

  const [pagination, setPagination] = React.useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [isRefreshing, setIsRefreshing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Filters
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState("ALL");
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");

  // Selected donation for details modal
  const [selectedDonation, setSelectedDonation] =
    React.useState<DonationListItem | null>(null);

  // Debounce search
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPagination((prev) => ({ ...prev, page: 1 }));
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch donations from API
  const fetchDonations = React.useCallback(async () => {
    try {
      setError(null);
      const query = new URLSearchParams();
      query.set("page", pagination.page.toString());
      query.set("limit", pagination.limit.toString());
      if (debouncedSearch) query.set("search", debouncedSearch);
      if (statusFilter !== "ALL") query.set("status", statusFilter);
      if (startDate) query.set("startDate", startDate);
      if (endDate) query.set("endDate", endDate);

      const res = await fetch(`/api/admin/donations?${query.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to load donation records.");
      }

      const json = await res.json();
      if (json.success) {
        setDonations(json.data);
        setPagination(json.pagination);
        if (json.metrics) {
          setMetrics(json.metrics);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred while loading donations."
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    statusFilter,
    startDate,
    endDate,
  ]);

  React.useEffect(() => {
    let active = true;

    async function load() {
      try {
        setError(null);
        const query = new URLSearchParams();
        query.set("page", pagination.page.toString());
        query.set("limit", pagination.limit.toString());
        if (debouncedSearch) query.set("search", debouncedSearch);
        if (statusFilter !== "ALL") query.set("status", statusFilter);
        if (startDate) query.set("startDate", startDate);
        if (endDate) query.set("endDate", endDate);

        const res = await fetch(`/api/admin/donations?${query.toString()}`);
        if (!res.ok) {
          throw new Error("Failed to load donation records.");
        }

        const json = await res.json();
        if (active && json.success) {
          setDonations(json.data);
          setPagination(json.pagination);
          if (json.metrics) {
            setMetrics(json.metrics);
          }
        }
      } catch (err) {
        if (active) {
          console.error(err);
          setError(
            err instanceof Error
              ? err.message
              : "An unexpected error occurred while loading donations."
          );
        }
      } finally {
        if (active) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, [
    pagination.page,
    pagination.limit,
    debouncedSearch,
    statusFilter,
    startDate,
    endDate,
  ]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    void fetchDonations();
  };

  const getStatusBadge = (status: DonationListItem["status"]) => {
    switch (status) {
      case "PAID":
        return (
          <Badge className="bg-[#E8F5E9] text-[#2E7D32] hover:bg-[#E8F5E9] border-emerald-200 gap-1 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Confirmed Paid</span>
          </Badge>
        );
      case "ORDER_CREATED":
      case "PENDING":
        return (
          <Badge className="bg-[#FFF4E5] text-[#FF8A00] hover:bg-[#FFF4E5] border-amber-200 gap-1 font-semibold">
            <Clock className="w-3 h-3" />
            <span>Pending</span>
          </Badge>
        );
      case "FAILED":
      case "EXPIRED":
        return (
          <Badge className="bg-red-50 text-red-700 hover:bg-red-50 border-red-200 gap-1 font-semibold">
            <XCircle className="w-3 h-3" />
            <span>Failed</span>
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#492A22] tracking-tight flex items-center gap-2.5">
            <HeartHandshake className="w-7 h-7 text-[#F52232]" />
            <span>Donations Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#78685D] mt-1">
            Audit, verify, and inspect all genuine donation records and live
            Razorpay transactions.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="border-[#D6CBB8] text-xs font-semibold gap-1.5"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`}
          />
          <span>Refresh Records</span>
        </Button>
      </div>

      {/* Metrics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Funds Received */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFE8D8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#E8F5E9] text-[#2E7D32] flex items-center justify-center shrink-0">
            <IndianRupee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#78685D] uppercase tracking-wider block">
              Total Funds Received
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#2E7D32]">
              {formatINR(metrics.totalReceivedAmount)}
            </span>
            <p className="text-[11px] text-[#78685D] mt-0.5 font-medium">
              Confirmed paid only
            </p>
          </div>
        </div>

        {/* Confirmed Donations */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFE8D8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#FFF0E2] text-[#F52232] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#78685D] uppercase tracking-wider block">
              Confirmed Donations
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#492A22]">
              {metrics.confirmedCount}
            </span>
            <p className="text-[11px] text-[#78685D] mt-0.5 font-medium">
              Captured successfully
            </p>
          </div>
        </div>

        {/* Pending Attempts */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFE8D8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#FF8A00] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#78685D] uppercase tracking-wider block">
              Pending Attempts
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#FF8A00]">
              {metrics.pendingCount}
            </span>
            <p className="text-[11px] text-[#78685D] mt-0.5 font-medium">
              Checkout opened or pending
            </p>
          </div>
        </div>

        {/* Total Order Attempts */}
        <div className="bg-white rounded-2xl p-5 border border-[#EFE8D8] shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-[#492A22] flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#78685D] uppercase tracking-wider block">
              Total Attempts
            </span>
            <span className="text-xl sm:text-2xl font-black text-[#492A22]">
              {metrics.totalAttempts}
            </span>
            <p className="text-[11px] text-[#78685D] mt-0.5 font-medium">
              {metrics.failedCount} cancelled / failed
            </p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EFE8D8] shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search bar */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-[#78685D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search reference, donor, email, phone, transaction ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-[#E8DFC9] pl-10 pr-3 py-2 text-xs sm:text-sm font-medium text-[#492A22] placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#F52232]"
            />
          </div>

          {/* Status filter */}
          <div className="md:col-span-3">
            <div className="relative">
              <Filter className="w-3.5 h-3.5 text-[#78685D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full rounded-xl border border-[#E8DFC9] pl-9 pr-3 py-2 text-xs sm:text-sm font-medium text-[#492A22] bg-white focus:outline-none focus:ring-2 focus:ring-[#F52232]"
              >
                <option value="ALL">All Statuses</option>
                <option value="PAID">Confirmed Paid</option>
                <option value="PENDING">Pending / Checkout Open</option>
                <option value="FAILED">Failed / Cancelled</option>
              </select>
            </div>
          </div>

          {/* Start Date */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full rounded-xl border border-[#E8DFC9] px-3 py-2 text-xs text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
                title="From Date"
              />
            </div>
          </div>

          {/* End Date */}
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full rounded-xl border border-[#E8DFC9] px-3 py-2 text-xs text-[#492A22] focus:outline-none focus:ring-2 focus:ring-[#F52232]"
                title="To Date"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-2xl border border-[#EFE8D8] shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-[#78685D] text-sm space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#F52232]" />
            <p>Loading donation records...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-red-600 text-sm">
            <p className="font-semibold">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-3"
            >
              Retry
            </Button>
          </div>
        ) : donations.length === 0 ? (
          <div className="p-12 text-center text-[#78685D] text-sm space-y-2">
            <HeartHandshake className="w-10 h-10 text-stone-300 mx-auto" />
            <p className="font-bold text-[#492A22]">
              No donation records found
            </p>
            <p className="text-xs">
              Try adjusting your search criteria or date filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF6F0] text-[#78685D] border-b border-[#EFE8D8] uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Reference / Date</th>
                  <th className="py-3.5 px-4 font-bold">Donor</th>
                  <th className="py-3.5 px-4 font-bold">Purpose</th>
                  <th className="py-3.5 px-4 font-bold">Amount</th>
                  <th className="py-3.5 px-4 font-bold">Status</th>
                  <th className="py-3.5 px-4 font-bold">Payment Details</th>
                  <th className="py-3.5 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EFE8D8]">
                {donations.map((d) => (
                  <tr
                    key={d.id}
                    className="hover:bg-[#FFFDF9] transition-colors"
                  >
                    <td className="py-3 px-4">
                      <code className="font-mono font-bold text-[#492A22] block">
                        {d.referenceId}
                      </code>
                      <span className="text-[11px] text-[#78685D]">
                        {new Date(d.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-bold text-[#492A22] flex items-center gap-1.5">
                        <span>{d.donorName}</span>
                        {d.isAnonymous && (
                          <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded font-normal">
                            Anon
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#78685D] block">
                        {d.donorEmail} · {d.donorPhone}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-[#492A22] block">
                        {d.causeTitle}
                      </span>
                      <span className="text-[10px] uppercase tracking-wider text-[#78685D]">
                        One-Time Gift
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold text-[#492A22] text-sm">
                      {formatINR(d.amountInRupees)}
                    </td>

                    <td className="py-3 px-4">{getStatusBadge(d.status)}</td>

                    <td className="py-3 px-4 text-xs font-mono">
                      {d.razorpayPaymentId ? (
                        <div>
                          <span className="text-emerald-700 font-bold block">
                            {d.razorpayPaymentId}
                          </span>
                          <span className="text-[10px] text-[#78685D] font-sans">
                            {d.paymentMethod || "online"}
                          </span>
                        </div>
                      ) : d.razorpayOrderId ? (
                        <span className="text-stone-500 text-[11px]">
                          {d.razorpayOrderId}
                        </span>
                      ) : (
                        <span className="text-stone-400">—</span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDonation(d)}
                        className="h-8 px-2 text-[#492A22] hover:text-[#F52232] cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        <span>Inspect</span>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination controls */}
        {!isLoading && pagination.total > 0 && (
          <div className="border-t border-[#EFE8D8] px-4">
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.totalPages}
              totalRecords={pagination.total}
              limit={pagination.limit}
              recordLabel="donations"
              disabled={isRefreshing}
              onPageChange={(page) =>
                setPagination((prev) => ({
                  ...prev,
                  page: Math.max(1, Math.min(page, prev.totalPages)),
                }))
              }
            />
          </div>
        )}
      </div>

      {/* Donation Detail Modal */}
      {selectedDonation && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-50 duration-200"
        >
          <div className="bg-white rounded-3xl border border-[#EFE8D8] shadow-2xl max-w-xl w-full p-6 sm:p-7 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#EFE8D8] pb-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#78685D]">
                  Donation Inspection
                </span>
                <h3 className="text-lg font-bold text-[#492A22] mt-0.5 font-mono">
                  {selectedDonation.referenceId}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDonation(null)}
                aria-label="Close dialog"
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status & Amount Banner */}
            <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EFE8D8] flex items-center justify-between">
              <div>
                <span className="text-xs text-[#78685D] block">
                  Contribution Amount
                </span>
                <span className="text-2xl font-black text-[#F52232]">
                  {formatINR(selectedDonation.amountInRupees)}
                </span>
              </div>
              <div>{getStatusBadge(selectedDonation.status)}</div>
            </div>

            {/* Detailed Grid */}
            <div className="space-y-4 text-xs sm:text-sm">
              {/* Donor Details */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#492A22] text-xs uppercase tracking-wider text-[#78685D]">
                  Donor Contact & Identity
                </h4>
                <div className="bg-[#FAF6F0]/60 p-3.5 rounded-xl border border-[#EFE8D8] space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-[#78685D]" />
                    <span className="font-bold text-[#492A22]">
                      {selectedDonation.donorName}
                    </span>
                    {selectedDonation.isAnonymous && (
                      <span className="text-[10px] bg-stone-200 text-stone-700 px-1.5 py-0.5 rounded">
                        Requested Public Anonymity
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[#492A22]">
                    <Mail className="w-4 h-4 text-[#78685D]" />
                    <span>{selectedDonation.donorEmail}</span>
                  </div>

                  <div className="flex items-center gap-2 text-[#492A22]">
                    <Phone className="w-4 h-4 text-[#78685D]" />
                    <span>{selectedDonation.donorPhone}</span>
                  </div>

                  {selectedDonation.panNumber && (
                    <div className="flex items-center gap-2 text-[#492A22]">
                      <FileText className="w-4 h-4 text-[#78685D]" />
                      <span>PAN: </span>
                      <code className="font-mono font-bold">
                        {selectedDonation.panNumber}
                      </code>
                    </div>
                  )}

                  {selectedDonation.address && (
                    <div className="flex items-start gap-2 text-[#492A22]">
                      <MapPin className="w-4 h-4 text-[#78685D] mt-0.5 shrink-0" />
                      <span>{selectedDonation.address}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Transaction & Gateway Info */}
              <div className="space-y-2">
                <h4 className="font-bold text-[#492A22] text-xs uppercase tracking-wider text-[#78685D]">
                  Razorpay Transaction Identifiers
                </h4>
                <div className="bg-[#FAF6F0]/60 p-3.5 rounded-xl border border-[#EFE8D8] space-y-2 font-mono text-xs">
                  <div>
                    <span className="text-[#78685D] block text-[11px] font-sans">
                      Razorpay Order ID:
                    </span>
                    <span className="text-[#492A22] font-bold">
                      {selectedDonation.razorpayOrderId || "—"}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#78685D] block text-[11px] font-sans">
                      Razorpay Payment ID:
                    </span>
                    <span className="text-emerald-700 font-bold">
                      {selectedDonation.razorpayPaymentId || "—"}
                    </span>
                  </div>

                  {selectedDonation.paymentMethod && (
                    <div>
                      <span className="text-[#78685D] block text-[11px] font-sans">
                        Payment Method:
                      </span>
                      <span className="text-[#492A22] font-sans capitalize">
                        {selectedDonation.paymentMethod}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[#78685D] block text-[11px] font-sans">
                      Captured Timestamp:
                    </span>
                    <span className="text-[#492A22] font-sans">
                      {selectedDonation.capturedAt
                        ? new Date(selectedDonation.capturedAt).toLocaleString(
                            "en-IN"
                          )
                        : "Not yet captured"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Personal Dedication Message */}
              {selectedDonation.message && (
                <div className="space-y-1">
                  <h4 className="font-bold text-[#492A22] text-xs uppercase tracking-wider text-[#78685D]">
                    Donor Dedication / Message
                  </h4>
                  <p className="p-3 bg-[#FFFDF9] rounded-xl border border-[#EFE8D8] italic text-xs text-[#492A22]">
                    &ldquo;{selectedDonation.message}&rdquo;
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-2 border-t border-[#EFE8D8] flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedDonation(null)}
                className="border-[#D6CBB8]"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
