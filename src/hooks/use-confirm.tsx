import { useState, type JSX } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
    title: string;
    description: string;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
}

export const useConfirm = (): [
    () => Promise<boolean> ,
    (props: ConfirmDialogProps) => JSX.Element
] => {
    const [state, setState] = useState<{
        resolve: (value: boolean) => void
    } | null>(null);

    const confirm = () => new Promise<boolean>((resolve) => setState({ resolve }));

    const handleConfirm = () => {
        state?.resolve(true);
        setState(null);
    }

    const handleCancel = () => {
        state?.resolve(false);
        setState(null);
    }

    const ConfirmDialog = ({
        title,
        description,
        confirmLabel = "Confirm",
        cancelLabel = "Cancel",
        destructive = false,
    }: ConfirmDialogProps) => (
        <Dialog open={!!state} onOpenChange={handleCancel}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <Button variant="outline" onClick={handleCancel}>
                        {cancelLabel}
                    </Button>
                    <Button variant={destructive ? "destructive" : "outline"} onClick={handleConfirm}>
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [
        confirm,
        ConfirmDialog
    ]
}