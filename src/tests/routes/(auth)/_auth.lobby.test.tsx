import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Route } from "@/routes/(auth)/_auth.lobby";
import { LobbyPage } from "@/routes/(auth)/_auth.lobby";

// Mocks
const mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
    ...jest.requireActual("@tanstack/react-router"),
    useNavigate: () => mockNavigate,
}));

const mockUser = { id: 1, username: "testuser" };
jest.mock("@/features/auth/hooks/use-auth", () => ({
    useAuth: () => ({ data: mockUser }),
}));

let mockRooms: any[] = [];
jest.mock("@/features/game-room/hooks/use-get-all-rooms", () => ({
    useGetAllRooms: () => ({ rooms: mockRooms }),
}));

jest.mock("sonner", () => ({
    toast: { success: jest.fn() },
}));

// Mock SockJS and StompJS
const mockSubscribe = jest.fn(() => ({ id: "sub-id" }));
const mockUnsubscribe = jest.fn();
const mockPublish = jest.fn();
const mockDeactivate = jest.fn();
const mockActivate = jest.fn();
const mockStompClient = {
    subscribe: mockSubscribe,
    unsubscribe: mockUnsubscribe,
    publish: mockPublish,
    deactivate: mockDeactivate,
    activate: mockActivate,
};

jest.mock("sockjs-client", () => {
    return jest.fn(() => ({}));
});
jest.mock("@stomp/stompjs", () => ({
    Client: function () {
        return mockStompClient;
    },
}));

beforeEach(() => {
    jest.clearAllMocks();
    mockRooms = [];
});

describe("LobbyPage", () => {
    it("renders exit lobby button and create game room input", () => {
        render(<LobbyPage />);
        expect(screen.getByText("Exit Lobby")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Enter room name")).toBeInTheDocument();
        expect(screen.getByText("Create Game Room")).toBeInTheDocument();
    });

    it("shows message when no game rooms are available", () => {
        render(<LobbyPage />);
        expect(screen.getByText(/No game rooms available/i)).toBeInTheDocument();
    });

    it("renders a list of game rooms", async () => {
        mockRooms = [
            {
                id: 123,
                name: "Test Room",
                players: [{ id: 1 }, { id: 2 }],
                status: "Waiting for players",
                creator: { username: "admin" },
            },
        ];
        render(<LobbyPage />);
        expect(await screen.findByText("Test Room")).toBeInTheDocument();
        expect(screen.getByText(/Players: 2\/2/)).toBeInTheDocument();
        expect(screen.getByText("Join Game")).toBeInTheDocument();
    });

    it("disables create game room button if no name or no stompClient", () => {
        render(<LobbyPage />);
        const createBtn = screen.getByText("Create Game Room") as HTMLButtonElement;
        expect(createBtn).toBeDisabled();
        fireEvent.change(screen.getByPlaceholderText("Enter room name"), { target: { value: " " } });
        expect(createBtn).toBeDisabled();
    });

    it("enables create game room button when name is entered and stompClient is set", () => {
        // Simulate stompClient being set by calling activate
        mockStompClient.activate();
        render(<LobbyPage />);
        fireEvent.change(screen.getByPlaceholderText("Enter room name"), { target: { value: "Room1" } });
        const createBtn = screen.getByText("Create Game Room") as HTMLButtonElement;
        // Button should be enabled if stompClient is set and name is not empty
        expect(createBtn.disabled).toBe(false);
    });

    it("calls handleLeaveLobby and navigates to / when Exit Lobby is clicked", () => {
        render(<LobbyPage />);
        fireEvent.click(screen.getByText("Exit Lobby"));
        expect(mockNavigate).toHaveBeenCalledWith({ to: "/" });
    });

    it("calls handleJoinRoom and navigates to room page when Join Game is clicked", async () => {
        mockRooms = [
            {
                id: 123,
                name: "Test Room",
                players: [{ id: 1 }],
                status: "Waiting for players",
                creator: { username: "admin" },
            },
        ];
        render(<LobbyPage />);
        const joinBtn = await screen.findByText("Join Game");
        fireEvent.click(joinBtn);
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith({
                to: "/room/$roomId",
                params: { roomId: 123 },
            });
        });
    });

    it("does nothing if roomName is empty or whitespace", () => {
        mockStompClient.activate();
        render(<LobbyPage />);
        const input = screen.getByPlaceholderText("Enter room name");
        fireEvent.change(input, { target: { value: "   " } });
        const createBtn = screen.getByText("Create Game Room");
        fireEvent.click(createBtn);
        expect(mockSubscribe).not.toHaveBeenCalled();
        expect(mockPublish).not.toHaveBeenCalled();
    });

    it("does nothing if user.username is missing", () => {
        mockStompClient.activate();
        // Patch user to not have username
        jest.spyOn(require("@/features/auth/hooks/use-auth"), "useAuth").mockReturnValue({ data: { id: 1 } });
        render(<LobbyPage />);
        const input = screen.getByPlaceholderText("Enter room name");
        fireEvent.change(input, { target: { value: "RoomX" } });
        const createBtn = screen.getByText("Create Game Room");
        fireEvent.click(createBtn);
        expect(mockSubscribe).not.toHaveBeenCalled();
        expect(mockPublish).not.toHaveBeenCalled();
    });

    // Websocket tests go here...
});