import React, { useState, useMemo, useEffect } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Download,
  Search,
  Filter,
  Calendar,
  FileText,
  Trash2,
  Maximize,
  UploadCloud,
  CheckCircle2,
  ListChecks,
  ShieldCheck,
  ArrowRight,
  Info,
  Plus,
  Pencil,
  Save,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useTour } from "@/contexts/TourContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DownloadedFile {
  id: string;
  fileName: string;
  dataCount: number;
  downloadedDate: string;
  type: "Prospect" | "VAIS" | "LAL";
  fileSize: string;
  status: "completed" | "processing" | "failed";
}

// Mock data based on the image
const mockDownloadedFiles: DownloadedFile[] = [
  {
    id: "1",
    fileName: "prospect_list_tech_ctos",
    dataCount: 1247,
    downloadedDate: "26 Aug 2025",
    type: "Prospect",
    fileSize: "2.3 MB",
    status: "completed",
  },
  {
    id: "2",
    fileName: "vais_scores_q3",
    dataCount: 856,
    downloadedDate: "25 Aug 2025",
    type: "VAIS",
    fileSize: "1.8 MB",
    status: "completed",
  },
  {
    id: "3",
    fileName: "lal_expansion_healthcare",
    dataCount: 2103,
    downloadedDate: "25 Aug 2025",
    type: "LAL",
    fileSize: "4.1 MB",
    status: "completed",
  },
  {
    id: "4",
    fileName: "prospects_mid_market",
    dataCount: 734,
    downloadedDate: "24 Aug 2025",
    type: "Prospect",
    fileSize: "1.5 MB",
    status: "completed",
  },
  {
    id: "5",
    fileName: "vais_fintech_analysis",
    dataCount: 1456,
    downloadedDate: "24 Aug 2025",
    type: "VAIS",
    fileSize: "3.2 MB",
    status: "completed",
  },
  {
    id: "6",
    fileName: "test_list_europe",
    dataCount: 445,
    downloadedDate: "23 Aug 2025",
    type: "Prospect",
    fileSize: "0.9 MB",
    status: "completed",
  },
  {
    id: "7",
    fileName: "lal_tech_companies",
    dataCount: 1823,
    downloadedDate: "18 Aug 2025",
    type: "LAL",
    fileSize: "3.7 MB",
    status: "completed",
  },
  {
    id: "8",
    fileName: "vais_enterprise_scores",
    dataCount: 967,
    downloadedDate: "18 Aug 2025",
    type: "VAIS",
    fileSize: "2.1 MB",
    status: "completed",
  },
  {
    id: "9",
    fileName: "test_lal_demo",
    dataCount: 234,
    downloadedDate: "17 Aug 2025",
    type: "LAL",
    fileSize: "0.6 MB",
    status: "completed",
  },
  {
    id: "10",
    fileName: "test_vais_pilot",
    dataCount: 123,
    downloadedDate: "16 Aug 2025",
    type: "VAIS",
    fileSize: "0.3 MB",
    status: "completed",
  },
];

const fileTypes = ["All Types", "Prospect", "VAIS", "LAL"];

export default function MyDownloadedList() {
  const { startTour } = useTour();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<string | null>(null);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [crmDialogOpen, setCrmDialogOpen] = useState(false);
  const [crmFile, setCrmFile] = useState<DownloadedFile | null>(null);
  const [selectedCrm, setSelectedCrm] = useState<
    "hubspot" | "salesforce" | "marketo" | "zoho" | "pipedrive" | "dynamics365" | "msteams"
  >("hubspot");
  const [connectedCrms, setConnectedCrms] = useState<
    Array<"hubspot" | "salesforce" | "marketo" | "zoho" | "pipedrive" | "dynamics365" | "msteams">
  >([]);
  const [isUploadingCrm, setIsUploadingCrm] = useState(false);
  const [uploadDone, setUploadDone] = useState(false);
  const [sfAddOpen, setSfAddOpen] = useState(false);
  const [sfShowLogin, setSfShowLogin] = useState(false);
  const [salesforceAccounts, setSalesforceAccounts] = useState([
    { id: "sf-1", name: "Salesforce Account" },
  ] as { id: string; name: string }[]);
  const [hubspotAccounts, setHubspotAccounts] = useState([
    { id: "hs-1", name: "HubSpot Account" },
  ] as { id: string; name: string }[]);
  const [zohoAccounts, setZohoAccounts] = useState([
    { id: "zoho-1", name: "Zoho Account" },
  ] as { id: string; name: string }[]);
  const [pipedriveAccounts, setPipedriveAccounts] = useState([
    { id: "pipedrive-1", name: "Pipedrive Account" },
  ] as { id: string; name: string }[]);
  const [msDynamicsAccounts, setMsDynamicsAccounts] = useState([
    { id: "dynamics-1", name: "Dynamics 365 Account" },
  ] as { id: string; name: string }[]);
  const [msTeamsAccounts, setMsTeamsAccounts] = useState([
    {
      id: "msteams-1",
      name: "MS-Teams Channel",
      clientKey: "4fb94f8b-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      clientSecret: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      tenantId: "72f988bf-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
      redirectUri: "https://your-app.com/callback",
      teamId: "19:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@thread.tacv2",
      channelId: "19:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx@thread.tacv2",
    },
  ] as {
    id: string;
    name: string;
    clientKey: string;
    clientSecret: string;
    tenantId: string;
    redirectUri: string;
    teamId: string;
    channelId: string;
  }[]);
  const [hsNextId, setHsNextId] = useState(() => {
    const nums = [
      ...hubspotAccounts
        .map((a) => Number(String(a.id).replace(/^hs-/, "")))
        .filter((n) => !Number.isNaN(n)),
    ];
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });
  const [hsAddOpen, setHsAddOpen] = useState(false);
  const [hsThankOpen, setHsThankOpen] = useState(false);
  const [hsThankProcessing, setHsThankProcessing] = useState(false);
  const [hsThankProgress, setHsThankProgress] = useState(0);
  const [hsDisplayName, setHsDisplayName] = useState("");
  const [hsToken, setHsToken] = useState("");
  const [hsOwnerId, setHsOwnerId] = useState("");
  const isHsValid =
    hsDisplayName.trim().length > 0 &&
    hsToken.trim().length > 0 &&
    hsOwnerId.trim().length > 0;
  const [zohoAddOpen, setZohoAddOpen] = useState(false);
  const [zohoDisplayName, setZohoDisplayName] = useState("");
  const [zohoClientId, setZohoClientId] = useState("");
  const [zohoClientSecret, setZohoClientSecret] = useState("");
  const [zohoRedirectUrl, setZohoRedirectUrl] = useState("");
  const [zohoNextId, setZohoNextId] = useState(() => {
    const nums = [
      ...zohoAccounts
        .map((a) => Number(String(a.id).replace(/^zoho-/, "")))
        .filter((n) => !Number.isNaN(n)),
    ];
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });
  const [zohoThankOpen, setZohoThankOpen] = useState(false);
  const [zohoThankProcessing, setZohoThankProcessing] = useState(false);
  const [zohoThankProgress, setZohoThankProgress] = useState(0);
  const isZohoValid =
    zohoDisplayName.trim().length > 0 &&
    zohoClientId.trim().length > 0 &&
    zohoClientSecret.trim().length > 0 &&
    zohoRedirectUrl.trim().length > 0;
  const [pipedriveAddOpen, setPipedriveAddOpen] = useState(false);
  const [pipedriveDisplayName, setPipedriveDisplayName] = useState("");
  const [pipedriveApiToken, setPipedriveApiToken] = useState("");
  const [pipedriveNextId, setPipedriveNextId] = useState(() => {
    const nums = [
      ...pipedriveAccounts
        .map((a) => Number(String(a.id).replace(/^pipedrive-/, "")))
        .filter((n) => !Number.isNaN(n)),
    ];
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });
  const [pipedriveThankOpen, setPipedriveThankOpen] = useState(false);
  const [pipedriveThankProcessing, setPipedriveThankProcessing] =
    useState(false);
  const [pipedriveThankProgress, setPipedriveThankProgress] = useState(0);
  const isPipedriveValid =
    pipedriveDisplayName.trim().length > 0 &&
    pipedriveApiToken.trim().length > 0;

  const [msDynamicsAddOpen, setMsDynamicsAddOpen] = useState(false);
  const [msDynamicsDisplayName, setMsDynamicsDisplayName] = useState("");
  const [msDynamicsClientKey, setMsDynamicsClientKey] = useState("");
  const [msDynamicsClientSecret, setMsDynamicsClientSecret] = useState("");
  const [msDynamicsTenantId, setMsDynamicsTenantId] = useState("");
  const [msDynamicsInstanceUrl, setMsDynamicsInstanceUrl] = useState("");
  const [msDynamicsRedirectUri, setMsDynamicsRedirectUri] = useState("");
  const [msDynamicsNextId, setMsDynamicsNextId] = useState(() => {
    const nums = [
      ...msDynamicsAccounts
        .map((a) => Number(String(a.id).replace(/^dynamics-/, "")))
        .filter((n) => !Number.isNaN(n)),
    ];
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });
  const [msDynamicsThankOpen, setMsDynamicsThankOpen] = useState(false);
  const [msDynamicsThankProcessing, setMsDynamicsThankProcessing] =
    useState(false);
  const [msDynamicsThankProgress, setMsDynamicsThankProgress] = useState(0);
  const isMsDynamicsValid =
    msDynamicsDisplayName.trim().length > 0 &&
    msDynamicsClientKey.trim().length > 0 &&
    msDynamicsClientSecret.trim().length > 0 &&
    msDynamicsTenantId.trim().length > 0 &&
    msDynamicsInstanceUrl.trim().length > 0 &&
    msDynamicsRedirectUri.trim().length > 0;

  const [msTeamsAddOpen, setMsTeamsAddOpen] = useState(false);
  const [msTeamsDisplayName, setMsTeamsDisplayName] = useState("");
  const [msTeamsClientKey, setMsTeamsClientKey] = useState("");
  const [msTeamsClientSecret, setMsTeamsClientSecret] = useState("");
  const [msTeamsTenantId, setMsTeamsTenantId] = useState("");
  const [msTeamsRedirectUri, setMsTeamsRedirectUri] = useState("");
  const [msTeamsTeamId, setMsTeamsTeamId] = useState("");
  const [msTeamsChannelId, setMsTeamsChannelId] = useState("");
  const [msTeamsNextId, setMsTeamsNextId] = useState(() => {
    const nums = [
      ...msTeamsAccounts
        .map((a) => Number(String(a.id).replace(/^msteams-/, "")))
        .filter((n) => !Number.isNaN(n)),
    ];
    return (nums.length ? Math.max(...nums) : 0) + 1;
  });
  const [msTeamsThankOpen, setMsTeamsThankOpen] = useState(false);
  const [msTeamsThankProcessing, setMsTeamsThankProcessing] = useState(false);
  const [msTeamsThankProgress, setMsTeamsThankProgress] = useState(0);
  const [isMsTeamsEditing, setIsMsTeamsEditing] = useState(false);
  const [editingMsTeamsAccountId, setEditingMsTeamsAccountId] = useState<
    string | null
  >(null);
  const isMsTeamsValid =
    msTeamsDisplayName.trim().length > 0 &&
    msTeamsClientKey.trim().length > 0 &&
    msTeamsClientSecret.trim().length > 0 &&
    msTeamsTenantId.trim().length > 0 &&
    msTeamsRedirectUri.trim().length > 0 &&
    msTeamsTeamId.trim().length > 0 &&
    msTeamsChannelId.trim().length > 0;

  useEffect(() => {
    if (!hsThankOpen || !hsThankProcessing) return;
    let progress = 0;
    setHsThankProgress(progress);
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        setHsThankProgress(progress);
        clearInterval(interval);
        setTimeout(() => {
          setHsThankProcessing(false);
        }, 400);
      } else {
        setHsThankProgress(progress);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [hsThankOpen, hsThankProcessing]);

  useEffect(() => {
    if (!zohoThankOpen || !zohoThankProcessing) return;
    let progress = 0;
    setZohoThankProgress(progress);
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        setZohoThankProgress(progress);
        clearInterval(interval);
        setTimeout(() => {
          setZohoThankProcessing(false);
        }, 400);
      } else {
        setZohoThankProgress(progress);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [zohoThankOpen, zohoThankProcessing]);

  useEffect(() => {
    if (!pipedriveThankOpen || !pipedriveThankProcessing) return;
    let progress = 0;
    setPipedriveThankProgress(progress);
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        setPipedriveThankProgress(progress);
        clearInterval(interval);
        setTimeout(() => {
          setPipedriveThankProcessing(false);
        }, 400);
      } else {
        setPipedriveThankProgress(progress);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [pipedriveThankOpen, pipedriveThankProcessing]);

  useEffect(() => {
    if (!msDynamicsThankOpen || !msDynamicsThankProcessing) return;
    let progress = 0;
    setMsDynamicsThankProgress(progress);
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        setMsDynamicsThankProgress(progress);
        clearInterval(interval);
        setTimeout(() => {
          setMsDynamicsThankProcessing(false);
        }, 400);
      } else {
        setMsDynamicsThankProgress(progress);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [msDynamicsThankOpen, msDynamicsThankProcessing]);

  useEffect(() => {
    if (!msTeamsThankOpen || !msTeamsThankProcessing) return;
    let progress = 0;
    setMsTeamsThankProgress(progress);
    const interval = setInterval(() => {
      progress += 8;
      if (progress >= 100) {
        progress = 100;
        setMsTeamsThankProgress(progress);
        clearInterval(interval);
        setTimeout(() => {
          setMsTeamsThankProcessing(false);
        }, 400);
      } else {
        setMsTeamsThankProgress(progress);
      }
    }, 120);
    return () => clearInterval(interval);
  }, [msTeamsThankOpen, msTeamsThankProcessing]);

  // Filter and search logic
  const filteredFiles = useMemo(() => {
    let filtered = mockDownloadedFiles;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter((file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by type
    if (selectedType !== "All Types") {
      filtered = filtered.filter((file) => file.type === selectedType);
    }

    // Sort files
    filtered.sort((a, b) => {
      let comparison = 0;

      if (sortBy === "date") {
        comparison =
          new Date(a.downloadedDate).getTime() -
          new Date(b.downloadedDate).getTime();
      } else if (sortBy === "name") {
        comparison = a.fileName.localeCompare(b.fileName);
      } else if (sortBy === "count") {
        comparison = a.dataCount - b.dataCount;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, selectedType, sortBy, sortOrder]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Prospect":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "VAIS":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "LAL":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const downloadCsvForFile = (file: DownloadedFile) => {
    const headers = [
      "fileName",
      "type",
      "dataCount",
      "downloadedDate",
      "fileSize",
      "status",
    ];
    const row = [
      file.fileName,
      file.type,
      String(file.dataCount),
      file.downloadedDate,
      file.fileSize,
      file.status,
    ];
    const csv = `${headers.join(",")}\n${row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")}`;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${file.fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownload = (file: DownloadedFile) => {
    downloadCsvForFile(file);
  };

  const handleBulkDownloadClick = () => {
    if (selectedFiles.length === 0) return;
    const byId: Record<string, DownloadedFile> = Object.fromEntries(
      mockDownloadedFiles.map((f) => [f.id, f]),
    );
    selectedFiles.forEach((id) => {
      const f = byId[id];
      if (f) downloadCsvForFile(f);
    });
  };

  const handleDeleteClick = (fileId: string) => {
    setFileToDelete(fileId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (fileToDelete) {
      console.log(`Deleting file with ID: ${fileToDelete}`);
      // In real implementation, would remove file from list
      setFileToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleBulkDeleteClick = () => {
    if (selectedFiles.length > 0) {
      setBulkDeleteDialogOpen(true);
    }
  };

  const handleConfirmBulkDelete = () => {
    console.log(`Deleting files with IDs: ${selectedFiles.join(", ")}`);
    // In real implementation, would remove files from list
    setSelectedFiles([]);
    setBulkDeleteDialogOpen(false);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedFiles(filteredFiles.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleSelectFile = (fileId: string, checked: boolean) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  const isAllSelected =
    selectedFiles.length === filteredFiles.length && filteredFiles.length > 0;
  const isIndeterminate =
    selectedFiles.length > 0 && selectedFiles.length < filteredFiles.length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-valasys-orange to-valasys-orange-light rounded-lg flex items-center justify-center">
                <Download className="w-4 h-4 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Downloaded List
              </h1>
            </div>
            <p className="text-gray-600 mt-1">
              Manage and access all your downloaded files and data exports
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Badge variant="secondary" className="bg-blue-50 text-blue-700">
              <FileText className="w-3 h-3 mr-1" />
              Total Files:{" "}
              <span className="font-bold ml-1">{filteredFiles.length}</span>
            </Badge>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              <Download className="w-3 h-3 mr-1" />
              Records:{" "}
              <span className="font-bold ml-1">
                {filteredFiles
                  .reduce((total, file) => total + file.dataCount, 0)
                  .toLocaleString()}
              </span>
            </Badge>

            {/* Start Tour Button */}
            <div className="hidden sm:block">
              <Button
                size="sm"
                onClick={startTour}
                className="bg-valasys-orange text-white h-8"
              >
                Start Tour
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card data-tour="download-search-filters" className="mb-6">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center text-lg">
              <Filter className="w-5 h-5 mr-2 text-valasys-orange" />
              Search & Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Buttons Section */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm">
                  <Maximize className="w-4 h-4 mr-2" />
                  Full Screen
                </Button>
                {selectedFiles.length >= 2 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBulkDownloadClick}
                    className="text-valasys-orange border-valasys-orange hover:bg-valasys-orange hover:text-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Selected ({selectedFiles.length})
                  </Button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by file name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* File Type Filter */}
              <div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Select
                  value={`${sortBy}-${sortOrder}`}
                  onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split("-");
                    setSortBy(newSortBy);
                    setSortOrder(newSortOrder as "asc" | "desc");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date-desc">Date (Newest)</SelectItem>
                    <SelectItem value="date-asc">Date (Oldest)</SelectItem>
                    <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                    <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                    <SelectItem value="count-desc">Count (High-Low)</SelectItem>
                    <SelectItem value="count-asc">Count (Low-High)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Filter Button */}
              <div>
                <Button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedType("All Types");
                    setSortBy("date");
                    setSortOrder("desc");
                  }}
                  variant="outline"
                  className="w-full"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Downloads Table */}
        <Card data-tour="downloads-table">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-valasys-gray-50">
                    <TableHead className="w-12">
                      <div className="flex items-center justify-center">
                        <Checkbox
                          checked={isAllSelected}
                          ref={(el) => {
                            if (el) el.indeterminate = isIndeterminate;
                          }}
                          onCheckedChange={handleSelectAll}
                        />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "name") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("name");
                          setSortOrder("asc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        File Name
                        <div className="ml-2">
                          {sortBy === "name" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "count") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("count");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        Data Count
                        <div className="ml-2">
                          {sortBy === "count" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-valasys-gray-900 cursor-pointer hover:bg-valasys-gray-100 transition-colors"
                      onClick={() => {
                        if (sortBy === "date") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                        } else {
                          setSortBy("date");
                          setSortOrder("desc");
                        }
                      }}
                    >
                      <div className="flex items-center justify-between">
                        Downloaded Date
                        <div className="ml-2">
                          {sortBy === "date" ? (
                            <span className="text-valasys-orange">
                              {sortOrder === "asc" ? "↑" : "↓"}
                            </span>
                          ) : (
                            <span className="text-valasys-gray-400">↕</span>
                          )}
                        </div>
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900">
                      Type
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900">
                      File Size
                    </TableHead>
                    <TableHead className="font-semibold text-valasys-gray-900 text-center">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFiles.length > 0 ? (
                    filteredFiles.map((file) => (
                      <TableRow
                        key={file.id}
                        data-tour={
                          file.type === "LAL" ? "download-lal-row" : undefined
                        }
                        className={cn(
                          "hover:bg-valasys-gray-50 transition-colors",
                          selectedFiles.includes(file.id) &&
                            "bg-valasys-orange/5",
                        )}
                      >
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedFiles.includes(file.id)}
                              onCheckedChange={(checked) =>
                                handleSelectFile(file.id, checked as boolean)
                              }
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-valasys-gray-500" />
                            <span className="text-valasys-gray-900">
                              {file.fileName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-semibold text-valasys-gray-700">
                            {file.dataCount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-1 text-valasys-gray-600">
                            <Calendar className="h-3 w-3" />
                            <span>{file.downloadedDate}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "font-medium",
                              getTypeColor(file.type),
                            )}
                          >
                            {file.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-valasys-gray-600 text-sm">
                            {file.fileSize}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(file)}
                              className="h-8 w-8 p-0 text-valasys-orange border-valasys-orange hover:bg-valasys-orange hover:text-white"
                              title="Download file"
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  data-tour="send-to-crm-button"
                                  variant="outline"
                                  size="sm"
                                  className="h-8 px-2 text-blue-700 border-blue-300 hover:bg-blue-600 hover:text-white"
                                  title="Send to CRM"
                                >
                                  <UploadCloud className="h-3 w-3 mr-1" />
                                  Send to CRM
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-gray-200 shadow-xl">
                                <div className="bg-gray-50/80 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center">
                                    <Settings className="w-3 h-3 mr-2" />
                                    CRM Integrations
                                  </h3>
                                  <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 text-[9px] border-none px-1.5 h-4">
                                    7 Platforms
                                  </Badge>
                                </div>
                                <div className="p-1.5 space-y-1">
                                  {/* Salesforce */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-blue-50/50 focus:bg-blue-50/50 data-[state=open]:bg-blue-50 border-transparent hover:border-blue-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2F28d611916abe4e3bb3b827ad1de3c806?format=webp&width=800&height=1200"
                                          alt="Salesforce"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          Salesforce
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {salesforceAccounts.length}{" "}
                                          {salesforceAccounts.length === 1
                                            ? "Account"
                                            : "Accounts"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {salesforceAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("salesforce");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-blue-500" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <button
                                              aria-label="Delete account"
                                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setSalesforceAccounts((prev) =>
                                                  prev.filter(
                                                    (a) => a.id !== acc.id,
                                                  ),
                                                );
                                              }}
                                              title="Delete account"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#00A1E0] text-white hover:bg-[#008fcc] focus:bg-[#008fcc] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setSfAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Account
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                  {/* HubSpot */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-orange-50/50 focus:bg-orange-50/50 data-[state=open]:bg-orange-50 border-transparent hover:border-orange-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2F40b715f86ba846e3a21fae42e8f6e64d?format=webp&width=800&height=1200"
                                          alt="HubSpot"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          HubSpot
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {hubspotAccounts.length}{" "}
                                          {hubspotAccounts.length === 1
                                            ? "Account"
                                            : "Accounts"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {hubspotAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("hubspot");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-orange-50/50 hover:border-orange-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-[#FF7A59]" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <button
                                              aria-label="Delete account"
                                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setHubspotAccounts((prev) =>
                                                  prev.filter(
                                                    (a) => a.id !== acc.id,
                                                  ),
                                                );
                                              }}
                                              title="Delete account"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#FF7A59] text-white hover:bg-[#e7674f] focus:bg-[#e7674f] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setHsAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Account
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                  {/* Zoho */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-blue-50/50 focus:bg-blue-50/50 data-[state=open]:bg-blue-50 border-transparent hover:border-blue-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2Ff9461315c70742a7bc20336186312fae?format=webp&width=800&height=1200"
                                          alt="Zoho"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          Zoho
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {zohoAccounts.length}{" "}
                                          {zohoAccounts.length === 1
                                            ? "Account"
                                            : "Accounts"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {zohoAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("zoho");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-[#026AA7]" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <button
                                              aria-label="Delete account"
                                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setZohoAccounts((prev) =>
                                                  prev.filter(
                                                    (a) => a.id !== acc.id,
                                                  ),
                                                );
                                              }}
                                              title="Delete account"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#026AA7] text-white hover:bg-[#01529b] focus:bg-[#01529b] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setZohoAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Account
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                  {/* Pipedrive */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-emerald-50/50 focus:bg-emerald-50/50 data-[state=open]:bg-emerald-50 border-transparent hover:border-emerald-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2F89a50adb31fb4b0a86972a2871fe141a?format=webp&width=800&height=1200"
                                          alt="Pipedrive"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          Pipedrive
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {pipedriveAccounts.length}{" "}
                                          {pipedriveAccounts.length === 1
                                            ? "Account"
                                            : "Accounts"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {pipedriveAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("pipedrive");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-emerald-50/50 hover:border-emerald-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-[#2ED8B6]" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <button
                                              aria-label="Delete account"
                                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setPipedriveAccounts((prev) =>
                                                  prev.filter(
                                                    (a) => a.id !== acc.id,
                                                  ),
                                                );
                                              }}
                                              title="Delete account"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#2ED8B6] text-white hover:bg-[#25c5a4] focus:bg-[#25c5a4] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setPipedriveAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Account
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                  {/* Dynamics 365 */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-blue-50/50 focus:bg-blue-50/50 data-[state=open]:bg-blue-50 border-transparent hover:border-blue-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2Fd6509f15327e401cad5147a39dbde9a1?format=webp&width=800&height=1200"
                                          alt="Dynamics 365"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          Dynamics 365
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {msDynamicsAccounts.length}{" "}
                                          {msDynamicsAccounts.length === 1
                                            ? "Account"
                                            : "Accounts"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {msDynamicsAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("dynamics365");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-blue-50/50 hover:border-blue-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-[#002050]" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <button
                                              aria-label="Delete account"
                                              className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                              onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setMsDynamicsAccounts((prev) =>
                                                  prev.filter(
                                                    (a) => a.id !== acc.id,
                                                  ),
                                                );
                                              }}
                                              title="Delete account"
                                            >
                                              <Trash2 className="h-4 w-4" />
                                            </button>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#002050] text-white hover:bg-[#00183d] focus:bg-[#00183d] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setMsDynamicsAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Account
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>
                                  {/* MS-Teams */}
                                  <DropdownMenuSub>
                                    <DropdownMenuSubTrigger className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-indigo-50/50 focus:bg-indigo-50/50 data-[state=open]:bg-indigo-50 border-transparent hover:border-indigo-100 border">
                                      <div className="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center p-1.5 flex-shrink-0">
                                        <img
                                          src="https://cdn.builder.io/api/v1/image/assets%2Fc1d6abb8b7ed4c9594742cec5cf96030%2F3b4884a105cf45798527733b74a30228?format=webp&width=800&height=1200"
                                          alt="MS-Teams"
                                          className="w-full h-full object-contain"
                                        />
                                      </div>
                                      <div className="flex flex-col text-left overflow-hidden">
                                        <span className="text-sm font-semibold text-gray-700">
                                          MS-Teams
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                          {msTeamsAccounts.length}{" "}
                                          {msTeamsAccounts.length === 1
                                            ? "Channel"
                                            : "Channels"}{" "}
                                          Connected
                                        </span>
                                      </div>
                                    </DropdownMenuSubTrigger>
                                    <DropdownMenuSubContent className="w-80 p-2 rounded-xl shadow-lg border-gray-200">
                                      {msTeamsAccounts.map((acc) => (
                                        <DropdownMenuItem
                                          key={acc.id}
                                          onSelect={() => {
                                            setCrmFile(file);
                                            setSelectedCrm("msteams");
                                            setCrmDialogOpen(true);
                                          }}
                                          className="p-0 mb-1 last:mb-0 focus:bg-transparent"
                                        >
                                          <div className="flex items-center justify-between w-full rounded-md border border-gray-100 px-3 py-2.5 hover:bg-indigo-50/50 hover:border-indigo-200 transition-colors">
                                            <div className="flex items-center gap-2">
                                              <div className="w-2 h-2 rounded-full bg-[#4B53BC]" />
                                              <span className="text-sm font-medium text-gray-700">
                                                {acc.name}
                                              </span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                              <button
                                                aria-label="Edit channel"
                                                className="text-gray-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  setIsMsTeamsEditing(true);
                                                  setEditingMsTeamsAccountId(
                                                    acc.id,
                                                  );
                                                  setMsTeamsDisplayName(
                                                    acc.name,
                                                  );
                                                  setMsTeamsClientKey(
                                                    acc.clientKey,
                                                  );
                                                  setMsTeamsClientSecret(
                                                    acc.clientSecret,
                                                  );
                                                  setMsTeamsTenantId(
                                                    acc.tenantId,
                                                  );
                                                  setMsTeamsRedirectUri(
                                                    acc.redirectUri,
                                                  );
                                                  setMsTeamsTeamId(acc.teamId);
                                                  setMsTeamsChannelId(
                                                    acc.channelId,
                                                  );
                                                  setMsTeamsAddOpen(true);
                                                }}
                                                title="Edit channel"
                                              >
                                                <Pencil className="h-4 w-4" />
                                              </button>
                                              <button
                                                aria-label="Delete channel"
                                                className="text-gray-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                                onClick={(e) => {
                                                  e.preventDefault();
                                                  e.stopPropagation();
                                                  setMsTeamsAccounts((prev) =>
                                                    prev.filter(
                                                      (a) => a.id !== acc.id,
                                                    ),
                                                  );
                                                }}
                                                title="Delete channel"
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </button>
                                            </div>
                                          </div>
                                        </DropdownMenuItem>
                                      ))}
                                      <DropdownMenuSeparator className="my-2 bg-gray-100" />
                                      <DropdownMenuItem
                                        className="w-full px-4 py-2.5 rounded-lg bg-[#4B53BC] text-white hover:bg-[#3f46a3] focus:bg-[#3f46a3] focus:text-white flex items-center justify-center font-bold text-sm shadow-sm transition-all active:scale-[0.98]"
                                        onSelect={(e) => {
                                          e.preventDefault();
                                          setMsTeamsAddOpen(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Channel
                                      </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                  </DropdownMenuSub>

                                  {/* Marketo */}
                                  <DropdownMenuItem
                                    onSelect={() => {
                                      setCrmFile(file);
                                      setSelectedCrm("marketo");
                                      setCrmDialogOpen(true);
                                    }}
                                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-purple-50/50 focus:bg-purple-50/50 border-transparent hover:border-purple-100 border"
                                  >
                                    <div className="w-8 h-8 rounded-lg bg-[#5C4BAF] shadow-sm flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0">
                                      MK
                                    </div>
                                    <div className="flex flex-col text-left overflow-hidden">
                                      <span className="text-sm font-semibold text-gray-700">
                                        Marketo
                                      </span>
                                      <span className="text-[9px] text-gray-400 font-medium uppercase truncate">
                                        Import via API
                                      </span>
                                    </div>
                                  </DropdownMenuItem>
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-3">
                          <FileText className="h-12 w-12 text-valasys-gray-300" />
                          <p className="text-valasys-gray-500 font-medium">
                            No files found
                          </p>
                          <p className="text-valasys-gray-400 text-sm">
                            Try adjusting your search or filter criteria
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Footer Information */}
        <div className="mt-6 text-center text-sm text-valasys-gray-500">
          <p>
            Files are automatically removed after 30 days. Download important
            files to your local storage.
          </p>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this file? This action cannot be
                undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Bulk Delete Confirmation Dialog */}
        <Dialog
          open={bulkDeleteDialogOpen}
          onOpenChange={setBulkDeleteDialogOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Bulk Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete {selectedFiles.length} selected
                file(s)? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setBulkDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleConfirmBulkDelete}>
                Delete {selectedFiles.length} Files
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Salesforce Add Account Dialog */}
        <Dialog
          open={sfAddOpen}
          onOpenChange={(open) => {
            setSfAddOpen(open);
            if (!open) setSfShowLogin(false);
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Salesforce Connection</DialogTitle>
              <DialogDescription>
                Add a Salesforce account or follow the steps to generate
                credentials.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-[#00A1E0]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#00A1E0] text-white text-xs font-bold">
                SF
              </span>
              <div className="text-sm text-blue-900">
                Securely connect your Salesforce to enable one‑click exports.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" /> Add Salesforce Account
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                {!sfShowLogin ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                      <div>
                        <Label htmlFor="sf-client-key">Client Key</Label>
                        <Input
                          id="sf-client-key"
                          placeholder="Enter Client Key"
                        />
                      </div>
                      <div>
                        <Label htmlFor="sf-client-secret">Client Secret</Label>
                        <Input
                          id="sf-client-secret"
                          type="password"
                          placeholder="Enter Client Secret"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Stored securely; never shared.
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <Label htmlFor="sf-redirect-url">Redirection URL</Label>
                        <Input
                          id="sf-redirect-url"
                          placeholder="https://your-app.com/oauth/callback"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          OAuth redirect/callback URL configured in Salesforce.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setSfAddOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white"
                        onClick={() => setSfShowLogin(true)}
                      >
                        <ArrowRight className="h-4 w-4 mr-2" /> Next
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="mt-3 rounded-lg border border-valasys-gray-200 overflow-hidden">
                    <div className="flex items-center justify-between px-3 py-2 bg-valasys-gray-50 border-b border-valasys-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded bg-[#00A1E0] text-white text-[10px] font-bold">
                          SF
                        </span>
                        <span className="text-sm font-medium">
                          Salesforce Login
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSfShowLogin(false)}
                        >
                          Back
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSfAddOpen(false)}
                        >
                          Close
                        </Button>
                      </div>
                    </div>
                    <div className="h-[70vh] bg-white">
                      <iframe
                        src="https://login.salesforce.com/"
                        title="Salesforce Login"
                        className="w-full h-full"
                      />
                    </div>
                  </div>
                )}
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-900 mt-3 text-sm">
                  Follow these steps in Salesforce to create credentials.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      In Salesforce, go to Setup → App Manager → New Connected
                      App.
                    </li>
                    <li>
                      Enable OAuth settings, add callback URL, and select scopes
                      (api, refresh_token).
                    </li>
                    <li>
                      Save and copy Consumer Key (Client Key) and Consumer
                      Secret.
                    </li>
                    <li>
                      Complete OAuth to obtain Access Token and Refresh Token;
                      note Instance URL.
                    </li>
                    <li>
                      Use Base URL: https://login.salesforce.com (or your SSO
                      domain if required).
                    </li>
                    <li>Paste values into the form and click Add Account.</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* HubSpot Add Account Dialog */}
        <Dialog
          open={hsAddOpen}
          onOpenChange={(open) => {
            setHsAddOpen(open);
            if (!open) {
              setHsDisplayName("");
              setHsToken("");
              setHsOwnerId("");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>HubSpot Connection</DialogTitle>
              <DialogDescription>
                Add a HubSpot account using a Private App token, or follow the
                steps to generate one.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-orange-200 bg-gradient-to-r from-orange-50 to-[#FF7A59]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#FF7A59] text-white text-xs font-bold">
                HS
              </span>
              <div className="text-sm text-orange-900">
                Securely connect your HubSpot to enable one‑click exports.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" /> Add HubSpot Account
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <Label htmlFor="hs-display-name">
                      Display Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hs-display-name"
                      value={hsDisplayName}
                      onChange={(e) => setHsDisplayName(e.target.value)}
                      placeholder="e.g., HubSpot Main"
                      required
                      aria-invalid={hsDisplayName.trim().length === 0}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hs-owner-id">
                      Owner ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hs-owner-id"
                      value={hsOwnerId}
                      onChange={(e) => setHsOwnerId(e.target.value)}
                      placeholder="Enter Owner ID"
                      required
                      aria-invalid={hsOwnerId.trim().length === 0}
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="hs-token">
                      Access Token <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="hs-token"
                      type="password"
                      value={hsToken}
                      onChange={(e) => setHsToken(e.target.value)}
                      placeholder="Enter HubSpot Private App Token"
                      required
                      aria-invalid={hsToken.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Stored securely; never shared.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button variant="outline" onClick={() => setHsAddOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    disabled={!isHsValid}
                    className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (!isHsValid) return;
                      setHubspotAccounts((prev) => [
                        ...prev,
                        { id: `hs-${hsNextId}`, name: hsDisplayName.trim() },
                      ]);
                      setHsNextId((n) => n + 1);
                      setHsDisplayName("");
                      setHsToken("");
                      setHsOwnerId("");
                      setHsAddOpen(false);
                      setHsThankOpen(true);
                      setHsThankProcessing(true);
                      setHsThankProgress(0);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Connection
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-orange-200 bg-orange-50 p-3 text-orange-900 mt-3 text-sm">
                  Follow these steps in HubSpot to create a Private App token.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      In HubSpot, go to Settings → Integrations → Private Apps.
                    </li>
                    <li>
                      Create a Private App and generate a token with CRM scopes.
                    </li>
                    <li>Copy the token and store it securely.</li>
                    <li>Paste the token above and click Save.</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* HubSpot Thank You Dialog */}
        <Dialog
          open={hsThankOpen}
          onOpenChange={(open) => {
            setHsThankOpen(open);
            if (!open) {
              setHsThankProcessing(false);
              setHsThankProgress(0);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription>
                {hsThankProcessing
                  ? "Processing your HubSpot connection..."
                  : "Your HubSpot connection successfully Completed"}
              </DialogDescription>
            </DialogHeader>

            {hsThankProcessing ? (
              <div className="space-y-3">
                <Progress value={hsThankProgress} />
                <div className="text-xs text-gray-500">
                  Please wait, this may take a few seconds…
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 ai-pulse" />
                <span className="text-sm text-gray-800">
                  Your HubSpot connection successfully Completed
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setHsThankOpen(false)}
                className="bg-valasys-orange text-white hover:bg-valasys-orange/90"
                disabled={hsThankProcessing}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Zoho Add Account Dialog */}
        <Dialog
          open={zohoAddOpen}
          onOpenChange={(open) => {
            setZohoAddOpen(open);
            if (!open) {
              setZohoDisplayName("");
              setZohoClientId("");
              setZohoClientSecret("");
              setZohoRedirectUrl("");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Zoho Connection</DialogTitle>
              <DialogDescription>
                Add a Zoho account using OAuth credentials to enable one-click
                exports.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-[#026AA7]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#026AA7] text-white text-xs font-bold">
                ZH
              </span>
              <div className="text-sm text-blue-900">
                Securely connect your Zoho CRM to enable one‑click exports.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" /> Add Zoho Account
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <Label htmlFor="zoho-display-name">
                      Display Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zoho-display-name"
                      value={zohoDisplayName}
                      onChange={(e) => setZohoDisplayName(e.target.value)}
                      placeholder="e.g., Zoho Main"
                      required
                      aria-invalid={zohoDisplayName.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A friendly name to identify this Zoho account.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="zoho-client-id">
                      Client ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zoho-client-id"
                      value={zohoClientId}
                      onChange={(e) => setZohoClientId(e.target.value)}
                      placeholder="Enter Client ID"
                      required
                      aria-invalid={zohoClientId.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Client ID generated in the Zoho Developer
                      Console for your application.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="zoho-client-secret">
                      Client Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zoho-client-secret"
                      type="password"
                      value={zohoClientSecret}
                      onChange={(e) => setZohoClientSecret(e.target.value)}
                      placeholder="Enter Client Secret"
                      required
                      aria-invalid={zohoClientSecret.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Client Secret associated with your Zoho
                      application. Keep this value confidential.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="zoho-redirect-url">
                      Redirect URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="zoho-redirect-url"
                      value={zohoRedirectUrl}
                      onChange={(e) => setZohoRedirectUrl(e.target.value)}
                      placeholder="https://your-app.com/oauth/callback"
                      required
                      aria-invalid={zohoRedirectUrl.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the redirect URL configured in your Zoho
                      application. Zoho will redirect users to this URL after
                      authorization.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setZohoAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isZohoValid}
                    className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (!isZohoValid) return;
                      setZohoAccounts((prev) => [
                        ...prev,
                        {
                          id: `zoho-${zohoNextId}`,
                          name: zohoDisplayName.trim(),
                        },
                      ]);
                      setZohoNextId((n) => n + 1);
                      setZohoDisplayName("");
                      setZohoClientId("");
                      setZohoClientSecret("");
                      setZohoRedirectUrl("");
                      setZohoAddOpen(false);
                      setZohoThankOpen(true);
                      setZohoThankProcessing(true);
                      setZohoThankProgress(0);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Connection
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-900 mt-3 text-sm">
                  Follow these steps in Zoho to create OAuth credentials.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>Log in to the Zoho Developer Console.</li>
                    <li>
                      Create a new OAuth application and configure OAuth
                      settings.
                    </li>
                    <li>
                      Add your application's Redirect URL to the authorized
                      redirect URLs.
                    </li>
                    <li>Generate and copy your Client ID and Client Secret.</li>
                    <li>
                      Paste the values into the form above and click Save
                      Connection.
                    </li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Zoho Thank You Dialog */}
        <Dialog
          open={zohoThankOpen}
          onOpenChange={(open) => {
            setZohoThankOpen(open);
            if (!open) {
              setZohoThankProcessing(false);
              setZohoThankProgress(0);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription>
                {zohoThankProcessing
                  ? "Processing your Zoho connection..."
                  : "Your Zoho connection successfully Completed"}
              </DialogDescription>
            </DialogHeader>

            {zohoThankProcessing ? (
              <div className="space-y-3">
                <Progress value={zohoThankProgress} />
                <div className="text-xs text-gray-500">
                  Please wait, this may take a few seconds…
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 ai-pulse" />
                <span className="text-sm text-gray-800">
                  Your Zoho connection successfully Completed
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setZohoThankOpen(false)}
                className="bg-valasys-orange text-white hover:bg-valasys-orange/90"
                disabled={zohoThankProcessing}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Pipedrive Add Account Dialog */}
        <Dialog
          open={pipedriveAddOpen}
          onOpenChange={(open) => {
            setPipedriveAddOpen(open);
            if (!open) {
              setPipedriveDisplayName("");
              setPipedriveApiToken("");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Pipedrive Connection</DialogTitle>
              <DialogDescription>
                Add a Pipedrive account using API credentials to enable
                one-click exports.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-teal-200 bg-gradient-to-r from-teal-50 to-[#2ED8B6]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#2ED8B6] text-white text-xs font-bold">
                PD
              </span>
              <div className="text-sm text-teal-900">
                Securely connect your Pipedrive CRM to enable one‑click exports.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" /> Add Pipedrive Account
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="grid grid-cols-1 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <Label htmlFor="pipedrive-display-name">
                      Display Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pipedrive-display-name"
                      value={pipedriveDisplayName}
                      onChange={(e) => setPipedriveDisplayName(e.target.value)}
                      placeholder="e.g., Pipedrive Main"
                      required
                      aria-invalid={pipedriveDisplayName.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A friendly name to identify this Pipedrive account.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="pipedrive-api-token">
                      API Token <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="pipedrive-api-token"
                      type="password"
                      value={pipedriveApiToken}
                      onChange={(e) => setPipedriveApiToken(e.target.value)}
                      placeholder="Enter Pipedrive API Token"
                      required
                      aria-invalid={pipedriveApiToken.trim().length === 0}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Your Pipedrive API token from Settings → Personal Settings
                      → API.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPipedriveAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isPipedriveValid}
                    className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (!isPipedriveValid) return;
                      setPipedriveAccounts((prev) => [
                        ...prev,
                        {
                          id: `pipedrive-${pipedriveNextId}`,
                          name: pipedriveDisplayName.trim(),
                        },
                      ]);
                      setPipedriveNextId((n) => n + 1);
                      setPipedriveDisplayName("");
                      setPipedriveApiToken("");
                      setPipedriveAddOpen(false);
                      setPipedriveThankOpen(true);
                      setPipedriveThankProcessing(true);
                      setPipedriveThankProgress(0);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Connection
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-teal-200 bg-teal-50 p-3 text-teal-900 mt-3 text-sm">
                  Follow these steps in Pipedrive to create an API token.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      Log in to your Pipedrive account and navigate to Settings.
                    </li>
                    <li>
                      Go to Personal Settings → API and generate a new API
                      token.
                    </li>
                    <li>Copy your API token and keep it secure.</li>
                    <li>
                      Paste the API token into the form above and click Save
                      Connection.
                    </li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Pipedrive Thank You Dialog */}
        <Dialog
          open={pipedriveThankOpen}
          onOpenChange={(open) => {
            setPipedriveThankOpen(open);
            if (!open) {
              setPipedriveThankProcessing(false);
              setPipedriveThankProgress(0);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription>
                {pipedriveThankProcessing
                  ? "Processing your Pipedrive connection..."
                  : "Your Pipedrive connection successfully Completed"}
              </DialogDescription>
            </DialogHeader>

            {pipedriveThankProcessing ? (
              <div className="space-y-3">
                <Progress value={pipedriveThankProgress} />
                <div className="text-xs text-gray-500">
                  Please wait, this may take a few seconds…
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 ai-pulse" />
                <span className="text-sm text-gray-800">
                  Your Pipedrive connection successfully Completed
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setPipedriveThankOpen(false)}
                className="bg-valasys-orange text-white hover:bg-valasys-orange/90"
                disabled={pipedriveThankProcessing}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Microsoft Dynamics 365 Add Account Dialog */}
        <Dialog
          open={msDynamicsAddOpen}
          onOpenChange={(open) => {
            setMsDynamicsAddOpen(open);
            if (!open) {
              setMsDynamicsDisplayName("");
              setMsDynamicsClientKey("");
              setMsDynamicsClientSecret("");
              setMsDynamicsTenantId("");
              setMsDynamicsInstanceUrl("");
              setMsDynamicsRedirectUri("");
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Microsoft Dynamics 365 Connection</DialogTitle>
              <DialogDescription>
                Add a Microsoft Dynamics 365 account using OAuth credentials to
                enable one-click exports.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-[#002050]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#002050] text-white text-xs font-bold">
                D3
              </span>
              <div className="text-sm text-blue-900">
                Securely connect your Microsoft Dynamics 365 CRM to enable
                one‑click exports.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" /> Add Dynamics 365 Account
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <Label htmlFor="ms-display-name">
                      Display Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-display-name"
                      value={msDynamicsDisplayName}
                      onChange={(e) => setMsDynamicsDisplayName(e.target.value)}
                      placeholder="e.g., Dynamics Main"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A friendly name to identify this Microsoft Dynamics 365
                      account.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ms-client-key">
                      Client Key <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-client-key"
                      value={msDynamicsClientKey}
                      onChange={(e) => setMsDynamicsClientKey(e.target.value)}
                      placeholder="Enter Client Key"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Application (client) ID from your Azure Portal
                      app registration.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ms-client-secret">
                      Client Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-client-secret"
                      type="password"
                      value={msDynamicsClientSecret}
                      onChange={(e) =>
                        setMsDynamicsClientSecret(e.target.value)
                      }
                      placeholder="Enter Client Secret"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Client Secret value generated in the Azure
                      Portal. Keep this value confidential.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ms-tenant-id">
                      Tenant ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-tenant-id"
                      value={msDynamicsTenantId}
                      onChange={(e) => setMsDynamicsTenantId(e.target.value)}
                      placeholder="Enter Tenant ID"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Directory (tenant) ID from your Azure Portal.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ms-instance-url">
                      Instance URL <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-instance-url"
                      value={msDynamicsInstanceUrl}
                      onChange={(e) => setMsDynamicsInstanceUrl(e.target.value)}
                      placeholder="https://org.crm.dynamics.com"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the base URL of your Dynamics 365 instance (e.g.,
                      https://org.crm.dynamics.com).
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="ms-redirect-uri">
                      Redirect URI <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="ms-redirect-uri"
                      value={msDynamicsRedirectUri}
                      onChange={(e) => setMsDynamicsRedirectUri(e.target.value)}
                      placeholder="https://your-app.com/callback"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Redirect URI configured in your Azure app
                      registration.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMsDynamicsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isMsDynamicsValid}
                    className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (!isMsDynamicsValid) return;
                      setMsDynamicsAccounts((prev) => [
                        ...prev,
                        {
                          id: `dynamics-${msDynamicsNextId}`,
                          name: msDynamicsDisplayName.trim(),
                        },
                      ]);
                      setMsDynamicsNextId((n) => n + 1);
                      setMsDynamicsDisplayName("");
                      setMsDynamicsClientKey("");
                      setMsDynamicsClientSecret("");
                      setMsDynamicsTenantId("");
                      setMsDynamicsInstanceUrl("");
                      setMsDynamicsRedirectUri("");
                      setMsDynamicsAddOpen(false);
                      setMsDynamicsThankOpen(true);
                      setMsDynamicsThankProcessing(true);
                      setMsDynamicsThankProgress(0);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" /> Save Connection
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-900 mt-3 text-sm">
                  Follow these steps in Azure Portal to create credentials for
                  Dynamics 365.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      Log in to the Azure Portal and navigate to Microsoft
                      Entra ID (formerly Azure AD).
                    </li>
                    <li>
                      Go to App registrations and create a new registration.
                    </li>
                    <li>
                      Set the Redirect URI as a Web platform with your
                      callback URL.
                    </li>
                    <li>
                      In Certificates & secrets, create a new client secret
                      and copy its value.
                    </li>
                    <li>
                      In API permissions, add permissions for Dynamics CRM
                      (user_impersonation).
                    </li>
                    <li>
                      Copy the Application (client) ID and Directory (tenant)
                      ID.
                    </li>
                    <li>
                      Paste all values into the form above and click Save
                      Connection.
                    </li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Microsoft Teams Add Channel Dialog */}
        <Dialog
          open={msTeamsAddOpen}
          onOpenChange={(open) => {
            setMsTeamsAddOpen(open);
            if (!open) {
              setMsTeamsDisplayName("");
              setMsTeamsClientKey("");
              setMsTeamsClientSecret("");
              setMsTeamsTenantId("");
              setMsTeamsRedirectUri("");
              setMsTeamsTeamId("");
              setMsTeamsChannelId("");
              setIsMsTeamsEditing(false);
              setEditingMsTeamsAccountId(null);
            }
          }}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Microsoft Teams Connection</DialogTitle>
              <DialogDescription>
                Add a Microsoft Teams channel using OAuth credentials to enable
                one-click exports.
              </DialogDescription>
            </DialogHeader>
            <div className="mt-2 rounded-lg border border-blue-200 bg-gradient-to-r from-blue-50 to-[#4B53BC]/10 p-3 flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded bg-[#4B53BC] text-white text-xs font-bold">
                TM
              </span>
              <div className="text-sm text-blue-900">
                Securely connect your MS-Teams to enable one‑click exports to
                channels.
              </div>
            </div>
            <Tabs defaultValue="add">
              <TabsList className="mt-3 bg-transparent p-0 border-b border-valasys-gray-200">
                <TabsTrigger
                  value="add"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <ListChecks className="h-4 w-4" />{" "}
                  {isMsTeamsEditing ? "Edit Teams Account" : "Add Teams Account"}
                </TabsTrigger>
                <TabsTrigger
                  value="howto"
                  className="relative -mb-[1px] inline-flex items-center gap-2 px-0 py-2 text-sm font-medium text-valasys-gray-500 data-[state=active]:text-valasys-orange data-[state=active]:underline data-[state=active]:decoration-2 data-[state=active]:underline-offset-8 data-[state=active]:shadow-none"
                >
                  <Info className="h-4 w-4" /> Instructions to Add Account
                </TabsTrigger>
              </TabsList>
              <TabsContent
                value="add"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 rounded-lg border border-valasys-gray-200 bg-white p-4 shadow-sm">
                  <div>
                    <Label htmlFor="teams-display-name">
                      Display Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-display-name"
                      value={msTeamsDisplayName}
                      onChange={(e) => setMsTeamsDisplayName(e.target.value)}
                      placeholder="e.g., Marketing Alerts"
                      required
                      disabled={isMsTeamsEditing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      A friendly name to identify this Microsoft Teams
                      connection.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="teams-client-key">
                      Client Key <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-client-key"
                      value={msTeamsClientKey}
                      onChange={(e) => setMsTeamsClientKey(e.target.value)}
                      placeholder="Enter Client Key"
                      required
                      disabled={isMsTeamsEditing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Application (client) ID from your Azure Portal
                      app registration.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="teams-client-secret">
                      Client Secret <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-client-secret"
                      type="password"
                      value={msTeamsClientSecret}
                      onChange={(e) => setMsTeamsClientSecret(e.target.value)}
                      placeholder="Enter Client Secret"
                      required
                      disabled={isMsTeamsEditing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Client Secret value generated in the Azure
                      Portal. Keep this value confidential.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="teams-tenant-id">
                      Tenant ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-tenant-id"
                      value={msTeamsTenantId}
                      onChange={(e) => setMsTeamsTenantId(e.target.value)}
                      placeholder="Enter Tenant ID"
                      required
                      disabled={isMsTeamsEditing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Directory (tenant) ID from your Azure Portal.
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="teams-redirect-uri">
                      Redirect URI <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-redirect-uri"
                      value={msTeamsRedirectUri}
                      onChange={(e) => setMsTeamsRedirectUri(e.target.value)}
                      placeholder="https://your-app.com/callback"
                      required
                      disabled={isMsTeamsEditing}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter the Redirect URI configured in your Azure app
                      registration.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="teams-team-id">
                      Team ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-team-id"
                      value={msTeamsTeamId}
                      onChange={(e) => setMsTeamsTeamId(e.target.value)}
                      placeholder="Enter Team ID"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The unique ID of the MS Team where the channel is located.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="teams-channel-id">
                      Channel ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teams-channel-id"
                      value={msTeamsChannelId}
                      onChange={(e) => setMsTeamsChannelId(e.target.value)}
                      placeholder="Enter Channel ID"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      The unique ID of the MS Teams channel where messages will
                      be sent.
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setMsTeamsAddOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={!isMsTeamsValid}
                    className="bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => {
                      if (!isMsTeamsValid) return;
                      if (isMsTeamsEditing) {
                        setMsTeamsAccounts((prev) =>
                          prev.map((a) =>
                            a.id === editingMsTeamsAccountId
                              ? {
                                  ...a,
                                  name: msTeamsDisplayName.trim(),
                                  clientKey: msTeamsClientKey,
                                  clientSecret: msTeamsClientSecret,
                                  tenantId: msTeamsTenantId,
                                  redirectUri: msTeamsRedirectUri,
                                  teamId: msTeamsTeamId,
                                  channelId: msTeamsChannelId,
                                }
                              : a,
                          ),
                        );
                      } else {
                        setMsTeamsAccounts((prev) => [
                          ...prev,
                          {
                            id: `msteams-${msTeamsNextId}`,
                            name: msTeamsDisplayName.trim(),
                            clientKey: msTeamsClientKey,
                            clientSecret: msTeamsClientSecret,
                            tenantId: msTeamsTenantId,
                            redirectUri: msTeamsRedirectUri,
                            teamId: msTeamsTeamId,
                            channelId: msTeamsChannelId,
                          },
                        ]);
                        setMsTeamsNextId((n) => n + 1);
                      }
                      setMsTeamsDisplayName("");
                      setMsTeamsClientKey("");
                      setMsTeamsClientSecret("");
                      setMsTeamsTenantId("");
                      setMsTeamsRedirectUri("");
                      setMsTeamsTeamId("");
                      setMsTeamsChannelId("");
                      setIsMsTeamsEditing(false);
                      setEditingMsTeamsAccountId(null);
                      setMsTeamsAddOpen(false);
                      setMsTeamsThankOpen(true);
                      setMsTeamsThankProcessing(true);
                      setMsTeamsThankProgress(0);
                    }}
                  >
                    <Save className="h-4 w-4 mr-2" />{" "}
                    {isMsTeamsEditing ? "Update Connection" : "Save Connection"}
                  </Button>
                </div>
              </TabsContent>
              <TabsContent
                value="howto"
                className="border-b border-valasys-gray-200 pb-4"
              >
                <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-blue-900 mt-3 text-sm">
                  Follow these steps in Azure Portal and MS Teams to connect.
                </div>
                <div className="space-y-2 mt-3 text-sm text-gray-700">
                  <ol className="list-decimal pl-5 space-y-1">
                    <li>
                      Go to Azure Portal → Microsoft Entra ID → App
                      registrations.
                    </li>
                    <li>Create a new registration and set the Redirect URI.</li>
                    <li>
                      Generate a Client Secret and copy the Client ID and
                      Tenant ID.
                    </li>
                    <li>
                      Add API permissions for Microsoft Graph:
                      <code className="mx-1 bg-gray-100 px-1 rounded">
                        Group.ReadWrite.All
                      </code>
                      ,
                      <code className="mx-1 bg-gray-100 px-1 rounded">
                        ChannelMessage.Send
                      </code>
                      .
                    </li>
                    <li>
                      In Microsoft Teams, create or select a Team and a Channel.
                    </li>
                    <li>
                      To get Team ID: Right-click Team name → Get link to team
                      (ID is between
                      <code className="mx-1 bg-gray-100 px-1 rounded">
                        groupId=
                      </code>
                      and
                      <code className="mx-1 bg-gray-100 px-1 rounded">&</code>
                      ).
                    </li>
                    <li>
                      To get Channel ID: Right-click Channel → Get link to
                      channel (ID is after
                      <code className="mx-1 bg-gray-100 px-1 rounded">
                        channel/
                      </code>
                      ).
                    </li>
                    <li>Paste all values into the form and save.</li>
                  </ol>
                </div>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>

        {/* Microsoft Dynamics 365 Thank You Dialog */}
        <Dialog
          open={msDynamicsThankOpen}
          onOpenChange={(open) => {
            setMsDynamicsThankOpen(open);
            if (!open) {
              setMsDynamicsThankProcessing(false);
              setMsDynamicsThankProgress(0);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription>
                {msDynamicsThankProcessing
                  ? "Processing your Microsoft Dynamics 365 connection..."
                  : "Your Microsoft Dynamics 365 connection successfully Completed"}
              </DialogDescription>
            </DialogHeader>

            {msDynamicsThankProcessing ? (
              <div className="space-y-3">
                <Progress value={msDynamicsThankProgress} />
                <div className="text-xs text-gray-500">
                  Please wait, this may take a few seconds…
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 ai-pulse" />
                <span className="text-sm text-gray-800">
                  Your Microsoft Dynamics 365 connection successfully Completed
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setMsDynamicsThankOpen(false)}
                className="bg-valasys-orange text-white hover:bg-valasys-orange/90"
                disabled={msDynamicsThankProcessing}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Microsoft Teams Thank You Dialog */}
        <Dialog
          open={msTeamsThankOpen}
          onOpenChange={(open) => {
            setMsTeamsThankOpen(open);
            if (!open) {
              setMsTeamsThankProcessing(false);
              setMsTeamsThankProgress(0);
            }
          }}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Thank you</DialogTitle>
              <DialogDescription>
                {msTeamsThankProcessing
                  ? "Processing your Microsoft Teams connection..."
                  : "Your Microsoft Teams connection successfully Completed"}
              </DialogDescription>
            </DialogHeader>

            {msTeamsThankProcessing ? (
              <div className="space-y-3">
                <Progress value={msTeamsThankProgress} />
                <div className="text-xs text-gray-500">
                  Please wait, this may take a few seconds…
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2">
                <CheckCircle2 className="h-6 w-6 text-green-600 ai-pulse" />
                <span className="text-sm text-gray-800">
                  Your Microsoft Teams connection successfully Completed
                </span>
              </div>
            )}

            <div className="flex justify-end">
              <Button
                onClick={() => setMsTeamsThankOpen(false)}
                className="bg-valasys-orange text-white hover:bg-valasys-orange/90"
                disabled={msTeamsThankProcessing}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* CRM Instruction Dialog */}
        <Dialog open={crmDialogOpen} onOpenChange={setCrmDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Send to CRM</DialogTitle>
              <DialogDescription>
                Import "{crmFile?.fileName}.csv" into your preferred CRM using
                the guided steps below.
              </DialogDescription>
            </DialogHeader>

            {connectedCrms.length === 0 ? (
              <>
                <Alert className="mb-4">
                  <Info className="h-4 w-4" />
                  <AlertTitle className="ml-2">
                    No connected CRM account found
                  </AlertTitle>
                  <AlertDescription className="ml-6 -mt-4">
                    You can still import the CSV manually using the steps below,
                    or connect a CRM for one-click uploads.
                  </AlertDescription>
                </Alert>
                <Accordion type="single" collapsible className="mb-4">
                  <AccordionItem value="connect">
                    <AccordionTrigger>
                      How to connect your CRM (optional)
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              Connect via Zapier (recommended)
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-gray-700 space-y-2">
                            <p>
                              Create a Zap that triggers on "Webhook Received"
                              and sends to your CRM
                              (HubSpot/Salesforce/Marketo).
                            </p>
                            <p>
                              Copy the webhook URL and add it in Settings →
                              Integrations (once available).
                            </p>
                            <p>Return here and click Send to CRM.</p>
                          </CardContent>
                        </Card>
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-base">
                              Native connections
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="text-sm text-gray-700 space-y-2">
                            <p>
                              HubSpot: use a Private App token to authorize.
                            </p>
                            <p>
                              Salesforce: connect via OAuth (Connected App).
                            </p>
                            <p>
                              Marketo: use REST API credentials (Client
                              ID/Secret).
                            </p>
                            <p>
                              Dynamics 365: connect via OAuth (Client
                              Key/Secret/Tenant).
                            </p>
                          </CardContent>
                        </Card>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-end mb-4">
                  <Button
                    onClick={() => setSfAddOpen(true)}
                    className="bg-[#00A1E0] text-white hover:bg-[#008fcc] flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add Account
                  </Button>
                </div>
              </>
            ) : (
              <div className="mb-3 grid grid-cols-1 md:grid-cols-3 gap-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Choose CRM</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Select
                      value={selectedCrm}
                      onValueChange={(v) => setSelectedCrm(v as any)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select CRM" />
                      </SelectTrigger>
                      <SelectContent>
                        {connectedCrms.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c === "hubspot"
                              ? "HubSpot"
                              : c === "salesforce"
                                ? "Salesforce"
                                : c === "zoho"
                                  ? "Zoho"
                                  : c === "pipedrive"
                                    ? "Pipedrive"
                                    : c === "dynamics365"
                                      ? "Dynamics 365"
                                      : c === "msteams"
                                        ? "MS-Teams"
                                        : "Marketo"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Upload file</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Button
                      disabled={isUploadingCrm || uploadDone}
                      onClick={() => {
                        setIsUploadingCrm(true);
                        setTimeout(() => {
                          setIsUploadingCrm(false);
                          setUploadDone(true);
                        }, 1500);
                      }}
                      className="w-full bg-gradient-to-r from-valasys-orange to-valasys-orange-light text-white"
                    >
                      {isUploadingCrm ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />{" "}
                          Uploading to{" "}
                          {selectedCrm === "hubspot"
                            ? "HubSpot"
                            : selectedCrm === "salesforce"
                              ? "Salesforce"
                              : selectedCrm === "zoho"
                                ? "Zoho"
                                : selectedCrm === "pipedrive"
                                  ? "Pipedrive"
                                  : selectedCrm === "dynamics365"
                                    ? "Dynamics 365"
                                    : selectedCrm === "msteams"
                                      ? "MS-Teams"
                                      : "Marketo"}
                          ...
                        </>
                      ) : uploadDone ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 mr-2" /> Uploaded to{" "}
                          {selectedCrm === "hubspot"
                            ? "HubSpot"
                            : selectedCrm === "salesforce"
                              ? "Salesforce"
                              : selectedCrm === "zoho"
                                ? "Zoho"
                                : selectedCrm === "pipedrive"
                                  ? "Pipedrive"
                                  : selectedCrm === "dynamics365"
                                    ? "Dynamics 365"
                                    : selectedCrm === "msteams"
                                      ? "MS-Teams"
                                      : "Marketo"}
                        </>
                      ) : (
                        <>
                          <UploadCloud className="h-4 w-4 mr-2" /> Upload to{" "}
                          {selectedCrm === "hubspot"
                            ? "HubSpot"
                            : selectedCrm === "salesforce"
                              ? "Salesforce"
                              : selectedCrm === "zoho"
                                ? "Zoho"
                                : selectedCrm === "pipedrive"
                                  ? "Pipedrive"
                                  : selectedCrm === "dynamics365"
                                    ? "Dynamics 365"
                                    : selectedCrm === "msteams"
                                      ? "MS-Teams"
                                      : "Marketo"}
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Verify in CRM</CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center gap-2 pt-0">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={!uploadDone}
                    >
                      <a
                        href={
                          selectedCrm === "hubspot"
                            ? "https://app.hubspot.com/"
                            : selectedCrm === "salesforce"
                              ? "https://login.salesforce.com/"
                              : selectedCrm === "zoho"
                                ? "https://app.zoho.com/"
                                : selectedCrm === "pipedrive"
                                  ? "https://app.pipedrive.com/"
                                  : selectedCrm === "dynamics365"
                                    ? "https://home.dynamics.com/"
                                    : selectedCrm === "msteams"
                                      ? "https://teams.microsoft.com/"
                                      : "https://app.marketo.com/"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        Open{" "}
                        {selectedCrm === "hubspot"
                          ? "HubSpot"
                          : selectedCrm === "salesforce"
                            ? "Salesforce"
                            : selectedCrm === "zoho"
                              ? "Zoho"
                              : selectedCrm === "pipedrive"
                                ? "Pipedrive"
                                : selectedCrm === "dynamics365"
                                  ? "Dynamics 365"
                                  : selectedCrm === "msteams"
                                    ? "MS-Teams"
                                    : "Marketo"}
                      </a>
                    </Button>
                    <Button asChild variant="outline" size="sm">
                      <a
                        href={
                          selectedCrm === "hubspot"
                            ? "https://knowledge.hubspot.com/crm-setup/import-objects-into-hubspot"
                            : selectedCrm === "salesforce"
                              ? "https://help.salesforce.com/s/articleView?id=sf.data_import_wizard.htm&type=5"
                              : selectedCrm === "zoho"
                                ? "https://www.zoho.com/crm/help/import-contacts.html"
                                : selectedCrm === "pipedrive"
                                  ? "https://support.pipedrive.com/en/articles/1237-importing-deals-persons-organizations-products"
                                  : selectedCrm === "dynamics365"
                                    ? "https://learn.microsoft.com/en-us/dynamics365/customerengagement/on-premises/basics/import-contacts?view=op-9-1"
                                    : selectedCrm === "msteams"
                                      ? "https://learn.microsoft.com/en-us/microsoftteams/platform/graph-api/teams-api-overview"
                                      : "https://experienceleague.adobe.com/en/docs/marketo/using/product-docs/administration/settings/importing-a-list"
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Import Guide
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                <UploadCloud className="h-3 w-3 mr-1" /> CSV ready to import
              </Badge>
              <Badge variant="secondary" className="bg-green-50 text-green-700">
                <ShieldCheck className="h-3 w-3 mr-1" /> Email-based
                de-duplication recommended
              </Badge>
              <Badge
                variant="secondary"
                className="bg-valasys-orange/10 text-valasys-orange"
              >
                Selected CRM:{" "}
                {selectedCrm === "hubspot"
                  ? "HubSpot"
                  : selectedCrm === "salesforce"
                    ? "Salesforce"
                    : selectedCrm === "zoho"
                      ? "Zoho"
                      : selectedCrm === "pipedrive"
                        ? "Pipedrive"
                        : selectedCrm === "dynamics365"
                          ? "Dynamics 365"
                          : selectedCrm === "msteams"
                            ? "MS-Teams"
                            : "Marketo"}
              </Badge>
            </div>

            <Tabs
              value={selectedCrm}
              onValueChange={(v) => setSelectedCrm(v as any)}
            >
              <TabsList>
                <TabsTrigger value="hubspot">HubSpot</TabsTrigger>
                <TabsTrigger value="salesforce">Salesforce</TabsTrigger>
                <TabsTrigger value="zoho">Zoho</TabsTrigger>
                <TabsTrigger value="pipedrive">Pipedrive</TabsTrigger>
                <TabsTrigger value="dynamics365">Dynamics 365</TabsTrigger>
                <TabsTrigger value="msteams">MS-Teams</TabsTrigger>
                <TabsTrigger value="marketo">Marketo</TabsTrigger>
              </TabsList>

              <TabsContent value="hubspot">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Import to HubSpot Contacts or Companies.</p>
                      <p>
                        Map Email, Name, Company, Title, and Location fields.
                      </p>
                      <p>Enable updates of existing records by Email.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Recommended settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Use UTF‑8 CSV with a header row.</p>
                      <p>Select “Update existing contacts using Email”.</p>
                      <p>Review sample rows before starting the import.</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                        <li>HubSpot → Contacts (or Companies) → Import.</li>
                        <li>
                          Start an import → File from computer → One file → CSV.
                        </li>
                        <li>Choose the downloaded CSV and continue.</li>
                        <li>
                          Map fields: Email → Email; First Name → First name;
                          Last Name → Last name; Company → Company name; Job
                          Title → Job title; Phone → Phone number;
                          Country/State/City → Location fields.
                        </li>
                        <li>
                          Deduplication: “Update existing contacts using Email”.
                        </li>
                        <li>
                          Review sample rows → Start import → Monitor progress.
                        </li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Field mapping guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Email</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: Email</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: First Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: First name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Last Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: Last name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Company</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: Company name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Job Title</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: Job title</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">
                            CSV: Country/State/City
                          </span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>HubSpot: Location fields</span>
                        </div>
                      </div>
                      <Alert className="mt-3">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="ml-2">Tip</AlertTitle>
                        <AlertDescription className="ml-6 -mt-4">
                          If importing Companies, map Company Name and Domain;
                          Emails are not required.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="salesforce">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>
                        Import into Leads or Contacts with Data Import Wizard.
                      </p>
                      <p>Map Email, Name, Company, Title, Phone, Address.</p>
                      <p>
                        Use “Add new and update existing records” for upserts.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Recommended settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Use UTF‑8 CSV; include headers.</p>
                      <p>Set matching by Email for Contacts/Leads.</p>
                      <p>Validate sample rows before running.</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                        <li>Setup → Data Import Wizard.</li>
                        <li>
                          Select object (Leads or Contacts) → Launch Wizard.
                        </li>
                        <li>Choose ���Add new and update existing records”.</li>
                        <li>Upload CSV → proceed to mapping.</li>
                        <li>
                          Map: Email, First/Last Name, Company, Title, Phone,
                          Address.
                        </li>
                        <li>Run import → Check Import Status for results.</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Field mapping guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Email</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: Email</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: First Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: First Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Last Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: Last Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Company</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: Company</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Title</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: Title</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Address</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Salesforce: Address fields</span>
                        </div>
                      </div>
                      <Alert className="mt-3">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="ml-2">Note</AlertTitle>
                        <AlertDescription className="ml-6 -mt-4">
                          For Accounts, use the Account object and map Company
                          fields accordingly.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="zoho">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Import into Zoho CRM Leads or Contacts.</p>
                      <p>
                        Map Email, First Name, Last Name, Company, and Title
                        fields.
                      </p>
                      <p>Enable de-duplication by Email address.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-valasys-orange" />
                        Field mapping example
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-1">
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: Email</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: First Name</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: Last Name</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: Company</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: Job Title</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Zoho: Phone Number</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Info className="h-4 w-4 mr-2 text-valasys-orange" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert className="border-blue-200 bg-blue-50 text-blue-900">
                        <AlertTitle>Zoho CRM Import Guide</AlertTitle>
                        <AlertDescription className="ml-6 -mt-4">
                          Zoho CRM supports CSV imports via the Data Enrichment
                          module or through direct Lead/Contact imports. Ensure
                          your OAuth credentials are valid and you have API
                          access enabled for the integration.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="pipedrive">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Import into Pipedrive Leads or Persons.</p>
                      <p>
                        Map Email, First Name, Last Name, Company, and Title
                        fields.
                      </p>
                      <p>Enable de-duplication by Email address.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-2 text-valasys-orange" />
                        Field mapping example
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-1">
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: Email</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: First Name</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: Last Name</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: Organization</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: Job Title</span>
                      </div>
                      <div>
                        <ArrowRight className="inline h-3 w-3 mx-1" />
                        <span>Pipedrive: Phone</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Info className="h-4 w-4 mr-2 text-valasys-orange" />
                        Important Notes
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Alert className="border-teal-200 bg-teal-50 text-teal-900">
                        <AlertTitle>Pipedrive API Import Guide</AlertTitle>
                        <AlertDescription className="ml-6 -mt-4">
                          Pipedrive supports CSV imports directly through their
                          web interface and API. Ensure your API token is valid
                          and has proper permissions for creating/updating
                          Persons and Deals. Use bulk import features for large
                          datasets.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="msteams">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Export prospect data directly to a Teams Channel.</p>
                      <p>Automate lead alerts for your sales team.</p>
                      <p>Include key details: Name, Company, Title, and LinkedIn.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Setup Requirements
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Requires Team ID and Channel ID.</p>
                      <p>Microsoft Graph API permissions enabled.</p>
                      <p>Active Teams Channel for incoming messages.</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                        <li>Register App in Azure Portal (Entra ID).</li>
                        <li>Grant <code className="bg-gray-100 px-1 rounded">ChannelMessage.Send</code> permissions.</li>
                        <li>Identify your Team and Channel in MS Teams.</li>
                        <li>Add the Channel credentials in Valasys AI.</li>
                        <li>Click "Send to CRM" to push data to Teams.</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Data formatting
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 text-sm">
                        <div className="rounded-lg border p-3 bg-valasys-gray-50 border-valasys-gray-200">
                          <p className="font-mono text-xs text-blue-700 font-bold mb-1">Incoming Message Preview:</p>
                          <p className="font-semibold">New Prospect Alert!</p>
                          <p>Name: John Doe</p>
                          <p>Company: Acme Corp</p>
                          <p>Source: Valasys AI</p>
                        </div>
                        <Alert className="bg-blue-50 border-blue-200">
                          <Info className="h-4 w-4 text-blue-600" />
                          <AlertDescription className="text-blue-800 text-xs">
                            Data is sent as a formatted Adaptive Card for clear visibility in Teams.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="marketo">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Import into a Static List from CSV.</p>
                      <p>
                        Map Email, Name, Company, Title, and Location fields.
                      </p>
                      <p>Enable de-duplication by Email.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Recommended settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>
                        Use UTF‑8 CSV with headers; choose the correct
                        delimiter.
                      </p>
                      <p>Use “Use first row as header”.</p>
                      <p>Ensure Email is present for all rows.</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                        <li>Database → Create or open a Static List.</li>
                        <li>Click “Import” → Choose File → Upload CSV.</li>
                        <li>Set “Use first row as header” and delimiter.</li>
                        <li>
                          Map: Email, First/Last Name, Company, Title,
                          Country/State/City, Phone.
                        </li>
                        <li>De-duplication: Use Email to avoid duplicates.</li>
                        <li>Start import → Check Notifications/Results.</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Field mapping guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Email</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: Email</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: First Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: First Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Last Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: Last Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Company</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: Company</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Job Title</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: Job Title</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">
                            CSV: Country/State/City
                          </span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Marketo: Location fields</span>
                        </div>
                      </div>
                      <Alert className="mt-3">
                        <Info className="h-4 w-4" />
                        <AlertTitle className="ml-2">Tip</AlertTitle>
                        <AlertDescription className="ml-6 -mt-4">
                          Static List imports are best for campaigns; sync to
                          Smart Lists after import.
                        </AlertDescription>
                      </Alert>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="dynamics365">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <ListChecks className="h-4 w-4 mr-2 text-valasys-orange" />
                        What you'll do
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Import into Leads or Contacts in Dynamics 365.</p>
                      <p>Map Email, Name, Company, Title, and Phone.</p>
                      <p>Use Duplicate Detection rules for clean data.</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <CheckCircle2 className="h-4 w-4 mr-2 text-green-600" />
                        Recommended settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm text-gray-700 space-y-2">
                      <p>Use CSV format with UTF-8 encoding.</p>
                      <p>Select "Ignore" or "Update" for duplicates.</p>
                      <p>Verify field mapping before finalizing.</p>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Steps</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-700">
                        <li>Dynamics 365 → Settings → Data Management.</li>
                        <li>Click "Imports" → "Import Data".</li>
                        <li>Upload the CSV file and click Next.</li>
                        <li>Select "Default (Automatic Mapping)".</li>
                        <li>Map CSV columns to Dynamics fields.</li>
                        <li>Review and click "Submit" to start import.</li>
                      </ol>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">
                        Field mapping guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Email</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Dynamics: Email</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: First Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Dynamics: First Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Last Name</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Dynamics: Last Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Company</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Dynamics: Company Name</span>
                        </div>
                        <div className="rounded-lg border p-2 bg-white">
                          <span className="font-medium">CSV: Job Title</span>
                          <ArrowRight className="inline h-3 w-3 mx-1" />
                          <span>Dynamics: Job Title</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter>
              <Button variant="outline" onClick={() => setCrmDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
