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
}) => {
  useEffect(() => {
    if (open) {
      console.log(open);
      setInputRating(initialRating || "");
    }
  }, [open, initialRating]);

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

  return (
    <div>
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {role === "Admin"
                ? `Rate ${title}`
                : `Your Score is ${rating}`}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {role === "Admin" ? (
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
                    <>
                      <h1 className=" text-green-500 font-medium">
                        Great Job. Keep up the amazing work! Sakcha ta kasaile?😎😎🤩
                      </h1>
                      <p className=" text-muted-foreground pt-2">
                        Please contact Ms. Akriti or Sonaam Sir for any queries.
                      </p>
                    </>
                  ) : (
                    <>
                     <h1 className=" text-red-500 font-medium pt-2">
                        You could do better.😊😊😊🙌
                      </h1>
                      <p className=" text-muted-foreground pt-2">
                        Please contact Ms. Akriti or Sonaam Sir for any queries.
                      </p>
                    </>
                  )}
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            {role === "Admin" && (
              <AlertDialogAction
                onClick={handleSubmit}
                className="cursor-pointer"
              >
                Submit Rating
              </AlertDialogAction>
            )}

            {role !== "Admin" && (
              <AlertDialogAction
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
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
