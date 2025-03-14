import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

const Modal = ({
  role,
  rating,
  file_id,
  title,
  open,
  onOpenChange,
  onSubmitRating,
  initialRating,
  onDelete,
  isDeleteMode = false
}) => {
  useEffect(() => {
    if (open && !isDeleteMode) {
      setInputRating(initialRating || "");
    }
  }, [open, initialRating,isDeleteMode]);

  useEffect(() => {
    if (open) {
      setInputRating(initialRating || "");
    }
  }, [open, initialRating]);

  const [inputRating, setInputRating] = useState("");

  const handleSubmit = () => {
    if (inputRating && file_id) {
      onSubmitRating(file_id, inputRating);
      onOpenChange(false); // Close modal after submit
    }
  };
  const handleDelete = () =>{
    if(file_id){
      onDelete(file_id)
      onOpenChange(false);
    }
  }

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeleteMode
              ? `Do you want to delete "${title}"?`
              : role === "Admin"
              ? `Rate ${title}`
              : `Your Score is ${rating}`}
          </AlertDialogTitle>

          <AlertDialogDescription>
            {isDeleteMode ? (
              <p className="text-muted-foreground">
                This action cannot be undone. The project will be permanently
                deleted from the system. Are you sure you want to delete it?
              </p>
            ) : role === "Admin" ? (
              <>
                Please provide your rating below.
                <input
                  type="number"
                  className="mt-3 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring"
                  placeholder="Enter rating (1-10)"
                  value={inputRating}
                  onChange={(e) => setInputRating(e.target.value)}
                  max={10}
                />
              </>
            ) : (
              <>
                {rating > 5 ? (
                  <h1 className="text-green-500 font-medium">
                    Great Job. Keep up the amazing work! Sakcha ta kasaile? 😎
                  </h1>
                ) : (
                  <h1 className="text-red-500 font-medium">
                    You could do better 😊🙌
                  </h1>
                )}
                <p className="text-muted-foreground pt-2">
                  Please contact Ms. Akriti or Sonaam Sir for any queries.
                </p>
              </>
            )}
          </AlertDialogDescription>
          </AlertDialogHeader>

         
        <AlertDialogFooter>
          <AlertDialogCancel className = "cursor-pointer" onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          {isDeleteMode ? (
            <AlertDialogAction className = "cursor-pointer" onClick={handleDelete}>
              Confirm Delete
            </AlertDialogAction>
          ) : role === "Admin" ? (
            <AlertDialogAction className = "cursor-pointer" onClick={handleSubmit}>
              Submit Rating
            </AlertDialogAction>
          ) : (
            <AlertDialogAction className = "cursor-pointer" onClick={() => onOpenChange(false)}>
              Continue
            </AlertDialogAction>
          )}
        </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Modal;
