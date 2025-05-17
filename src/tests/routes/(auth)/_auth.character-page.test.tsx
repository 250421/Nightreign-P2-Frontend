import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { RouteComponent } from "@/routes/(auth)/_auth.character-page";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Mocks
jest.mock("@/components/character-create-sheet", () => ({
  CharacterCreateSheet: () => <div data-testid="character-create-sheet">CreateSheet</div>,
}));
jest.mock("@/components/character-edit-sheet", () => ({
  CharacterEditSheet: (props: any) => <button data-testid={`edit-sheet-${props.name}`}>Edit {props.name}</button>,
}));
jest.mock("@/components/ui/input", () => ({
  Input: (props: any) => <input data-testid="search-input" {...props} />,
}));
jest.mock("@/components/ui/button", () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));
jest.mock("@/components/ui/separator", () => ({
  Separator: () => <hr data-testid="separator" />,
}));
jest.mock("@/components/ui/card", () => ({
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <div>{children}</div>,
  CardDescription: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));
jest.mock("@/hooks/use-confirm", () => ({
  useConfirm: () => [jest.fn().mockResolvedValue(true), ({ children }: any) => <div data-testid="deletion-dialog">{children}</div>],
}));
jest.mock("@/features/auth/hooks/use-delete-character", () => ({
  useDeleteCharacter: () => ({ mutate: jest.fn() }),
}));

const mockCharactersList = [
  {
    character_id: 1,
    name: "Batman",
    origin: "DC",
    characterImageUrl: "batman.png",
  },
  {
    character_id: 2,
    name: "Superman",
    origin: "DC",
    characterImageUrl: "superman.png",
  },
];

let mockCharacters: any[] = [];
let mockUser: any = {};

jest.mock("@/hooks/use-get-characters", () => ({
  useGetCharacters: () => ({ data: mockCharacters }),
}));
jest.mock("@/features/auth/hooks/use-auth", () => ({
  useAuth: () => ({ data: mockUser }),
}));

describe("Character Page Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCharacters = [];
    mockUser = {};
    
  });

  it("shows 'No characters found' and create sheet for admin if no characters", () => {
    mockCharacters = [];
    mockUser = { role: "ADMIN" };
    // re-render to apply new mock values
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RouteComponent />
      </QueryClientProvider>
    );
    expect(screen.getByTestId("character-create-sheet")).toBeInTheDocument();
    expect(screen.getByText(/No characters found/i)).toBeInTheDocument();
  });

  it("shows 'No characters found' for non-admin if no characters", () => {
    mockCharacters = [];
    mockUser = { role: "USER" };
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RouteComponent />
      </QueryClientProvider>
    );
    expect(screen.queryByTestId("character-create-sheet")).not.toBeInTheDocument();
    expect(screen.getByText(/No characters found/i)).toBeInTheDocument();
  });

  it("renders character cards and admin controls for admin", () => {
    mockCharacters = mockCharactersList;
    mockUser = { role: "ADMIN" };
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RouteComponent />
      </QueryClientProvider>
    );

    expect(screen.getByTestId("character-create-sheet")).toBeInTheDocument();
    expect(screen.getByTestId("separator")).toBeInTheDocument();
    expect(screen.getByTestId("search-input")).toBeInTheDocument();
    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.getByText("Superman")).toBeInTheDocument();
    expect(screen.getByTestId("edit-sheet-Batman")).toBeInTheDocument();
    expect(screen.getByTestId("edit-sheet-Superman")).toBeInTheDocument();
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(2);
  });

  it("filters characters by search input", () => {
    mockCharacters = mockCharactersList;
    mockUser = { role: "ADMIN" };
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RouteComponent />
      </QueryClientProvider>
    );

    const search = screen.getByTestId("search-input");
    fireEvent.change(search, { target: { value: "bat" } });
    expect(screen.getByText("Batman")).toBeInTheDocument();
    expect(screen.queryByText("Superman")).not.toBeInTheDocument();
  });

  it("shows deletion dialog when delete is clicked", async () => {
    const mockDelete = jest.fn();
    jest.mock("@/features/auth/hooks/use-delete-character", () => ({
      useDeleteCharacter: () => ({ mutate: mockDelete }),
    }));

    mockCharacters = mockCharactersList;
    mockUser = { role: "ADMIN" };
    const queryClient = new QueryClient();
    render(
      <QueryClientProvider client={queryClient}>
        <RouteComponent />
      </QueryClientProvider>
    );

    const deleteButtons = screen.getAllByRole("button", { name: "" }); // Trash button has no text
    fireEvent.click(deleteButtons[0]);
    await waitFor(() => {
      expect(screen.getByTestId("deletion-dialog")).toBeInTheDocument();
    });
  });
});