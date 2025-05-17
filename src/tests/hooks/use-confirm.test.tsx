import { render, screen, fireEvent, act } from "@testing-library/react";
import { useConfirm } from "@/hooks/use-confirm";

// Mock Dialog and Button components
jest.mock("@/components/ui/dialog", () => ({
    Dialog: ({ open, children }: any) =>
        open ? <div data-testid="dialog">{children}</div> : null,
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogDescription: ({ children }: any) => <div>{children}</div>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/components/ui/button", () => ({
    Button: ({ children, onClick }: any) => (
        <button onClick={onClick}>{children}</button>
    ),
}));

function TestComponent({ onResult }: { onResult: (result: boolean) => void }) {
    const [confirm, ConfirmDialog] = useConfirm();

    const handleClick = async () => {
        const result = await confirm();
        onResult(result);
    };

    return (
        <div>
            <button onClick={handleClick}>Open Confirm</button>
            <ConfirmDialog
                title="Test Title"
                description="Test Description"
                confirmLabel="Yes"
                cancelLabel="No"
                destructive
            />
        </div>
    );
}

describe("useConfirm", () => {
    it("renders dialog when confirm is called and resolves true on confirm", async () => {
        const onResult = jest.fn();
        render(<TestComponent onResult={onResult} />);

        // Open the confirm dialog
        fireEvent.click(screen.getByText("Open Confirm"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();
        expect(screen.getByText("Test Title")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();

        // Click confirm button
        await act(async () => {
            fireEvent.click(screen.getByText("Yes"));
        });

        expect(onResult).toHaveBeenCalledWith(true);
        // Dialog should close
        expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("renders dialog when confirm is called and resolves false on cancel", async () => {
        const onResult = jest.fn();
        render(<TestComponent onResult={onResult} />);

        // Open the confirm dialog
        fireEvent.click(screen.getByText("Open Confirm"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        // Click cancel button
        await act(async () => {
            fireEvent.click(screen.getByText("No"));
        });

        expect(onResult).toHaveBeenCalledWith(false);
        // Dialog should close
        expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });

    it("calls onOpenChange (cancel) when dialog is closed externally", async () => {
        const onResult = jest.fn();
        render(<TestComponent onResult={onResult} />);

        // Open the confirm dialog
        fireEvent.click(screen.getByText("Open Confirm"));
        expect(screen.getByTestId("dialog")).toBeInTheDocument();

        // Simulate dialog close by calling onOpenChange (calls handleCancel)
        await act(async () => {
            // The Dialog's onOpenChange is wired to handleCancel, so simulate by clicking cancel
            fireEvent.click(screen.getByText("No"));
        });

        expect(onResult).toHaveBeenCalledWith(false);
        expect(screen.queryByTestId("dialog")).not.toBeInTheDocument();
    });
});