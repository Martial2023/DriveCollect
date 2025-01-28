import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Info, ShieldX } from 'lucide-react';

type Props = {
    type: "Error" | "Info";
    message: string;
    open: boolean;
    onClose: () => void;
};

const PopUp = ({ type, message, open, onClose }: Props) => {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            {/* Contenu du Pop-Up */}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle
                        className={`text-2xl font-bold flex items-center ${type === "Error" ? "text-destructive" : "text-primary"}`}
                    >
                        {type === "Error" ? <ShieldX className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                        <span>{type === "Error" ? "Erreur" : "Information"}</span>
                    </DialogTitle>
                    <DialogDescription className={`text-xl p-4 ${type === "Error" ? "text-destructive" : "text-primary"}`}>
                        {message}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default PopUp;