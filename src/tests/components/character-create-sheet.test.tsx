import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CharacterCreateSheet } from "@/components/character-create-sheet";

// Mock Plus icon to avoid SVG issues
jest.mock("lucide-react", () => ({
  Plus: () => <svg data-testid="plus-icon" />,
  XIcon: () => <svg data-testid="x-icon" />,
}));

// Mock useAddCharacter hook
const mockMutate = jest.fn();
jest.mock("@/features/auth/hooks/use-add-character", () => ({
  useAddCharacter: () => ({
    mutate: mockMutate,
  }),
}));

// Mock react-hook-form's useForm to use the real implementation
jest.mock("react-hook-form", () => {
  const actual = jest.requireActual("react-hook-form");
  return {
    ...actual,
  };
});

describe("CharacterCreateSheet", () => {
  beforeEach(() => {
    mockMutate.mockClear();
  });

  it("renders the Add New Character button", () => {
    render(<CharacterCreateSheet />);
    expect(screen.getByRole("button", { name: /add new character/i })).toBeInTheDocument();
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
  });

  it("opens the sheet when the button is clicked", () => {
    render(<CharacterCreateSheet />);
    fireEvent.click(screen.getByRole("button", { name: /add new character/i }));
    expect(screen.getByText(/add a new character!/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/origin/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
  });

  it("submits the form and calls addCharacter with correct data", async () => {
    render(<CharacterCreateSheet />);
    fireEvent.click(screen.getByRole("button", { name: /add new character/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Batman" } });
    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: "DC" } });
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: "http://batman.png" } });

    fireEvent.click(screen.getByRole("button", { name: /add character/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        character_id: null,
        name: "Batman",
        origin: "DC",
        image: "http://batman.png",
      });
    });
  });

  it("closes the sheet after submission", async () => {
    render(<CharacterCreateSheet />);
    fireEvent.click(screen.getByRole("button", { name: /add new character/i }));

    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: "Batman" } });
    fireEvent.change(screen.getByLabelText(/origin/i), { target: { value: "DC" } });
    fireEvent.change(screen.getByLabelText(/image url/i), { target: { value: "http://batman.png" } });

    fireEvent.click(screen.getByRole("button", { name: /add character/i }));

    await waitFor(() => {
      expect(screen.queryByText(/add a new character!/i)).not.toBeInTheDocument();
    });
  });
});