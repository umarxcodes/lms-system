import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import PageHeader from "../../components/common/PageHeader";
import { PageContent } from "../../components/layout/AppLayout";
import { reportApi } from "../../services/reportApi";
import { useToast } from "../../context/ToastContext";

import ReportSummaryCards from "../../components/reports/ReportSummaryCards";
import ReportFilters from "../../components/reports/ReportFilters";
import ReportTable from "../../components/reports/ReportTable";
import ReportDetailsDialog from "../../components/reports/ReportDetailsDialog";

export default function AdminReports() {
  const [reportType, setReportType] = useState("attendance");
  const [attendanceReport, setAttendanceReport] = useState([]);
  const [assignmentReport, setAssignmentReport] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Details Modal State
  const [selectedReportItem, setSelectedReportItem] = useState(null);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);

  const { showToast } = useToast();
  const navigate = useNavigate();

  const fetchReportsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [attRes, assRes] = await Promise.allSettled([
        reportApi.getAttendanceReport(),
        reportApi.getAssignmentReport(),
      ]);

      if (attRes.status === "fulfilled" && attRes.value.success) {
        const rawAtt = attRes.value.data;
        setAttendanceReport(Array.isArray(rawAtt) ? rawAtt : rawAtt?.records || rawAtt?.data || []);
      }
      if (assRes.status === "fulfilled" && assRes.value.success) {
        const rawAss = assRes.value.data;
        setAssignmentReport(Array.isArray(rawAss) ? rawAss : rawAss?.tasks || rawAss?.data || []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load reports data");
      showToast(err?.message || "Failed to load reports data", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchReportsData();
  }, [fetchReportsData]);

  // Compute Summary KPI Values
  const attendanceCount = attendanceReport.length;
  const deliverablesCount = assignmentReport.length;

  const attendanceRate = useMemo(() => {
    if (attendanceCount === 0) return 100;
    const presentCount = attendanceReport.filter((r) => (r.status || "").toLowerCase() === "present").length;
    return (presentCount / attendanceCount) * 100;
  }, [attendanceReport, attendanceCount]);

  const deliverableCompletionRate = useMemo(() => {
    if (deliverablesCount === 0) return 0;
    const doneCount = assignmentReport.filter((t) => (t.status || "").toLowerCase() === "completed" || (t.status || "").toLowerCase() === "done").length;
    return (doneCount / deliverablesCount) * 100;
  }, [assignmentReport, deliverablesCount]);

  // Active dataset filtering
  const activeReportData = reportType === "attendance" ? attendanceReport : assignmentReport;

  const filteredReportData = useMemo(() => {
    return activeReportData.filter((item) => {
      let matchesSearch = true;
      if (search) {
        const sQuery = search.toLowerCase();
        if (reportType === "attendance") {
          const name = item.student?.name || item.studentName || "";
          const email = item.student?.email || item.studentEmail || "";
          const notes = item.notes || item.remarks || "";
          matchesSearch = name.toLowerCase().includes(sQuery) || email.toLowerCase().includes(sQuery) || notes.toLowerCase().includes(sQuery);
        } else {
          const title = item.title || item.name || "";
          const assigned = item.assignedTo?.name || item.studentName || "";
          const project = item.project?.name || item.team?.name || "";
          matchesSearch = title.toLowerCase().includes(sQuery) || assigned.toLowerCase().includes(sQuery) || project.toLowerCase().includes(sQuery);
        }
      }

      let matchesStatus = true;
      if (statusFilter !== "all") {
        const itemStatus = (item.status || "").toLowerCase();
        matchesStatus = itemStatus === statusFilter.toLowerCase();
      }

      return matchesSearch && matchesStatus;
    });
  }, [activeReportData, reportType, search, statusFilter]);

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  // CSV Export Handler
  const handleExportCsv = async () => {
    const url = reportType === "attendance" ? reportApi.exportAttendanceCsvUrl : reportApi.exportAssignmentCsvUrl;
    const fileName = reportType === "attendance" ? "attendance_report.csv" : "deliverables_report.csv";

    try {
      setExporting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Export download failed");
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`${fileName} exported and downloaded successfully!`, "success");
    } catch (err) {
      showToast(err?.message || "Failed to download CSV export", "error");
    } finally {
      setExporting(false);
    }
  };

  const handleViewDetails = (item) => {
    setSelectedReportItem(item);
    setOpenDetailsModal(true);
  };

  return (
    <PageContent px={{ xs: 2, sm: 3, md: 4 }}>
      {/* Page Header */}
      <PageHeader
        breadcrumbs={[{ label: "Home", to: "/admin/dashboard" }, { label: "Reports" }]}
        title="Reports Management"
        description="View and analyze bootcamp performance, attendance, progress, and project deliverables information."
      />

      {/* Summary KPI Cards */}
      <ReportSummaryCards
        loading={loading}
        attendanceCount={attendanceCount}
        deliverablesCount={deliverablesCount}
        attendanceRate={attendanceRate}
        deliverableCompletionRate={deliverableCompletionRate}
      />

      {/* Filter / Search Toolbar */}
      <ReportFilters
        reportType={reportType}
        onReportTypeChange={(val) => {
          setReportType(val);
          setStatusFilter("all");
        }}
        search={search}
        onSearchChange={setSearch}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        onClearFilters={handleClearFilters}
        onExportCsv={handleExportCsv}
        exporting={exporting}
      />

      {/* Primary Report Table */}
      <ReportTable
        loading={loading}
        error={error}
        reportType={reportType}
        reportData={filteredReportData}
        onRetry={fetchReportsData}
        onViewDetails={handleViewDetails}
        onViewStudent={(studentId) => navigate(`/admin/students`)}
      />

      {/* Record Details Modal */}
      <ReportDetailsDialog
        open={openDetailsModal}
        onClose={() => {
          setOpenDetailsModal(false);
          setSelectedReportItem(null);
        }}
        reportItem={selectedReportItem}
        reportType={reportType}
      />
    </PageContent>
  );
}
