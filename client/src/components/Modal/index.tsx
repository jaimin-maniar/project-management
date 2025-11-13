import { Button } from "@mui/material";
import { X } from "lucide-react";
import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
  error: string;
  success: string;
};

const Modal = ({ children, isOpen, onClose, name, error, success }: Props) => {
  if (!isOpen) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex h-full w-full items-center justify-center overflow-y-auto bg-black/40 p-4">
      <div className="dark:bg-dark-secondary w-full max-w-2xl rounded-lg bg-white p-4 shadow-lg">
        <Header
          name={name}
          buttonComponent={
            <Button
              className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 text-white hover:bg-blue-500"
              onClick={onClose}
            >
              <X size={18} />
            </Button>
          }
          isSmallText
        />
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
