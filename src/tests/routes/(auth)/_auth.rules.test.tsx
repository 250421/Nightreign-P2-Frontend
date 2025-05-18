import { RouteComponent } from "@/routes/(auth)/_auth.rules";
import { render, screen } from "@testing-library/react";

describe("Auth Rules Page", () => {
    beforeEach(() => {
        render(<RouteComponent />);
    });

    it("renders the HOW TO PLAY title", () => {
        expect(screen.getByText(/HOW TO PLAY/i)).toBeInTheDocument();
    });

    it("renders all main sections", () => {
        expect(screen.getByText("1. Join/Create a Lobby")).toBeInTheDocument();
        expect(screen.getByText("2. Choose Your Team")).toBeInTheDocument();
        expect(screen.getByText("3. Battle!")).toBeInTheDocument();
    });

    it("renders instructions for joining or creating a lobby", () => {
        expect(screen.getByText(/To begin, you will navigate to the home screen/i)).toBeInTheDocument();
        expect(screen.getByText(/If a lobby is waiting for a player/i)).toBeInTheDocument();
        expect(screen.getByText(/If no lobbies are available/i)).toBeInTheDocument();
        expect(screen.getByText(/Once you create a lobby/i)).toBeInTheDocument();
        expect(screen.getByText(/Once there are two players in a lobby/i)).toBeInTheDocument();
    });

    it("renders instructions for choosing your team", () => {
        expect(screen.getByText(/Once the game begins, you will be prompted to choose three characters/i)).toBeInTheDocument();
        expect(screen.getByText(/Once you have chosen your team/i)).toBeInTheDocument();
        expect(screen.getByText(/Once both players are ready/i)).toBeInTheDocument();
    });

    it("renders instructions for battle", () => {
        expect(screen.getByText(/Battle begins with both players selecting their first character/i)).toBeInTheDocument();
        expect(screen.getByText(/Once both players have selected a character/i)).toBeInTheDocument();
        expect(screen.getByText(/The winner of the fight is determined by non-partial AI/i)).toBeInTheDocument();
        expect(screen.getByText(/The player whose character was defeated/i)).toBeInTheDocument();
        expect(screen.getByText(/A player wins by defeating all three of their opponent's characters/i)).toBeInTheDocument();
    });
});