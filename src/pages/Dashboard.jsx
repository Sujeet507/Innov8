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
import Modal from "../components/Modal";
import toast from "react-hot-toast";

export default function ProjectTable() {
  const [pdfView, setPdfView] = useState({
    isOpen: false,
    fileUrl: "",
    title: "",
  });

  useEffect(() => {
    fetchUploads();
  }, []);
  const [uploads, setUploads] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState({
    isOpen: false,
    title: "",
    file_id: null,
  });

  const handleModalOpenChange = (isOpen) => {
    setIsModalOpen((prev) => ({ ...prev, isOpen }));
  };

  const toggleModal = (file_id, title, rating, status) => {
    console.log("status", status);
    if (status === "review") {
      toast.error("Please update the status before rating");
      return;
    }
    setIsModalOpen({
      isOpen: true,
      title,
      file_id,
      rating: rating || 0,
    });
  };

  const handleSubmitRating = async (file_id, rating) => {
    const { error } = await supabase
      .from("user_uploads")
      .update({ rating })
      .eq("file_id", file_id);

    if (!error) {
      toast.success("Rating submitted!");
      fetchUploads();
    }
  };

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
    <div className="">
      <Nav />

      <div className="w-full px-4 md:px-6">
        <div className="rounded-md border bg-card shadow-sm mt-8">
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
                  <TableHead className="w-24 text-center">View</TableHead>
                  <TableHead className="w-40">Status</TableHead>
                  <TableHead className="w-40">Rate</TableHead>
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
                    <TableCell className="text-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() =>
                          setPdfView({
                            isOpen: true,
                            fileUrl: upload.file_url,
                            title: upload.project_title,
                          })
                        }
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">View document</span>
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(upload.status)}
                        <Select
                          className="text-white"
                          required
                          defaultValue={upload.status}
                          onValueChange={(value) =>
                            updateStatus(upload.file_id, value)
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px] border-dashed">
                            <SelectValue placeholder="Change Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Approved">Approved</SelectItem>
                            <SelectItem value="Reevaluate">
                              Revaluate
                            </SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </TableCell>
                    <TableCell>
                      {!upload.rating ? (
                        <button
                          className="btn btn-accent border-0 outline-0"
                          onClick={() =>
                            toggleModal(
                              upload.file_id,
                              upload.project_title,
                              upload.rating,
                              upload.status
                            )
                          }
                        >
                          Rate
                        </button>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-muted-foreground">
                            {upload.rating}
                          </span>
                          <div
                            className="w-fit cursor-pointer"
                            onClick={() =>
                              toggleModal(
                                upload.file_id,
                                upload.project_title,
                                upload.rating,
                                upload.status
                              )
                            }
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-pencil"
                            >
                              <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {upload.rating ? upload.rating : "Not rated"}
                        </span>
                        <div
                          className="w-fit cursor-pointer"
                          onClick={() =>
                            toggleModal(
                              upload.file_id,
                              upload.project_title,
                              upload.rating
                            )
                          }
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            class="lucide lucide-pencil"
                          >
                            <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                            <path d="m15 5 4 4" />
                          </svg>
                        </div>
                      </div>
                    </TableCell> */}
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
        {isModalOpen.isOpen && (
          <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <Modal
              open={isModalOpen.isOpen}
              role="Admin"
              title={isModalOpen.title}
              file_id={isModalOpen.file_id}
              onOpenChange={handleModalOpenChange}
              onSubmitRating={handleSubmitRating}
              initialRating={isModalOpen.rating}
            />
          </div>
        )}
      </div>
    </div>
  );
}
