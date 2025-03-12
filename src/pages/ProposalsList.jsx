import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import Nav from "../components/Nav";
import PdfView from "../components/PdfView";

export default function ProposalsList() {
  const [pdfView, setPdfView] = useState({
    isOpen: false,
    fileUrl: "",
    title: "",
  });

  useEffect(() => {
    fetchUploads();
  }, []);
  const [uploads, setUploads] = useState([]);

  const fetchUploads = async () => {
    const { data, error } = await supabase
      .from("user_uploads")
      .select("*")
      .order("id");
    if (error) return console.error(error);
    setUploads(data);
    console.log("data", data);
  };

  const updateStatus = async (id, status) => {
    const { error } = await supabase
      .from("user_uploads")
      .update({ status })
      .eq("file_id", id);
    if (!error) fetchUploads();
    toast.success("Status Changed");
  };

  // Helper function to format dates
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge styling
  const getStatusBadge = (status) => {
    switch (status) {
      case "Approved":
        return (
          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
            Approved
          </Badge>
        );
      case "Reevaluate":
        return (
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
            Revaluate
          </Badge>
        );
      case "Rejected":
        return (
          <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-100">
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            Pending
          </Badge>
        );
    }
  };

  return (
      <div className="w-full px-4 md:px-6 pt-12">
        <div className="rounded-md border bg-card shadow-sm">
          <div className="flex items-center justify-between p-4 md:p-6">
            <h2 className="text-xl font-semibold text-foreground">
              Project Submissions
            </h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-12 text-center">#</TableHead>
                  <TableHead>Project Title</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Submitted On
                  </TableHead>
                  <TableHead className="w-40">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {uploads.map((upload, idx) => (
                  <TableRow key={upload.id} className="hover:bg-muted/30">
                    <TableCell className="text-center font-medium text-muted-foreground">
                      {idx + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {upload.project_title}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {formatDate(upload.created_at)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(upload.status)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-between px-4 py-4 md:px-6">
            <div className="text-sm text-muted-foreground">
              Showing <strong>{uploads.length}</strong> of{" "}
              <strong>{uploads.length}</strong> projects
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled>
                Next
              </Button>
            </div>
          </div>
        </div>

        {/* This would be your PDF viewer modal */}
        {pdfView.isOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <PdfView
              fileUrl={pdfView.fileUrl}
              setPdfView={setPdfView}
              title={pdfView.title}
            />
          </div>
        )}
      </div>
  );
}
