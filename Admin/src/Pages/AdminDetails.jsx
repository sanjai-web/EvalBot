import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  FileText,
  Building2,
  Upload,
  Edit,
  Trash2,
  Mail,
  Phone,
  User,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  Hash,
  X,
  Save,
  Plus,
  Clock,
  Star,
  Loader2,
  Download,
  ArrowUp,
  ArrowDown,
  CheckCircle2,
  Clock as ClockIcon,
  Timer,
  Cpu,
  Brain,
  Code,
  Briefcase,
} from "lucide-react";

const API_URL = "http://localhost:5000/api";

function AdminDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const collection = location.state?.collection;

  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editedCollection, setEditedCollection] = useState(collection);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showAddApplicant, setShowAddApplicant] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [applicantFilter, setApplicantFilter] = useState("all");
  const [newApplicant, setNewApplicant] = useState({
    name: "",
    loginId: "",
    password: "",
    score: 0,
  });

  const levelConfig = {
    Beginner: {
      color: "emerald",
      icon: "🟢",
      bgColor: "bg-emerald-500/10",
      textColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
    Intermediate: {
      color: "amber",
      icon: "🟡",
      bgColor: "bg-amber-500/10",
      textColor: "text-amber-400",
      borderColor: "border-amber-500/20",
    },
    Advanced: {
      color: "rose",
      icon: "🔴",
      bgColor: "bg-rose-500/10",
      textColor: "text-rose-400",
      borderColor: "border-rose-500/20",
    },
  };

  useEffect(() => {
    if (collection) {
      fetchUsers();
    }
  }, [collection]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${API_URL}/collections/${collection._id}/users`,
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      const data = await response.json();
      setStudents(data);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortStudents = () => {
    let filtered = students.filter(
      (student) =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.loginId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.password.includes(searchTerm),
    );

    switch (applicantFilter) {
      case "completed":
        filtered = filtered.filter(
          (student) => student.completionStatus === "Completed",
        );
        break;
      case "incomplete":
        filtered = filtered.filter(
          (student) => student.completionStatus === "Incomplete",
        );
        break;
      case "high-to-low":
        filtered = [...filtered].sort((a, b) => b.score - a.score);
        break;
      case "low-to-high":
        filtered = [...filtered].sort((a, b) => a.score - b.score);
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredStudents = filterAndSortStudents();

  const downloadExcel = () => {
    const headers = [
      "Name",
      "Email",
      "Mobile",
      "Score",
      "Interview Status",
      "Completion Date",
    ];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map((student) =>
        [
          `"${student.name}"`,
          `"${student.loginId}"`,
          `"${student.password}"`,
          student.score,
          student.completionStatus,
          student.completedAt
            ? new Date(student.completedAt).toLocaleString()
            : "N/A",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `${collection.company}_${collection.role}_applicants.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatDisplayDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return <span className="text-slate-500">N/A</span>;
    const [datePart, timePart] = dateTimeStr.split(" ");
    return (
      <div className="flex flex-col">
        <span className="font-semibold text-slate-900 tracking-wide">
          {datePart}
        </span>
        <span className="text-xs text-indigo-300 flex items-center space-x-1 mt-0.5">
          <Clock className="w-3 h-3" />
          <span>{timePart}</span>
        </span>
      </div>
    );
  };

  const getDateTimeLocalValue = (dateTimeStr) => {
    if (!dateTimeStr) return "";
    const [datePart, timePart] = dateTimeStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const formatDateTimeFromInput = (datetimeLocalValue) => {
    if (!datetimeLocalValue) return "";
    const [datePart, timePart] = datetimeLocalValue.split("T");
    const [year, month, day] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return `${day}-${month}-${year} ${hours}:${minutes}`;
  };

  const toggleBlockStudent = async (studentId) => {
    try {
      const student = students.find((s) => s._id === studentId);
      const newStatus = student.status === "Active" ? "Blocked" : "Active";

      const response = await fetch(
        `${API_URL}/collections/${collection._id}/users/${studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update user status");

      setStudents(
        students.map((s) =>
          s._id === studentId ? { ...s, status: newStatus } : s,
        ),
      );
    } catch (err) {
      console.error("Error updating user status:", err);
      alert("Failed to update user status");
    }
  };

  const toggleCompletionStatus = async (studentId) => {
    try {
      const student = students.find((s) => s._id === studentId);
      const newCompletionStatus =
        student.completionStatus === "Completed" ? "Incomplete" : "Completed";

      const response = await fetch(
        `${API_URL}/collections/${collection._id}/users/${studentId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ completionStatus: newCompletionStatus }),
        },
      );

      if (!response.ok) throw new Error("Failed to update completion status");

      const updatedStudents = students.map((s) =>
        s._id === studentId
          ? {
              ...s,
              completionStatus: newCompletionStatus,
              completedAt:
                newCompletionStatus === "Completed" ? new Date() : null,
            }
          : s,
      );

      setStudents(updatedStudents);

      const completedCount = updatedStudents.filter(
        (s) => s.completionStatus === "Completed",
      ).length;
      setEditedCollection((prev) => ({
        ...prev,
        completedApplicants: completedCount,
      }));
    } catch (err) {
      console.error("Error updating completion status:", err);
      alert("Failed to update completion status");
    }
  };

  const handleEditToggle = async () => {
    if (isEditing) {
      try {
        setIsSaving(true);
        const response = await fetch(
          `${API_URL}/collections/${collection._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(editedCollection),
          },
        );

        if (!response.ok) throw new Error("Failed to update collection");
      } catch (err) {
        console.error("Error updating collection:", err);
        alert("Failed to update collection");
      } finally {
        setIsSaving(false);
      }
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field, value) => {
    setEditedCollection((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDateTimeChange = (field, e) => {
    const formattedDateTime = formatDateTimeFromInput(e.target.value);
    setEditedCollection((prev) => ({
      ...prev,
      [field]: formattedDateTime,
    }));
  };

  const handleDeleteCollection = async () => {
    try {
      const response = await fetch(`${API_URL}/collections/${collection._id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete collection");
      navigate("/");
    } catch (err) {
      console.error("Error deleting collection:", err);
      alert("Failed to delete collection");
    }
  };

  const handleNewApplicantChange = (field, value) => {
    setNewApplicant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddApplicant = async () => {
    if (!newApplicant.name || !newApplicant.loginId || !newApplicant.password) {
      alert("Please fill in all required fields");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection._id}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newApplicant,
            status: "Active",
            completionStatus: "Incomplete",
          }),
        },
      );

      if (!response.ok) throw new Error("Failed to add applicant");

      await fetchUsers();

      setNewApplicant({
        name: "",
        loginId: "",
        password: "",
        score: 0,
      });
      setShowAddApplicant(false);

      setEditedCollection((prev) => ({
        ...prev,
        applicants: prev.applicants + 1,
      }));
    } catch (err) {
      console.error("Error adding applicant:", err);
      alert("Failed to add applicant");
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this applicant?"))
      return;

    try {
      const response = await fetch(
        `${API_URL}/collections/${collection._id}/users/${userId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) throw new Error("Failed to delete user");

      await fetchUsers();

      setEditedCollection((prev) => ({
        ...prev,
        applicants: Math.max(0, prev.applicants - 1),
        completedApplicants: Math.max(0, prev.completedApplicants - 1),
      }));
    } catch (err) {
      console.error("Error deleting user:", err);
      alert("Failed to delete user");
    }
  };

  const handleUploadQuestions = () => {
    if (editedCollection.domain === "Code Test") {
      navigate("/CodeUpload", { state: { collection: editedCollection } });
    } else if (editedCollection.domain === "Quiz") {
      navigate("/QuizUpload", { state: { collection: editedCollection } });
    }
  };

  const getInterviewStatus = (startDateTime, endDateTime) => {
    const now = new Date();
    const start = parseCustomDateTime(startDateTime);
    const end = parseCustomDateTime(endDateTime);

    if (now < start)
      return {
        status: "Upcoming",
        color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      };
    if (now >= start && now <= end)
      return {
        status: "Live",
        color:
          "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.2)]",
      };
    return {
      status: "Completed",
      color: "bg-gray-500/10 text-slate-500 border-gray-500/20",
    };
  };

  const parseCustomDateTime = (dateTimeStr) => {
    const [datePart, timePart] = dateTimeStr.split(" ");
    const [day, month, year] = datePart.split("-");
    const [hours, minutes] = timePart.split(":");
    return new Date(`${year}-${month}-${day}T${hours}:${minutes}`);
  };

  const isTimedTest = ["Quiz", "Code Test"].includes(editedCollection?.domain);
  const isLevelBased = ["Computer Science", "Role Based"].includes(
    editedCollection?.domain,
  );

  if (!collection) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500 rounded-full blur-[120px] opacity-20" />
        <div className="glass-panel p-10 rounded-2xl text-center relative z-10 border border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
          <h2 className="text-3xl font-bold text-slate-900 mb-6 tracking-wide">
            No Collection Found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-red-600 hover:bg-red-500 text-slate-900 px-8 py-3 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.4)]"
          >
            RETURN TO HUB
          </button>
        </div>
      </div>
    );
  }

  const interviewStatus = getInterviewStatus(
    editedCollection.startDateTime,
    editedCollection.endDateTime,
  );
  const completedCount = students.filter(
    (s) => s.completionStatus === "Completed",
  ).length;
  const incompleteCount = students.filter(
    (s) => s.completionStatus === "Incomplete",
  ).length;

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-[-1]">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600 rounded-full blur-[120px] opacity-10" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[120px] opacity-10" />
      </div>

      <header className="glass-panel sticky top-0 z-40 border-b border-slate-200 mb-10 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 py-5">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate("/")}
              className="p-2.5 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900 group border border-transparent hover:border-slate-200"
            >
              <ChevronRight className="w-5 h-5 rotate-180 group-hover:-translate-x-1 transition-transform" />
            </button>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-xl tracking-widest shadow-[0_0_20px_rgba(79,70,229,0.4)] border border-slate-200">
              EVAL<span className="font-light">BOT</span>
            </div>
            <div className="hidden md:flex items-center space-x-3 text-slate-500 text-sm font-medium">
              <span
                className="hover:text-indigo-400 cursor-pointer transition-colors"
                onClick={() => navigate("/")}
              >
                Admin Hub
              </span>
              <ChevronRight className="w-4 h-4 text-slate-900/30" />
              <span
                className="hover:text-indigo-400 cursor-pointer transition-colors"
                onClick={() => navigate("/")}
              >
                Collections
              </span>
              <ChevronRight className="w-4 h-4 text-slate-900/30" />
              <span className="text-slate-900 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-inner">
                Details Console
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 space-y-8">
        {/* Collection Details Section */}
        <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] max-w-4xl">
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border-b border-slate-200 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-20 -mt-20 -mr-20 pointer-events-none" />

            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 relative z-10">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-4 max-w-xl">
                    <input
                      type="text"
                      value={editedCollection.company}
                      onChange={(e) =>
                        handleInputChange("company", e.target.value)
                      }
                      className="w-full text-xl font-bold text-slate-900 bg-white/80 border border-indigo-500/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-[0_0_15px_rgba(79,70,229,0.2)]"
                    />
                    <input
                      type="text"
                      value={editedCollection.role}
                      onChange={(e) =>
                        handleInputChange("role", e.target.value)
                      }
                      className="w-full text-indigo-300 font-medium bg-white/80 border border-indigo-500/50 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-1 tracking-tight flex items-center gap-3">
                      {editedCollection.company}
                    </h1>
                    <p className="text-base text-indigo-400 font-medium tracking-wide flex items-center gap-2">
                      <Briefcase className="w-4 h-4 opacity-80" />
                      {editedCollection.role}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-end space-y-3">
                <span
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider border shadow-lg ${interviewStatus.color}`}
                >
                  {interviewStatus.status.toUpperCase()}
                </span>

                {isEditing ? (
                  isLevelBased ? (
                    <select
                      value={editedCollection.level}
                      onChange={(e) =>
                        handleInputChange("level", e.target.value)
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-300 bg-white/80 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  ) : null
                ) : (
                  isLevelBased && (
                    <span
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold border shadow-inner flex items-center gap-2 ${
                        levelConfig[editedCollection.level].bgColor
                      } ${levelConfig[editedCollection.level].textColor} ${
                        levelConfig[editedCollection.level].borderColor
                      }`}
                    >
                      <span className="text-[10px]">
                        {levelConfig[editedCollection.level].icon}
                      </span>
                      {editedCollection.level.toUpperCase()}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <ColorDetailItem
                icon={Hash}
                label="Interview ID"
                value={editedCollection.interviewId}
                gradient="from-blue-500/20 to-blue-600/20"
                iconColor="text-blue-400"
              />

              <ColorDetailItem
                icon={Calendar}
                label="Start Timeline"
                value={
                  isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={getDateTimeLocalValue(
                          editedCollection.startDateTime,
                        )}
                        onChange={(e) =>
                          handleDateTimeChange("startDateTime", e)
                        }
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none [color-scheme:dark]"
                      />
                    </div>
                  ) : (
                    formatDisplayDateTime(editedCollection.startDateTime)
                  )
                }
                gradient="from-emerald-500/20 to-teal-600/20"
                iconColor="text-emerald-400"
              />

              <ColorDetailItem
                icon={Calendar}
                label="End Timeline"
                value={
                  isEditing ? (
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-4 h-4 pointer-events-none" />
                      <input
                        type="datetime-local"
                        value={getDateTimeLocalValue(
                          editedCollection.endDateTime,
                        )}
                        onChange={(e) => handleDateTimeChange("endDateTime", e)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white/80 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none [color-scheme:dark]"
                      />
                    </div>
                  ) : (
                    formatDisplayDateTime(editedCollection.endDateTime)
                  )
                }
                gradient="from-rose-500/20 to-pink-600/20"
                iconColor="text-rose-400"
              />

              <ColorDetailItem
                icon={FileText}
                label="Primary Domain"
                value={
                  isEditing ? (
                    <select
                      value={editedCollection.domain}
                      onChange={(e) =>
                        handleInputChange("domain", e.target.value)
                      }
                      className="w-full px-4 py-2.5 bg-white/80 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none appearance-none"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Role Based">Role Based</option>
                      <option value="Quiz">Quiz</option>
                      <option value="Code Test">Code Test</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-slate-900 tracking-wide">
                      {editedCollection.domain}
                    </span>
                  )
                }
                gradient="from-indigo-500/20 to-purple-600/20"
                iconColor="text-indigo-400"
              />

              <ColorDetailItem
                icon={Building2}
                label="Applicant Metrics"
                value={
                  <div>
                    <div className="font-bold text-lg text-slate-900">
                      {students.length}{" "}
                      <span className="text-sm font-medium text-slate-500">
                        Total
                      </span>
                    </div>
                    <div className="text-xs text-indigo-300 mt-1 font-medium tracking-wide">
                      <span className="text-emerald-400">
                        {completedCount} Done
                      </span>{" "}
                      •{" "}
                      <span className="text-amber-400">
                        {incompleteCount} Pending
                      </span>
                    </div>
                  </div>
                }
                gradient="from-cyan-500/20 to-blue-600/20"
                iconColor="text-cyan-400"
              />

              <ColorDetailItem
                icon={Upload}
                label="Source Roster"
                value={
                  <span className="font-medium text-slate-600 truncate block">
                    {editedCollection.fileName || "No file attached"}
                  </span>
                }
                gradient="from-fuchsia-500/20 to-purple-600/20"
                iconColor="text-fuchsia-400"
              />

              {isTimedTest && (
                <ColorDetailItem
                  icon={Timer}
                  label="Execution Constraint"
                  value={
                    isEditing ? (
                      <div className="relative">
                        <input
                          type="number"
                          value={editedCollection.timeLimit || ""}
                          onChange={(e) =>
                            handleInputChange(
                              "timeLimit",
                              parseInt(e.target.value) || 0,
                            )
                          }
                          className="w-full px-4 py-2.5 bg-white/80 border border-slate-300 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 text-slate-900 outline-none"
                          placeholder="Minutes"
                          min="1"
                        />
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-slate-900 font-bold">
                        <Timer className="w-4 h-4 text-amber-400" />
                        <span>
                          {editedCollection.timeLimit}{" "}
                          <span className="text-slate-500 text-sm font-medium">
                            MINUTES
                          </span>
                        </span>
                      </div>
                    )
                  }
                  gradient="from-amber-500/20 to-orange-600/20"
                  iconColor="text-amber-400"
                />
              )}
            </div>

            <div className="glass-card rounded-xl p-4 border border-slate-100 mb-5">
              <h3 className="text-xs font-bold text-slate-500 tracking-widest uppercase mb-3 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Mission Briefing</span>
              </h3>
              {isEditing ? (
                <textarea
                  value={editedCollection.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white/80 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 resize-none text-slate-700 leading-relaxed text-sm outline-none shadow-inner"
                  rows={3}
                />
              ) : (
                <p className="text-slate-600 leading-relaxed text-sm bg-white/90 p-4 rounded-xl border border-slate-100 shadow-inner">
                  {editedCollection.description}
                </p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
              <button
                onClick={handleEditToggle}
                disabled={isSaving}
                className={`flex-1 py-2.5 text-sm rounded-xl font-bold tracking-wide transition-all shadow-lg flex items-center justify-center space-x-2 outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
                  isEditing
                    ? "bg-emerald-600 hover:bg-emerald-500 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]"
                }`}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNCHRONIZING...</span>
                  </>
                ) : isEditing ? (
                  <>
                    <Save className="w-4 h-4" />
                    <span>SAVE CONFIGURATION</span>
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4" />
                    <span>MODIFY PARAMETERS</span>
                  </>
                )}
              </button>

              {isEditing ? (
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedCollection(collection);
                  }}
                  className="flex-1 py-2.5 text-sm bg-white/90 border border-slate-200 text-slate-600 rounded-xl font-bold tracking-wide hover:bg-white hover:text-slate-900 transition-all flex items-center justify-center space-x-2 outline-none focus:ring-2 focus:ring-white/20"
                >
                  <X className="w-4 h-4" />
                  <span>ABORT CHANGES</span>
                </button>
              ) : (
                <>
                  {isTimedTest && (
                    <button
                      onClick={handleUploadQuestions}
                      className="flex-1 bg-purple-600 hover:bg-purple-500 text-slate-900 py-2.5 text-sm rounded-xl font-bold tracking-wide transition-all flex items-center justify-center space-x-2 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                    >
                      <Upload className="w-4 h-4" />
                      <span>MANAGE ASSESSMENTS</span>
                    </button>
                  )}
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex-1 py-2.5 text-sm bg-rose-600/20 border border-rose-500/30 text-rose-400 rounded-xl font-bold tracking-wide hover:bg-rose-600 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>PURGE RECORD</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Applicant Details Section */}
        <div className="glass-panel rounded-2xl border border-slate-200 overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="p-6 md:p-8 border-b border-slate-200 bg-white/90 flex flex-col xl:flex-row xl:items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 flex items-center space-x-3 tracking-wide mb-2">
                <div className="p-2 bg-indigo-500/20 rounded-lg border border-indigo-500/30">
                  <User className="w-6 h-6 text-indigo-400" />
                </div>
                <span>Candidate Matrix</span>
              </h2>
              <p className="text-indigo-300/80 text-sm font-medium pl-14">
                <span className="text-emerald-400">
                  {completedCount} Cleared
                </span>{" "}
                •{" "}
                <span className="text-amber-400">
                  {incompleteCount} Pending
                </span>{" "}
                • {students.length} Total
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 md:w-64 relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5 z-10" />
                <input
                  type="text"
                  placeholder="Search identities..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="relative w-full pl-12 pr-4 py-3 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 placeholder-gray-500 transition-all outline-none text-sm"
                />
              </div>

              <div className="relative group min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                  <Filter className="text-indigo-400 w-4 h-4" />
                </div>
                <select
                  value={applicantFilter}
                  onChange={(e) => setApplicantFilter(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 text-slate-900 outline-none text-sm appearance-none cursor-pointer transition-all hover:border-slate-300"
                >
                  <option value="all">All Candidates</option>
                  <option value="completed">Status: Cleared</option>
                  <option value="incomplete">Status: Pending</option>
                  <option value="high-to-low">Rank: Alpha (High)</option>
                  <option value="low-to-high">Rank: Omega (Low)</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={downloadExcel}
                  className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600 hover:border-emerald-500 text-emerald-400 hover:text-slate-900 px-5 py-3 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 shadow-sm hover:shadow-[0_0_15px_rgba(16,185,129,0.4)] text-sm"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">EXPORT</span>
                </button>

                <button
                  onClick={() => setShowAddApplicant(true)}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold tracking-wide flex items-center space-x-2 transition-all duration-300 shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">ADD RECORD</span>
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4 drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
              <p className="text-indigo-300 tracking-widest text-sm font-bold animate-pulse">
                DECRYPTING DATABASES...
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-white/90 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Identity
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Comms Link (ID)
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Secure Key (Tel)
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <span>Evaluation</span>
                        {applicantFilter === "high-to-low" && (
                          <ArrowDown className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                        {applicantFilter === "low-to-high" && (
                          <ArrowUp className="w-3.5 h-3.5 text-indigo-400" />
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Phase
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                      Access
                    </th>
                    <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-widest text-right whitespace-nowrap">
                      Override
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student._id}
                        className="hover:bg-white/[0.02] transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_10px_rgba(79,70,229,0.3)] flex-shrink-0 border border-slate-300 group-hover:scale-110 transition-transform">
                              <span className="font-bold text-slate-900 text-sm">
                                {student.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-bold text-slate-700 group-hover:text-slate-900 transition-colors">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 text-slate-500 group-hover:text-indigo-300 transition-colors">
                            <Mail className="w-4 h-4 text-indigo-500" />
                            <span className="text-sm font-medium">
                              {student.loginId}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-3 text-slate-500 group-hover:text-emerald-300 transition-colors">
                            <Phone className="w-4 h-4 text-emerald-500" />
                            <span className="text-sm font-medium font-mono">
                              {student.password}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col space-y-2">
                            <div className="flex items-center justify-between">
                              <span
                                className={`font-bold text-sm ${
                                  student.score >= 90
                                    ? "text-emerald-400"
                                    : student.score >= 70
                                      ? "text-blue-400"
                                      : student.score >= 50
                                        ? "text-amber-400"
                                        : "text-rose-400"
                                }`}
                              >
                                {student.score}%
                              </span>
                            </div>
                            <div className="w-32 bg-white rounded-full h-1.5 overflow-hidden">
                              <div
                                className={`h-full rounded-full relative ${
                                  student.score >= 90
                                    ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"
                                    : student.score >= 70
                                      ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]"
                                      : student.score >= 50
                                        ? "bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]"
                                        : "bg-rose-500 shadow-[0_0_10px_rgba(225,29,72,0.8)]"
                                }`}
                                style={{
                                  width: `${Math.min(student.score, 100)}%`,
                                }}
                              >
                                <div className="absolute inset-0 bg-slate-50 animate-[shimmer_2s_infinite]"></div>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            onClick={() => toggleCompletionStatus(student._id)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider transition-all flex items-center space-x-2 border shadow-lg ${
                              student.completionStatus === "Completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                                : "bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20"
                            }`}
                          >
                            {student.completionStatus === "Completed" ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                <span>CLEARED</span>
                              </>
                            ) : (
                              <>
                                <ClockIcon className="w-4 h-4 flex-shrink-0" />
                                <span>PENDING</span>
                              </>
                            )}
                          </button>
                          {student.completedAt && (
                            <div className="text-[10px] text-slate-500 mt-2 font-mono uppercase tracking-wider pl-1">
                              {new Date(
                                student.completedAt,
                              ).toLocaleDateString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider border flex items-center w-max space-x-1.5 ${
                              student.status === "Blocked"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_10px_rgba(225,29,72,0.2)]"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full ${student.status === "Blocked" ? "bg-rose-400 animate-pulse" : "bg-emerald-400"}`}
                            ></div>
                            <span>{student.status.toUpperCase()}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end space-x-3 opacity-50 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => toggleBlockStudent(student._id)}
                              className={`p-2 rounded-xl transition-all border shadow-sm ${
                                student.status === "Blocked"
                                  ? "bg-emerald-500/10 border-emerald-500/30 hover:bg-emerald-500 text-emerald-400 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                                  : "bg-rose-500/10 border-rose-500/30 hover:bg-rose-500 text-rose-400 hover:text-slate-900 hover:shadow-[0_0_15px_rgba(225,29,72,0.4)]"
                              }`}
                              title={
                                student.status === "Blocked"
                                  ? "Restore Access"
                                  : "Revoke Access"
                              }
                            >
                              {student.status === "Blocked" ? (
                                <CheckCircle className="w-4 h-4" />
                              ) : (
                                <Ban className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteUser(student._id)}
                              className="p-2 bg-white border border-gray-700 text-slate-500 rounded-xl hover:bg-rose-600 hover:border-rose-500 hover:text-slate-900 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(225,29,72,0.5)]"
                              title="Erase Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <User className="w-12 h-12 text-gray-600 mb-4" />
                          <p className="text-slate-500 font-medium tracking-wide">
                            NO RECORDS DETECTED IN SECTOR
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}

          <div className="px-6 py-4 border-t border-slate-200 bg-white/80">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-slate-500 tracking-wide uppercase">
                Displaying {filteredStudents.length} of {students.length} nodes
                {applicantFilter !== "all" &&
                  ` • Filter Active: ${applicantFilter}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="glass-panel rounded-2xl w-full max-w-md border border-rose-500/30 shadow-[0_0_50px_rgba(225,29,72,0.3)] animate-in fade-in zoom-in duration-200">
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-500/20 shadow-[0_0_20px_rgba(225,29,72,0.2)]">
                <Trash2 className="w-10 h-10 text-rose-500" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2 tracking-wide">
                CONFIRM DELETION
              </h3>
              <p className="text-slate-500 mb-8">
                Initiating protocol to purge collection{" "}
                <span className="text-slate-900 font-bold">
                  {collection.company}
                </span>
                . This action is irreversible. Proceed?
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-3.5 bg-white/90 border border-slate-200 text-slate-600 rounded-xl font-bold tracking-wide hover:bg-white hover:text-slate-900 transition-all outline-none"
                >
                  ABORT
                </button>
                <button
                  onClick={handleDeleteCollection}
                  className="flex-1 px-4 py-3.5 bg-rose-600 hover:bg-rose-500 text-slate-900 rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(225,29,72,0.4)]"
                >
                  PURGE
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Applicant Modal */}
      {showAddApplicant && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center z-50 p-4 transition-all duration-300">
          <div className="glass-panel rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-300 shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-in fade-in zoom-in duration-200">
            <div className="sticky top-0 bg-white/80 backdrop-blur-xl border-b border-slate-200 p-6 flex items-center justify-between z-10">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
                  <User className="w-5 h-5 text-indigo-400" />
                </div>
                <h2 className="text-lg font-bold text-slate-900 tracking-widest uppercase">
                  Inject Record
                </h2>
              </div>
              <button
                onClick={() => setShowAddApplicant(false)}
                className="p-2 hover:bg-white rounded-xl transition-colors text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">
                  Identity <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="text"
                    value={newApplicant.name}
                    onChange={(e) =>
                      handleNewApplicantChange("name", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-gray-600 transition-all outline-none"
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">
                  Comms Link (Login ID) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="email"
                    value={newApplicant.loginId}
                    onChange={(e) =>
                      handleNewApplicantChange(
                        "loginId",
                        e.target.value.toLowerCase(),
                      )
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-gray-600 transition-all outline-none"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">
                  Secure Key (Mobile) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="tel"
                    value={newApplicant.password}
                    onChange={(e) =>
                      handleNewApplicantChange("password", e.target.value)
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-gray-600 transition-all outline-none"
                    placeholder="Enter mobile number"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-2 tracking-widest uppercase">
                  Initial Evaluation Score
                </label>
                <div className="relative">
                  <Star className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newApplicant.score}
                    onChange={(e) =>
                      handleNewApplicantChange(
                        "score",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border border-slate-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 text-slate-900 placeholder-gray-600 transition-all outline-none"
                    placeholder="Score (0-100)"
                  />
                </div>
              </div>

              <div className="flex space-x-4 pt-4 border-t border-slate-200 mt-6">
                <button
                  onClick={() => setShowAddApplicant(false)}
                  className="flex-1 px-4 py-4 bg-white/90 border border-slate-200 text-slate-600 rounded-xl font-bold tracking-wide hover:bg-white hover:text-slate-900 transition-all outline-none"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleAddApplicant}
                  disabled={
                    !newApplicant.name ||
                    !newApplicant.loginId ||
                    !newApplicant.password
                  }
                  className="flex-1 px-4 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:text-slate-500 disabled:shadow-none text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex justify-center items-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>INJECT</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ColorDetailItem({ icon: Icon, label, value, gradient, iconColor }) {
  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
      <div
        className={`absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br ${gradient} rounded-full blur-[40px] opacity-40 group-hover:opacity-70 transition-opacity duration-500`}
      />
      <div className="relative z-10 flex items-start space-x-4">
        <div
          className={`p-3 rounded-xl bg-white/90 border border-slate-200 shadow-inner flex-shrink-0 ${iconColor}`}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1.5">
            {label}
          </p>
          <div className="text-slate-900 text-base">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default AdminDetails;
