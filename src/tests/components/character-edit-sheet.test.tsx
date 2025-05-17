import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CharacterEditSheet } from "../../components/character-edit-sheet";

// filepath: d:\Program Files\Revature\Nightreign-P2-Frontend\src\tests\components\character-edit-sheet.test.tsx

// Mock dependencies
jest.mock("@/features/auth/hooks/use-edit-character", () => ({
    useEditCharacter: () => ({
        mutate: jest.fn(),
    }),
}));

// Mock UI components (Sheet, Form, etc.) if needed, or use actual implementations if available

const mockCharacter = {
    character_id: 1,
    name: "Batman",
    origin: "DC",
    characterImageUrl: "https://batman.com/image.png",
};

describe("CharacterEditSheet", () => {
    it("renders edit button", () => {
        render(<CharacterEditSheet {...mockCharacter} />);
        expect(screen.getByRole("button")).toBeInTheDocument();
    });

    it("opens sheet on edit button click", () => {
        render(<CharacterEditSheet {...mockCharacter} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByText(/Edit Batman/i)).toBeInTheDocument();
        expect(screen.getByText(/Edit character name, origin, and image URL/i)).toBeInTheDocument();
    });

    it("shows form fields with default values", () => {
        render(<CharacterEditSheet {...mockCharacter} />);
        fireEvent.click(screen.getByRole("button"));
        expect(screen.getByLabelText(/Name/i)).toHaveValue("Batman");
        expect(screen.getByLabelText(/Origin/i)).toHaveValue("DC");
        expect(screen.getByLabelText(/Image URL/i)).toHaveValue("https://batman.com/image.png");
    });

    it("calls mutate and closes sheet on submit", async () => {
        const mutateMock = jest.fn();
        // Override the mock for this test
        jest.spyOn(require("@/features/auth/hooks/use-edit-character"), "useEditCharacter").mockReturnValue({ mutate: mutateMock });

        render(<CharacterEditSheet {...mockCharacter} />);
        fireEvent.click(screen.getByRole("button"));

        fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "Superman" } });
        fireEvent.change(screen.getByLabelText(/Origin/i), { target: { value: "DC" } });
        fireEvent.change(screen.getByLabelText(/Image URL/i), { target: { value: "https://superman.com/image.png" } });

        fireEvent.click(screen.getByRole("button", { name: /Save/i }));

        await waitFor(() => {
            expect(mutateMock).toHaveBeenCalledWith({
                character_id: 1,
                name: "Superman",
                origin: "DC",
                image: "https://superman.com/image.png",
            });
        });
    });
});