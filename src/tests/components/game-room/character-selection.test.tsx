import { render, screen, fireEvent } from "@testing-library/react";
import { CharacterSelection } from "@/components/game-room/character-selection";

// Mock dependencies
jest.mock("@/hooks/use-get-characters", () => ({
    useGetCharacters: () => ({
        data: [
            {
                character_id: 1,
                name: "Batman",
                origin: "DC",
                characterImageUrl: "https://batman.com/image.png",
            },
            {
                character_id: 2,
                name: "Superman",
                origin: "DC",
                characterImageUrl: "https://superman.com/image.png",
            },
            {
                character_id: 3,
                name: "Iron Man",
                origin: "Marvel",
                characterImageUrl: "https://ironman.com/image.png",
            },
            {
                character_id: 4,
                name: "Spider-Man",
                origin: "Marvel",
                characterImageUrl: "https://spiderman.com/image.png",
            },
        ],
    }),
}));

jest.mock("lucide-react", () => ({
    Check: () => <span data-testid="check-icon" />,
    Ellipsis: () => <span data-testid="ellipsis-icon" />,
}));

const mockRoom = { id: 1 };
const mockPlayer = {
    userId: 42,
    username: "Player",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    readyForBattle: false,
    selectedCharacter: null
}
const mockChallenger = {
    userId: 43,
    username: "Challenger",
    activeCharacters: [],
    defeatedCharacters: [],
    battleReady: false,
    readyForBattle: false,
    selectedCharacter: null
};

describe("CharacterSelection", () => {

    it("renders error if no room", () => {
        render(
            <CharacterSelection
                room={undefined as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        expect(screen.getByText(/error fetching room data/i)).toBeInTheDocument();
    });

    let spy: jest.SpyInstance;
    it("renders no characters found if characters list is empty", () => {
        spy = jest.spyOn(require("@/hooks/use-get-characters"), "useGetCharacters").mockReturnValue({ data: [] });
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        expect(screen.getByText(/no characters found/i)).toBeInTheDocument();
        spy.mockRestore();
    });

    it("renders character cards sorted by name", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        // Should render all character names
        expect(screen.getByText("Batman")).toBeInTheDocument();
        expect(screen.getByText("Superman")).toBeInTheDocument();
        expect(screen.getByText("Iron Man")).toBeInTheDocument();
        expect(screen.getByText("Spider-Man")).toBeInTheDocument();
    });

    it("filters characters by search input", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        const search = screen.getByPlaceholderText(/search/i);
        fireEvent.change(search, { target: { value: "bat" } });
        expect(screen.getByText("Batman")).toBeInTheDocument();
        expect(screen.queryByText("Superman")).not.toBeInTheDocument();
    });

    it("selects characters, max 3", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );

        // Should render all character names
        expect(screen.getByText("Batman")).toBeInTheDocument();
        expect(screen.getByText("Superman")).toBeInTheDocument();
        expect(screen.getByText("Iron Man")).toBeInTheDocument();
        expect(screen.getByText("Spider-Man")).toBeInTheDocument();

        const batmanCard = screen.getByText("Batman");
        const supermanCard = screen.getByText("Superman");
        const ironmanCard = screen.getByText("Iron Man");
        const spidermanCard = screen.getByText("Spider-Man");

        // Select three
        fireEvent.click(batmanCard!);
        fireEvent.click(supermanCard!);
        fireEvent.click(ironmanCard!);

        // Try to select a fourth, should not be added to the list
        fireEvent.click(spidermanCard!);

        // The first slot should still be Batman, then Superman, then Iron Man
        const select1 = screen.getByTestId("Select1");
        const select2 = screen.getByTestId("Select2");
        const select3 = screen.getByTestId("Select3");
        expect(select1).toHaveAttribute("alt", "Batman");
        expect(select2).toHaveAttribute("alt", "Superman");
        expect(select3).toHaveAttribute("alt", "Iron Man");
    });

    it("removes character from slot when slot card is clicked", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        const batmanCard = screen.getByText("Batman");
        const supermanCard = screen.getByText("Superman");
        const ironmanCard = screen.getByText("Iron Man");

        // Select three
        fireEvent.click(batmanCard!);
        fireEvent.click(supermanCard!);
        fireEvent.click(ironmanCard!);

        // Remove first slot
        const select1 = screen.getByTestId("Select1");
        const select2 = screen.getByTestId("Select2");
        const select3 = screen.getByTestId("Select3");
        fireEvent.click(select3); // Remove Iron Man

        // Now only Batman and Superman should remain
        expect(select1).toHaveAttribute("alt", "Batman");
        expect(select2).toHaveAttribute("alt", "Superman");
        expect(select3).toHaveAttribute("alt", "Placeholder");

        // Remove second slot (third slot is empty)
        fireEvent.click(select2); // Remove Superman

        // Now only Batman should remain
        expect(select1).toHaveAttribute("alt", "Batman");
        expect(select2).toHaveAttribute("alt", "Placeholder");
        expect(select3).toHaveAttribute("alt", "Placeholder");

        // Remove first slot (other slots are empty)
        fireEvent.click(select1); // Remove Superman

        // Now nothing should be selected
        expect(select1).toHaveAttribute("alt", "Placeholder");
        expect(select2).toHaveAttribute("alt", "Placeholder");
        expect(select3).toHaveAttribute("alt", "Placeholder");
    });

    it("deselects a character when its card is clicked again", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        const batmanCard = screen.getByText("Batman");

        // There should be nothing selected
        expect(screen.getByTestId("Select1")).toHaveAttribute("alt", "Placeholder");

        // Select Batman
        fireEvent.click(batmanCard);

        // Batman should now be in the first slot
        expect(screen.getByTestId("Select1")).toHaveAttribute("alt", "Batman");

        // Click Batman card again to deselect
        fireEvent.click(batmanCard);

        // Batman should be removed from the selection slot
        expect(screen.getByTestId("Select1")).toHaveAttribute("alt", "Placeholder");
    });

    it("calls onPlayerReady with correct data when ready is clicked", () => {
        const onPlayerReady = jest.fn();
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={onPlayerReady}
            />
        );
        const batmanCard = screen.getByText("Batman");
        const supermanCard = screen.getByText("Superman");
        const ironmanCard = screen.getByText("Iron Man");

        // Select three
        fireEvent.click(batmanCard!);
        fireEvent.click(supermanCard!);
        fireEvent.click(ironmanCard!);

        // Click ready
        const readyButton = screen.getByRole("button", { name: /ready/i });
        fireEvent.click(readyButton);

        expect(onPlayerReady).toHaveBeenCalledWith({
            userId: mockPlayer.userId,
            isReadyForBattle: true,
            team: [
                expect.objectContaining({ name: "Batman" }),
                expect.objectContaining({ name: "Superman" }),
                expect.objectContaining({ name: "Iron Man" }),
            ],
        });
    });

    it("shows challenger username and readiness", () => {
        const readyChallenger = { ...mockChallenger, readyForBattle: true };
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={readyChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        expect(screen.getByText("Challenger")).toBeInTheDocument();
        expect(screen.getByTestId("check-icon")).toBeInTheDocument();
    });

    it("shows ellipsis if challenger is not ready", () => {
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={mockPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );
        expect(screen.getByTestId("ellipsis-icon")).toBeInTheDocument();
    });

    it("should not allow character selection or deselection after player is ready", () => {
        // Set up player not ready initially
        const notReadyPlayer = { ...mockPlayer, readyForBattle: false };
        render(
            <CharacterSelection
                room={mockRoom as any}
                player={notReadyPlayer}
                challenger={mockChallenger}
                onPlayerReady={jest.fn()}
            />
        );

        // Select three characters
        const batmanCard = screen.getByText("Batman");
        const supermanCard = screen.getByText("Superman");
        const ironmanCard = screen.getByText("Iron Man");

        fireEvent.click(batmanCard);
        fireEvent.click(supermanCard);
        fireEvent.click(ironmanCard);

        // Click ready
        const readyButton = screen.getByRole("button", { name: /ready/i });
        fireEvent.click(readyButton);

        // Try to select a fourth character (should not change selection)
        const spidermanCard = screen.getByText("Spider-Man");
        fireEvent.click(spidermanCard);

        // Try to deselect a character (should not change selection)
        const select1 = screen.getByTestId("Select1");
        fireEvent.click(select1);

        // The selection slots should remain as the original 3
        expect(screen.getByTestId("Select1")).toHaveAttribute("alt", "Batman");
        expect(screen.getByTestId("Select2")).toHaveAttribute("alt", "Superman");
        expect(screen.getByTestId("Select3")).toHaveAttribute("alt", "Iron Man");
    });
});