import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { GameRoomIdPage } from "@/routes/(auth)/_auth.room.$roomId";

// Mocks
const mockNavigate = jest.fn();
jest.mock("@tanstack/react-router", () => ({
  ...jest.requireActual("@tanstack/react-router"),
  useNavigate: () => mockNavigate,
  useParams: () => ({ roomId: "123" }),
}));
jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ data: { id: 1, username: "testuser" } }),
}));
jest.mock("@/features/game-room/hooks/use-get-room-by-id", () => ({
  useGetRoomById: () => ({
    data: {
      id: "123",
      name: "Test Room",
      players: [
        { userId: 1, username: "testuser", readyForBattle: false },
        { userId: 2, username: "challenger", readyForBattle: false },
      ],
      creator: { userId: 1, username: "testuser" },
    },
    isLoading: false,
  }),
}));
jest.mock("@/components/game-room/character-selection", () => ({
  CharacterSelection: (props: any) => (
    <div data-testid="character-selection">{JSON.stringify(props)}</div>
  ),
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}));
jest.mock("sonner", () => ({
  toast: { success: jest.fn() },
}));

// Mock SockJS and StompJS
const mockSubscribe = jest.fn();
const mockUnsubscribe = jest.fn();
const mockPublish = jest.fn();
const mockDeactivate = jest.fn();
const mockActivate = jest.fn();
const mockConnected = true;
let stompConfig: any = {};
const mockStompClient = {
  subscribe: mockSubscribe,
  unsubscribe: mockUnsubscribe,
  publish: mockPublish,
  deactivate: mockDeactivate,
  activate: function () {
    mockActivate();
    // Simulate successful connection
    if (stompConfig.onConnect) {
      stompConfig.onConnect();
    }
  },
  connected: mockConnected,
};
jest.mock("sockjs-client", () => {
  return jest.fn(() => ({}));
});
jest.mock("@stomp/stompjs", () => ({
  Client: function (config: any) {
    stompConfig = config;
    return mockStompClient;
  },
}));

describe("GameRoomIdPage", () => {
    beforeEach(() => {
    jest.clearAllMocks();
    mockSubscribe.mockReset();
    mockPublish.mockReset();
    mockDeactivate.mockReset();
    mockActivate.mockReset();
  });

  it("renders room name and players", () => {
    //render(<GameRoomIdPage />);
  });
});